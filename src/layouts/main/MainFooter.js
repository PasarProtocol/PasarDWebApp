import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-ant-design/twitter-circle';
import telegramIcon from '@iconify/icons-ic/round-telegram';
import discordIcon from '@iconify/icons-ic/round-discord';

// material
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, IconButton, Stack, Box } from '@mui/material';
import palette from '../../theme/palette'
import ModeSwitch from '../../components/mode-switch'
// ----------------------------------------------------------------------

const SOCIALS = [
  { name: 'TelegramIcon', icon: telegramIcon },
  { name: 'Twitter', icon: twitterFill },
  { name: 'DiscordIcon', icon: discordIcon },
];

const RootStyle = styled('div')(({ theme }) => ({
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
              <Box draggable = {false} component="img" src="/static/elastos.svg" sx={{ width: 21, display: 'inline', pl: .5 }} />
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
                <ModeSwitch sx={{ mt: 1, mb: 1 }} defaultChecked />
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
