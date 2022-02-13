import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Tooltip } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// components
import { MHidden } from '../../components/@material-extend';
import SearchBox from '../../components/SearchBox';
import Searchbar from '../../components/Searchbar';
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
  const isOffset = useOffSetTop(40);
  const { pathname } = useLocation();
  const isHome = pathname === '/explorer';
  const isMarketHome = pathname === '' || pathname === '/';

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
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
          {
            !isMarketHome?
            <>
              <MHidden width="mdUp">
                <Searchbar />
              </MHidden>
              {
                !isHome&&
                <MHidden width="mdDown">
                  <RouterLink to="/">
                    <Box draggable = {false} component="img" src="/static/logo-sm.svg" sx={{ minWidth: 140, width: 140 }} />
                  </RouterLink>
                  <SearchBox sx={{flexGrow: 1, width: '100%', mx: 3}} needbgcolor={!isOffset && isMarketHome}/>
                </MHidden>
              }
            </>:
            <Box draggable = {false} component="img" src="/static/logo-sm.svg" sx={{ minWidth: 140, width: 140 }} />
          }
          {
            isHome||isMarketHome?
            <Box sx={{ flexGrow: 1 }} />:
            <MHidden width="mdUp">
              <Box sx={{ flexGrow: 1 }} />
            </MHidden>
          }
          <MHidden width="mdDown">
            <MenuDesktop
              isOffset={isOffset}
              isHome={isHome}
              navConfig={navConfig}
            />
          </MHidden>
          <SignInDialog/>
          <MHidden width="mdUp">
            <MenuMobile
              isOffset={isOffset}
              isHome={isHome}
              navConfig={navConfig}
            />
          </MHidden>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
