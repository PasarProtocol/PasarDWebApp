import * as React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Fab, Zoom, useScrollTrigger } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// material
// components
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import useSettings from '../../hooks/useSettings';
import useSingin from '../../hooks/useSignin';

// ----------------------------------------------------------------------

function ScrollTop(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: {xs: 56, sm: 36}, right: 22, zIndex: 2 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired
};

const BodyStyle = styled('div')(({ theme, footerhidden }) => (
  footerhidden?{}:
  {
    [theme.breakpoints.up('md')]: {
      paddingBottom: 200
    }
  }
));

export default function MainLayout() {
  const { themeMode } = useSettings();
  const { pathname } = useLocation();
  const { openTopAlert } = useSingin()
  const isHome = pathname === '/';
  const isContainerXl = isHome || pathname === '/collections';
  const isFooterHiddenPage = 
    pathname === '/marketplace' || 
    pathname === '/marketplace/' || 
    pathname === '/create' || 
    pathname === '/create/' || 
    pathname === '/activity' || 
    pathname === '/activity/' || 
    pathname.startsWith('/marketplace/search') || 
    pathname.startsWith('/collections/detail');
  return (
    <>
      <MainNavbar />
      <BodyStyle footerhidden={isFooterHiddenPage?1:0} style={{paddingTop: openTopAlert?50:0, transition: 'padding-top 0.3s'}}>
        <Outlet />
      </BodyStyle>
      <MainFooter hidden={isFooterHiddenPage} isContainerXl={isContainerXl}/>
      <ScrollTop>
        <Fab variant="contained" size="small" aria-label="scroll back to top" color={themeMode==='light'?'primary':'default'}>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
