import React from 'react';
import bs58 from 'bs58'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { VerifiablePresentation, DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import { Icon } from '@iconify/react';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';

// components
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import Page from '../../components/Page';
import RingAvatar from '../../components/RingAvatar';
import CustomSwitch from '../../components/custom-switch';
import ElastosConnectivityService from '../../utils/elastosConnectivityService';
import useSingin from '../../hooks/useSignin';
import TransLoadingButton from '../../components/TransLoadingButton';
import { isInAppBrowser, getCredentialInfo } from '../../utils/common';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(13)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));
// ----------------------------------------------------------------------

const credentialItems = [
  {title: 'Name', description: 'name'},
  {title: 'Description', description: 'description'},
  {title: 'Website', description: 'website'},
  {title: 'Twitter', description: 'Twitter account'},
  {title: 'Discord', description: 'Discord account'},
  {title: 'Telegram', description: 'Telegram account'},
  {title: 'Medium', description: 'Medium account'},
  {title: 'KYC-me', description: 'KYC-me badge'},
]
export default function EditProfile() {
  const [checkedItem, setCheckedItem] = React.useState(Array(7).fill(false));
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [onProgress, setOnProgress] = React.useState(false);
  
  const { elaConnectivityService, setElastosConnectivityService } = useSingin();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(async () => {
    const connectivityService = new ElastosConnectivityService()
    setElastosConnectivityService(connectivityService)

    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2')
      navigate('/profile')
    else {
      const strWalletAddress = isInAppBrowser() ? await window.elastos.getWeb3Provider().address : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
      setWalletAddress(strWalletAddress);
    }
  }, []);

  const handleCheckItem = (event, i) => {
    setCheckedItem((prevState) => {
      const tempState = [...prevState]
      tempState[i] = event.target.checked
      return tempState
    })
  };

  const stopProvide = (errMsg)=>{
    setOnProgress(false)
    enqueueSnackbar(errMsg, { variant: 'error' });
  }

  const handleSaveAction = async() => {
    setOnProgress(true)
    let kycVerifiablePresentation
    try {
      const customItems = credentialItems.filter((item, i)=>checkedItem[i])
      kycVerifiablePresentation = await elaConnectivityService.requestCustomCredentials(customItems);

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

    const birthDateCredential = credentials.find(c => c.getType().indexOf("BirthDateCredential") >= 0);
    const genderCredential = credentials.find(c => c.getType().indexOf("GenderCredential") >= 0);
    const countryCredential = credentials.find(c => c.getType().indexOf("CountryCredential") >= 0);
    if (!birthDateCredential && !genderCredential && !countryCredential){
      stopProvide("Nothing to provide KYC-me credentials")
      return
    }

    const vpBuffer = Buffer.from(kycVerifiablePresentation.serialize())
    const encodedPresentation = bs58.encode(vpBuffer)
    sessionStorage.setItem('KYCedProof', encodedPresentation)
    enqueueSnackbar('Save action success', { variant: 'success' });
    setOnProgress(false)
  }
  return (
    <RootStyle title="EditProfile | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{mb: 3}}>
          Edit Profile
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={7}>
            <Typography variant="subtitle2" sx={{fontWeight: 'normal'}}>
              We do not store you personal information.
              Therefore, please choose your credentials from DID to display them on your public profile.
              The credentials must first be published on the blockchain.
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Stack direction='column' spacing={1} sx={{mb: 2}}>
              {
                credentialItems.map((item, i)=>(
                  <Box key={i}>
                    <Typography variant="h4" sx={{fontWeight: 'normal'}}>{item.title}</Typography>
                    <Stack direction="row">
                      <InputLabel sx={{ fontSize: 12, flex: 1 }}>
                        Display {item.description}
                      </InputLabel>
                      <FormControlLabel
                        control={<CustomSwitch onChange={(event)=>handleCheckItem(event, i)}/>}
                        sx={{mt:-1, mr: 0}}
                        label=""
                      />
                    </Stack>
                    <Divider/>
                    {
                      item.title==='KYC-me'&&
                      <Link href='http://kyc-me.io' target="_blank" sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="caption" sx={{color: 'origin.main'}}>No such credentials yet? Get credentials on KYC-me.io now!</Typography>
                        <Icon icon={externalLinkFill} width="15px"/>
                      </Link>
                    }
                  </Box>
                ))
              }
              {/* <LoadingButton loading={onProgress} variant="contained" onClick={handleSaveAction} fullWidth>
              </LoadingButton> */}
            </Stack>
            <TransLoadingButton loading={onProgress} loadingText="Please Provide Credentials From Wallet" onClick={handleSaveAction} fullWidth>
              Save Credentials
            </TransLoadingButton>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Avatar</Typography>
            <RingAvatar
              address={walletAddress}
              size={110}
              outersx={{m: 4}}
            />
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}