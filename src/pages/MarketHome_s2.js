// material
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, Grid, Typography, Button, Card } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
// components
import Page from '../components/Page';
import HomeAssetCard from '../components/HomeAssetCard';
import { MotionInView, varFadeInUp, varFadeInDown } from '../components/animate';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  background: 'black',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));
const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.up('sm')]: {
    '& .MuiPaper-root': {
      width: '30%',
      height: '100%',
      minWidth: '300px'
    }
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& .MuiPaper-root': {
      marginTop: theme.spacing(2)
    }
  }
}));
const CardStyle = styled(Card)(({ theme }) => ({
  backgroundColor: '#0d0d0d',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    '& img': {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(2),
      width: '25%',
      height: '100%',
    }
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& img': {
      margin: '32px auto 32px'
    }
  },
  '& div.MuiBox-root': {
    minWidth: 0,
    flexGrow: 1,
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: 48
    }
  }
}));

const TitleStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  lineHeight: 64 / 48,
  fontSize: '2rem',
  '@media (min-width:600px)': {
    fontSize: '2.3rem'
  },
  '@media (min-width:900px)': {
    fontSize: '2.5rem'
  },
  '@media (min-width:1200px)': {
    fontSize: '2.7rem'
  }
}));

const OutlineBtnStyle = styled(Button)(({ theme }) => ({
  color: theme.palette.origin.main,
  borderColor: theme.palette.origin.main,
  "&:hover": {
    color: 'white',
    background: theme.palette.origin.main
  }
}));

const HeadTitleStyle = styled(Typography)(({ theme }) => ({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline'
}))
// ----------------------------------------------------------------------

export default function MarketHome() {
  React.useEffect(() => {
  }, []);

  const openSignin = (e)=>{
    if(document.getElementById("signin"))
      document.getElementById("signin").click()
  }

  return (
    <RootStyle title="Explorer | PASAR">
      <Box draggable = {false} component="img" src="/static/corner-logo.png" sx={{ width: '50%', maxWidth: '550px', position: 'absolute', top: 0, right: 0 }} />
      <Container sx={{pt: 4, mb: '100px', position: 'relative'}}>
        <StackStyle>
          <Box sx={{ flexGrow: 1 }}>
            <HeadTitleStyle variant="h1">
              Dawn of the DeMKT
            </HeadTitleStyle>
            <Typography variant="h4" component="div" sx={{fontWeight: 'normal', pb: 3}}>
              Pasar is open-sourced, community-centric, and one
              of the first truly Web3.0 decentralized marketplaces (DeMKT)
              for exchanging data and Non-fungible Tokens (NFTs).
            </Typography>
            <Stack spacing={1} direction="row">
              <OutlineBtnStyle to="/marketplace" variant="outlined" component={RouterLink}>
                Go to App
              </OutlineBtnStyle>
              <Button to="/create" variant="contained" component={RouterLink} color="inherit">
                Create
              </Button>
            </Stack>
          </Box>
          <HomeAssetCard/>
        </StackStyle>
      </Container>
      <Container maxWidth="md">
        <MotionInView variants={varFadeInUp}>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">
                Get Started with Essentials
              </TitleStyle>
              <Typography variant="p" component="div" sx={{color: 'text.secondary'}}>
                Onboarding is easy. Just register a Decentralized Identifier (DID) and wallet address from
                the Elastos Essentials Super-Wallet.<br/>
                <br/>
                Then explore Elastos’ complete Web3.0 tech stack, including Hive decentralized storage,
                Carrier’s P2P network, Ecosystem DAO Cyber Republic, and much more!
              </Typography>
            </Box>
            <Box draggable = {false} component="img" src="/static/essentials.png" sx={{p: {xs: '0px 32px 32px', sm: 0}, mt: '0 !important'}} />
            <Stack spacing={1} direction="row" sx={{position: 'absolute', bottom: 32, mr: 4}}>
              <OutlineBtnStyle variant="outlined" href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app" target="_blank" startIcon={<AdbIcon />}>
                Google Play
              </OutlineBtnStyle>
              <Button variant="contained" href="https://apps.apple.com/us/app/elastos-essentials/id1568931743" target="_blank" startIcon={<AppleIcon />} color="inherit">
                App Store
              </Button>
            </Stack>
          </CardStyle>
        </MotionInView>
        <MotionInView variants={varFadeInUp}>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">
                Decentralized Marketplace (DeMKT)
              </TitleStyle>
              <Typography variant="p" component="div" sx={{color: 'text.secondary'}}>
                Pasar is a truly decentralized marketplace that does not depend on any central servers entities
                to facilitate the peer-to-peer exchange of data and NFTs.<br/>
                <br/>
                On Pasar, assets cannot be censored, blocked. or taken down, and Pasar’s trustless
                exchange protocol is already poised to become a leader in Web3.0 space.
              </Typography>
            </Box>
            <Box draggable = {false} component="img" src="/static/market-home-1.svg" sx={{p: {xs: '0px 32px 32px', sm: 0}}} />
            <Stack spacing={1} direction="row" sx={{position: 'absolute', bottom: 32, mr: 4}}>
              <OutlineBtnStyle to="/marketplace" variant="outlined" component={RouterLink}>
                Marketplace
              </OutlineBtnStyle>
              <Button variant="contained" to="/explorer" component={RouterLink} color="inherit">
                Explorer
              </Button>
            </Stack>
          </CardStyle>
        </MotionInView>
        <MotionInView variants={varFadeInUp}>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">
                Decentralized Identity (DID)
              </TitleStyle>
              <Typography variant="p" component="div" sx={{color: 'text.secondary'}}>
                DID empowers users to become self-sovereign in virtual space.
                On Pasar, users are required to sign in with their DIDs in order to create or sell assets.
                However, all users may purchase assets simply connecting their wallets – no identification required.<br/>
                <br/>
                A reputation system based on DID enables users to cultivate trust within their communities
                in place of depending on traditional verification systems provided by central authorities.
              </Typography>
            </Box>
            <Box draggable = {false} component="img" src="/static/user-home.svg" sx={{p: {xs: '0px 32px 32px', sm: 0}}} />
            <Stack spacing={1} direction="row" sx={{position: 'absolute', bottom: 32, mr: 4}}>
              <OutlineBtnStyle variant="outlined" onClick={openSignin}>
                Sign in with DID
              </OutlineBtnStyle>
              <Button variant="contained" href="https://www.elastos.org/did" target="_blank" color="inherit">
                Learn more about DID
              </Button>
            </Stack>
          </CardStyle>
        </MotionInView>
        <MotionInView variants={varFadeInUp}>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">
                Elastos Smart Chain (ESC)
              </TitleStyle>
              <Typography variant="p" component="div" sx={{color: 'text.secondary'}}>
                ESC is a programmable smart-contract Sidechain that runs on Elastos.
                Pasar is built on the ESC to benefit from its efficiency and high-performance,
                so users can generate and exchange assets in a secure, low-cost environment.<br/>
                <br/>
                To execute transactions on the ESC, users can purchase ELA on the Essentials app via Glide Finance,
                a Decentralized Exchange (DEX) also built on the ESC.
              </Typography>
            </Box>
            <Box draggable = {false} component="img" src="/static/chain-home.svg" sx={{p: {xs: '0px 32px 32px', sm: 0}}} />
            <Stack spacing={1} direction="row" sx={{position: 'absolute', bottom: 32, mr: 4}}>
              <OutlineBtnStyle variant="outlined" href="https://glidefinance.io/swap" target="_blank">
                Get ELA 
              </OutlineBtnStyle>
              <Button variant="contained" href="https://www.elastos.org/esc" target="_blank" color="inherit">
                Learn more about ESC
              </Button>
            </Stack>
          </CardStyle>
        </MotionInView>
        <Box draggable = {false} component="img" src="/static/elastos-logo.svg" sx={{m: 'auto', width: '40%'}}/>
      </Container>
    </RootStyle>
  );
}