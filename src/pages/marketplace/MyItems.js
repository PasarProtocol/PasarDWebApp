// material
import React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { isMobile } from 'react-device-detect';

import { styled } from '@mui/material/styles';
import { Container, Stack, Typography, Tab, Tabs, Link, Button, Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
// import { TabContext, TabList, TabPanel } from '@mui/lab';
import SquareIcon from '@mui/icons-material/Square';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Icon } from '@iconify/react';
import { useWeb3React } from '@web3-react/core';
import jwtDecode from 'jwt-decode';
// components
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import MyItemsSortSelect from '../../components/MyItemsSortSelect';
import AssetGrid from '../../components/marketplace/AssetGrid';
import { useEagerConnect } from '../../components/signin-dlg/hook';
import Jazzicon from '../../components/Jazzicon';
import Badge from '../../components/Badge';
import { reduceHexAddress, getDiaTokenInfo, fetchFrom, getInfoFromDID, getDidInfoFromAddress, isInAppBrowser } from '../../utils/common';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(13)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const ToolGroupStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));
// ----------------------------------------------------------------------
export default function MyItems() {
  const sessionDispMode = sessionStorage.getItem("disp-mode")
  const params = useParams(); // params.address
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([[], [], []]);
  const [isLoadingAssets, setLoadingAssets] = React.useState([false, false, false]);
  const [dispmode, setDispmode] = React.useState(sessionDispMode!==null?parseInt(sessionDispMode, 10):1);
  const [orderType, setOrderType] = React.useState(0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [tabValue, setTabValue] = React.useState(params.type!==undefined?parseInt(params.type, 10):0);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [myAddress, setMyAddress] = React.useState(null);
  const [didInfo, setDidInfo] = React.useState({name: '', description: ''});
  const [updateCount, setUpdateCount] = React.useState(0);
  const [diaBadge, setDiaBadge] = React.useState(false);

  const context = useWeb3React();
  const { account } = context;

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  React.useEffect(async() => {
    if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '1') {
      setMyAddress(account)
      setWalletAddress(account);
    }
    else if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '2') {
      const strWalletAddress = isInAppBrowser() ? await window.elastos.getWeb3Provider().address : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
      setMyAddress(strWalletAddress)
      setWalletAddress(strWalletAddress);
    }
    else if (sessionStorage.getItem("PASAR_LINK_ADDRESS") === '3') {
      const strWalletAddress = await walletconnect.getAccount()
      setMyAddress(strWalletAddress)
      setWalletAddress(strWalletAddress);
    }
    else if(!params.address) {
      navigate('/marketplace');
    }
    // ----------------------------------------------------------
    if (params.address){
      setWalletAddress(params.address)
      getDidInfoFromAddress(params.address)
        .then((info) => {
          setDidInfo({'name': info.name || '', 'description': info.description || ''})
        })
        .catch((e) => {
        })
    }
    else if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '2') {
      const token = sessionStorage.getItem("PASAR_TOKEN");
      const user = jwtDecode(token);
      const {name, bio} = user;
      setDidInfo({'name': name, 'description': bio})
    }
    else {
      setDidInfo({'name': '', 'description': ''})
    }
  }, [account, params.address]);

  const handleSwitchTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSwitchSwiper = (value) => {
    setTabValue(value);
  };

  const setLoadingAssetsOfType = (index, value) => {
    setLoadingAssets((prevState) => {
      const tempLoadingAssets = [...prevState];
      tempLoadingAssets[index] = value;
      return tempLoadingAssets;
    });
  };

  const setAssetsOfType = (index, value) => {
    if (!value) return;
    setAssets((prevState) => {
      const tempAssets = [...prevState];
      tempAssets[index] = value;
      return tempAssets;
    });
  };

  const apiNames = ['getListedCollectiblesByAddress', 'getOwnCollectiblesByAddress', 'getCreatedCollectiblesByAddress'];
  const typeNames = ['listed', 'owned', 'created'];
  React.useEffect(async () => {
    if(walletAddress)
      getDiaTokenInfo(walletAddress).then(dia=>{
        if(dia!=='0')
          setDiaBadge(true)
      })

    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const { signal } = newController;
    setAbortController(newController);

    Array(3)
      .fill(0)
      .forEach((_, i) => {
        setLoadingAssetsOfType(i, true);
        fetchFrom(`sticker/api/v1/${apiNames[i]}?address=${walletAddress}&orderType=${orderType}`, { signal })
          .then((response) => {
            response.json().then((jsonAssets) => {
              setAssetsOfType(i, jsonAssets.data);
              setLoadingAssetsOfType(i, false);
            }).catch((e) => {
              setLoadingAssetsOfType(i, false);
            });
          })
          .catch((e) => {
            if (e.code !== e.ABORT_ERR) setLoadingAssetsOfType(i, false);
          });
      });
  }, [walletAddress, orderType, updateCount]);

  const handleDispmode = (event, mode) => {
    if (mode === null)
      return
    sessionStorage.setItem('disp-mode', mode);
    setDispmode(mode);
  };
  const link2Detail = (tokenId) => {
    navigate(`/explorer/collectible/detail/${tokenId}`);
  };
  const loadingSkeletons = Array(10).fill(null)

  return (
    <RootStyle title="MyItems | PASAR">
      <Container maxWidth={false}>
        <Box sx={{ position: 'relative', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: isMobile?1:1.5 }}>
            <Jazzicon
              address={walletAddress}
              size={isMobile ? 80 : 100}
              sx={{
                mr: 0,
                borderColor: (theme) => theme.palette.origin.main,
                width: isMobile ? 98 : 118,
                height: isMobile ? 98 : 118,
                backgroundColor: (theme) => theme.palette.background.paper,
                p: '5px',
                background:
                  'linear-gradient(#fff, #fff) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box',
                border: '4px solid transparent'
              }}
            />
          </Box>
          <Typography variant="h2" component="div" align="center" sx={{ position: 'relative', lineHeight: 1.1 }}>
            <Link to={`/explorer/transaction/detail/${walletAddress}`} component={RouterLink}>
              <span role="img" aria-label="">
                {didInfo.name || reduceHexAddress(walletAddress)}
              </span>
            </Link>
            {
              didInfo.name.length>0 &&
              <Typography variant="subtitle2" noWrap>{reduceHexAddress(walletAddress)}</Typography>
            }
            {
              didInfo.description.length>0 &&
              <Typography variant="subtitle2" noWrap sx={{color: 'text.secondary'}}>{didInfo.description}</Typography>
            }
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', pt: 1}}>
          {
            diaBadge&&
            <Tooltip title="Diamond (DIA) token holder" arrow enterTouchDelay={0}>
              <Box sx={{display: 'inline-flex'}}><Badge name="diamond"/></Box>
            </Tooltip>
          }
          </Box>
          {/* <MHidden width="smUp">
            <ToolGroupStyle>
              <MyItemsSortSelect onChange={setOrderType} sx={{ flex: 1 }} />
              <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                <ToggleButton value={0}>
                  <SquareIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <GridViewSharpIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </ToolGroupStyle>
          </MHidden> */}
        </Box>
        <Box sx={{ display: 'flex', position: 'relative', mb: 2, justifyContent: 'center' }} align="center">
          <Tabs value={tabValue} onChange={handleSwitchTab} TabIndicatorProps={{ style: { background: '#FF5082' } }}>
            <Tab label={`Listed (${assets[0].length})`} value={0} />
            <Tab label={`Owned (${assets[1].length})`} value={1} />
            <Tab label={`Created (${assets[2].length})`} value={2} />
          </Tabs>
          {/* <MHidden width="smDown">
            <ToolGroupStyle>
              <MyItemsSortSelect onChange={setOrderType} />
              <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                <ToggleButton value={0}>
                  <GridViewSharpIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <AppsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </ToolGroupStyle>
          </MHidden> */}
        </Box>
        <Box
          sx={{
            width: '100%'
          }}
        >
          <SwipeableViews
            index={tabValue}
            onChangeIndex={handleSwitchSwiper}
            containerStyle={{
              transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
            }}
          >
            {assets.map((group, i) => (
              <Box key={i} sx={{ minHeight: 200 }}>
                {/* {isLoadingAssets[i] && <LoadingScreen sx={{ background: 'transparent' }} />} */}
                {!isLoadingAssets[i]?
                  <Box component="main">
                    {group.length > 0 ? (
                      <AssetGrid assets={group} type={i + 1} dispmode={dispmode} myaddress={myAddress} updateCount={updateCount} handleUpdate={setUpdateCount}/>
                    ) : (
                      <Typography variant="subtitle2" align="center" sx={{ mb: 3 }}>
                        No {typeNames[i]} collectible found!
                      </Typography>
                    )}
                  </Box>:
                  <Box component="main">
                    <AssetGrid assets={loadingSkeletons} type={i + 1} dispmode={dispmode} myaddress={myAddress} updateCount={updateCount} handleUpdate={setUpdateCount}/>
                  </Box>
                }
              </Box>
            ))}
          </SwipeableViews>
        </Box>
      </Container>
    </RootStyle>
  );
}
