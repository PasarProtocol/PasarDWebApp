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
import useSettings from '../../hooks/useSettings';
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
        sx={{ position: 'fixed', bottom: {xs: 56, sm: 36}, right: 22, zIndex: 1 }}
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
  const isHome = pathname === '/';
  const isContainerXl = isHome || pathname === '/collection';
  const isFooterHiddenPage = pathname === '/marketplace' || pathname === '/marketplace/' || pathname === '/create'
   || pathname === '/create/' || pathname.startsWith('/marketplace/search') || pathname.startsWith('/collections/detail');
  return (
    <>
      <MainNavbar />
      <BodyStyle footerhidden={isFooterHiddenPage?1:0}>
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
