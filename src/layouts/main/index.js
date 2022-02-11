import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import { useLocation, Outlet } from 'react-router-dom';
// material
import { Box } from '@mui/material';
// components
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';

// ----------------------------------------------------------------------

function ScrollTop(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
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
        sx={{ position: 'fixed', bottom: 56, right: 32, zIndex: 1 }}
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
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isFooterHiddenPage = pathname === '/marketplace' || pathname === '/marketplace/' || pathname === '/create' || pathname === '/create/' || pathname.startsWith('/marketplace/search');
  return (
    <>
      <MainNavbar />
      <BodyStyle footerhidden={isFooterHiddenPage?1:0}>
        <Outlet />
      </BodyStyle>
      <MainFooter hidden={isFooterHiddenPage} isHome={isHome}/>
      <ScrollTop>
        <Fab variant="contained" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
