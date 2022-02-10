import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-ant-design/twitter-circle';
import telegramIcon from '@iconify/icons-ic/round-telegram';

// material
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, IconButton, Stack, Box } from '@mui/material';
import generatedGitInfo from '../../generatedGitInfo.json';
import palette from '../../theme/palette';
import ModeSwitch from '../../components/mode-switch';
// ----------------------------------------------------------------------

const SOCIALS = [
  { name: 'TelegramIcon', icon: telegramIcon },
  { name: 'Twitter', icon: twitterFill }
];

const RootStyle = styled('div')(({ theme, sx }) => ({
  ...sx,
  position: 'absolute',
  bottom: 0,
  width: '100%',
  // position: 'relative',
  backgroundColor: '#c4c4c4',
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
export default function MainFooter({ hidden, isHome }) {
  const sx = hidden ? { display: 'none' } : {};
  if (isHome) sx.backgroundColor = '#0d0d0d';
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
            <h3 style={{ paddingBottom: 15 }}>
              <span role="img" aria-label="">
                ⚡{' '}
              </span>
              Powered by Elastos
              <Box
                draggable={false}
                component="img"
                src="/static/elastos.svg"
                sx={{ width: 21, display: 'inline', pl: 0.5 }}
              />
            </h3>
            <Typography variant="body2" sx={{ pr: { md: 5 }, color: 'GrayText' }}>
              Pasar is a truly decentralized Web3.0 Marketplace, Collectible Explorer,
              and Analytics Platform for NFTs created on the Elastos Smart Chain (ESC).
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              spacing={1}
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              sx={{ mb: { xs: 5, md: 0 } }}
            >
              {/* {SOCIALS.map((social) => (
                <IconButton key={social.name} color="inherit" sx={{ p: 0 }}>
                  <Icon icon={social.icon} width={40} height={40} />
                </IconButton>
              ))} */}
              <IconButton
                color="inherit"
                sx={{ p: '2px' }}
                href="https://discord.gg/RPbcBv8ckh"
                component={Link}
                target="_blank"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="36" height="36" viewBox="0 0 256 256">
                  <g transform="translate(128 128) scale(0.72 0.72)">
                    <g transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)">
                      <path
                        d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 56.901 62.98 c 0 0 -1.541 -1.841 -2.825 -3.467 c 5.608 -1.584 7.748 -5.094 7.748 -5.094 c -1.755 1.156 -3.425 1.969 -4.923 2.526 c -2.14 0.899 -4.195 1.498 -6.207 1.841 c -4.11 0.771 -7.877 0.557 -11.087 -0.043 c -2.44 -0.471 -4.538 -1.156 -6.293 -1.841 c -0.985 -0.385 -2.055 -0.856 -3.125 -1.455 c -0.128 -0.086 -0.257 -0.128 -0.385 -0.214 c -0.086 -0.043 -0.128 -0.086 -0.171 -0.128 c -0.771 -0.428 -1.199 -0.728 -1.199 -0.728 s 2.055 3.425 7.491 5.051 c -1.284 1.627 -2.868 3.553 -2.868 3.553 C 23.596 62.68 20 56.473 20 56.473 c 0 -13.784 6.164 -24.957 6.164 -24.957 c 6.164 -4.623 12.029 -4.495 12.029 -4.495 l 0.428 0.514 c -7.706 2.226 -11.259 5.608 -11.259 5.608 s 0.942 -0.514 2.526 -1.241 c 4.581 -2.012 8.219 -2.568 9.717 -2.697 c 0.257 -0.043 0.471 -0.086 0.728 -0.086 c 2.611 -0.342 5.565 -0.428 8.647 -0.086 c 4.067 0.471 8.433 1.669 12.885 4.11 c 0 0 -3.382 -3.211 -10.659 -5.437 l 0.599 -0.685 c 0 0 5.865 -0.128 12.029 4.495 c 0 0 6.164 11.173 6.164 24.957 C 70 56.473 66.361 62.68 56.901 62.98 z"
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                        style={{ fill: 'currentColor' }}
                      />
                      <path
                        d="M 36.995 42.988 c -2.44 0 -4.366 2.14 -4.366 4.752 c 0 2.611 1.969 4.752 4.366 4.752 c 2.44 0 4.366 -2.14 4.366 -4.752 C 41.404 45.129 39.435 42.988 36.995 42.988 z M 52.62 42.988 c -2.44 0 -4.366 2.14 -4.366 4.752 c 0 2.611 1.969 4.752 4.366 4.752 c 2.44 0 4.366 -2.14 4.366 -4.752 C 56.986 45.129 55.06 42.988 52.62 42.988 z"
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                        style={{ fill: 'currentColor' }}
                      />
                    </g>
                  </g>
                </svg>
              </IconButton>
              <IconButton
                color="inherit"
                sx={{ p: '2px' }}
                href="https://github.com/PasarProtocol"
                component={Link}
                target="_blank"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0, 0, 43, 43">
                  <g fill="currentColor">
                    <path
                      d="M21.3035 0C9.5395 0 0 9.5373 0 21.3035c0 9.4122 6.1041 17.3976 14.5687 20.2146 1.0646.1972 1.4555-.4622 1.4555-1.0249 0-.5076-.0198-2.1861-.0289-3.9662-5.9266 1.2887-7.1772-2.5136-7.1772-2.5136-.9691-2.462-2.3654-3.1171-2.3654-3.1171-1.9329-1.3222.1457-1.295.1457-1.295 2.1392.1502 3.2656 2.1956 3.2656 2.1956 1.9001 3.2565 4.9837 2.315 6.1994 1.7706.1916-1.3765.7433-2.3167 1.3526-2.8487-4.7319-.5383-9.706-2.3653-9.706-10.5283 0-2.3255.8322-4.2259 2.195-5.7178-.2212-.537-.9504-2.7037.2067-5.638 0 0 1.789-.5723 5.8596 2.184 1.6994-.472 3.5218-.7088 5.3323-.7172 1.8104.008 3.6343.2451 5.3368.7172 4.0661-2.7563 5.8526-2.184 5.8526-2.184 1.1596 2.9343.4304 5.101.2092 5.638 1.366 1.4919 2.1921 3.3923 2.1921 5.7178 0 8.1827-4.9837 9.984-9.7275 10.5114.7642.6611 1.445 1.9576 1.445 3.9451 0 2.8505-.0243 5.1446-.0243 5.8462 0 .5673.3831 1.2316 1.463 1.0224 8.4603-2.8201 14.5566-10.8028 14.5566-20.212C42.6071 9.5372 33.0691 0 21.3036 0"
                      fillRule="evenodd"
                    />
                    <path d="M8.0689 30.587c-.047.1061-.2135.1379-.3651.0649-.155-.0695-.2413-.2138-.1913-.32.046-.1087.2124-.139.367-.0663.1545.0695.2426.2152.1894.3214m.863.9625c-.1016.0942-.3006.0504-.435-.0984-.1397-.1485-.1655-.3475-.0624-.4427.1048-.0942.2974-.0501.4367.0984.1397.1503.1669.3475.0607.4427m.8399 1.2268c-.1305.091-.3443.006-.4763-.1834-.1305-.1898-.1305-.417.003-.508.132-.091.3426-.009.4763.1788.1302.1926.1302.4198-.003.5126m1.1506 1.1855c-.1167.1287-.3654.0942-.5475-.0815-.1862-.1718-.238-.4156-.1213-.5444.1185-.129.3686-.0928.552.0815.185.1715.241.417.1168.5444m1.5876.6882c-.052.167-.291.2424-.5324.1715-.241-.073-.3986-.268-.35-.4367.0502-.1683.2908-.247.5338-.1711.2406.0727.3987.2667.3486.4364m1.7435.1275c.006.1757-.1986.3214-.4519.3245-.2547.006-.461-.1365-.4639-.3094 0-.1774.2004-.3213.4547-.326.2533-.005.4611.1366.4611.3109m1.6223-.276c.0303.171-.1457.3471-.3972.394-.2473.0455-.4763-.0607-.5077-.2303-.0307-.1757.1482-.3517.3955-.3972.2519-.0437.4773.0593.5094.2335" />
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
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            mt: 2,
            borderTop: '1px solid',
            borderColor: palette.light.grey['300']
          }}
        >
          <Grid item xs={12} md={6}>
            <CopyRight textAlign="left">
              Pasar Protocol 2021 | Donate{' '}
              <span role="img" aria-label="">
                ❤️
              </span>{' '}
              v1 - {generatedGitInfo.gitCommitHash}
            </CopyRight>
          </Grid>
          <Grid item xs={12} md={6}>
            <CopyRight textAlign="right">Privacy Policy | Disclaimer️</CopyRight>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
