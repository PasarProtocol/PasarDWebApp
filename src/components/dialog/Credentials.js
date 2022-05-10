import React, { useState } from 'react';
import { VerifiablePresentation, DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import bs58 from 'bs58'
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Tooltip, Icon, Button, Box, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import StyledButton from '../signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';
import ElastosConnectivityService from '../../utils/elastosConnectivityService';
import TransLoadingButton from '../TransLoadingButton';
import { fetchFrom } from '../../utils/common';
import { trustedProviders } from '../../config';

export default function Credentials() {
  const { openCredentials, elaConnectivityService, setOpenCredentials, setElastosConnectivityService } = useSingin();
  React.useEffect(()=>{
    const connectivityService = new ElastosConnectivityService()
    setElastosConnectivityService(connectivityService)
  }, [])
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const handleClose = () => {
    setOpenCredentials(false);
    setIsSuccess(false)
    setOnProgress(false)
  }
  const stopProvide = (errMsg)=>{
    setOnProgress(false)
    enqueueSnackbar(errMsg, { variant: 'error' });
  }

  const onClickProvideCredentials = async ()=>{
    setOnProgress(true)
    let kycVerifiablePresentation
    try {
      kycVerifiablePresentation = await elaConnectivityService.requestKYCCredentials();

      if (!kycVerifiablePresentation) {
        setOnProgress(false)
        return
        // return Promise.reject(new Error("Error while trying to get the presentation"))
      }
      const resolverUrl = 'https://api.trinity-tech.cn/eid';
      DIDBackend.initialize(new DefaultDIDAdapter(resolverUrl));
    } catch (error) {
      stopProvide("Request credentials error")
      try {
        await elaConnectivityService.disconnect();
      } catch (disconnectError) {
        return Promise.reject(disconnectError);
      }
      return Promise.reject(error);
    }

    // Check presentation validity (genuine, not tampered)
    const valid = await kycVerifiablePresentation.isValid();
    if (!valid) {
      stopProvide("Invalid presentation")
      return
    }

    // Get the presentation holder
    const presentationDID = kycVerifiablePresentation.getHolder().getMethodSpecificId();
    if (!presentationDID) {
      stopProvide("Unable to extract owner DID from the presentation")
      return
    }

    // Make sure the holder of this presentation is the currently authentified user
    if (sessionStorage.getItem('PASAR_DID') !== presentationDID) {
      stopProvide("Presentation not issued by the currently authenticated user")
      return
    }

    const credentials = kycVerifiablePresentation.getCredentials();
    if (!credentials.length) {
      stopProvide("Nothing to provide")
      return
    }

    const nameCredential = credentials.find(c => c.getType().indexOf("NameCredential") >= 0);
    const birthDateCredential = credentials.find(c => c.getType().indexOf("BirthDateCredential") >= 0);
    const genderCredential = credentials.find(c => c.getType().indexOf("GenderCredential") >= 0);
    const countryCredential = credentials.find(c => c.getType().indexOf("CountryCredential") >= 0);
    if (!nameCredential && !birthDateCredential && !genderCredential && !countryCredential){
      stopProvide("Nothing to provide")
      return
    }
    
    /* const credentialInfo = {}

    if (nameCredential){
      if(!ensureTrustedKycProvider(nameCredential)){
        stopProvide("The issuer of the name credential is unknown or not trusted")
        return
      }
      const lastName = nameCredential.getSubject().getProperty("lastName") || "";
      const firstNames = nameCredential.getSubject().getProperty("firstNames") || "";
      const name = `${lastName} ${firstNames}`.trim();
      credentialInfo.name = name
    } 

    if (birthDateCredential) {
      if(!ensureTrustedKycProvider(birthDateCredential)){
        stopProvide("The issuer of the birth date credential is unknown or not trusted")
        return
      }
      credentialInfo.birthDate = birthDateCredential.getSubject().getProperty("birthDate") || "";
    }
    
    if (genderCredential) {
      if(!ensureTrustedKycProvider(genderCredential)){
        stopProvide("The issuer of the gender credential is unknown or not trusted")
        return
      }
      credentialInfo.gender = genderCredential.getSubject().getProperty("gender") || "";
    }

    if (countryCredential) {
      if(!ensureTrustedKycProvider(countryCredential)){
        stopProvide("The issuer of the country credential is unknown or not trusted")
        return
      }
      credentialInfo.country = countryCredential.getSubject().getProperty("country") || "";
    }
    sessionStorage.setItem('CREDENTIALS', JSON.stringify(credentialInfo)) */
    
    const vpBuffer = Buffer.from(kycVerifiablePresentation.serialize())
    const encodedPresentation = bs58.encode(vpBuffer)
    sessionStorage.setItem('KYCedProof', encodedPresentation)
    setIsSuccess(true)
    setOnProgress(false)
  }
  
  /**
   * Checks if we trust the issuer of a credential as KYC provider.
   */
  const ensureTrustedKycProvider = (credential) => {
    const credentialIssuer = credential.getIssuer().toString();
    return trustedProviders.indexOf(credentialIssuer) >= 0;
  }

  return (
    <Dialog open={openCredentials} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {
        !isSuccess?
        <DialogContent>
          <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
            Credentials
          </Typography>
          <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
            Pasar requires certain verifiable credentials issued<br/>by KYC-me in order for the user to receive a badge.
          </Typography>
          <Typography variant="body2" display="block" gutterBottom align="center" sx={{ mt: 4 }}>
            Web3.0 super wallet with Decentralized Identifier (DID)
          </Typography>
          <Box component="div" sx={{ maxWidth: 350, m: 'auto' }}>
            <Grid container spacing={1.5} sx={{ mt: 2, mb: 4 }}>
              <Grid item xs={12}>
                {
                  !onProgress?
                  <StyledButton
                    variant="contained"
                    startIcon={
                      <Avatar
                        alt="Elastos"
                        src="/static/elastos.svg"
                        sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                      />
                    }
                    fullWidth
                    onClick={onClickProvideCredentials}
                  >
                    Provide Credentials
                  </StyledButton>:
                  <TransLoadingButton loading={onProgress} loadingText="Please Provide Credentials From Wallet"/>
                }
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" display="block" gutterBottom align="center">
                  No such credentials yet?
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pt: '4px !important'}}>
                <StyledButton
                  variant="outlined"
                  href="https://kyc-me.io/"
                  target="_blank"
                  startIcon={
                    <Box
                      component="img"
                      alt="kyc"
                      src="/static/badges/kyc.svg"
                      sx={{ width: 24, height: 24, p: '3px' }}
                    />
                  }
                  fullWidth
                  sx={{textTransform: 'none'}}
                >
                  Get credentials on KYC-me.io now
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Typography>
        </DialogContent>:

        <DialogContent>
          <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
            Credentials
          </Typography>
          <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
            KYC-me Badge
          </Typography>
          <Box sx={{justifyContent: 'center', display: 'flex', py: '20px'}}>
            <Box sx={{background: 'black', borderRadius: '100%', p: 3, display: 'inline-flex', boxShadow: '0px 8px 18px #4d4d4d'}}>
              <Box
                draggable={false}
                component="img"
                alt="kyc"
                src="/static/badges/kyc.svg"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
          </Box>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
            This badge will appear on your profile as well on the item card whenever you list it on the marketplace.
            This is also gives you the power to vouch or report a creator, owner and collection.
          </Typography>
        </DialogContent>
      }
    </Dialog>
  );
}
