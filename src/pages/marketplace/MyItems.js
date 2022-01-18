// material
import React from 'react';
import { styled } from '@mui/material/styles';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, AppBar, Toolbar, Tab,
  Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Icon } from '@iconify/react';
import { useWeb3React } from "@web3-react/core";
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import MyItemsSortSelect from '../../components/MyItemsSortSelect';
import LoadingWrapper from '../../components/LoadingWrapper';
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
  const [tabValue, setTabValue] = React.useState('1');
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
        </Box>
        <TabContext value={tabValue}>
          <Box sx={{display: {xs: 'block', sm: 'flex'}, position: 'relative', mb: 2, justifyContent: {sm: 'left', md: 'center'}}} align="center">
            <TabList onChange={handleSwitchTab} TabIndicatorProps={{style: {background:'#FF5082'}}}>
              <Tab label="Listed" value='1' />
              <Tab label="Owned" value='2' />
              <Tab label="Created" value='3' />
            </TabList>
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
          <Box
            sx={{
              width: '100%',
            }}
          >
            <TabPanel value='1'>
              {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
              <Box component="main">
                <AssetGrid assets={assets} dispmode={dispmode}/>
              </Box>
            </TabPanel>
            <TabPanel value='2'>
              {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
              <Box component="main">
                <Typography variant="subtitle2" align="center" sx={{mb: 3}}>No owned collectible found!</Typography>
              </Box>
            </TabPanel>
            <TabPanel value='3'>
              {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
              <Box component="main">
                <Typography variant="subtitle2" align="center" sx={{mb: 3}}>No created collectible found!</Typography>
              </Box>
            </TabPanel>
          </Box>
        </TabContext>
      </Container>
    </RootStyle>
  );
}
