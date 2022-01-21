// material
import React from 'react';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, AppBar, Toolbar, 
  Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import CloseIcon from '@mui/icons-material/Close';

// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import AssetSortSelect from '../../components/AssetSortSelect';
import LoadingWrapper from '../../components/LoadingWrapper';
import useOffSetTop from '../../hooks/useOffSetTop';
import AssetFilterPan from '../../components/marketplace/AssetFilterPan';
import AssetGrid from '../../components/marketplace/AssetGrid';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(19)
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


const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;
const AppBarStyle = styled(AppBar)(({ theme }) => ({
  color: 'inherit',
  transition: theme.transitions.create(['top'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
}));
const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: '48px',
  minHeight: '48px !important',
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
  // [theme.breakpoints.up('md')]: {
  //   height: APP_BAR_MOBILE
  // },
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8
}));
// ----------------------------------------------------------------------
export default function MarketExplorer() {
  const drawerWidth = 360;
  const btnNames = ["Listed on Market", "On Auction", "General", "Avatar"]

  const isOffset = useOffSetTop(20);
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([]);
  const [selectedBtns, setSelectedBtns] = React.useState([]);
  const [dispmode, setDispmode] = React.useState(0);
  const [isFilterView, setFilterView] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingAssets(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=${page}&pageSize=${showCount}&timeOrder=${timeOrder}`, { signal }).then(response => {
      response.json().then(jsonAssets => {
        setTotalCount(jsonAssets.data.total)
        setPages(Math.ceil(jsonAssets.data.total/showCount));
        setAssets(jsonAssets.data.result);
        setLoadingAssets(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingAssets(false);
    });
  }, [page, showCount, timeOrder]);
  
  const handleDispmode = (event, mode) => {
    if(mode===null)
      return
    setDispmode(mode)
  };
  const handleBtns = (num)=>{
    const tempBtns = [...selectedBtns]
    if(tempBtns.includes(num)){
      const findIndex = tempBtns.indexOf(num)
      tempBtns.splice(findIndex, 1)
    }
    else
      tempBtns.push(num)
    setSelectedBtns(tempBtns);
  }
  const handleDateOrder = (selected)=>{
    setTimeOrder(selected)
  }
  const link2Detail = (tokenId)=>{
    navigate(`/explorer/collectible/detail/${tokenId}`);
  }
  return (
    <RootStyle title="Marketplace | PASAR">
      <Stack direction="row">
        <Container maxWidth={false}>
          <AppBarStyle sx={{ boxShadow: 0, bgcolor: 'transparent', top: isOffset?APP_BAR_MOBILE:APP_BAR_DESKTOP }}>
            <ToolbarStyle
              sx={{
                ...(isOffset && {
                  bgcolor: 'background.default',
                })
              }}
            >
              <StackStyle width="100%">
                <Box sx={{flex:1}}>
                  <Button
                    variant="contained"
                    color="origin"
                    startIcon={isFilterView?<Icon icon={arrowIosBackFill} />:''}
                    endIcon={isFilterView?'':<Icon icon={arrowIosForwardFill} />}
                    onClick={()=>{setFilterView(!isFilterView&&1)}}
                  >
                    Filters
                  </Button>
                  <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>{totalCount.toLocaleString('en')} items</Typography>
                  <Stack spacing={1} sx={{display: 'inline', pl: 1}} direction="row">
                    {
                      selectedBtns.map((nameId, index)=>(
                        <Button
                          key={index}
                          variant="outlined"
                          color="origin"
                          endIcon={<CloseIcon />}
                          onClick={()=>{handleBtns(nameId)}}
                        >
                          {btnNames[nameId]}
                        </Button>
                      ))
                    }
                    {
                      selectedBtns.length>0&&
                      <Button
                        color="inherit"
                        onClick={()=>{setSelectedBtns([])}}
                      >
                        Clear All
                      </Button>
                    }
                  </Stack>
                </Box>
                <Box sx={{display: 'flex'}}>
                  <AssetSortSelect/>
                  <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                    <ToggleButton value={0}>
                      <GridViewSharpIcon />
                    </ToggleButton>
                    <ToggleButton value={1}>
                      <AppsIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </StackStyle>
            </ToolbarStyle>
            {isOffset && <ToolbarShadowStyle />}
          </AppBarStyle>
          {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
          <Box sx={{ display: 'flex' }}>
            <Box
              component="nav"
              sx={{ width: drawerWidth*isFilterView, flexShrink: 0, display: {xs: 'none', sm: 'none', md: 'block'} }}
              aria-label="mailbox folders"
            >
              <AssetFilterPan 
                sx={{
                  pt: 3,
                  '& .MuiDrawer-paper': { width: drawerWidth*isFilterView, top: isOffset?APP_BAR_MOBILE+48:APP_BAR_DESKTOP+48 },
                }}
                scrollMaxHeight = {`calc(100vh - ${isOffset?APP_BAR_MOBILE:APP_BAR_DESKTOP}px - 48px)`}
                btnNames = {btnNames}
                selectedBtns = {selectedBtns}
                handleBtnFunc = {handleBtns}
              />
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth*isFilterView}px)` } }}
            >
              <AssetGrid assets={assets} dispmode={dispmode}/>
            </Box>
          </Box>
        </Container>
      </Stack>
    </RootStyle>
  );
}
