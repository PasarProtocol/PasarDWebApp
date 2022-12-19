import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  Stack,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Avatar,
  Box,
  Link,
  Menu,
  MenuItem
} from '@mui/material';
import * as math from 'mathjs';
import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useWeb3React } from '@web3-react/core';
import { isUndefined } from 'lodash';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { VerifiablePresentation, DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import jwt from 'jsonwebtoken';
import { essentialsConnector, initConnectivitySDK, isUsingEssentialsConnector } from './EssentialConnectivity';
import { MFab } from '../@material-extend';
import { injected, walletconnect, resetWalletConnector } from './connectors';
import StyledButton from './StyledButton';
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
  fetchAPIFrom, getERC20TokenPrice
} from '../../utils/common';
import useSignIn from '../../hooks/useSignin';
import { creatAndRegister, prepareConnectToHive, downloadAvatar } from './HiveAPI';
import {DidResolverUrl, firebaseConfig, mainDiaContract as DIA_CONTRACT_MAIN_ADDRESS} from '../../config';

// Initialize Firebase
if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}

export default function SignInDialog() {
  const {
    openSigninEssential,
    openDownloadEssential,
    afterSigninPath,
    diaBalance,
    pasarLinkChain,
    setOpenTopAlert,
    setOpenSigninEssentialDlg,
    setOpenDownloadEssentialDlg,
    setOpenCredentials,
    setAfterSigninPath,
    setSigninEssentialSuccess,
    setPasarLinkAddress,
    setDiaBalance,
    setPasarLinkChain
  } = useSignIn();

  let sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
  const context = useWeb3React();
  const { activate, active, library, chainId, account } = context;
  const [isOpenSnackbar, setSnackbarOpen] = useState(false);
  const [openSignin, setOpenSigninDlg] = useState(false);
  const [openDownload, setOpenDownloadDlg] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState(null);
  const [isOpenAccountPopup, setOpenAccountPopup] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [elaOnEthBalance, setElaOnEthBalance] = useState(0);
  const [coinUSD, setCoinUSD] = React.useState(0);
  const [diaUSD, setDiaUSD] = React.useState(0);
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [tokenPricesInETH, setTokenPricesInETH] = React.useState([0, 0]);

  const [chainType, setChainType] = React.useState('ESC');
  const walletConnectProvider = essentialsConnector.getWalletConnectProvider();
  const navigate = useNavigate();

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
        // const mydid = sessionStorage.getItem('PASAR_DID');
        // getAvatarUrl(mydid);
        setActivatingConnector(essentialsConnector);
      } else if (sessionLinkFlag === '3') {
        setActivatingConnector(walletconnect);
        await activate(walletconnect);
        setWalletAddress(await walletconnect.getAccount());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLinkFlag, activatingConnector, account, chainId]);

  const getAvatarUrl = (did) => {
    const targetDid = `did:elastos:${did}`;
    downloadAvatar(targetDid).then((res) => {
      if (res && res.length) {
        const base64Content = res.reduce((content, code) => {
          content = `${content}${String.fromCharCode(code)}`;
          return content;
        }, '');
        setAvatarUrl((prevState) => {
          if (!prevState) return `data:image/png;base64,${base64Content}`;
          return prevState;
        });
      }
    });
  };

  React.useEffect(() => {
    const currentChainType = getChainTypeFromId(pasarLinkChain);
    if (pasarLinkChain) setChainType(currentChainType);
  }, [pasarLinkChain]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAPIFrom(`api/v1/getV1MarketNFTByWalletAddr?walletAddr=${walletAddress}`, {});
      const json = await res.json();
      setOpenTopAlert((json?.data || []).length > 0);
    };
    if (walletAddress) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  React.useEffect(() => {
    // EE
    const handleEEAccountsChanged = (accounts) => {
      if (accounts.length && walletAddress) {
        setWalletAddress(accounts[0]);
        getDiaTokenInfo(accounts[0], walletConnectProvider)
          .then((dia) => {
            setDiaBalance(dia);
          })
          .catch((e) => {
            console.error(e);
            setDiaBalance(0);
          });
        getElaOnEthTokenInfo(accounts[0], walletConnectProvider)
          .then((ela) => {
            setElaOnEthBalance(ela);
          })
          .catch((e) => {
            console.error(e);
            setElaOnEthBalance(0);
          });
        getBalance(walletConnectProvider).then((res) => {
          setBalance(math.round(res / 1e18, 4));
        });
      }
    };
    const handleEEChainChanged = (chainId) => {
      setPasarLinkChain(chainId);
      if (!checkValidChain(chainId)) setSnackbarOpen(true);
    };
    const handleEEDisconnect = (code, reason) => {
      console.log('Disconnect code: ', code, ', reason: ', reason);
      signOutWithEssentials();
    };
    const handleEEError = (code, reason) => {
      console.error(code, reason);
    };

    // Subscribe to accounts change
    walletConnectProvider.on('accountsChanged', handleEEAccountsChanged);
    // Subscribe to chainId change
    walletConnectProvider.on('chainChanged', handleEEChainChanged);
    // Subscribe to session disconnection
    walletConnectProvider.on('disconnect', handleEEDisconnect);
    // Subscribe to session disconnection
    walletConnectProvider.on('error', handleEEError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      initializeWalletConnection();
      getCoinUSD().then((res) => {
        setCoinUSD(res);
      });
      getTokenPriceInEthereum().then((res) => {
        setTokenPricesInETH(res);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
      if (sessionLinkFlag) {
        // when connected
        if ((sessionLinkFlag === '1' || sessionLinkFlag === '3') && library) {
          setDiaUSD(await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS))
        } else if (sessionLinkFlag === '2') {
          if (isInAppBrowser()) {
            setDiaUSD(await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS))
          } else if (essentialsConnector.getWalletConnectProvider()) {
            setDiaUSD(await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS))
          }
        }
      }
    };
    fetchData();
  }, [sessionLinkFlag]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (chainId) {
        setPasarLinkChain(chainId);
        if (!checkValidChain(chainId)) setSnackbarOpen(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
      if (sessionLinkFlag) {
        // when connected
        if ((sessionLinkFlag === '1' || sessionLinkFlag === '3') && library) {
          getDiaTokenInfo(account, library.provider)
            .then((dia) => {
              setDiaBalance(dia);
            })
            .catch((e) => {
              console.error(e);
              setDiaBalance(0);
            });
          getElaOnEthTokenInfo(account, library.provider)
            .then((ela) => {
              setElaOnEthBalance(ela);
            })
            .catch((e) => {
              console.error(e);
              setElaOnEthBalance(0);
            });
          getBalance(library.provider).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          });
        } else if (sessionLinkFlag === '2') {
          if (isInAppBrowser()) {
            const elastosWeb3Provider = await window.elastos.getWeb3Provider();
            getDiaTokenInfo(elastosWeb3Provider.address, elastosWeb3Provider)
              .then((dia) => {
                setDiaBalance(dia);
              })
              .catch((e) => {
                console.error(e);
                setDiaBalance(0);
              });
            getElaOnEthTokenInfo(elastosWeb3Provider.address, elastosWeb3Provider)
              .then((ela) => {
                setElaOnEthBalance(ela);
              })
              .catch((e) => {
                console.error(e);
                setElaOnEthBalance(0);
              });
            getBalance(elastosWeb3Provider).then((res) => {
              setBalance(math.round(res / 1e18, 4));
            });
          } else if (essentialsConnector.getWalletConnectProvider()) {
            const essentialProvider = essentialsConnector.getWalletConnectProvider();
            if(essentialProvider.chainId === 20 || essentialProvider.chainId === 21) {
              getDiaTokenInfo(essentialProvider.wc.accounts[0], essentialProvider)
                  .then((dia) => {
                    setDiaBalance(dia);
                  })
                  .catch((e) => {
                    console.error(e);
                    setDiaBalance(0);
                  });
            }
            if(essentialProvider.chainId === 1 || essentialProvider.chainId === 5) {
              getElaOnEthTokenInfo(essentialProvider.wc.accounts[0], essentialProvider)
                  .then((ela) => {
                    setElaOnEthBalance(ela);
                  })
                  .catch((e) => {
                    console.error(e);
                    setElaOnEthBalance(0);
                  });
            }
            getBalance(essentialProvider).then((res) => {
              setBalance(math.round(res / 1e18, 4));
            });
          }
        }
      }
    };
    fetchData();
  }, [sessionLinkFlag, account, active, chainId, activatingConnector, chainType]);

  // listen for disconnect from essentials / wallet connect
  React.useEffect(() => {
    const fetchData = async () => {
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
        setPasarLinkChain(1);
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
              .then((res) => {
                console.log(res);
              })
              .catch((e) => {
                console.log(e);
              });
            sessionStorage.removeItem('PASAR_LINK_ADDRESS');
            sessionStorage.removeItem('PASAR_TOKEN');
            sessionStorage.removeItem('PASAR_DID');
            sessionStorage.removeItem('KYCedProof');
            setPasarLinkChain(1);
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
            .then((res) => {
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
          sessionStorage.removeItem('PASAR_LINK_ADDRESS');
          sessionStorage.removeItem('PASAR_TOKEN');
          sessionStorage.removeItem('PASAR_DID');
          setPasarLinkChain(1);
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
          setPasarLinkChain(1);
          setActivatingConnector(null);
          setWalletAddress(null);
          navigate('/marketplace');
          window.location.reload();
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [essentialsConnector.hasWalletConnectSession(), active]);

  // ------------ MM, WC Connect ------------ //
  const handleChooseWallet = async (wallet) => {
    let currentConnector = null;
    if (wallet === 'metamask') {
      currentConnector = injected;
      await activate(currentConnector);
    } else if (wallet === 'walletconnect') {
      currentConnector = walletconnect;
      await resetWalletConnector(currentConnector);
      await activate(currentConnector);
    }
    const retAddress = await currentConnector.getAccount();
    if (!isUndefined(retAddress)) {
      console.log('loged in');
      if (currentConnector === injected) {
        sessionLinkFlag = '1';
        sessionStorage.setItem('PASAR_LINK_ADDRESS', sessionLinkFlag);
        setPasarLinkAddress(sessionLinkFlag);
      } else if (currentConnector === walletconnect) {
        sessionLinkFlag = '3';
        sessionStorage.setItem('PASAR_LINK_ADDRESS', sessionLinkFlag);
        setPasarLinkAddress(sessionLinkFlag);
      }
      setActivatingConnector(currentConnector);
      setWalletAddress(await currentConnector.getAccount());
      setOpenSigninDlg(false);
    }
  };
  // ----------------------------------------- //

  // ------------ EE Connect ------------ //
  if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') initConnectivitySDK();

  const signInWithEssentials = async () => {
    initConnectivitySDK();
    const didAccess = new DID.DIDAccess();
    try {
      const presentation = await didAccess.requestCredentials({
        claims: [
          DID.simpleIdClaim('Your avatar', 'avatar', false),
          DID.simpleIdClaim('Your name', 'name', false),
          DID.simpleIdClaim('Your description', 'description', false)
        ]
      });
      if (presentation) {
        const did = presentation.getHolder().getMethodSpecificId() || '';
        DIDBackend.initialize(new DefaultDIDAdapter(DidResolverUrl));
        // verify
        const vp = VerifiablePresentation.parse(JSON.stringify(presentation.toJSON()));
        const sDid = vp.getHolder().toString();
        if (!sDid) {
          console.log('Unable to extract owner DID from the presentation');
          return;
        }
        // Optional name
        const nameCredential = vp.getCredential(`name`);
        const name = nameCredential ? nameCredential.getSubject().getProperty('name') : '';
        // Optional bio
        const bioCredential = vp.getCredential(`description`);
        const bio = bioCredential ? bioCredential.getSubject().getProperty('description') : '';
        const user = {
          sDid,
          type: 'user',
          bio,
          name,
          canManageAdmins: false
        };
        // succeed
        const token = jwt.sign(user, 'pasar', { expiresIn: 60 * 60 * 24 * 7 });
        sessionStorage.setItem('PASAR_TOKEN', token);
        sessionStorage.setItem('PASAR_DID', did);
        sessionLinkFlag = '2';
        sessionStorage.setItem('PASAR_LINK_ADDRESS', sessionLinkFlag);
        setPasarLinkAddress(sessionLinkFlag);
        setOpenSigninDlg(false);

        // HIVE START
        // TODO: IMPROVE HIVE LOGIN
        // prepareConnectToHive()
        //   .then((res) => {
        //     creatAndRegister(true);
        //     console.log(res);
        //   })
        //   .catch((error) => {
        //     console.log('Register scripting error: ', error);
        //   });
        // HIVE END
        let essentialAddress = essentialsConnector.getWalletConnectProvider().wc.accounts[0];
        if (isInAppBrowser()) essentialAddress = await window.elastos.getWeb3Provider().address;
        setWalletAddress(essentialAddress);
        setActivatingConnector(essentialsConnector);
        setSigninEssentialSuccess(true);
        // getAvatarUrl(did);

        if (afterSigninPath) {
          setOpenSigninEssentialDlg(false);
          navigate(afterSigninPath);
          setAfterSigninPath(null);
        }
      } else {
        // console.log('User closed modal');
      }
    } catch (e) {
      try {
        await essentialsConnector.getWalletConnectProvider().disconnect();
      } catch (e) {
        console.log('Error while trying to disconnect wallet connect session', e);
      }
    }
  };
  const signOutWithEssentials = async () => {
    sessionStorage.removeItem('PASAR_LINK_ADDRESS');
    sessionStorage.removeItem('PASAR_TOKEN');
    sessionStorage.removeItem('PASAR_DID');
    sessionStorage.removeItem('KYCedProof');
    sessionStorage.removeItem('REWARD_USER');
    try {
      setSigninEssentialSuccess(false);
      setActivatingConnector(null);
      setWalletAddress(null);
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
        await essentialsConnector.disconnectWalletConnect();
      if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
        await window.elastos.getWeb3Provider().disconnect();
    } catch (error) {
      console.log('Error while disconnecting the wallet', error);
    }
    window.location.reload();
  };
  // ----------------------------------- //

  const handleClickOpenSignInDlg = async () => {
    if (isInAppBrowser()) {
      if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
        await signOutWithEssentials();
        await signInWithEssentials();
      } else {
        await signInWithEssentials();
      }
    } else setOpenSigninDlg(true);
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
    if (e.target.getAttribute('value') === 'credentials') {
      setOpenCredentials(true);
    } else if (e.target.getAttribute('value') === 'signout') {
      await activate(null);
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        try {
          if (isUsingEssentialsConnector() || essentialsConnector.hasWalletConnectSession())
            await essentialsConnector.disconnectWalletConnect();
          if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
            await window.elastos.getWeb3Provider().disconnect();
        } catch (error) {
          console.log('Error while disconnecting the wallet', error);
        }
      }
      setSigninEssentialSuccess(false);
      sessionStorage.removeItem('PASAR_LINK_ADDRESS');
      sessionStorage.removeItem('PASAR_TOKEN');
      sessionStorage.removeItem('PASAR_DID');
      sessionStorage.removeItem('KYCedProof');
      setActivatingConnector(null);
      setWalletAddress(null);
      navigate('/marketplace');
      window.location.reload();
    }
  };

  let totalBalance = 0;
  if (chainType === 'ESC')
    totalBalance = math.round(math.round(coinUSD * balance, 2) + math.round(diaUSD * diaBalance, 2), 2);
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
        balance: diaBalance,
        balanceUSD: diaUSD * diaBalance
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
      {walletAddress ? (
        <>
          <MFab id="signin" size="small" onClick={openAccountMenu} onMouseEnter={openAccountMenu}>
            <RingAvatar
              avatar={avatarUrl}
              isImage={!!avatarUrl}
              address={walletAddress}
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
            <MenuItem to="/profile" onClick={closeAccountMenu} component={RouterLink}>
              <AccountCircleOutlinedIcon />
              &nbsp;Profile
            </MenuItem>
            <MenuItem value="signout" onClick={closeAccountMenu} id="signout">
              <LogoutOutlinedIcon />
              &nbsp;Sign Out
            </MenuItem>
          </Menu>
        </>
      ) : (
        <div style={{ minWidth: 79 }}>
          <Button id="signin" variant="contained" onClick={handleClickOpenSignInDlg}>
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
                    <StyledButton
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
                      fullWidth
                      onClick={async () => {
                        // check if is already connected
                        if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                          await signOutWithEssentials();
                        } else if (essentialsConnector.hasWalletConnectSession()) {
                          await essentialsConnector.disconnectWalletConnect();
                        }
                        await signInWithEssentials();
                      }}
                    >
                      Elastos Essentials
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: '8px !important' }}>
                    <Typography variant="body2" display="block" gutterBottom align="center">
                      Just basic wallet and no DID
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ pt: '8px !important' }}>
                    <StyledButton
                      variant="contained"
                      startIcon={
                        <Avatar
                          alt="metamask"
                          src="/static/metamask.svg"
                          sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                        />
                      }
                      fullWidth
                      onClick={() => {
                        handleChooseWallet('metamask');
                      }}
                    >
                      MetaMask
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton variant="outlined" fullWidth onClick={handleClickOpenDownloadDlg}>
                      I don’t have a wallet
                    </StyledButton>
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
                <StyledButton
                  variant="contained"
                  href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app"
                  target="_blank"
                  startIcon={<AdbIcon />}
                  fullWidth
                >
                  Google Play
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  variant="outlined"
                  href="https://apps.apple.com/us/app/elastos-essentials/id1568931743"
                  target="_blank"
                  startIcon={<AppleIcon />}
                  fullWidth
                >
                  App Store
                </StyledButton>
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
                <StyledButton
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
                  fullWidth
                  onClick={async () => {
                    // check if is already connected
                    if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                      await signOutWithEssentials();
                      await signInWithEssentials();
                    } else {
                      await signInWithEssentials();
                    }
                  }}
                >
                  Elastos Essentials
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton variant="outlined" fullWidth onClick={handleClickOpenDownloadEssentialDlg}>
                  I don’t have a wallet
                </StyledButton>
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
            A DID is required in order to create or{' '}
            {openDownloadEssential === true ? 'sell items' : 'import collections'} on Pasar. Get your own DID by
            downloading the Elastos Essentials mobile app now!
          </Typography>
          <Typography variant="body2" display="block" gutterBottom align="center" sx={{ mt: 4 }}>
            Web3.0 super wallet with Decentralized Identifier (DID)
          </Typography>
          <Box component="div" sx={{ maxWidth: 300, m: 'auto' }}>
            <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
              <Grid item xs={12} sx={{ pt: '8px !important' }}>
                <StyledButton
                  variant="contained"
                  href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app"
                  target="_blank"
                  startIcon={<AdbIcon />}
                  fullWidth
                >
                  Google Play
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  variant="outlined"
                  href="https://apps.apple.com/us/app/elastos-essentials/id1568931743"
                  target="_blank"
                  startIcon={<AppleIcon />}
                  fullWidth
                >
                  App Store
                </StyledButton>
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
        Wrong network, only Elastos Smart Chain, Ethereum and Fusion is supported
      </SnackbarCustom>
    </>
  );
}
