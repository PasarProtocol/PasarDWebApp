import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import twitterIcon from '@iconify/icons-ant-design/twitter';
// import telegramIcon from '@iconify/icons-ic/outline-telegram';
import TelegramIcon from '@mui/icons-material/Telegram';
import discordIcon from '@iconify/icons-ic/baseline-discord';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, List, Link, Drawer, Typography, Grid, Paper, CardActionArea, ListItemText, ListItemIcon, ListItemButton, Container } from '@mui/material';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import ModeSwitch from '../../components/mode-switch';
import { MIconButton } from '../../components/@material-extend';

// ----------------------------------------------------------------------

const ICON_SIZE = 22;
const ITEM_SIZE = 48;
const PADDING = 2.5;

const ListItemStyle = styled(ListItemButton)(({ theme }) => ({
  ...theme.typography.body2,
  height: ITEM_SIZE,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(PADDING),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------

MenuMobileItem.propTypes = {
  item: PropTypes.object,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func
};

function MenuMobileItem({ item, isOpen, onOpen }) {
  const { title, path, icon, children } = item;

  if (children) {
    return (
      <>
        <ListItemStyle onClick={onOpen}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText disableTypography primary={title} />
          <Box
            component={Icon}
            icon={isOpen ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>
      </>
    );
  }

  return (
    <ListItemStyle
      to={path}
      component={RouterLink}
      end={path === '/'}
      sx={{
        '&.active': {
          color: 'primary.main',
          fontWeight: 'fontWeightMedium',
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        }
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText disableTypography primary={title} />
    </ListItemStyle>
  );
}
function MessengerItem(props){
  return (
    <Paper
      variant='outlined'
      sx={{
        borderRadius: 2
      }}
    >
      <CardActionArea sx={{ borderRadius: 2 }}>
        <Box
          sx={{
            py: 1,
            display: 'flex',
            justifyContent: 'center',
            color: 'text.secondary'
          }}
        >
          {props.children}
        </Box>
      </CardActionArea>
    </Paper>
  )
}
function CopyRight(prop) {
  return (
    <Typography
      component="p"
      variant="body2"
      sx={{
        color: 'text.secondary',
        textAlign: 'center'
      }}
    >
      {prop.children}
    </Typography>
  );
}
MenuMobile.propTypes = {
  isOffset: PropTypes.bool,
  isHome: PropTypes.bool,
  navConfig: PropTypes.array
};

export default function MenuMobile({ isOffset, isHome, navConfig }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <MIconButton
        onClick={handleDrawerOpen}
        sx={{
          ml: 1,
          // ...(isHome && { color: 'common.white' }),
          ...(isOffset && { color: 'text.primary' })
        }}
      >
        <Icon icon={menu2Fill} />
      </MIconButton>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { pb: 5, width: 260 } }}
      >
        <Scrollbar sx={{minHeight: 250}}>
          <Link component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
            <Logo sx={{ mx: PADDING, my: 3 }} />
          </Link>

          <List disablePadding>
            {navConfig.map((link) => (
              <MenuMobileItem key={link.title} item={link} isOpen={open} onOpen={handleOpen} />
            ))}
          </List>
        </Scrollbar>
        <Box sx={{ flexGrow: 1 }} />
        <Container>
          <Grid container spacing={2} dir="ltr" sx={{px: 1}}>
            <Grid item xs={4}>
              <MessengerItem>
                <TelegramIcon sx={{ fontSize: 30 }} />
              </MessengerItem>
            </Grid>
            <Grid item xs={4}>
              <MessengerItem>
                <Icon icon={twitterIcon} width={30} height={30} />
              </MessengerItem>
            </Grid>
            <Grid item xs={4}>
              <MessengerItem>
                <Icon icon={discordIcon} width={30} height={30} />
              </MessengerItem>
            </Grid>
          </Grid>
          <Box
            sx={{
              py: 3,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ModeSwitch/>
          </Box>
          <CopyRight>
            Pasar Protocol 2021 | Donate <span role="img" aria-label="">❤️</span>
          </CopyRight>
          <CopyRight>
            Privacy Policy | Disclaimer️
          </CopyRight>
        </Container>
      </Drawer>
    </>
  );
}

/* <IconButton key={social.name} color="inherit" sx={{ p: 0 }}>
<Icon icon={social.icon} width={40} height={40} />
</IconButton> */