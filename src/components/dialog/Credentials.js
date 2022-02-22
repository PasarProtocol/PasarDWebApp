import React, { useState } from 'react';
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
    } catch (error) {
      setOnProgress(false)
      enqueueSnackbar("Request credentials error", { variant: 'error' });
      try {
        await elaConnectivityService.disconnect();
      } catch (disconnectError) {
        return Promise.reject(disconnectError);
      }
      return Promise.reject(error);
    }

    // try {
    //   fetchFrom('/auth/api/v1/kycactivation',
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify(kycVerifiablePresentation.toJSON())
    //     }).then(response => response.json()).then(data => {
    //       setOnProgress(false)
    //       if (data.code === 200) {
    //         setIsSuccess(true)
    //       } else {
    //         enqueueSnackbar(data.message, { variant: 'warning' });
    //       }
    //     }).catch((error) => {
    //       Promise.reject(error)
    //       setOnProgress(false)
    //       enqueueSnackbar("Credentials error", { variant: 'error' });
    //       // console.log(error);
    //   });
    //   return Promise.resolve();
    // } catch (error) {
    //   setOnProgress(false)
    //   return Promise.reject(error);
    // }
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
                      src="/static/kyc.svg"
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
                src="/static/kyc.svg"
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
