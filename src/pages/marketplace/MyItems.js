// material
import React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import SwipeableViews from "react-swipeable-views";
import {isMobile} from 'react-device-detect';

import { styled } from '@mui/material/styles';
import { Container, Stack, Typography, Tab, Tabs, Link, 
  Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
// import { TabContext, TabList, TabPanel } from '@mui/lab';
import SquareIcon from '@mui/icons-material/Square';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Icon } from '@iconify/react';
import { useWeb3React } from "@web3-react/core";
// components
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import MyItemsSortSelect from '../../components/MyItemsSortSelect';
import AssetGrid from '../../components/marketplace/AssetGrid';
import { useEagerConnect } from "../../components/signin-dlg/hook";
import Jazzicon from '../../components/Jazzicon';
import { reduceHexAddress } from '../../utils/common';

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
    flexDirection: 'column',
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
  const params = useParams(); // params.address
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([[],[],[]]);
  const [isLoadingAssets, setLoadingAssets] = React.useState([false,false,false]);
  const [dispmode, setDispmode] = React.useState(1);
  const [orderType, setOrderType] = React.useState(0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [tabValue, setTabValue] = React.useState(0);
  const [walletAddress, setWalletAddress] = React.useState(null);

  const context = useWeb3React()
  const { account } = context;

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  React.useEffect(() => {
    if(!params.address)
      setWalletAddress(account)
    else 
      setWalletAddress(params.address)
  }, [account, params.address])


  const handleSwitchTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSwitchSwiper = (value) => {
    setTabValue(value);
  };

  const setLoadingAssetsOfType = (index, value) => {
    setLoadingAssets(prevState=>{
      const tempLoadingAssets = [...prevState]
      tempLoadingAssets[index] = value
      return tempLoadingAssets
    })
  }

  const setAssetsOfType = (index, value) => {
    if(!value)
      return

    setAssets(prevState=>{
      const tempAssets = [...prevState]
      tempAssets[index] = value
      return tempAssets
    })
  }

  const apiNames = ['getListedCollectiblesByAddress', 'getOwnCollectiblesByAddress', 'getCreatedCollectiblesByAddress']
  const typeNames = ['listed', 'owned', 'created']
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    Array(3).fill(0).forEach((_, i)=>{
      setLoadingAssetsOfType(i, true)
      fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/${apiNames[i]}?address=${walletAddress}&orderType=${orderType}`, { signal }).then(response => {
        response.json().then(jsonAssets => {
          setAssetsOfType(i, jsonAssets.data);
          setLoadingAssetsOfType(i, false)
        })
      }).catch(e => {
        if(e.code !== e.ABORT_ERR)
          setLoadingAssetsOfType(i, false)
      });
    })
  }, [walletAddress, orderType]);
  
  const handleDispmode = (event, mode) => {
    if(mode===null)
      return
    setDispmode(mode)
  };
  const link2Detail = (tokenId)=>{
    navigate(`/explorer/collectible/detail/${tokenId}`);
  }
  return (
    <RootStyle title="MyItems | PASAR">
      <Container maxWidth={false}>
        <Box sx={{position: 'relative', mb: {xs: 0, sm: 2}, justifyContent: 'center'}}>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Jazzicon 
              address={walletAddress}
              size={isMobile?80:100}
              sx={{
                mr: 0,
                border: '3px solid',
                borderColor: (theme)=>theme.palette.origin.main,
                width: isMobile?96:116,
                height: isMobile?96:116,
                backgroundColor: (theme)=>theme.palette.background.paper,
                p: '5px'
              }}/>
          </Box>
          <Typography variant="h2" component="h2" align="center" sx={{position: 'relative'}}>
            <Link to={`/explorer/transaction/detail/${walletAddress}`} component={RouterLink}>
              {
                !params.address?
                <span role="img" aria-label="">Me</span>:
                <span role="img" aria-label="">{reduceHexAddress(params.address)}</span>
              }
            </Link>
          </Typography>
          <MHidden width="smUp">
              <ToolGroupStyle>
                <MyItemsSortSelect onChange={setOrderType} sx={{flex: 1}}/>
                <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                  <ToggleButton value={0}>
                    <SquareIcon />
                  </ToggleButton>
                  <ToggleButton value={1}>
                    <GridViewSharpIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </ToolGroupStyle>
          </MHidden>
        </Box>
        <Box sx={{display: 'flex', position: 'relative', mb: 2, justifyContent: 'center'}} align="center">
          <Tabs value={tabValue} onChange={handleSwitchTab} TabIndicatorProps={{style: {background:'#FF5082'}}}>
            <Tab label="Listed" value={0} />
            <Tab label="Owned" value={1} />
            <Tab label="Created" value={2} />
          </Tabs>
          <MHidden width="smDown">
            <ToolGroupStyle>
              <MyItemsSortSelect onChange={setOrderType}/>
              <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                <ToggleButton value={0}>
                  <GridViewSharpIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <AppsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </ToolGroupStyle>
          </MHidden>
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <SwipeableViews
            index={tabValue}
            onChangeIndex={handleSwitchSwiper}
            containerStyle={{
              transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
            }}
          >
            {
              assets.map((group, i)=>(
                <Box key={i} sx={{minHeight: 200}}>
                  {isLoadingAssets[i] && <LoadingScreen sx={{background: 'transparent'}}/>}
                  {
                    !isLoadingAssets[i] && 
                    <Box component="main">
                      {
                        group.length>0?
                        <AssetGrid assets={group} type={i+1} dispmode={dispmode} isOwner={!params.address}/>:
                        <Typography variant="subtitle2" align="center" sx={{mb: 3}}>No {typeNames[i]} collectible found!</Typography>
                      }
                    </Box>
                  }
                </Box>
              ))
            }
          </SwipeableViews>
        </Box>
      </Container>
    </RootStyle>
  );
}
