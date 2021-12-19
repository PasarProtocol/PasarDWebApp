import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-ant-design/twitter-circle';
import telegramIcon from '@iconify/icons-ic/round-telegram';
import discordIcon from '@iconify/icons-ic/round-discord';

// material
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, IconButton, Stack, Switch } from '@mui/material';
import palette from '../../theme/palette'
// ----------------------------------------------------------------------

const SOCIALS = [
  { name: 'TelegramIcon', icon: telegramIcon },
  { name: 'Twitter', icon: twitterFill },
  { name: 'DiscordIcon', icon: discordIcon },
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: "#c4c4c4"
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
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
export default function MainFooter() {
  return (
    <RootStyle>
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
            </h3>
            <Typography variant="body2" sx={{ pr: { md: 5 }, color: 'GrayText' }}>
              Pasar Explorer is a Collectible Explorer and <br />
              Analytics Platform for Elastos NFTs, on the <br />
              Elastos Smart Chain (ESC).
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              spacing={1.5}
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              sx={{ mb: { xs: 5, md: 0 } }}
            >
              {SOCIALS.map((social) => (
                <IconButton key={social.name} color="inherit" sx={{ p: 0 }}>
                  <Icon icon={social.icon} width={40} height={40} />
                </IconButton>
              ))}
              
            </Stack>
            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <MaterialUISwitch sx={{ mt: 1, mb: 1 }} defaultChecked />
            </Stack>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' }, mt: 2, borderTop: '1px solid', borderColor: palette.light.grey['300']}}
        >
          <Grid item xs={12} md={6}>
            <CopyRight textAlign='left'>
              Pasar Protocol 2021 | Donate <span role="img" aria-label="">❤️</span>
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
