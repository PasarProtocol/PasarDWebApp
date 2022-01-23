// material
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SwipeableViews from "react-swipeable-views";

import { styled } from '@mui/material/styles';
import { Container, Stack, Typography, Tab, Tabs, 
  Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
// import { TabContext, TabList, TabPanel } from '@mui/lab';
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
    justifyContent: 'right',
    marginBottom: theme.spacing(1)
  }
}));
// ----------------------------------------------------------------------
export default function MyItems() {
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([]);
  const [dispmode, setDispmode] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [walletAddress, setWalletAddress] = React.useState(null);


  const context = useWeb3React()
  const { account } = context;

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  React.useEffect(() => {
    setWalletAddress(account)
  }, [account])


  const handleSwitchTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSwitchSwiper = (value) => {
    setTabValue(value);
  };

  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingAssets(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=1&pageSize=10&timeOrder=${timeOrder}`, { signal }).then(response => {
      response.json().then(jsonAssets => {
        setTotalCount(jsonAssets.data.total)
        setAssets(jsonAssets.data.result);
        setLoadingAssets(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingAssets(false);
    });
  }, [timeOrder]);
  
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
        <Box sx={{display: {xs: 'block', sm: 'flex'}, position: 'relative', mb: {xs: 0, sm: 2}, justifyContent: 'center'}}>
          <Typography variant="h2" component="h2" align="center" sx={{position: 'relative'}}>
            <span role="img" aria-label="">🗂️</span> My Items
          </Typography>
          <Box fullWidth sx={{justifyContent: {xs: 'right', md: 'normal'}, display: 'flex'}}>
            <Button
                to={`/explorer/transaction/detail/${walletAddress}`}
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
                sx={{position: {xs: 'unset', sm: 'absolute'}, right: 0, bottom: 0}}
            >
              See more details
            </Button>
          </Box>
          <MHidden width="smUp">
            <Box fullWidth sx={{justifyContent: 'right', display: 'flex'}}>
              <ToolGroupStyle>
                <MyItemsSortSelect onChange={()=>{}}/>
                <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                  <ToggleButton value={0}>
                    <GridViewSharpIcon />
                  </ToggleButton>
                  <ToggleButton value={1}>
                    <AppsIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </ToolGroupStyle>
            </Box>
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
              <MyItemsSortSelect onChange={()=>{}}/>
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
            <Box>
              {isLoadingAssets && <LoadingScreen sx={{background: 'transparent'}}/>}
              <Box component="main">
                <AssetGrid assets={assets} dispmode={dispmode}/>
              </Box>
            </Box>
            <Box>
              {isLoadingAssets && <LoadingScreen sx={{background: 'transparent'}}/>}
              <Box component="main">
                <Typography variant="subtitle2" align="center" sx={{mb: 3}}>No owned collectible found!</Typography>
              </Box>
            </Box>
            <Box>
              {isLoadingAssets && <LoadingScreen sx={{background: 'transparent'}}/>}
              <Box component="main">
                <Typography variant="subtitle2" align="center" sx={{mb: 3}}>No created collectible found!</Typography>
              </Box>
            </Box>
          </SwipeableViews>
        </Box>
      </Container>
    </RootStyle>
  );
}
