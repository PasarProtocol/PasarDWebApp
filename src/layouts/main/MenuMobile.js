import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import twitterIcon from '@iconify/icons-ant-design/twitter';
import mediumIcon from '@iconify/icons-ant-design/medium';
import githubIcon from '@iconify/icons-ant-design/github';
import discordIcon from '@iconify/icons-ic/baseline-discord';
import { NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  List,
  Link,
  Drawer,
  Typography,
  Grid,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Container
} from '@mui/material';
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
import { PATH_DOCS } from '../../routes/paths';

// ----------------------------------------------------------------------

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

const SOCIALS = [
  { name: 'Medium', icon: mediumIcon, url: 'https://medium.com/@protocolpasar' },
  { name: 'Twitter', icon: twitterIcon, url: 'https://twitter.com/PasarProtocol' },
  { name: 'Discord', icon: discordIcon, url: 'https://discord.gg/RPbcBv8ckh' },
  { name: 'Github', icon: githubIcon, url: 'https://github.com/PasarProtocol' }
];
// ----------------------------------------------------------------------

MenuMobileItem.propTypes = {
  item: PropTypes.object,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func
};

function MenuMobileItem(props) {
  const { item, isOpen, onOpen } = props;
  const { setOpenSigninEssentialDlg, setOpenDownloadEssentialDlg, setAfterSigninPath } = useSingin();
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

  if (!item.disable && title === 'Docs') {
    return (
      <ListItemStyle href={path} target="_blank" component={Link}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
    );
  }

  const openSignin = async (path) => {
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
      setOpenDownloadEssentialDlg(true);
    } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      const connectedInApp = await window.elastos.getWeb3Provider();
      if (isInAppBrowser() && connectedInApp) navigate(path);
      else setOpenSigninEssentialDlg(true);
    } else setOpenSigninEssentialDlg(true);
    setAfterSigninPath(path);
  };

  if (path.startsWith('/create')) {
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && essentialsConnector.hasWalletConnectSession())
      return (
        <ListItemStyle
          to={path}
          component={RouterLink}
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
      );
    return (
      <ListItemStyle
        sx={{
          cursor: 'pointer',
          '&.active': {
            color: 'text.primary',
            fontWeight: 'fontWeightMedium',
            bgcolor: (theme) => alpha(theme.palette.text.primary, theme.palette.action.selectedOpacity)
          }
        }}
        onClick={() => openSignin(path)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
    );
  }

  return !item.disable ? (
    <ListItemStyle
      to={path}
      component={RouterLink}
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
  ) : (
    <ListItemStyle disabled={1 && true}>
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
  navConfig: PropTypes.array
};

export default function MenuMobile(props) {
  const { isOffset, navConfig } = props;
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { themeMode } = useSettings();
  const fabColorType = themeMode === 'light' ? 'primary' : 'default';

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
        <Scrollbar sx={{ minHeight: 250 }}>
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
          <Grid container dir="ltr" sx={{ pb: 1 }}>
            {SOCIALS.map((social, _i) => (
              <Grid key={_i} item xs={3} align="center">
                <MFab size="small" color={fabColorType} href={social.url} component={Link} target="_blank">
                  <Icon icon={social.icon} width={20} height={22} />
                </MFab>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              pb: 1,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ModeSwitch />
          </Box>
          <CopyRight>
            Pasar Protocol 2021 |{' '}
            <Link
              onClick={() => {
                setDonateOpen(true);
              }}
              underline="always"
              sx={{ color: 'inherit' }}
            >
              Donate{' '}
              <span role="img" aria-label="">
                ❤️
              </span>
            </Link>
          </CopyRight>
          <CopyRight>
            <Link href={PATH_DOCS} target="_blank" underline="always" sx={{ color: 'inherit' }}>
              Docs
            </Link>{' '}
            | Privacy Policy | Disclaimer️
          </CopyRight>
          <CopyRight>v2 - {generatedGitInfo.gitCommitHash}</CopyRight>
        </Container>
        <DonateDlg isOpen={donateOpen} setOpen={setDonateOpen} />
      </Drawer>
    </>
  );
}
