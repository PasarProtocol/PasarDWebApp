import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import { isMobile } from 'react-device-detect';
import * as math from 'mathjs';
import { Container, Stack, Typography, AppBar, Toolbar, Paper, Divider, Backdrop, Table, TableRow, TableHead, TableBody, TableCell, TableContainer,
  Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha, styled } from '@mui/material/styles';
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
import LoadingWrapper from '../../components/LoadingWrapper';
import LoadingScreen from '../../components/LoadingScreen';
import ChainSelect from '../../components/ChainSelect';
import ActivityPeriodSelect from '../../components/ActivityPeriodSelect';
import ActivityFilterPan from '../../components/activity/ActivityFilterPan';
import TabletImgBox from '../../components/activity/TabletImgBox'
import AssetGrid from '../../components/marketplace/AssetGrid';
import Scrollbar from '../../components/Scrollbar';
import ScrollManager from '../../components/ScrollManager'
import useOffSetTop from '../../hooks/useOffSetTop';
import useSignin from '../../hooks/useSignin';
import { fetchFrom, MethodList, setAllTokenPrice, getTotalCountOfCoinTypes, getCoinTypeFromToken } from '../../utils/common';

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
  zIndex: 1,
  background: alpha(theme.palette.background.default, 0.5)
}));
const FilterBtnBadgeStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.origin.main,
  width: 30,
  height: 30,
  lineHeight: '30px',
  borderRadius: 15,
  textAlign: 'center',
  alignItems: 'center',
  marginLeft: theme.spacing(1)
}));
// ----------------------------------------------------------------------
const COLUMNS = [
  { id: 'event', label: 'Type', minWidth: 170, align: 'center' },
  { id: 'image', label: 'Item', minWidth: 170, align: 'center' },
  { id: 'price', label: 'Price', minWidth: 170, align: 'center' },
  { id: 'from', label: 'From', minWidth: 170, align: 'center' },
  { id: 'to', label: 'To', minWidth: 170, align: 'center' },
  { id: 'timestamp', label: 'Time', minWidth: 170, align: 'center' },
];
export default function MarketExplorer() {
  const sessionDispMode = sessionStorage.getItem("disp-mode")
  const sessionFilterProps = JSON.parse(sessionStorage.getItem("activity-filter-props")) || {}
  const params = useParams(); // params.key
  const drawerWidth = 360;
  const btnGroup = {
    status: ["Sale", "Listed", "Minted"],
  }
  const { openTopAlert } = useSignin()
  const APP_BAR_MOBILE = 72+(openTopAlert?50:0);
  const APP_BAR_DESKTOP = 88+(openTopAlert?50:0);
  const rangeBtnId = 10
  const adultBtnId = 11
  const emptyRange = {min: '', max: ''}
  const defaultDispMode = isMobile?1:0
  const isOffset = useOffSetTop(20);
  const navigate = useNavigate();
  // const [activities, setActivity] = React.useState([]);
  const [activities, setActivity] = React.useState([{
    "_id": "62f4a11492e7d1083f48c404",
    "blockNumber": 7369397,
    "marketPlace": 3,
    "tokenId": "79829147512736634719551218892238588924174987477326859535778640470300681938890",
    "from": "0x0000000000000000000000000000000000000000",
    "gasFee": 0.0075,
    "timestamp": 1658839826,
    "to": "0x93b76C16e8A2c61a3149dF3AdCbE604be1F4137b",
    "event": "CreateOrderForSale",
    "tHash": "0x53cdb6e55b896fe9113aff652689c2495d8dda25828905b1cbb4421efcced885",
    "royaltyFee": "0",
    "name": "first1",
    "royalties": "0",
    "asset": "pasar:image:QmNc2K6rxHX8zsoAdewfe4dtX6NTu8NLMtm4pkw9uv7WGu",
    "royaltyOwner": "0x93b76C16e8A2c61a3149dF3AdCbE604be1F4137b",
    "thumbnail": "pasar:image:QmRJwYzZnZacEz5TjNGRkZzBzXaaB9NPY24aZJi9hNoRAi",
    "data": {},
    "tokenJsonVersion": "2",
    "quoteToken": "0x0000000000000000000000000000000000000000",
    "baseToken": "0xEcedc8942e20150691Bd6A622442108d4c6572d7",
    "price": "2000000000000000000",
    "collection": "Pasar Collection",
    "v1Event": null
  }]);
  const [selectedCollections, setSelectedCollections] = React.useState(sessionFilterProps.selectedCollections || []);
  const [selectedTokens, setSelectedTokens] = React.useState(sessionFilterProps.selectedTokens || []);
  const [selectedBtns, setSelectedBtns] = React.useState(sessionFilterProps.selectedBtns || []);
  const [isAlreadyMounted, setAlreadyMounted] = React.useState(true);
  const [dispmode, setDispmode] = React.useState(sessionDispMode!==null?parseInt(sessionDispMode, 10):defaultDispMode);
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    ...sessionFilterProps
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [period, setPeriod] = React.useState(4);
  const [chainType, setChainType] = React.useState(sessionFilterProps.chainType || 0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingActivity, setLoadingActivity] = React.useState(false);
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));

  const [loadNext, setLoadNext] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(30);

  const fetchMoreData = () => {
    if(!loadNext){
      setLoadNext(true)
      setPage(page+1)
    }
  }
  const handleDispInLaptopSize = ()=>{
    const sessionDispMode = sessionStorage.getItem("disp-mode")
    if(sessionDispMode!==null)
      return
    const hypotenuse = Math.sqrt(window.innerWidth**2 + window.innerHeight**2)
    const hypotenuseInch = hypotenuse / 96
    let tempDefaultDispMode = defaultDispMode
    if(hypotenuseInch>12 && hypotenuseInch<16)
      tempDefaultDispMode = 1
    if(dispmode!==tempDefaultDispMode)
      setDispmode(tempDefaultDispMode)
  }
  window.addEventListener('resize', handleDispInLaptopSize);
  
  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  }

  React.useEffect(() => {
    handleDispInLaptopSize()
    setAllTokenPrice(setCoinPriceByType)
  }, [])
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);
    let statusFilter = btnGroup.status.filter((name, index)=>selectedBtns.indexOf(index)>=0)
    statusFilter = (statusFilter.length===btnGroup.status.length || statusFilter.length===0)?'All':statusFilter.join(",")
    setLoadingActivity(true);

    // if(!loadNext)
    //   setActivity([])
    // fetchFrom(`api/v2/sticker/getDetailedCollectibles?`+
    //   `status=${statusFilter}&`+
    //   `period=${period}&`+
    //   `pageNum=${page}&`+
    //   `pageSize=${showCount}`, { signal })
    //   .then(response => {
    //     response.json().then(jsonAssets => {
    //       if(jsonAssets.data){
    //         setTotalCount(jsonAssets.data.total)
    //         setPages(Math.ceil(jsonAssets.data.total/showCount));
    //         if(loadNext)
    //           setActivity([...activities, ...jsonAssets.data.result]);
    //         else {
    //           setActivity(jsonAssets.data.result);
    //           // window.scrollTo(0,0)
    //         }
    //       }
    //       setAlreadyMounted(false)
    //       setLoadNext(false)
    //       setLoadingActivity(false)
    //     })
    //   }).catch(e => {
    //     setLoadingActivity(false);
    //   });
    sessionStorage.setItem("activity-filter-props", JSON.stringify({selectedBtns}))
    setFilterForm({selectedBtns})
  }, [page, showCount, selectedBtns, params.key]);
  
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
  const handleBtnsMobile = (num)=>{
    handleFilterMobile('eventype', num)
  }
  const setSelectedByValue = (value, btnId)=>{
    setSelectedBtns((prevState) => {
      const tempBtns = [...prevState]
      if(value){
        if(!tempBtns.includes(btnId)) {
          tempBtns.push(btnId)
          return tempBtns
        }
      } else if(tempBtns.includes(btnId)){
        const findIndex = tempBtns.indexOf(btnId)
        tempBtns.splice(findIndex, 1)
        return tempBtns
      }
      return tempBtns
    })
  }

  const handleFilter = (key, value)=>{
    setPage(1)
    switch(key){
      case 'eventype':
        handleBtns(value)
        break
      case 'selectedBtns':
        setSelectedBtns(value)
        break
      default:
        break
    }
  }
  const handleFilterMobile = (key, value)=>{
    const tempForm = {...filterForm}
    const tempBtns = [...filterForm.selectedBtns]
    tempForm[key] = value
    if(key==='clear_all'){
      tempForm.selectedBtns = []
      tempForm.range = emptyRange
      tempForm.adult = false
      setFilterForm(tempForm)
      return
    }
    if(key==='eventype'){
      if(tempBtns.includes(value)){
        const findIndex = tempBtns.indexOf(value)
        tempBtns.splice(findIndex, 1)
      }
      else
        tempBtns.push(value)
    }
    tempForm.selectedBtns = tempBtns
    setFilterForm(tempForm)
  }
  const applyFilterForm = (e)=>{
    const tempForm = {...filterForm}
    delete tempForm.statype
    delete tempForm.clear_all
    Object.keys(tempForm).forEach(key => handleFilter(key, tempForm[key]))
    setFilterForm(tempForm)
    closeFilter(e)
  }
  const handleClearAll = ()=>{
    setSelectedBtns([])
  }
  const link2Detail = (tokenId, baseToken)=>{
    navigate(`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`);
  }
  const closeFilter = (e)=>{
    setFilterView(!isFilterView&&1)
  }
  const loadingSkeletons = Array(10).fill(null)
  return (
    <ScrollManager scrollKey="asset-list-key" isAlreadyMounted={isAlreadyMounted}>
      {({ connectScrollTarget, ...props }) => 
        <RootStyle title="Activity | PASAR">
          <Stack direction="row">
            <Container maxWidth={false}>
              <AppBarStyle sx={{ boxShadow: 0, bgcolor: 'transparent', top: isOffset?APP_BAR_MOBILE:APP_BAR_DESKTOP, zIndex: 1099 }}>
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
                          selectedBtns.map((nameId, index)=>{
                            const buttonName = [...btnGroup.status][nameId]
                            return <Button
                              key={index}
                              variant="outlined"
                              color="origin"
                              endIcon={<CloseIcon />}
                              onClick={()=>{handleBtns(nameId)}}
                            >
                              {buttonName}
                            </Button>
                          })
                        }
                        {
                          selectedBtns.length>0&&
                          <Button
                            color="inherit"
                            onClick={handleClearAll}
                          >
                            Clear All
                          </Button>
                        }
                      </Stack>
                    </Box>
                    <Box sx={{display: 'flex'}}>
                      <ActivityPeriodSelect selected={period} onChange={setPeriod}/>
                    </Box>
                  </Stack>
                </ToolbarStyle>
                {/* {isOffset && <ToolbarShadowStyle />} */}
              </AppBarStyle>
              {/* {isLoadingActivity && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>} */}
              <Box sx={{ display: 'flex' }}>
                <Box
                  component="nav"
                  sx={{ width: drawerWidth*isFilterView, flexShrink: 0, display: {xs: 'none', sm: 'none', md: 'block'}, transition: 'width ease .5s' }}
                  aria-label="mailbox folders"
                >
                  <ActivityFilterPan 
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
                    filterProps = {{selectedBtns}}
                    {...{btnGroup, handleFilter}}
                  />
                </Box>
                <Box
                  component="main"
                  sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth*isFilterView}px)` }, m: '-10px' }}
                >
                  <MHidden width="mdUp">
                    <Box sx={{display: 'flex', p: '10px', pb: 1}}>
                      <ActivityPeriodSelect selected={period} onChange={setPeriod}/>
                    </Box>
                  </MHidden>
                  <InfiniteScroll
                    dataLength={activities.length}
                    next={fetchMoreData}
                    hasMore={page<pages}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      !isLoadingActivity&&!activities.length&&<Typography variant="h4" align='center'>No matching activity found!</Typography>
                    }
                    style={{padding: '10px'}}
                  >
                    <TableContainer sx={{ minWidth: 800, maxHeight: 400 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            {COLUMNS.map((column) => (
                              <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {
                            activities.map((trans, _i) => (
                              <TableRow hover tabIndex={-1} key={_i}>
                                {COLUMNS.map((column) => {
                                  let cellcontent = ''
                                  switch(column.id) {
                                    case "event": {
                                      let methodItem = MethodList.find((item)=>item.method===trans.event)
                                      if(!methodItem)
                                          methodItem = {color: 'grey', icon: 'tag', detail: []}
                                      // const explorerSrvUrl = getExplorerSrvByNetwork(trans.marketPlace)
                                      // const tempChainType = chainTypes[trans.marketPlace-1]
                                      // let feeTokenName = 'ELA'
                                      // if(tempChainType)
                                      //     feeTokenName = tempChainType.token
                                      cellcontent = 
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                          <Box
                                            component="img"
                                            alt=""
                                            src={`/static/${methodItem.icon}.svg`}
                                            sx={{ width: 50, height: 50, borderRadius: 1, cursor: 'pointer', background: methodItem.color, p: 2 }}
                                          />
                                          <Typography variant="subtitle2">{trans.event}</Typography>
                                        </Stack>
                                    }
                                      break;
                                    case "image":
                                      cellcontent = 
                                        <Stack direction="row" spacing={2}>
                                          <Box sx={{width: 50, height: 50}}>
                                            <TabletImgBox {...trans}/>
                                          </Box>
                                          <Stack flexGrow={1} textAlign="left">
                                            <Typography variant="body2" color="text.secondary">{trans.collection}</Typography>
                                            <Typography variant="subtitle2">{trans.name}</Typography>
                                          </Stack>
                                        </Stack>
                                      break;
                                    case "price": {
                                      const priceVal = trans.price ? math.round(trans.price/1e18, 3) : 0
                                      const coinType = getCoinTypeFromToken(trans)
                                      const coinUSD = coinPrice[coinType.index]
                                      cellcontent = 
                                        <Stack flexGrow={1}>
                                          <Stack direction='row' spacing={1}>
                                            <Box component="img" src={`/static/${coinType.icon}`} sx={{ width: 20, m: 'auto', display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&coinType.index===0?'invert(1)':'none' }} />
                                            <Typography variant="subtitle1" color="origin.main" flexGrow={1} textAlign="left">{priceVal}</Typography>
                                          </Stack>
                                          <Typography variant="caption" sx={{color: 'text.secondary', display: 'inline-flex', alignItems: 'end'}}>≈ USD {math.round(coinUSD * priceVal, 2)}</Typography>
                                        </Stack>
                                    }
                                      break;
                                    default:
                                      break;
                                  }
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      {cellcontent}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </InfiniteScroll>
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
                {
                  filterForm.selectedBtns&&filterForm.selectedBtns.length>0&&
                  <FilterBtnBadgeStyle>{filterForm.selectedBtns.length}</FilterBtnBadgeStyle>
                }
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
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: (theme) => theme.customShadows.z24,
                  transition: (theme) => theme.transitions.create('width'),
                  ...(!isFilterView && { width: 'calc(100vw - 24px)' })
                }}
              >
                {
                  filterForm.selectedBtns&&filterForm.selectedBtns.length>0&&
                  <>
                    <Box sx={{ pt: 2, pb: 1, pr: 1, pl: 2.5 }}>
                      {
                        filterForm.selectedBtns.map((nameId, index)=>{
                          const buttonName = [...btnGroup.status][nameId]
                          return <Button
                            key={index}
                            variant="outlined"
                            color="origin"
                            endIcon={<CloseIcon />}
                            onClick={()=>{handleBtnsMobile(nameId)}}
                            sx={{mr: 1, mb: 1}}
                          >
                            {buttonName}
                          </Button>
                        })
                      }
                      <Button
                        color="inherit"
                        onClick={()=>{handleFilterMobile('clear_all', null)}}
                        sx={{mb: 1}}
                      >
                        Clear All
                      </Button>
                    </Box>
                    <Divider />
                  </>
                }
                <Box style={{height: '100%'}}>
                  <Scrollbar>
                    <ActivityFilterPan 
                      sx={{
                      }}
                      filterProps = {filterForm}
                      handleFilter = {handleFilterMobile}
                      {...{btnGroup}}
                    />
                  </Scrollbar>
                </Box>
                <Divider />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                  <Typography variant="subtitle1">Filters</Typography>
                  <Button
                    endIcon={<CheckIcon/>}
                    onClick={applyFilterForm}
                    color='inherit'
                  >
                    Done
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </MHidden>
        </RootStyle>
      }
    </ScrollManager>
  );
}
