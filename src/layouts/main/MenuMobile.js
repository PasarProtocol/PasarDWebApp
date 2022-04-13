import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import twitterIcon from '@iconify/icons-ant-design/twitter';
// import telegramIcon from '@iconify/icons-ic/outline-telegram';
import TelegramIcon from '@mui/icons-material/Telegram';
import githubIcon from '@iconify/icons-ant-design/github'
import discordIcon from '@iconify/icons-ic/baseline-discord';
import { NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, List, Link, Drawer, Typography, Grid, Paper, CardActionArea, ListItemText, ListItemIcon, ListItemButton, Container } from '@mui/material';
// components
import generatedGitInfo from '../../generatedGitInfo.json';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import ModeSwitch from '../../components/mode-switch';
import { MIconButton, MFab } from '../../components/@material-extend';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import DonateDlg from '../../components/dialog/Donate';
import useSingin from '../../hooks/useSignin';
import useSettings from '../../hooks/useSettings';
import { isInAppBrowser } from '../../utils/common';

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

// MenuMobileItem.propTypes = {
//   item: PropTypes.object,
//   isOpen: PropTypes.bool,
//   onOpen: PropTypes.func
// };

function MenuMobileItem(props) {
  const { item, isOpen, onOpen } = props
  const { signinEssentialSuccess, setOpenSigninEssentialDlg, setOpenDownloadEssentialDlg, setAfterSigninPath } = useSingin()
  const { title, path, icon, children } = item;
  const navigate = useNavigate();

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

  if (!item.disable&&title === 'Docs') {
    return (
      <ListItemStyle href={path} target="_blank" component={Link}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
    );
  }

  const openSignin = async(path)=>{
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
      setOpenDownloadEssentialDlg(true)
    }
    else if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2'){
      const connectedInApp = await window.elastos.getWeb3Provider()
      if(isInAppBrowser() && connectedInApp)
        navigate(path)
      else
        setOpenSigninEssentialDlg(true)
    }
    else
      setOpenSigninEssentialDlg(true)
    setAfterSigninPath(path)
  }

  if(path.startsWith("/create")) {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && essentialsConnector.hasWalletConnectSession())
      return <ListItemStyle
        to={path}
        component={RouterLink}
        // end={path === '/'}
        sx={{
          '&.active': {
            color: 'text.primary',
            fontWeight: 'fontWeightMedium',
            bgcolor: (theme) => alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity)
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
    return <ListItemStyle
        // end={path === '/'}
        sx={{
          cursor: 'pointer',
          '&.active': {
            color: 'text.primary',
            fontWeight: 'fontWeightMedium',
            bgcolor: (theme) => alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity)
          }
        }}
        onClick={e=>openSignin(path)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
  }

  return (
    !item.disable?
      <ListItemStyle
        to={path}
        component={RouterLink}
        // end={path === '/'}
        sx={{
          '&.active': {
            color: 'text.primary',
            fontWeight: 'fontWeightMedium',
            bgcolor: (theme) => alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity)
          }
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>:
      
      <ListItemStyle
        disabled={1&&true}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
  );
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

export default function MenuMobile(props) {
  const { isOffset, isHome, navConfig } = props
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const { themeMode } = useSettings();
  const fabColorType = themeMode==='light'?'primary':'default'

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
              <MenuMobileItem
                key={link.title}
                item={link}
                isOpen={open}
                onOpen={handleOpen}
              />
            ))}
          </List>
        </Scrollbar>
        <Box sx={{ flexGrow: 1 }} />
        <Container>
          <Grid container dir="ltr" sx={{pb: 1}}>
            {/* <Grid item xs={4} align="center">
              <MFab color="info" size="medium">
                <TelegramIcon sx={{ fontSize: 30 }} />
              </MFab>
            </Grid> */}
            <Grid item xs={6} align="center">
              <MFab size="medium" color={fabColorType} href="https://discord.gg/RPbcBv8ckh" component={Link} target="_blank">
                <Icon icon={discordIcon} width={30} height={30} />
              </MFab>
            </Grid>
            <Grid item xs={6} align="center">
              <MFab size="medium" color={fabColorType} href="https://github.com/PasarProtocol" component={Link} target="_blank">
                <Icon icon={githubIcon} width={30} height={30} />
              </MFab>
            </Grid>
            {/* <Grid item xs={4} align="center">
              <MFab color="info" size="medium">
                <Icon icon={twitterIcon} width={30} height={30} />
              </MFab>
            </Grid> */}
          </Grid>
          <Box
            sx={{
              pb: 1,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ModeSwitch/>
          </Box>
          <CopyRight>
            Pasar Protocol 2021 |{' '}
            <Link onClick={()=>{setDonateOpen(true)}} color='GrayText' sx={{cursor: 'pointer'}}>
              Donate <span role="img" aria-label="">❤️</span>
            </Link>
          </CopyRight>
          <CopyRight>
            Privacy Policy | Disclaimer️
          </CopyRight>
          <CopyRight>
            v1 - {generatedGitInfo.gitCommitHash}
          </CopyRight>
        </Container>
        <DonateDlg isOpen={donateOpen} setOpen={setDonateOpen}/>
      </Drawer>
    </>
  );
}