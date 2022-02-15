import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Grid, List, Stack, Popover, ListItem, ListSubheader, CardActionArea, Tooltip } from '@mui/material';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import useSingin from '../../hooks/useSignin';

// ----------------------------------------------------------------------

const LinkStyle = styled(Link)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
  marginRight: theme.spacing(5),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shortest
  }),
  '&.active': {
    borderBottom: '2px solid',
    borderColor: theme.palette.origin.main,
  },
  '&:hover': {
    opacity: 0.48,
    textDecoration: 'none'
  }
}));

const ListItemStyle = styled(ListItem)(({ theme }) => ({
  ...theme.typography.body2,
  padding: 0,
  marginTop: theme.spacing(3),
  color: theme.palette.text.secondary,
  transition: theme.transitions.create('color'),
  '&:hover': {
    color: theme.palette.text.primary
  }
}));

// ----------------------------------------------------------------------

IconBullet.propTypes = {
  type: PropTypes.oneOf(['subheader', 'item'])
};

function IconBullet({ type = 'item' }) {
  return (
    <Box sx={{ width: 24, height: 16, display: 'flex', alignItems: 'center' }}>
      <Box
        component="span"
        sx={{
          ml: '2px',
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'currentColor',
          ...(type !== 'item' && { ml: 0, width: 8, height: 2, borderRadius: 2 })
        }}
      />
    </Box>
  );
}

// MenuDesktopItem.propTypes = {
//   item: PropTypes.object,
//   isHome: PropTypes.bool,
//   isOffset: PropTypes.bool,
//   isOpen: PropTypes.bool,
//   onOpen: PropTypes.func,
//   onClose: PropTypes.func
// };

function MenuDesktopItem(props) {
  const { item, isHome, isOpen, isOffset, onOpen, onClose } = props
  const { signinEssentialSuccess, setOpenSigninEssentialDlg, setOpenDownloadEssentialDlg, setAfterSigninPath } = useSingin()
  const { title, path, children } = item;

  if (children) {
    return (
      <>
        <LinkStyle
          onClick={onOpen}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            // ...(isHome && { color: 'common.white' }),
            ...(isOffset && { color: 'text.primary' }),
            ...(isOpen && { opacity: 0.48 })
          }}
        >
          {title}
          <Box
            component={Icon}
            icon={isOpen ? arrowIosUpwardFill : arrowIosDownwardFill}
            sx={{ ml: 0.5, width: 16, height: 16 }}
          />
        </LinkStyle>

        <Popover
          open={isOpen}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 80, left: 0 }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={onClose}
          PaperProps={{
            sx: {
              px: 3,
              pt: 5,
              pb: 3,
              right: 16,
              m: 'auto',
              borderRadius: 2,
              maxWidth: (theme) => theme.breakpoints.values.lg,
              boxShadow: (theme) => theme.customShadows.z24
            }
          }}
        >
          <Grid container spacing={3}>
            {children.map((list) => {
              const { subheader, items } = list;

              return (
                <Grid key={subheader} item xs={12} md={subheader === 'Dashboard' ? 6 : 2}>
                  <List disablePadding>
                    <ListSubheader
                      disableSticky
                      disableGutters
                      sx={{
                        display: 'flex',
                        lineHeight: 'unset',
                        alignItems: 'center',
                        color: 'text.primary',
                        typography: 'overline'
                      }}
                    >
                      <IconBullet type="subheader" /> {subheader}
                    </ListSubheader>

                    {items.map((item) => (
                      <ListItemStyle
                        key={item.title}
                        to={item.path}
                        component={RouterLink}
                        underline="none"
                        sx={{
                          '&.active': {
                            color: 'text.primary',
                            typography: 'subtitle2'
                          }
                        }}
                      >
                        <>
                          <IconBullet />
                          {item.title}
                        </>
                      </ListItemStyle>
                    ))}
                  </List>
                </Grid>
              );
            })}
          </Grid>
        </Popover>
      </>
    );
  }

  if (!item.disable&&title === 'Docs') {
    return (
      <LinkStyle
        href={path}
        target="_blank"
        sx={{
          // ...(isHome && { color: 'common.white' }),
          ...(isOffset && { color: 'text.primary' })
        }}
      >
        {title}
      </LinkStyle>
    );
  }

  const openSignin = (path)=>{
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3')
      setOpenDownloadEssentialDlg(true)
    else
      setOpenSigninEssentialDlg(true)
    setAfterSigninPath(path)
  }

  if(path.startsWith("/create")){
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && essentialsConnector.hasWalletConnectSession())
      return <LinkStyle
        to={path}
        component={RouterLink}
        // end={path === '/'}
        sx={{
          '&.active': {
            color: 'primary.main'
          }
        }}
      >
        {title}
      </LinkStyle>
    return <LinkStyle
        // end={path === '/'}
        sx={{
          cursor: 'pointer',
          '&.active': {
            color: 'primary.main'
          }
        }}
        onClick={e=>openSignin(path)}
      >
        {title}
      </LinkStyle>
  }

  return (
    !item.disable?
      <LinkStyle
        to={path}
        component={RouterLink}
        // end={path === '/'}
        sx={{
          // ...(isHome && { color: 'common.white' }),
          // ...(isOffset && { color: 'text.primary' }),
          '&.active': {
            color: 'primary.main'
          }
        }}
      >
        {title}
      </LinkStyle>:
      
      <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
        <LinkStyle
          disabled={1&&true}
          sx={{
            cursor: "default",
          }}
        >
          {title}
        </LinkStyle>
      </Tooltip>
  );
}

MenuDesktop.propTypes = {
  isOffset: PropTypes.bool,
  isHome: PropTypes.bool,
  navConfig: PropTypes.array
};

export default function MenuDesktop(props) {
  const { isOffset, isHome, navConfig } = props
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack direction="row">
      {navConfig.map((link) => (
        <MenuDesktopItem
          key={link.title}
          item={link}
          isOpen={open}
          onOpen={handleOpen}
          onClose={handleClose}
          isOffset={isOffset}
          isHome={isHome}
        />
      ))}
    </Stack>
  );
}
