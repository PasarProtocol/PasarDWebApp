import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, Box, Link, Menu, MenuItem } from '@mui/material';
import * as math from 'mathjs';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { essentialsConnector, initConnectivitySDK } from './EssentialConnectivity';
import { MFab } from '../@material-extend';
import { injected, walletconnect, resetWalletConnector } from './connectors';
import CopyButton from '../CopyButton';
import SnackbarCustom from '../SnackbarCustom';
import PaperRecord from '../PaperRecord';
import RingAvatar from '../RingAvatar';
import {
  reduceHexAddress,
  getBalance,
  getCoinUSD,
  getDiaTokenInfo,
  getElaOnEthTokenInfo,
  getTokenPriceInEthereum,
  isInAppBrowser,
  checkValidChain,
  getChainTypeFromId,
  fetchAPIFrom,
  getERC20TokenPrice
} from '../../utils/common';
import {
  getDIDDocumentFromDID,
  getCredentialsFromDIDDoc,
  getHiveAvatarUrlFromDIDAvatarCredential,
  fetchHiveScriptPictureToDataUrl
} from './LoadCredentials';
import { useUserContext } from '../../contexts/UserContext';
import useConnectEE from '../../hooks/useConnectEE';
// import { creatAndRegister, prepareConnectToHive, downloadAvatar } from './HiveAPI';
import { downloadAvatar } from './HiveAPI';
import { firebaseConfig, mainDiaContract as DIA_CONTRACT_MAIN_ADDRESS } from '../../config';
import SignInDlg from './dlg/SignInDlg';
import DownloadEEDlg from './dlg/DownloadEEDlg';

// Initialize Firebase
if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}

export default function SignInButton() {
  const {
    user,
    openSignInDlg,
    openDownloadEEDlg,
    navigationPath,
    wallet,
    setUser,
    setOpenTopAlert,
    setOpenSignInDlg,
    setOpenDownloadEEDlg,
    setNavigationPath,
    setWallet,
    setOpenCredentials
  } = useUserContext();

  const { activate, active, library, chainId, account } = useWeb3React();
  const { isConnectedEE, signInWithEssentials, signOutWithEssentials } = useConnectEE();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState(null);
  const [openAccountPopup, setOpenAccountPopup] = useState(null);
  const [balance, setBalance] = useState(0);
  const [elaOnEthBalance, setElaOnEthBalance] = useState(0);
  const [coinUSD, setCoinUSD] = React.useState(0);
  const [diaUSD, setDiaUSD] = React.useState(0);
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [tokenPricesInETH, setTokenPricesInETH] = React.useState([0, 0]);
  const [chainType, setChainType] = React.useState('ESC');
  const navigate = useNavigate();

  const [walletConnectProvider] = useState(essentialsConnector.getWalletConnectProvider());
  initConnectivitySDK();

  // ------------ Track EE Connection ------------ //
  React.useEffect(() => {
    const handleEEAccountsChanged = async (accounts) => {
      console.log('EE Account Changed: ', accounts);
      if (user?.link && accounts.length) handleAccountChanged(accounts[0], walletConnectProvider);
    };
    const handleEEChainChanged = (chainId) => {
      console.log('EE ChainId Changed', chainId);
      if (user?.link && chainId) handleChainIdChanged(chainId);
    };
    const handleEEDisconnect = (code, reason) => {
      console.log('EE Disconnect code: ', code, ', reason: ', reason);
      signOutWithEssentials(true);
    };
    const handleEEError = (code, reason) => {
      console.error('EE Error code: ', code, ', reason: ', reason);
    };
    if (isInAppBrowser()) {
      const inAppProvider = window.elastos.getWeb3Provider();
      const inAppWeb3 = new Web3(inAppProvider);
      inAppWeb3.eth.getChainId().then((chainId) => {
        if (chainId) handleChainIdChanged(chainId);
      });
      if (inAppProvider?.address) handleAccountChanged(inAppProvider.address, inAppProvider);
    } else {
      walletConnectProvider.on('accountsChanged', handleEEAccountsChanged);
      walletConnectProvider.on('chainChanged', handleEEChainChanged);
      walletConnectProvider.on('disconnect', handleEEDisconnect);
      walletConnectProvider.on('error', handleEEError);
    }
    return () => {
      if (walletConnectProvider.removeListener) {
        walletConnectProvider.removeListener('accountsChanged', handleEEAccountsChanged);
        walletConnectProvider.removeListener('chainChanged', handleEEChainChanged);
        walletConnectProvider.removeListener('disconnect', handleEEDisconnect);
        walletConnectProvider.removeListener('error', handleEEError);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnectProvider]);

  // ------------ Track MM, WC Connection ------------ //
  // reactivate connector after page refresh
  React.useEffect(() => {
    const initializeWalletConnection = async () => {
      let connector = null;
      if (user.link === '1') {
        connector = injected;
      } else if (user.link === '3') {
        connector = walletconnect;
      }
      setActivatingConnector(connector);
      await activate(connector);
      const walletAddress = await connector.getAccount();
      setWallet((prev) => {
        const current = { ...prev };
        current.address = walletAddress;
        return current;
      });
    };
    if ((user?.link === '1' || user?.link === '3') && !activatingConnector) initializeWalletConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatingConnector, user.link]);

  // handle account / chainId changed
  React.useEffect(() => {
    if (user?.link === '1' || user?.link === '3') {
      if (chainId) {
        console.log('Wallet ChainId Changed', chainId);
        handleChainIdChanged(chainId);
      }
      if (account) {
        console.log('Wallet Account Changed: ', account);
        handleAccountChanged(account, library.provider);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.link, chainId, account]);

  // handle disconnect from wallet
  React.useEffect(() => {
    const fetchData = async () => {
      if (user?.link === '1' && activatingConnector === injected && !active) disconnect();
      // else if (user?.link === '2' && activatingConnector === essentialsConnector) {
      //   if (isInAppBrowser()) {
      //     if (!(await window.elastos.getWeb3Provider().isConnected())) disconnect();
      //   } else if (!essentialsConnector.hasWalletConnectSession()) disconnect();
      // }
      else if (
        user?.link === '3' &&
        activatingConnector === walletconnect &&
        !walletconnect.walletConnectProvider.connected
      )
        disconnect();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // ------------ Common ------------ //
  React.useEffect(() => {
    const fetchCoinPrice = async () => {
      const ela2usd = await getCoinUSD();
      const token2eth = await getTokenPriceInEthereum();
      const dia2usd = await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS);
      setCoinUSD(ela2usd);
      setTokenPricesInETH(token2eth);
      setDiaUSD(dia2usd);
    };
    if (user?.link) fetchCoinPrice();
  }, [user?.link]);

  React.useEffect(() => {
    const fetchV1NFT = async (walletAddress) => {
      const res = await fetchAPIFrom(`api/v1/getV1MarketNFTByWalletAddr?walletAddr=${walletAddress}`, {});
      const json = await res.json();
      setOpenTopAlert((json?.data || []).length > 0);
    };
    if (wallet?.address) fetchV1NFT(wallet.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  React.useEffect(() => {
    const getUserInfo = async (did) => {
      let avatar = null;
      try {
        const didDoc = await getDIDDocumentFromDID(did);
        const credentials = getCredentialsFromDIDDoc(didDoc);
        if (did && credentials && credentials?.avatar) {
          const hiveAvatarUrl = getHiveAvatarUrlFromDIDAvatarCredential(credentials.avatar);
          avatar = await fetchHiveScriptPictureToDataUrl(hiveAvatarUrl, did);
        }
        setUser((prev) => {
          const current = { ...prev };
          current.credentials = credentials;
          current.didDoc = didDoc;
          current.avatar = avatar;
          return current;
        });
      } catch (e) {
        console.error(e);
      }
      try {
        const avatarInfo = await downloadAvatar(did);
        if (avatarInfo && avatarInfo.length) {
          const base64Content = avatarInfo.reduce((content, code) => {
            content = `${content}${String.fromCharCode(code)}`;
            return content;
          }, '');
          const avatarImg = `data:image/png;base64,${base64Content}`;
          setAvatarUrl((prevState) => {
            if (!prevState) return avatarImg || avatar;
            return prevState;
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (user?.did) getUserInfo(`did:elastos:${user.did}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.did]);

  // ----------------------------------------- //
  const handleAccountChanged = async (walletAddress, walletProvider) => {
    setWallet((prev) => {
      const current = { ...prev };
      current.address = walletAddress;
      return current;
    });
    try {
      const dia = await getDiaTokenInfo(walletAddress, walletProvider);
      setWallet((prev) => {
        const current = { ...prev };
        current.diaBalance = dia;
        return current;
      });
    } catch (e) {
      console.error(e);
      setWallet((prev) => {
        const current = { ...prev };
        current.diaBalance = 0;
        return current;
      });
    }
    try {
      const elaOnEth = await getElaOnEthTokenInfo(walletAddress, walletProvider);
      setElaOnEthBalance(elaOnEth);
    } catch (e) {
      console.error(e);
      setElaOnEthBalance(0);
    }
    try {
      const balance = await getBalance(walletProvider);
      setBalance(math.round(balance / 1e18, 4));
    } catch (e) {
      console.error(e);
      setBalance(0);
    }
  };

  const handleChainIdChanged = (chainId) => {
    setWallet((prev) => {
      const current = { ...prev };
      current.chainId = chainId;
      return current;
    });
    setChainType(getChainTypeFromId(chainId));
    if (!checkValidChain(chainId)) setOpenSnackbar(true);
  };
  // ====================== ====================== ====================== //
  // ------------ MM, WC Connection ------------ //
  const connectToWallet = async (wallet) => {
    let currentConnector = null;
    if (wallet === 'MM') {
      currentConnector = injected;
    } else if (wallet === 'WC') {
      currentConnector = walletconnect;
      resetWalletConnector(currentConnector);
    }
    await activate(currentConnector);
    const retAddress = await currentConnector.getAccount();
    if (retAddress) {
      console.log('loged in');
      let linkType;
      if (currentConnector === injected) linkType = '1';
      else if (currentConnector === walletconnect) linkType = '3';
      sessionStorage.setItem('PASAR_LINK_ADDRESS', linkType);
      sessionStorage.setItem('PASAR_DID', null);
      sessionStorage.setItem('PASAR_ADDRESS', retAddress);
      sessionStorage.setItem('PASAR_TOKEN', null);
      setActivatingConnector(currentConnector);
      setUser((prev) => {
        const current = { ...prev };
        current.link = linkType;
        return current;
      });
      setWallet((prev) => {
        const current = { ...prev };
        current.address = retAddress;
        return current;
      });
      setOpenSignInDlg(false);
    }
  };

  const disconnectWallet = async () => {
    sessionStorage.removeItem('PASAR_LINK_ADDRESS');
    sessionStorage.removeItem('PASAR_DID');
    sessionStorage.removeItem('PASAR_ADDRESS');
    sessionStorage.removeItem('PASAR_TOKEN');
    sessionStorage.removeItem('KYCedProof');
    sessionStorage.removeItem('REWARD_USER');
    try {
      await activatingConnector.deactivate();
      await activate(null);
      setActivatingConnector(null);
      setWallet((prev) => {
        const current = { ...prev };
        current.address = '';
        return current;
      });
    } catch (e) {
      console.error(e);
    }
  };

  // ------------ EE Connection ------------ //
  const connectToEE = async () => {
    try {
      if (isConnectedEE) await signOutWithEssentials(false);
      const objUser = await signInWithEssentials();
      if (objUser) {
        setUser((prev) => {
          const current = { ...prev };
          current.link = objUser?.link;
          return current;
        });
        setWallet((prev) => {
          const current = { ...prev };
          current.address = objUser?.address;
          return current;
        });
        setActivatingConnector(essentialsConnector);
        setOpenSignInDlg(false);
        if (navigationPath) {
          setOpenSignInDlg(false);
          navigate(navigationPath);
          setNavigationPath(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const disconnect = async () => {
    setOpenAccountPopup(null);
    if (user?.link === '1' || user?.link === '3') await disconnectWallet();
    else if (user?.link === '2') await signOutWithEssentials(true);
    await activate(null);
    setActivatingConnector(null);
    setWallet((prev) => {
      const current = { ...prev };
      current.address = '';
      return current;
    });
    navigate('/marketplace');
    window.location.reload();
  };

  // ====================== Dlgs ====================== //
  const handleClickSignInButton = async () => {
    if (isInAppBrowser()) await connectToEE();
    else setOpenSignInDlg(true);
  };

  // ---------- SignInDlg ------------ //
  const handleClickSignInDlg = async (type) => {
    if (type === 'EE') {
      await connectToEE();
    } else if (type === 'MM') {
      await connectToWallet('MM');
    } else if (type === 'download') {
      setOpenDownloadEEDlg(true);
    } else if (type === 'close') {
      setOpenSignInDlg(false);
    }
  };

  // ---------- DownloadEEDlg ------------ //
  const handleClickDownloadEEDlg = (type) => {
    if (type === 'goback') {
      setOpenSignInDlg(true);
      setOpenDownloadEEDlg(false);
    } else if (type === 'close') {
      setOpenDownloadEEDlg(false);
    }
  };

  const handleOpenAccountMenu = (event) => {
    if (isMobile && event.type === 'mouseenter') return;
    setOpenAccountPopup(event.currentTarget);
  };

  const handleCloseAccountMenu = async (e) => {
    if (e.target.getAttribute('value') === 'credentials') {
      setOpenAccountPopup(null);
      setOpenCredentials(true);
    } else if (e.target.getAttribute('value') === 'signout') disconnect();
  };

  let totalBalance = 0;
  if (chainType === 'ESC')
    totalBalance = math.round(math.round(coinUSD * balance, 2) + math.round(diaUSD * (wallet?.diaBalance ?? 0), 2), 2);
  else if (chainType === 'ETH')
    totalBalance = math.round(
      math.round(tokenPricesInETH[0] * balance, 2) + math.round(tokenPricesInETH[1] * elaOnEthBalance, 2),
      2
    );
  else if (chainType === 'FSN') totalBalance = math.round(tokenPricesInETH[2] * balance, 2);

  const balanceListByNetwork = {
    ESC: [
      { icon: 'elastos.svg', symbol: 'ELA', name: 'Elastos (ESC)', balance, balanceUSD: coinUSD * balance },
      {
        icon: 'badges/diamond.svg',
        symbol: 'DIA',
        name: 'Diamond (ESC)',
        balance: wallet?.diaBalance ?? 0,
        balanceUSD: diaUSD * (wallet?.diaBalance ?? 0)
      }
    ],
    ETH: [
      {
        icon: 'erc20/ETH.svg',
        symbol: 'ETH',
        name: 'Ether (Ethereum)',
        balance,
        balanceUSD: tokenPricesInETH[0] * balance
      },
      {
        icon: 'erc20/ELAonETH.svg',
        symbol: 'ELA on ETH',
        name: 'Elastos (Ethereum)',
        balance: elaOnEthBalance,
        balanceUSD: tokenPricesInETH[1] * elaOnEthBalance
      }
    ],
    FSN: [
      { icon: 'erc20/FSN.svg', symbol: 'FSN', name: 'Fusion (FSN)', balance, balanceUSD: tokenPricesInETH[2] * balance }
    ]
  };

  return (
    <>
      {wallet?.address ? (
        <>
          <MFab id="signin" size="small" onClick={handleOpenAccountMenu} onMouseEnter={handleOpenAccountMenu}>
            <RingAvatar
              avatar={avatarUrl}
              isImage={!!avatarUrl}
              address={wallet?.address || ''}
              size={30}
              outersx={{
                p: '3px',
                border: '2px solid transparent',
                width: 40,
                height: 40
              }}
            />
          </MFab>
          <Menu
            keepMounted
            id="simple-menu"
            anchorEl={openAccountPopup}
            onClose={handleCloseAccountMenu}
            open={Boolean(openAccountPopup)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            MenuListProps={{ onMouseLeave: () => setOpenAccountPopup(null) }}
          >
            <Box sx={{ px: 2, py: '6px' }}>
              <Typography variant="h6">
                {reduceHexAddress(wallet?.address || '')}{' '}
                <CopyButton text={wallet?.address || ''} sx={{ mt: '-3px' }} />
              </Typography>
              {user?.did ? (
                <Typography variant="body2" color="text.secondary">
                  did:elastos:{user.did}
                  <CopyButton text={`did:elastos:${user.did}`} />
                </Typography>
              ) : (
                <Link underline="hover" onClick={() => setOpenDownloadEEDlg(true)} sx={{ cursor: 'pointer' }}>
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
                    USD {totalBalance}
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
                {!!chainType &&
                  balanceListByNetwork[chainType].map((item, _i) => (
                    <PaperRecord sx={{ p: 1.5 }} key={_i}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          draggable={false}
                          component="img"
                          alt=""
                          src={`/static/${item.icon}`}
                          sx={{
                            width: 24,
                            height: 24,
                            filter:
                              item.symbol === 'ELA'
                                ? (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none')
                                : 'unset'
                          }}
                        />
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography variant="body2"> {item.symbol} </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {' '}
                            {item.name}{' '}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" align="right">
                            {' '}
                            {item.balance}{' '}
                          </Typography>
                          <Typography variant="body2" align="right" color="text.secondary">
                            {' '}
                            USD {math.round(item.balanceUSD, 2)}{' '}
                          </Typography>
                        </Box>
                      </Stack>
                    </PaperRecord>
                  ))}
              </Stack>
            </Box>
            <MenuItem to="/profile" onClick={handleCloseAccountMenu} component={RouterLink}>
              <AccountCircleOutlinedIcon />
              &nbsp;Profile
            </MenuItem>
            <MenuItem value="signout" onClick={handleCloseAccountMenu} id="signout">
              <LogoutOutlinedIcon />
              &nbsp;Sign Out
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button id="signin" variant="contained" onClick={handleClickSignInButton} sx={{ minWidth: 79 }}>
          Sign In
        </Button>
      )}
      <SignInDlg open={openSignInDlg} noDID={user.link === '1' || user.link === '3'} onClick={handleClickSignInDlg} />
      <DownloadEEDlg
        open={openDownloadEEDlg}
        noDID={user.link === '1' || user.link === '3'}
        onClick={handleClickDownloadEEDlg}
      />
      <SnackbarCustom isOpen={openSnackbar} setOpen={setOpenSnackbar}>
        Wrong network, only Elastos Smart Chain, Ethereum and Fusion is supported
      </SnackbarCustom>
    </>
  );
}
