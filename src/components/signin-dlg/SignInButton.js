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
import { useSnackbar } from 'notistack';
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
import { useUserContext } from '../../contexts/UserContext';
import useConnectEE from '../../hooks/useConnectEE';
// import { creatAndRegister, prepareConnectToHive, downloadAvatar } from './HiveAPI';
import { DidResolverUrl, firebaseConfig, mainDiaContract as DIA_CONTRACT_MAIN_ADDRESS } from '../../config';
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
    openTopAlert,
    openSignInDlg,
    openDownloadEEDlg,
    navigationPath,
    wallet,
    elaConnectivityService,
    setUser,
    setOpenTopAlert,
    setOpenSignInDlg,
    setOpenDownloadEEDlg,
    setNavigationPath,
    setWallet,
    setOpenCredentials,
    setElastosConnectivityService
  } = useUserContext();

  // let sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
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
  const { enqueueSnackbar } = useSnackbar();

  initConnectivitySDK();

  React.useEffect(() => {
    const handleEEAccountsChanged = async (accounts) => {
      console.log('Account Changed: ', accounts);
      if (accounts.length) {
        setWallet((prev) => {
          const current = { ...prev };
          const [address] = accounts;
          current.address = address;
          return current;
        });
        try {
          const dia = await getDiaTokenInfo(accounts[0], walletConnectProvider);
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
          const elaOnEth = await getElaOnEthTokenInfo(accounts[0], walletConnectProvider);
          setElaOnEthBalance(elaOnEth);
        } catch (e) {
          console.error(e);
          setElaOnEthBalance(0);
        }
        try {
          const balance = await getBalance(walletConnectProvider);
          setBalance(math.round(balance / 1e18, 4));
        } catch (e) {
          console.error(e);
          setBalance(0);
        }
      }
    };
    const handleEEChainChanged = (chainId) => {
      console.log('ChainId Changed', chainId);
      if (chainId) {
        setWallet((prev) => {
          const current = { ...prev };
          current.chainId = chainId;
          return current;
        });
        setChainType(getChainTypeFromId(chainId));
        if (!checkValidChain(chainId)) setOpenSnackbar(true);
      }
    };
    const handleEEDisconnect = (code, reason) => {
      console.log('Disconnect code: ', code, ', reason: ', reason);
      signOutWithEssentials();
    };
    const handleEEError = (code, reason) => {
      console.error(code, reason);
    };
    if (isInAppBrowser()) {
      const inAppProvider = window.elastos.getWeb3Provider();
      const inAppWeb3 = new Web3(inAppProvider);
      inAppWeb3.eth.getChainId().then((chainId) => {
        if (chainId) {
          setWallet((prev) => {
            const current = { ...prev };
            current.chainId = chainId;
            return current;
          });
          setChainType(getChainTypeFromId(chainId));
          if (!checkValidChain(chainId)) setOpenSnackbar(true);
        }
      });
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

  // const initializeWalletConnection = React.useCallback(async () => {
  //   if (sessionLinkFlag && !activatingConnector) {
  //     if (sessionLinkFlag === '1') {
  //       setActivatingConnector(injected);
  //       await activate(injected);
  //       setWalletAddress(await injected.getAccount());
  //     } else if (sessionLinkFlag === '2') {
  //       // const mydid = sessionStorage.getItem('PASAR_DID');
  //       // getAvatarUrl(mydid);
  //     } else if (sessionLinkFlag === '3') {
  //       setActivatingConnector(walletconnect);
  //       await activate(walletconnect);
  //       setWalletAddress(await walletconnect.getAccount());
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sessionLinkFlag, activatingConnector, account, chainId]);

  // const getAvatarUrl = (did) => {
  //   const targetDid = `did:elastos:${did}`;
  //   downloadAvatar(targetDid).then((res) => {
  //     if (res && res.length) {
  //       const base64Content = res.reduce((content, code) => {
  //         content = `${content}${String.fromCharCode(code)}`;
  //         return content;
  //       }, '');
  //       setAvatarUrl((prevState) => {
  //         if (!prevState) return `data:image/png;base64,${base64Content}`;
  //         return prevState;
  //       });
  //     }
  //   });
  // };

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAPIFrom(`api/v1/getV1MarketNFTByWalletAddr?walletAddr=${wallet.address}`, {});
      const json = await res.json();
      setOpenTopAlert((json?.data || []).length > 0);
    };
    if (wallet?.address) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     initializeWalletConnection();
  //     getCoinUSD().then((res) => {
  //       setCoinUSD(res);
  //     });
  //     getTokenPriceInEthereum().then((res) => {
  //       setTokenPricesInETH(res);
  //     });
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
  //     if (sessionLinkFlag) {
  //       // when connected
  //       if ((sessionLinkFlag === '1' || sessionLinkFlag === '3') && library) {
  //         setDiaUSD(await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS));
  //       } else if (sessionLinkFlag === '2') {
  //         if (isInAppBrowser()) {
  //           setDiaUSD(await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS));
  //         } else if (essentialsConnector.getWalletConnectProvider()) {
  //           setDiaUSD(await getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS));
  //         }
  //       }
  //     }
  //   };
  //   fetchData();
  // }, [sessionLinkFlag]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     if (chainId) {
  //       setPasarLinkChain(chainId);
  //       if (!checkValidChain(chainId)) setOpenSnackbar(true);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
  //     if (sessionLinkFlag) {
  //       // when connected
  //       if ((sessionLinkFlag === '1' || sessionLinkFlag === '3') && library) {
  //         getDiaTokenInfo(account, library.provider)
  //           .then((dia) => {
  //             setDiaBalance(dia);
  //           })
  //           .catch((e) => {
  //             console.error(e);
  //             setDiaBalance(0);
  //           });
  //         getElaOnEthTokenInfo(account, library.provider)
  //           .then((ela) => {
  //             setElaOnEthBalance(ela);
  //           })
  //           .catch((e) => {
  //             console.error(e);
  //             setElaOnEthBalance(0);
  //           });
  //         getBalance(library.provider).then((res) => {
  //           setBalance(math.round(res / 1e18, 4));
  //         });
  //       } else if (sessionLinkFlag === '2') {
  //         if (isInAppBrowser()) {
  //           const elastosWeb3Provider = await window.elastos.getWeb3Provider();
  //           getDiaTokenInfo(elastosWeb3Provider.address, elastosWeb3Provider)
  //             .then((dia) => {
  //               setDiaBalance(dia);
  //             })
  //             .catch((e) => {
  //               console.error(e);
  //               setDiaBalance(0);
  //             });
  //           getElaOnEthTokenInfo(elastosWeb3Provider.address, elastosWeb3Provider)
  //             .then((ela) => {
  //               setElaOnEthBalance(ela);
  //             })
  //             .catch((e) => {
  //               console.error(e);
  //               setElaOnEthBalance(0);
  //             });
  //           getBalance(elastosWeb3Provider).then((res) => {
  //             setBalance(math.round(res / 1e18, 4));
  //           });
  //         } else if (essentialsConnector.getWalletConnectProvider()) {
  //           const essentialProvider = essentialsConnector.getWalletConnectProvider();
  //           if (essentialProvider.chainId === 20 || essentialProvider.chainId === 21) {
  //             getDiaTokenInfo(essentialProvider.wc.accounts[0], essentialProvider)
  //               .then((dia) => {
  //                 setDiaBalance(dia);
  //               })
  //               .catch((e) => {
  //                 console.error(e);
  //                 setDiaBalance(0);
  //               });
  //           }
  //           if (essentialProvider.chainId === 1 || essentialProvider.chainId === 5) {
  //             getElaOnEthTokenInfo(essentialProvider.wc.accounts[0], essentialProvider)
  //               .then((ela) => {
  //                 setElaOnEthBalance(ela);
  //               })
  //               .catch((e) => {
  //                 console.error(e);
  //                 setElaOnEthBalance(0);
  //               });
  //           }
  //           getBalance(essentialProvider).then((res) => {
  //             setBalance(math.round(res / 1e18, 4));
  //           });
  //         }
  //       }
  //     }
  //   };
  //   fetchData();
  // }, [sessionLinkFlag, account, active, chainId, activatingConnector, chainType]);

  // // listen for disconnect from essentials / wallet connect
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     if (sessionLinkFlag === '1' && activatingConnector === injected && !active) {
  //       setOpenAccountPopup(null);
  //       await activate(null);
  //       if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1') {
  //         try {
  //           await activatingConnector.deactivate();
  //         } catch (e) {
  //           console.log('injected connector deactive error: ', e);
  //         }
  //       }
  //       sessionStorage.removeItem('PASAR_LINK_ADDRESS');
  //       setPasarLinkChain(1);
  //       setActivatingConnector(null);
  //       setWalletAddress(null);
  //       navigate('/marketplace');
  //       window.location.reload();
  //     } else if (sessionLinkFlag === '2' && activatingConnector === essentialsConnector) {
  //       if (isInAppBrowser()) {
  //         if (!(await window.elastos.getWeb3Provider().isConnected())) {
  //           setOpenAccountPopup(null);
  //           await activate(null);
  //           window.elastos
  //             .getWeb3Provider()
  //             .disconnect()
  //             .then((res) => {
  //               console.log(res);
  //             })
  //             .catch((e) => {
  //               console.log(e);
  //             });
  //           sessionStorage.removeItem('PASAR_LINK_ADDRESS');
  //           sessionStorage.removeItem('PASAR_TOKEN');
  //           sessionStorage.removeItem('PASAR_DID');
  //           sessionStorage.removeItem('KYCedProof');
  //           setPasarLinkChain(1);
  //           setActivatingConnector(null);
  //           setWalletAddress(null);
  //           navigate('/marketplace');
  //           window.location.reload();
  //         }
  //       } else if (!essentialsConnector.hasWalletConnectSession()) {
  //         setOpenAccountPopup(null);
  //         await activate(null);
  //         essentialsConnector
  //           .disconnectWalletConnect()
  //           .then((res) => {
  //             console.log(res);
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //           });
  //         sessionStorage.removeItem('PASAR_LINK_ADDRESS');
  //         sessionStorage.removeItem('PASAR_TOKEN');
  //         sessionStorage.removeItem('PASAR_DID');
  //         setPasarLinkChain(1);
  //         setActivatingConnector(null);
  //         setWalletAddress(null);
  //         navigate('/marketplace');
  //         window.location.reload();
  //       }
  //     } else if (sessionLinkFlag === '3') {
  //       if (activatingConnector === walletconnect && !walletconnect.walletConnectProvider.connected) {
  //         setOpenAccountPopup(null);
  //         await activate(null);
  //         if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
  //           try {
  //             await activatingConnector.deactivate();
  //           } catch (e) {
  //             console.log('walletconnect deactive error: ', e);
  //           }
  //         }
  //         sessionStorage.removeItem('PASAR_LINK_ADDRESS');
  //         setPasarLinkChain(1);
  //         setActivatingConnector(null);
  //         setWalletAddress(null);
  //         navigate('/marketplace');
  //         window.location.reload();
  //       }
  //     }
  //   };
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [essentialsConnector.hasWalletConnectSession(), active]);

  // ----------------------------------------- //
  // ----------------------------------- //
  // ====================== ====================== ====================== //
  const handleClickSignInButton = async () => {
    if (isInAppBrowser()) await connectToEE();
    else setOpenSignInDlg(true);
  };

  // ------------ MM, WC Connect ------------ //
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

  const disconnectWallet = async () => {
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
    setOpenAccountPopup(null);
    if (e.target.getAttribute('value') === 'credentials') {
      setOpenCredentials(true);
    } else if (e.target.getAttribute('value') === 'signout') {
      if (user?.link === '1' || user?.link === '3') await disconnectWallet();
      else if (user?.link === '2') await signOutWithEssentials();
      await activate(null);
      setActivatingConnector(null);
      setWallet((prev) => {
        const current = { ...prev };
        current.address = '';
        return current;
      });
      navigate('/marketplace');
      window.location.reload();
    }
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
