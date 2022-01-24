// material
import React from 'react';
import { Icon } from '@iconify/react';
import { alpha, styled } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography, AppBar, Toolbar, Paper, Divider, Backdrop, 
  Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import SquareIcon from '@mui/icons-material/Square';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

// components
import { MHidden, MIconButton } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import AssetSortSelect from '../../components/AssetSortSelect';
import LoadingWrapper from '../../components/LoadingWrapper';
import useOffSetTop from '../../hooks/useOffSetTop';
import AssetFilterPan from '../../components/marketplace/AssetFilterPan';
import AssetGrid from '../../components/marketplace/AssetGrid';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(19)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(8)
  }
}));

const APP_BAR_MOBILE = 72;
const APP_BAR_DESKTOP = 88;
const AppBarStyle = styled(AppBar)(({ theme }) => ({
  color: 'inherit',
  transition: theme.transitions.create(['top'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
  [theme.breakpoints.down('md')]: {
    top: 64,
    display: 'none'
  }
}));
const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: '48px',
  minHeight: '48px !important',
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  })
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
const FilterBtnContainerStyle = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  display: 'flex',
  width: '100%',
  padding: theme.spacing(1),
  justifyContent: 'center',
  backdropFilter: 'blur(6px)',
  background: alpha(theme.palette.background.default, 0.5)
}));
// ----------------------------------------------------------------------
export default function MarketExplorer() {
  const drawerWidth = 360;
  const btnNames = ["Listed", "On Auction", "General", "Avatar"]

  const isOffset = useOffSetTop(20);
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([]);
  const [selectedBtns, setSelectedBtns] = React.useState([]);
  const [range, setRange] = React.useState({min:'', max:''});
  const [adult, setAdult] = React.useState(false);
  const [dispmode, setDispmode] = React.useState(1);
  const [isFilterView, setFilterView] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [order, setOrder] = React.useState(0);
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
    let statusFilter = [...btnNames].splice(0, 2).filter((name, index)=>selectedBtns.indexOf(index)>=0)
    statusFilter = (statusFilter.length===2 || statusFilter.length===0)?'All':statusFilter[0]
    let itemTypeFilter = [...btnNames].splice(2).filter((name, index)=>selectedBtns.indexOf(index+2)>=0)
    itemTypeFilter = (itemTypeFilter.length===2 || itemTypeFilter.length===0)?'All':itemTypeFilter[0].toLowerCase()
    if(itemTypeFilter==='general')
      itemTypeFilter = itemTypeFilter.concat(',image')
    setLoadingAssets(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getDetailedCollectibles?`+
      `collectionType=&`+
      `status=${statusFilter}&`+
      `itemType=${itemTypeFilter}&`+
      `adult=${adult}&`+
      `minPrice=${range.min===''?0:range.min}&`+
      `maxPrice=${range.max===''?9999999999999999:range.max}&`+
      `order=${order}&`+
      `pageNum=${page}&`+
      `pageSize=${showCount}`, { signal }).then(response => {
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
  }, [page, showCount, selectedBtns, adult, range, order]);
  
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
  const handleFilter = (key, value)=>{
    switch(key){
      case 'statype':
        handleBtns(value)
        break
      case 'range':
        setRange(value)
        break
      case 'adult':
        setAdult(value)
        break
      default:
        break
    }
  }
  const link2Detail = (tokenId)=>{
    navigate(`/explorer/collectible/detail/${tokenId}`);
  }
  const closeFilter = (e)=>{
    setFilterView(!isFilterView&&1)
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
              <Stack width="100%" direction="row">
                <Box sx={{flex:1}}>
                  <Button
                    variant="contained"
                    color="origin"
                    startIcon={isFilterView?<Icon icon={arrowIosBackFill} />:''}
                    endIcon={isFilterView?'':<Icon icon={arrowIosForwardFill} />}
                    onClick={closeFilter}
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
                  <AssetSortSelect onChange={setOrder}/>
                  <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                    <ToggleButton value={0}>
                      <GridViewSharpIcon />
                    </ToggleButton>
                    <ToggleButton value={1}>
                      <AppsIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            </ToolbarStyle>
            {isOffset && <ToolbarShadowStyle />}
          </AppBarStyle>
          {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
          <Box sx={{ display: 'flex' }}>
            <Box
              component="nav"
              sx={{ width: drawerWidth*isFilterView, flexShrink: 0, display: {xs: 'none', sm: 'none', md: 'block'}, transition: 'width ease .5s' }}
              aria-label="mailbox folders"
            >
              <AssetFilterPan 
                sx={{
                  pt: 3,
                  '& .MuiDrawer-paper': {
                    transition: 'all ease .5s',
                    width: drawerWidth,
                    top: isOffset?APP_BAR_MOBILE+48:APP_BAR_DESKTOP+48,
                    left: drawerWidth*(isFilterView-1) 
                  },
                }}
                scrollMaxHeight = {`calc(100vh - ${isOffset?APP_BAR_MOBILE:APP_BAR_DESKTOP}px - 48px)`}
                btnNames = {btnNames}
                selectedBtns = {selectedBtns}
                // handleBtnFunc = {handleBtns}
                handleFilter = {handleFilter}
              />
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth*isFilterView}px)` } }}
            >
              <MHidden width="mdUp">
                <Box sx={{display: 'flex', pb: 1}}>
                  <AssetSortSelect sx={{flex: 1}}/>
                  <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                    <ToggleButton value={0}>
                      <SquareIcon />
                    </ToggleButton>
                    <ToggleButton value={1}>
                      <GridViewSharpIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </MHidden>
              <AssetGrid assets={assets} dispmode={dispmode}/>
            </Box>
          </Box>
        </Container>
      </Stack>
      <MHidden width="mdUp">
        <FilterBtnContainerStyle>
          <Button
            size="large"
            variant="contained"
            color="origin"
            onClick={closeFilter}
          >
            Filters
          </Button>
        </FilterBtnContainerStyle>
        
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isFilterView!==1} onClick={closeFilter} />
        <Box
          sx={{
            top: 12,
            bottom: 12,
            right: 0,
            position: 'fixed',
            zIndex: 1210,
            ...(!isFilterView && { right: 12 })
          }}
        >
          <Paper
            sx={{
              height: 1,
              width: '0px',
              maxWidth: 400,
              overflow: 'hidden',
              boxShadow: (theme) => theme.customShadows.z24,
              transition: (theme) => theme.transitions.create('width'),
              ...(!isFilterView && { width: 'calc(100vw - 24px)' })
            }}
          >
            <AssetFilterPan 
              sx={{
              }}
              scrollMaxHeight = 'calc(100vh - 24px - 68px)'
              btnNames = {btnNames}
              selectedBtns = {selectedBtns}
              handleBtnFunc = {handleBtns}
            />
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
              <Typography variant="subtitle1">Filters</Typography>
              <Button
                endIcon={<CheckIcon/>}
                onClick={closeFilter}
              >
                Done
              </Button>
            </Stack>
          </Paper>
        </Box>
      </MHidden>
    </RootStyle>
  );
}
