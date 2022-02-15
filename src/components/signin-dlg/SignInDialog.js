import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, Stack, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, DialogContentText, IconButton, Typography, Grid, Avatar, Box, Link, Menu, MenuItem } from '@mui/material';
import * as math from 'mathjs';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import jwtDecode from 'jwt-decode';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { VerifiablePresentation, DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import jwt from 'jsonwebtoken';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { essentialsConnector, initConnectivitySDK, isUsingEssentialsConnector } from './EssentialConnectivity';
import { MIconButton, MFab } from '../@material-extend';
import { injected, walletconnect, walletlink } from './connectors';
import { useEagerConnect, useInactiveListener } from './hook';
import CopyButton from '../CopyButton';
import SnackbarCustom from '../SnackbarCustom';
import PaperRecord from '../PaperRecord';
import { reduceHexAddress, getBalance, getCoinUSD, getDiaTokenInfo, getDiaTokenPrice, fetchFrom, clearCacheData, isInAppBrowser } from '../../utils/common';
import useSettings from '../../hooks/useSettings';
import useSingin from '../../hooks/useSignin';

const useStyles = makeStyles({
  iconAbsolute1: {
    paddingLeft: 40,
    paddingRight: 80,
    position: 'relative',
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 16
    },
    '& .MuiButton-endIcon': {
      position: 'absolute',
      right: 16
    }
  },
  iconAbsolute2: {
    paddingLeft: 40,
    paddingRight: 40,
    position: 'relative',
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 16
    }
  }
});

export default function SignInDialog() {
  const {
    openSigninEssential,
    openDownloadEssential,
    afterSigninPath,
    diaBalance,
    setOpenSigninEssentialDlg,
    setOpenDownloadEssentialDlg,
    setAfterSigninPath,
    setSigninEssentialSuccess,
    setPasarLinkAddress,
    setDiaBalance
  } = useSingin();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const { themeMode } = useSettings();
  const isLight = !isHome && themeMode === 'light';

  const ButtonStyle = styled(Button)(
    ({ theme }) =>
      !isLight && {
        backgroundColor: 'white',
        color: theme.palette.background.default,
        '&:hover': {
          backgroundColor: theme.palette.action.active
        }
      }
  );

  const ButtonOutlinedStyle = styled(Button)(
    ({ theme }) =>
      !isLight && {
        borderColor: 'white',
        color: 'white',
        '&:hover': {
          color: theme.palette.background.default,
          backgroundColor: theme.palette.action.active
        }
      }
  );

  let sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
  const context = useWeb3React();
  const { connector, activate, active, error, library, chainId, account } = context;
  const [isOpenSnackbar, setSnackbarOpen] = useState(false);
  const [openSignin, setOpenSigninDlg] = useState(false);
  const [openDownload, setOpenDownloadDlg] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState(null);
  const [isOpenAccountPopup, setOpenAccountPopup] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [coinUSD, setCoinUSD] = React.useState(0);
  const [diaUSD, setDiaUSD] = React.useState(0);
  const navigate = useNavigate();

  const classes = useStyles();

  const initializeWalletConnection = React.useCallback(async () => {
    if (sessionLinkFlag && !activatingConnector) {
      if (sessionLinkFlag === '1') {
        setActivatingConnector(injected);
        await activate(injected);
        setWalletAddress(await injected.getAccount());
      } else if (sessionLinkFlag === '2') {
        setWalletAddress(
          isInAppBrowser()
            ? await window.elastos.getWeb3Provider().address
            : essentialsConnector.getWalletConnectProvider().wc.accounts[0]
        );
        setActivatingConnector(essentialsConnector);
      } else if (sessionLinkFlag === '3') {
        setActivatingConnector(walletconnect);
        // await activate(walletconnect);
        await walletconnect.activate();
        setWalletAddress(await walletconnect.getAccount());
      }
    }
  }, [sessionLinkFlag, activatingConnector, account, chainId]);

  React.useEffect(async () => {
    initializeWalletConnection();
    getCoinUSD().then((res) => {
      setCoinUSD(res);
    });
    if (chainId !== undefined && chainId !== 21 && chainId !== 20) {
      setSnackbarOpen(true);
    }

    sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    if (sessionLinkFlag) {
      // when connected
      if ((sessionLinkFlag === '1' || sessionLinkFlag === '3') && library) {
        getDiaTokenPrice(library.provider)
          .then((res) => {
            setDiaUSD(res.token.derivedELA * res.bundle.elaPrice);
          })
          .catch((error) => {
            setDiaUSD(0);
          });
        getDiaTokenInfo(account, library.provider)
          .then((dia) => {
            setDiaBalance(dia);
          })
          .catch((error) => {
            setDiaBalance(0);
          });
        getBalance(library.provider).then((res) => {
          setBalance(math.round(res / 1e18, 4));
        });
      } else if (sessionLinkFlag === '2') {
        if (isInAppBrowser()) {
          const elastosWeb3Provider = await window.elastos.getWeb3Provider();
          getDiaTokenPrice(elastosWeb3Provider)
            .then((res) => {
              setDiaUSD(res.token.derivedELA * res.bundle.elaPrice);
            })
            .catch((error) => {
              setDiaUSD(0);
            });
          getDiaTokenInfo(elastosWeb3Provider.address, elastosWeb3Provider)
            .then((dia) => {
              setDiaBalance(dia);
            })
            .catch((error) => {
              setDiaBalance(0);
            });
          getBalance(elastosWeb3Provider).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          });
          // setWalletAddress(await window.elastos.getWeb3Provider().address);
        } else if (essentialsConnector.getWalletConnectProvider()) {
          const essentialProvider = essentialsConnector.getWalletConnectProvider();
          getDiaTokenPrice(essentialProvider)
            .then((res) => {
              setDiaUSD(res.token.derivedELA * res.bundle.elaPrice);
            })
            .catch((error) => {
              setDiaUSD(0);
            });
          getDiaTokenInfo(essentialProvider.wc.accounts[0], essentialProvider)
            .then((dia) => {
              setDiaBalance(dia);
            })
            .catch((error) => {
              setDiaBalance(0);
            });
          getBalance(essentialProvider).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          });
          // setWalletAddress(essentialsConnector.getWalletConnectProvider().wc.accounts[0]);
        }
      }
    }
  }, [sessionLinkFlag, account, active, chainId, activatingConnector]);

  // listen for disconnect from essentials / wallet connect
  React.useEffect(async () => {
    if (sessionLinkFlag === '1' && activatingConnector === injected && !active) {
      setOpenAccountPopup(null);
      await activate(null);
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1') {
        try {
          await activatingConnector.deactivate();
        } catch (e) {
          console.log('injected connector deactive error: ', e);
        }
      }
      sessionStorage.removeItem('PASAR_LINK_ADDRESS');
      setActivatingConnector(null);
      setWalletAddress(null);
      navigate('/marketplace');
      window.location.reload();
    } else if (sessionLinkFlag === '2' && activatingConnector === essentialsConnector) {
      if (isInAppBrowser()) {
        if (!(await window.elastos.getWeb3Provider().isConnected())) {
          setOpenAccountPopup(null);
          await activate(null);
          window.elastos
            .getWeb3Provider()
            .disconnect()
            .then((res) => {})
            .catch((e) => {
              console.log(e);
            });
          sessionStorage.removeItem('PASAR_LINK_ADDRESS');
          sessionStorage.removeItem('PASAR_TOKEN');
          sessionStorage.removeItem('PASAR_DID');
          setActivatingConnector(null);
          setWalletAddress(null);
          navigate('/marketplace');
          window.location.reload();
        }
      } else if (!essentialsConnector.hasWalletConnectSession()) {
        setOpenAccountPopup(null);
        await activate(null);
        essentialsConnector
          .disconnectWalletConnect()
          .then((res) => {})
          .catch((e) => {
            console.log(e);
          });
        sessionStorage.removeItem('PASAR_LINK_ADDRESS');
        sessionStorage.removeItem('PASAR_TOKEN');
        sessionStorage.removeItem('PASAR_DID');
        setActivatingConnector(null);
        setWalletAddress(null);
        navigate('/marketplace');
        window.location.reload();
      }
    } else if (sessionLinkFlag === '3') {
      if (activatingConnector === walletconnect && !walletconnect.walletConnectProvider.connected) {
        setOpenAccountPopup(null);
        await activate(null);
        if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
          try {
            await activatingConnector.deactivate();
          } catch (e) {
            console.log('walletconnect deactive error: ', e);
          }
        }
        sessionStorage.removeItem('PASAR_LINK_ADDRESS');
        setActivatingConnector(null);
        setWalletAddress(null);
        navigate('/marketplace');
        window.location.reload();
      }
    }
  }, [essentialsConnector.hasWalletConnectSession(), active]);

  // useEffect(async () => {
  //   if (isInAppBrowser()) {
  //     await window.elastos.getWeb3Provider().on('accountsChanged', (accounts) => {
  //       // Handle the new accounts, or lack thereof.
  //       // "accounts" will always be an array, but it can be empty.
  //       alert(accounts)
  //     });
  //   }
  // }, []);

  // ------------ MM, WC, WL Connect ------------
  const handleChooseWallet = async (wallet) => {
    let currentConnector = null;
    if (wallet === 'metamask') currentConnector = injected;
    else if (wallet === 'walletconnect') currentConnector = walletconnect;
    else if (wallet === 'walletlink') currentConnector = walletlink;
    setActivatingConnector(currentConnector);
    await activate(currentConnector);
    // if(active) {
    console.log('loged in');
    if (wallet === 'metamask') {
      sessionLinkFlag = '1';
      sessionStorage.setItem('PASAR_LINK_ADDRESS', 1);
      setPasarLinkAddress(1)
    } else if (wallet === 'walletconnect') {
      sessionLinkFlag = '3';
      sessionStorage.setItem('PASAR_LINK_ADDRESS', 3);
      setPasarLinkAddress(3)
    } else if (wallet === 'walletlink') {
      sessionLinkFlag = '4';
      sessionStorage.setItem('PASAR_LINK_ADDRESS', 4);
      setPasarLinkAddress(4)
    }
    // }
    setWalletAddress(await currentConnector.getAccount());
    setOpenSigninDlg(false);
  };

  // ------------ EE Connect ------------
  if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') initConnectivitySDK();

  // essentials wallet connection
  const signInWithEssentials = async () => {
    initConnectivitySDK();
    const didAccess = new DID.DIDAccess();
    // let presentation;
    try {
      const presentation = await didAccess.requestCredentials({
        claims: [DID.simpleIdClaim('Your name', 'name', false), DID.simpleIdClaim('Your description', 'bio', false)]
      });
      if (presentation) {
        const did = presentation.getHolder().getMethodSpecificId() || '';

        const resolverUrl = 'https://api.trinity-tech.cn/eid';
        DIDBackend.initialize(new DefaultDIDAdapter(resolverUrl));
        // verify
        const vp = VerifiablePresentation.parse(JSON.stringify(presentation.toJSON()));
        // const valid = await vp.isValid();
        // if (!valid) {
        //   console.log('Invalid presentation');
        //   return;
        // }
        const sDid = vp.getHolder().toString();
        if (!sDid) {
          console.log('Unable to extract owner DID from the presentation');
          return;
        }
        // Optional name
        const nameCredential = vp.getCredential(`name`);
        const name = nameCredential ? nameCredential.getSubject().getProperty('name') : '';
        // Optional bio
        const bioCredential = vp.getCredential(`bio`);
        const bio = bioCredential ? bioCredential.getSubject().getProperty('bio') : '';
        // Optional email
        // const emailCredential = vp.getCredential(`email`);
        // const email = emailCredential ? emailCredential.getSubject().getProperty('email') : '';
        const user = {
          sDid,
          type: 'user',
          bio,
          name,
          // email,
          canManageAdmins: false
        };
        // succeed
        const token = jwt.sign(user, 'pasar', { expiresIn: 60 * 60 * 24 * 7 });
        sessionStorage.setItem('PASAR_TOKEN', token);
        sessionStorage.setItem('PASAR_DID', did);
        sessionLinkFlag = '2';
        sessionStorage.setItem('PASAR_LINK_ADDRESS', 2);
        setPasarLinkAddress(2)
        setOpenSigninDlg(false);
        if (isInAppBrowser()) {
          setWalletAddress(await window.elastos.getWeb3Provider().address);
          setActivatingConnector(essentialsConnector);
        } else {
          setWalletAddress(essentialsConnector.getWalletConnectProvider().wc.accounts[0]);
          setActivatingConnector(essentialsConnector);
        }
        setSigninEssentialSuccess(true);
        if (afterSigninPath) {
          setOpenSigninEssentialDlg(false);
          navigate(afterSigninPath);
          setAfterSigninPath(null);
        }
      } else {
        console.error('User closed modal');
      }
    } catch (e) {
      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      } catch (e) {
        console.error('Error while trying to disconnect wallet connect session', e);
      }
    }
  };

  const signOutWithEssentials = async () => {
    sessionStorage.removeItem('PASAR_LINK_ADDRESS');
    sessionStorage.removeItem('PASAR_TOKEN');
    sessionStorage.removeItem('PASAR_DID');
    try {
      setSigninEssentialSuccess(false);
      setActivatingConnector(null);
      setWalletAddress(null);
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
        await essentialsConnector.disconnectWalletConnect();
      if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
        await window.elastos.getWeb3Provider().disconnect();
    } catch (error) {
      console.error('Error while disconnecting the wallet', error);
    }
  };

  const handleClickOpenSinginDlg = async() => {
    if(isInAppBrowser()){
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
        await signOutWithEssentials();
        await signInWithEssentials();
      } else {
        await signInWithEssentials();
      }
    }
    else
      setOpenSigninDlg(true);
  };
  const handleClickOpenDownloadDlg = () => {
    setOpenSigninDlg(false);
    setOpenDownloadDlg(true);
  };
  const handleClickOpenDownloadEssentialDlg = () => {
    setOpenSigninEssentialDlg(false);
    setOpenDownloadEssentialDlg(true);
  };
  const handleGoBack = () => {
    setOpenSigninDlg(true);
    setOpenDownloadDlg(false);
  };
  const handleGoBackEssential = () => {
    setOpenSigninEssentialDlg(true);
    setOpenDownloadEssentialDlg(false);
  };
  const handleCloseSigninDlg = () => {
    setOpenSigninDlg(false);
  };
  const handleCloseSigninEssentialDlg = () => {
    setOpenSigninEssentialDlg(false);
  };
  const handleCloseDownloadEssentialDlg = () => {
    setOpenDownloadEssentialDlg(false);
  };
  const handleCloseDownloadDlg = () => {
    setOpenDownloadDlg(false);
  };

  const openAccountMenu = (event) => {
    if (isMobile && event.type === 'mouseenter') return;
    setOpenAccountPopup(event.currentTarget);
  };
  const closeAccountMenu = async (e) => {
    setOpenAccountPopup(null);
    if (e.target.getAttribute('value') === 'signout') {
      await activate(null);
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        try {
          if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
            await essentialsConnector.disconnectWalletConnect();
          if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
            await window.elastos.getWeb3Provider().disconnect();
        } catch (error) {
          console.error('Error while disconnecting the wallet', error);
        }
      }
      sessionStorage.removeItem('PASAR_LINK_ADDRESS');
      setSigninEssentialSuccess(false);
      sessionStorage.removeItem('PASAR_TOKEN');
      sessionStorage.removeItem('PASAR_DID');
      setActivatingConnector(null);
      setWalletAddress(null);
      navigate('/marketplace');
    }
  };

  return (
    <>
      {walletAddress ? (
        <>
          <MFab id="signin" size="small" onClick={openAccountMenu} onMouseEnter={openAccountMenu}>
            <AccountCircleOutlinedIcon />
          </MFab>
          <Menu
            keepMounted
            id="simple-menu"
            anchorEl={isOpenAccountPopup}
            onClose={closeAccountMenu}
            open={Boolean(isOpenAccountPopup)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            MenuListProps={{ onMouseLeave: () => setOpenAccountPopup(null) }}
          >
            <Box sx={{ px: 2, py: '6px' }}>
              <Typography variant="h6">
                {reduceHexAddress(walletAddress)} <CopyButton text={walletAddress} sx={{ mt: '-3px' }} />
              </Typography>
              {sessionStorage.getItem('PASAR_DID') ? (
                <Typography variant="body2" color="text.secondary">
                  did:elastos:{sessionStorage.getItem('PASAR_DID')}
                  <CopyButton text={`did:elastos:${sessionStorage.getItem('PASAR_DID')}`} />
                </Typography>
              ) : (
                <Link
                  underline="hover"
                  onClick={() => {
                    setOpenDownloadDlg(true);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  Get DID now!
                </Link>
              )}
              <Stack spacing={1}>
                <PaperRecord
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    minWidth: 300
                  }}
                >
                  <Typography variant="h6">Total Balance</Typography>
                  <Typography variant="h3" color="origin.main">
                    USD {math.round(math.round(coinUSD * balance, 2) + math.round(diaUSD * diaBalance, 2), 2)}
                  </Typography>
                  <Button
                    href="https://glidefinance.io/swap"
                    target="_blank"
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                    color="inherit"
                  >
                    Add funds
                  </Button>
                </PaperRecord>
                <PaperRecord sx={{ p: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      draggable={false}
                      component="img"
                      alt=""
                      src="/static/elastos.svg"
                      sx={{ width: 24, height: 24 }}
                    />
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2"> ELA </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        Elastos (ESC){' '}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" align="right">
                        {' '}
                        {balance}{' '}
                      </Typography>
                      <Typography variant="body2" align="right" color="text.secondary">
                        {' '}
                        USD {math.round(coinUSD * balance, 2)}{' '}
                      </Typography>
                    </Box>
                  </Stack>
                </PaperRecord>
                <PaperRecord sx={{ p: 1.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      draggable={false}
                      component="img"
                      alt=""
                      src="/static/badges/diamond.svg"
                      sx={{ width: 24, height: 24 }}
                    />
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2"> DIA </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        Diamond (ESC){' '}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" align="right">
                        {' '}
                        {diaBalance}{' '}
                      </Typography>
                      <Typography variant="body2" align="right" color="text.secondary">
                        {' '}
                        USD {math.round(diaUSD * diaBalance, 2)}{' '}
                      </Typography>
                    </Box>
                  </Stack>
                </PaperRecord>
              </Stack>
            </Box>
            <MenuItem to="/profile/myitem" onClick={closeAccountMenu} component={RouterLink}>
              <BookOutlinedIcon />
              &nbsp;My Items
            </MenuItem>
            {/* <MenuItem onClick={closeAccountMenu}>
              <SettingsOutlinedIcon />
              &nbsp;Settings
            </MenuItem> */}
            <MenuItem value="signout" onClick={closeAccountMenu} id="signout">
              <LogoutOutlinedIcon />
              &nbsp;Sign Out
            </MenuItem>
          </Menu>
        </>
      ) : (
        <div style={{ minWidth: 79 }}>
          <Button id="signin" variant="contained" onClick={handleClickOpenSinginDlg}>
            Sign In
          </Button>

          <Dialog open={openSignin} onClose={handleCloseSigninDlg}>
            <DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleCloseSigninDlg}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
                Sign in with your DID
              </Typography>
              <Box component="div" sx={{ maxWidth: 350, m: 'auto' }}>
                <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
                  Sign in with one of the available providers or create a new one.
                  <Link href="https://www.elastos.org/did" underline="hover" color="red" target="_blank">
                    What is a DID?
                  </Link>
                </Typography>
                <Grid container spacing={2} sx={{ my: 4 }}>
                  <Grid item xs={12} sx={{ pt: '0 !important' }}>
                    <Typography variant="body2" display="block" gutterBottom align="center">
                      Web3.0 super wallet with Decentralized Identifier (DID)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: '8px !important' }}>
                    <ButtonStyle
                      variant="contained"
                      startIcon={
                        <Avatar
                          alt="Elastos"
                          src="/static/elastos.svg"
                          sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                        />
                      }
                      endIcon={
                        <Typography variant="p" sx={{ fontSize: '0.875rem !important' }}>
                          <span role="img" aria-label="">
                            🔥
                          </span>
                          Popular
                        </Typography>
                      }
                      className={classes.iconAbsolute1}
                      fullWidth
                      onClick={async () => {
                        // check if is already connected
                        // await signInWithEssentials();
                        if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                          await signOutWithEssentials();
                          await signInWithEssentials();
                        } else {
                          await signInWithEssentials();
                        }
                      }}
                      sx={!isLight && { backgroundColor: 'white' }}
                    >
                      Elastos Essentials
                    </ButtonStyle>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: '8px !important' }}>
                    <Typography variant="body2" display="block" gutterBottom align="center">
                      Just basic wallet and no DID
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: '8px !important' }}>
                    <ButtonStyle
                      variant="contained"
                      startIcon={
                        <Avatar
                          alt="metamask"
                          src="/static/metamask.svg"
                          sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                        />
                      }
                      className={classes.iconAbsolute2}
                      fullWidth
                      onClick={() => {
                        handleChooseWallet('metamask');
                      }}
                    >
                      MetaMask
                    </ButtonStyle>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <ButtonStyle
                      variant="contained"
                      startIcon={
                        <Avatar
                          alt="walletconnect"
                          src="/static/walletconnect.svg"
                          sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                        />
                      }
                      className={classes.iconAbsolute2}
                      fullWidth
                      onClick={() => {
                        handleChooseWallet('walletconnect');
                      }}
                    >
                      WalletConnect
                    </ButtonStyle>
                  </Grid> */}
                  <Grid item xs={12}>
                    <ButtonOutlinedStyle variant="outlined" fullWidth onClick={handleClickOpenDownloadDlg}>
                      I don’t have a wallet
                    </ButtonOutlinedStyle>
                  </Grid>
                </Grid>
              </Box>
              <Typography
                variant="caption"
                display="block"
                sx={{ color: 'text.secondary' }}
                gutterBottom
                align="center"
              >
                We do not own your private keys and cannot access your funds without your confirmation.
              </Typography>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <Dialog open={openDownload} onClose={handleCloseDownloadDlg}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDownloadDlg}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
            Download Essentials
          </Typography>
          <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
            Get Elastos Essentials now to kickstart your journey!
            <br />
            It is your gateway to Web3.0!
          </Typography>
          <Typography variant="body2" display="block" gutterBottom align="center" sx={{ mt: 4 }}>
            Web3.0 super wallet with Decentralized Identifier (DID)
          </Typography>
          <Box component="div" sx={{ maxWidth: 300, m: 'auto' }}>
            <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
              <Grid item xs={12} sx={{ pt: '8px !important' }}>
                <ButtonStyle
                  variant="contained"
                  href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app"
                  target="_blank"
                  startIcon={<AdbIcon />}
                  className={classes.iconAbsolute2}
                  fullWidth
                >
                  Google Play
                </ButtonStyle>
              </Grid>
              <Grid item xs={12}>
                <ButtonOutlinedStyle
                  variant="outlined"
                  href="https://apps.apple.com/us/app/elastos-essentials/id1568931743"
                  target="_blank"
                  startIcon={<AppleIcon />}
                  className={classes.iconAbsolute2}
                  fullWidth
                >
                  App Store
                </ButtonOutlinedStyle>
              </Grid>
              <Grid item xs={12} align="center">
                <Button color="inherit" startIcon={<Icon icon={arrowIosBackFill} />} onClick={handleGoBack}>
                  Go back
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={openSigninEssential} onClose={handleCloseSigninEssentialDlg}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseSigninEssentialDlg}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
            Sign in with your DID
          </Typography>
          <Box component="div" sx={{ maxWidth: 350, m: 'auto' }}>
            <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
              Sign in with one of the available providers or create a new one.
              <Link href="https://www.elastos.org/did" underline="hover" color="red" target="_blank">
                What is a DID?
              </Link>
            </Typography>
            <Grid container spacing={2} sx={{ my: 4 }}>
              <Grid item xs={12} sx={{ pt: '0 !important' }}>
                <Typography variant="body2" display="block" gutterBottom align="center">
                  Web3.0 super wallet with Decentralized Identifier (DID)
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ pt: '8px !important' }}>
                <ButtonStyle
                  variant="contained"
                  startIcon={
                    <Avatar
                      alt="Elastos"
                      src="/static/elastos.svg"
                      sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                    />
                  }
                  endIcon={
                    <Typography variant="p" sx={{ fontSize: '0.875rem !important' }}>
                      <span role="img" aria-label="">
                        🔥
                      </span>
                      Popular
                    </Typography>
                  }
                  className={classes.iconAbsolute1}
                  fullWidth
                  onClick={async () => {
                    // check if is already connected
                    // await signInWithEssentials();
                    if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                      await signOutWithEssentials();
                      await signInWithEssentials();
                    } else {
                      await signInWithEssentials();
                    }
                  }}
                  sx={!isLight && { backgroundColor: 'white' }}
                >
                  Elastos Essentials
                </ButtonStyle>
              </Grid>
              <Grid item xs={12}>
                <ButtonOutlinedStyle variant="outlined" fullWidth onClick={handleClickOpenDownloadEssentialDlg}>
                  I don’t have a wallet
                </ButtonOutlinedStyle>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={openDownloadEssential} onClose={handleCloseDownloadEssentialDlg}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDownloadEssentialDlg}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
            Download Essentials
          </Typography>
          <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
            A DID is required in order to create or sell items on Pasar. Get your own DID by downloading the Elastos
            Essentials mobile app now!
          </Typography>
          <Typography variant="body2" display="block" gutterBottom align="center" sx={{ mt: 4 }}>
            Web3.0 super wallet with Decentralized Identifier (DID)
          </Typography>
          <Box component="div" sx={{ maxWidth: 300, m: 'auto' }}>
            <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
              <Grid item xs={12} sx={{ pt: '8px !important' }}>
                <ButtonStyle
                  variant="contained"
                  href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app"
                  target="_blank"
                  startIcon={<AdbIcon />}
                  className={classes.iconAbsolute2}
                  fullWidth
                >
                  Google Play
                </ButtonStyle>
              </Grid>
              <Grid item xs={12}>
                <ButtonOutlinedStyle
                  variant="outlined"
                  href="https://apps.apple.com/us/app/elastos-essentials/id1568931743"
                  target="_blank"
                  startIcon={<AppleIcon />}
                  className={classes.iconAbsolute2}
                  fullWidth
                >
                  App Store
                </ButtonOutlinedStyle>
              </Grid>
              <Grid item xs={12} align="center">
                <Button color="inherit" startIcon={<Icon icon={arrowIosBackFill} />} onClick={handleGoBackEssential}>
                  Go back
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Typography>
        </DialogContent>
      </Dialog>
      <SnackbarCustom isOpen={isOpenSnackbar} setOpen={setSnackbarOpen}>
        Wrong network, only Elastos Smart Chain is supported
      </SnackbarCustom>
    </>
  );
}
