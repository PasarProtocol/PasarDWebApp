import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Alert, IconButton, Collapse } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CloseIcon from '@mui/icons-material/Close';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useSettings from '../../hooks/useSettings';
import useSignin from '../../hooks/useSignin';
// components
import { MHidden } from '../../components/@material-extend';
import SearchBox from '../../components/SearchBox';
import Searchbar from '../../components/Searchbar';
import NetworkCircle from '../../components/NetworkCircle';
import SignInDialog from '../../components/signin-dlg/SignInDialog';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('md')]: {
    height: APP_BAR_DESKTOP
  }
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8
}));

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const { openTopAlert, setOpenTopAlert } = useSignin();
  const isOffset = useOffSetTop(40);
  const { pathname } = useLocation();
  const { themeMode, changeMode } = useSettings();
  const isLight = themeMode === 'light';
  const isExplorer = pathname === '/explorer';
  const isHome = pathname === '' || pathname === '/';
  const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <Collapse in={openTopAlert}>
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenTopAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ borderRadius: 0 }}
        >
          If you have any existing NFTs listed on the old marketplace contract (Pasar V1), we encourage you to relist
          them on the new marketplace contract (Pasar V2).
        </Alert>
      </Collapse>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            bgcolor: 'background.default',
            height: { md: APP_BAR_DESKTOP - 16 }
          })
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {isHome ? (
            <Box draggable={false} component="img" src="/static/logo-sm.svg" sx={{ minWidth: 140, width: 140 }} />
          ) : (
            <>
              <MHidden width="mdUp">
                <Searchbar />
              </MHidden>
              {!isExplorer && (
                <MHidden width="mdDown">
                  <RouterLink to="/">
                    <Box
                      draggable={false}
                      component="img"
                      src="/static/logo-sm.svg"
                      sx={{ minWidth: 140, width: 140 }}
                    />
                  </RouterLink>
                  <SearchBox
                    sx={{ flexGrow: 1, width: '100%' }}
                    needbgcolor={!isOffset && isHome}
                    needAutocomplete={Boolean(true)}
                  />
                </MHidden>
              )}
            </>
          )}
          {isExplorer || isHome ? (
            <Box sx={{ flexGrow: 1 }} />
          ) : (
            <MHidden width="mdUp">
              <Box sx={{ flexGrow: 1 }} />
            </MHidden>
          )}
          <MHidden width="mdDown">
            <MenuDesktop isOffset={isOffset} navConfig={navConfig} />
          </MHidden>
          <SignInDialog />
          {!!sessionLinkFlag && <NetworkCircle />}
          <MHidden width="mdDown">
            <Button
              variant="outlined"
              value="light"
              onClick={() => {
                changeMode(isLight ? 'dark' : 'light');
              }}
              sx={{
                padding: 0,
                minWidth: 40,
                height: 40,
                borderRadius: '100%',
                ml: 1,
                color: 'text.primary',
                borderColor: (theme) => theme.palette.grey[500_32]
              }}
            >
              {isLight ? <LightModeIcon /> : <DarkModeIcon />}
            </Button>
          </MHidden>
          <MHidden width="mdUp">
            <MenuMobile isOffset={isOffset} navConfig={navConfig} />
          </MHidden>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
