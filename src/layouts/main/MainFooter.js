import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-ant-design/twitter-circle';
import telegramIcon from '@iconify/icons-ic/round-telegram';

// material
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, IconButton, Stack, Box } from '@mui/material';
import palette from '../../theme/palette'
import ModeSwitch from '../../components/mode-switch'
// ----------------------------------------------------------------------

const SOCIALS = [
  { name: 'TelegramIcon', icon: telegramIcon },
  { name: 'Twitter', icon: twitterFill },
];

const RootStyle = styled('div')(({ theme, sx }) => ({
  ...sx,
  position: 'absolute',
  bottom: 0,
  width: '100%',
  // position: 'relative',
  backgroundColor: "#c4c4c4",
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

// ----------------------------------------------------------------------
function CopyRight(prop) {
  return (
    <Typography
      component="p"
      variant="body2"
      sx={{
        pt: 2,
        pb: 2,
        color: 'GrayText',
        textAlign: { xs: 'center', md: prop.textAlign }
      }}
    >
      {prop.children}
    </Typography>
  );
}
export default function MainFooter({hidden, isHome}) {
  const sx=hidden?{display: 'none'}:{}
  if(isHome)
    sx.backgroundColor = '#0d0d0d'
  return (
    <RootStyle sx={sx}>
      <Divider />
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          <Grid item xs={12} md={6}>
            <h3 style={{paddingBottom: 15}}>
              <span role="img" aria-label=''>⚡ </span>Powered by Elastos
              <Box draggable = {false} component="img" src="/static/elastos.svg" sx={{ width: 21, display: 'inline', pl: .5 }} />
            </h3>
            <Typography variant="body2" sx={{ pr: { md: 5 }, color: 'GrayText' }}>
              Pasar Protocol is a truly decentralized Web3.0 Marketplace, Collectible Explorer
              and Analytics Platform for NFTs created on the Elastos Smart Chain (ESC)
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              spacing={1.5}
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              sx={{ mb: { xs: 5, md: 0 } }}
            >
              {/* {SOCIALS.map((social) => (
                <IconButton key={social.name} color="inherit" sx={{ p: 0 }}>
                  <Icon icon={social.icon} width={40} height={40} />
                </IconButton>
              ))} */}
              <IconButton color="inherit" sx={{ p: '2px' }} href="https://discord.gg/RPbcBv8ckh" component={Link} target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="36" height="36" viewBox="0 0 256 256">
                  <g transform="translate(128 128) scale(0.72 0.72)">
                    <g transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)">
                      <path d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 56.901 62.98 c 0 0 -1.541 -1.841 -2.825 -3.467 c 5.608 -1.584 7.748 -5.094 7.748 -5.094 c -1.755 1.156 -3.425 1.969 -4.923 2.526 c -2.14 0.899 -4.195 1.498 -6.207 1.841 c -4.11 0.771 -7.877 0.557 -11.087 -0.043 c -2.44 -0.471 -4.538 -1.156 -6.293 -1.841 c -0.985 -0.385 -2.055 -0.856 -3.125 -1.455 c -0.128 -0.086 -0.257 -0.128 -0.385 -0.214 c -0.086 -0.043 -0.128 -0.086 -0.171 -0.128 c -0.771 -0.428 -1.199 -0.728 -1.199 -0.728 s 2.055 3.425 7.491 5.051 c -1.284 1.627 -2.868 3.553 -2.868 3.553 C 23.596 62.68 20 56.473 20 56.473 c 0 -13.784 6.164 -24.957 6.164 -24.957 c 6.164 -4.623 12.029 -4.495 12.029 -4.495 l 0.428 0.514 c -7.706 2.226 -11.259 5.608 -11.259 5.608 s 0.942 -0.514 2.526 -1.241 c 4.581 -2.012 8.219 -2.568 9.717 -2.697 c 0.257 -0.043 0.471 -0.086 0.728 -0.086 c 2.611 -0.342 5.565 -0.428 8.647 -0.086 c 4.067 0.471 8.433 1.669 12.885 4.11 c 0 0 -3.382 -3.211 -10.659 -5.437 l 0.599 -0.685 c 0 0 5.865 -0.128 12.029 4.495 c 0 0 6.164 11.173 6.164 24.957 C 70 56.473 66.361 62.68 56.901 62.98 z" transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" style={{fill: 'currentColor'}}/>
                      <path d="M 36.995 42.988 c -2.44 0 -4.366 2.14 -4.366 4.752 c 0 2.611 1.969 4.752 4.366 4.752 c 2.44 0 4.366 -2.14 4.366 -4.752 C 41.404 45.129 39.435 42.988 36.995 42.988 z M 52.62 42.988 c -2.44 0 -4.366 2.14 -4.366 4.752 c 0 2.611 1.969 4.752 4.366 4.752 c 2.44 0 4.366 -2.14 4.366 -4.752 C 56.986 45.129 55.06 42.988 52.62 42.988 z" transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" style={{fill: 'currentColor'}}/>
                    </g>
                  </g>
                </svg>
              </IconButton>
            </Stack>
            {/* <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <ModeSwitch sx={{ mt: 1, mb: 1 }} defaultChecked />
            </Stack> */}
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' }, mt: 2, borderTop: '1px solid', borderColor: palette.light.grey['300']}}
        >
          <Grid item xs={12} md={6}>
            <CopyRight textAlign='left'>
              Pasar Protocol 2021 | Donate <span role="img" aria-label="">❤️</span> v1 - 6c57f5efda348a6c164b44e737a3abd4cdf03b6e
            </CopyRight>
          </Grid>
          <Grid item xs={12} md={6}>
            <CopyRight textAlign='right'>
              Privacy Policy | Disclaimer️
            </CopyRight>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
