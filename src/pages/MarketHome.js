// material
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, Typography, Button, Link } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import { Icon } from '@iconify/react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// components
import Page from '../components/Page';
import StyledButton from '../components/signin-dlg/StyledButton';
import HomeAssetCarousel from '../components/home/HomeAssetCarousel';
import FilteredAssetGrid from '../components/home/FilteredAssetGrid';
import FilteredTransGrid from '../components/home/FilteredTransGrid';
import FilteredCollectionGrid from '../components/home/FilteredCollectionGrid';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
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
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& .carousel-box': {
      width: '100%',
      marginTop: theme.spacing(2)
    }
  }
}));

const CardStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    '& img': {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(10),
      width: '15%',
      height: '100%'
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
    paddingBottom: 80
  }
}));

const TitleStyle = styled(Typography)({
  fontWeight: 700,
  lineHeight: 64 / 48,
  fontSize: '2rem',
  '@media (min-width:600px)': {
    fontSize: '2.1rem'
  },
  '@media (min-width:900px)': {
    fontSize: '2.3rem'
  },
  '@media (min-width:1200px)': {
    fontSize: '2.5rem'
  }
});

const HeadTitleStyle = styled(Typography)({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline'
});

const ExternalLink = (props) => {
  const { linkURL, title } = props;
  return (
    <Link underline="always" href={linkURL} target="_blank" color="text.secondary">
      {title}
    </Link>
  );
};

ExternalLink.propTypes = {
  linkURL: PropTypes.string,
  title: PropTypes.string
};
// ----------------------------------------------------------------------

export default function MarketHome() {
  const openSignin = () => {
    if (document.getElementById('signin')) document.getElementById('signin').click();
  };

  return (
    <RootStyle title="Explorer | PASAR">
      <Box
        draggable={false}
        component="img"
        src="/static/corner-logo.png"
        sx={{ width: '50%', maxWidth: '550px', position: 'absolute', top: 0, right: 0 }}
      />
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8, px: { sm: 3, md: 6, lg: 9 }, position: 'relative' }}>
        <StackStyle>
          <Box sx={{ flexGrow: 1, pr: { xs: 0, sm: 3, md: 4, lg: 12, xl: 15 } }}>
            <Stack sx={{ height: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <HeadTitleStyle variant="h1" sx={{ fontSize: { md: '3.9rem', lg: '5rem', xl: '6.5rem' } }}>
                  Dawn of the DeMKT
                </HeadTitleStyle>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 'normal', pr: 4, pb: 2, fontSize: { sm: '1.1rem', md: '1.3rem', lg: '1.5rem' } }}
                >
                  Pasar is open-sourced, community-centric, and one of the first truly Web3.0 decentralized marketplaces
                  (DeMKT) for exchanging data and Non-fungible Tokens (NFTs).
                </Typography>
              </Box>
              <Stack spacing={1} direction="row">
                <StyledButton to="/marketplace" variant="contained" component={RouterLink}>
                  Explore
                </StyledButton>
                <Button to="/create" variant="outlined" component={RouterLink} color="inherit">
                  Create
                </Button>
              </Stack>
            </Stack>
          </Box>
          <HomeAssetCarousel />
        </StackStyle>
      </Container>
      <Container maxWidth="xl" sx={{ px: { sm: 3, md: 6, lg: 9 } }}>
        <Stack spacing={10}>
          <Box>
            <Stack direction="row">
              <TitleStyle component="h1" flexGrow={1}>
                Recently Sold{' '}
                <span role="img" aria-label="">
                  🤝
                </span>
              </TitleStyle>
              <Button
                to="/activity"
                size="small"
                color="inherit"
                component={RouterLink}
                state={{ type: 'Sale' }}
                endIcon={<Icon icon={arrowIosForwardFill} />}
                sx={{ minWidth: '100px' }}
              >
                See more
              </Button>
            </Stack>
            <FilteredAssetGrid type="recent_sold" />
          </Box>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">Get Started with Essentials</TitleStyle>
              <Typography variant="p" component="div" sx={{ color: 'text.secondary' }}>
                Onboarding is easy: Simply register a Decentralized Identifier (DID) and wallet address from the Elastos
                Essentials Wallet. You now have the tools you need to access NFTs with PASAR.
                <br />
                <br />
                Your DID and wallet address allows you to explore Elastos’ complete Web3.0 tech stack, including: Hive
                decentralized storage, Carrier’s P2P network, Ecosystem DAO Cyber Republic, and much more!
                <br />
                <br />
                Download the wallet, follow the instructions and you’re set. If you need help then visit our friendly{' '}
                <ExternalLink linkURL="https://discord.gg/RPbcBv8ckh" title="Discord Server" /> where you will find
                experience, a friendly community, and more information about the delights of Elastos and NFTs.
              </Typography>
            </Box>
            <Box
              draggable={false}
              component="img"
              src="/static/essentials.png"
              sx={{ p: { xs: '0px 32px 32px', sm: 0 }, mt: '0 !important' }}
            />
            <Stack spacing={1} direction="row" sx={{ position: 'absolute', bottom: 0, mr: 4 }}>
              <StyledButton
                variant="contained"
                href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app"
                target="_blank"
                startIcon={<AdbIcon />}
              >
                Google Play
              </StyledButton>
              <Button
                variant="outlined"
                href="https://apps.apple.com/us/app/elastos-essentials/id1568931743"
                target="_blank"
                startIcon={<AppleIcon />}
                color="inherit"
              >
                App Store
              </Button>
            </Stack>
          </CardStyle>
          <Box>
            <Stack direction="row">
              <TitleStyle component="h1" sx={{ flex: 1 }}>
                Auctions{' '}
                <span role="img" aria-label="">
                  ⏰
                </span>
              </TitleStyle>
              <Button
                to="/marketplace"
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
              >
                See more
              </Button>
            </Stack>
            <FilteredAssetGrid type="live_auction" />
          </Box>
          <Box>
            <Stack direction="row">
              <TitleStyle component="h1" sx={{ flex: 1 }}>
                Popular Collections{' '}
                <span role="img" aria-label="">
                  🔥
                </span>
              </TitleStyle>
              <Button
                to="/collections"
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
              >
                See more
              </Button>
            </Stack>
            <FilteredCollectionGrid />
          </Box>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">Decentralized Marketplace (DeMKT)</TitleStyle>
              <Typography variant="p" component="div" sx={{ color: 'text.secondary' }}>
                Pasar is a truly decentralized marketplace that does not rely on any central servers to facilitate the
                peer-to-peer exchange of data and NFTs. You interact directly with buyers and sellers, all secured by
                blockchain technology that is totally transparent and immutable. This means all transactions are secure,
                all transactions are your responsibility and all the data management and ownership is yours.
                <br />
                <br />
                The marketplace has been designed to complement users’ previous experiences in online shopping. The
                buying and selling experience for NFTs does not need to be complicated, but relate to what is already
                available, and what digital citizens have been accustomed to for many years. Now, however, with a DeMKT,
                all users have the added benefit of Elastos Web3.0 data ownership and autonomy securing the shopping
                process for all parties.
                <br />
                <br />
                On Pasar, assets cannot be censored, blocked, or taken down, and Pasar’s trustless exchange protocol is
                already poised to become a leader in Web3.0 space.
              </Typography>
            </Box>
            <Stack spacing={1} direction="row" sx={{ position: 'absolute', bottom: 0, mr: 4 }}>
              <StyledButton to="/marketplace" variant="contained" component={RouterLink}>
                Marketplace
              </StyledButton>
              <Button variant="outlined" to="/explorer" component={RouterLink} color="inherit">
                Explorer
              </Button>
            </Stack>
          </CardStyle>
          <Box>
            <Stack direction="row">
              <TitleStyle component="h1" sx={{ flex: 1 }}>
                Marketplace{' '}
                <span role="img" aria-label="">
                  🛍️
                </span>
              </TitleStyle>
              <Button
                to="/marketplace"
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
              >
                See more
              </Button>
            </Stack>
            <FilteredAssetGrid type="all" />
          </Box>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">Decentralized Identity (DID)</TitleStyle>
              <Typography variant="p" component="div" sx={{ color: 'text.secondary' }}>
                DID empowers users to become self-sovereign in the virtual and online space. On Pasar, users are
                required to sign in with their DIDs in order to create or sell assets. However, all users may purchase
                assets simply connecting their wallets – no identification required.
                <br />
                <br />
                A reputation system based on DID credential enables users to cultivate trust within their communities in
                place of depending on traditional verification systems provided by central authorities.
                <br />
                <br />
                As in real world activities, be they trading, financial, friendship or myriad other possibilities, trust
                is earned. Such trust is attributed to a known entity. With Pasar and Web3.0 the transactions are
                trustless, and visible for all to see, and individuals can earn trust through their behaviors, all
                securely attributed to a tamper-proof DID.
              </Typography>
            </Box>
            <Stack spacing={1} direction="row" sx={{ position: 'absolute', bottom: 0, mr: 4 }}>
              <StyledButton variant="contained" onClick={openSignin}>
                Sign in with DID
              </StyledButton>
              <Button variant="outlined" href="https://www.elastos.org/did" target="_blank" color="inherit">
                Learn more about DID
              </Button>
            </Stack>
          </CardStyle>
          <Box>
            <Stack direction="row">
              <TitleStyle component="h1" sx={{ flex: 1 }}>
                Latest Transactions{' '}
                <span role="img" aria-label="">
                  ✉️
                </span>
              </TitleStyle>
              <Button
                to="explorer/transaction"
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
              >
                See more
              </Button>
            </Stack>
            <FilteredTransGrid />
          </Box>
          <CardStyle>
            <Box component="div">
              <TitleStyle component="h1">Elastos Smart Chain (ESC)</TitleStyle>
              <Typography variant="p" component="div" sx={{ color: 'text.secondary' }}>
                ESC is a programmable smart-contract sidechain that runs on Elastos. Smart contracts, written in
                Solidity, allow users to interact directly with the chain and one another to transact in multiple
                currencies for purchases on Pasar and other protocols.
                <br />
                <br />
                Pasar is built on the ESC to benefit from its efficiency and high-performance. This allows users to
                generate and exchange assets in a secure, low-cost environment.
                <br />
                <br />
                ELA is the native token on ESC and is required as “gas” for completing transactions. Assets can be
                transferred to Elastos Essentials wallet from both centralized and decentralized exchanges. Furthermore,
                cryptocurrency assets can be bridged to ESC from 16 other chains using{' '}
                <ExternalLink linkURL="https://tokbridge.net" title="ShadowTokens" /> or{' '}
                <ExternalLink linkURL="https://elk.finance" title="Elk Finance" />.<br />
                <br />
                Our partners on ESC include <ExternalLink linkURL="https://glidefinance.io" title="Glide Finance" />, a
                decentralized exchange (DEX) and Essentials Wallet, for DID and asset management.
              </Typography>
            </Box>
            <Stack spacing={1} direction="row" sx={{ position: 'absolute', bottom: 0, mr: 4 }}>
              <StyledButton variant="contained" href="https://glidefinance.io/swap" target="_blank">
                Get ELA
              </StyledButton>
              <Button variant="outlined" href="https://www.elastos.org/esc" target="_blank" color="inherit">
                Learn more about ESC
              </Button>
            </Stack>
          </CardStyle>
        </Stack>
      </Container>
    </RootStyle>
  );
}