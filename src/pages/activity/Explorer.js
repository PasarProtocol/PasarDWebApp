import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
import KYCBadge from '../../components/badge/KYCBadge';
import ActivityPeriodSelect from '../../components/ActivityPeriodSelect';
import ActivityFilterPan from '../../components/activity/ActivityFilterPan';
import TabletImgBox from '../../components/activity/TabletImgBox'
import ActivitySkeleton from '../../components/activity/ActivitySkeleton'
import ActivityAccordion from '../../components/activity/ActivityAccordion'
import ActivityTableRow from '../../components/activity/ActivityTableRow'
import AssetGrid from '../../components/marketplace/AssetGrid';
import Scrollbar from '../../components/Scrollbar';
import ScrollManager from '../../components/ScrollManager'
import { queryName, queryKycMe } from '../../components/signin-dlg/HiveAPI'
import useOffSetTop from '../../hooks/useOffSetTop';
import useSignin from '../../hooks/useSignin';

import { fetchFrom, setAllTokenPrice, getTotalCountOfCoinTypes, getDidInfoFromAddress } from '../../utils/common';

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
  { id: 'type', label: 'Type', minWidth: 170, align: 'center' },
  { id: 'image', label: 'Item', minWidth: 170, align: 'center' },
  { id: 'price', label: 'Price', minWidth: 170 },
  { id: 'buyerAddr', label: 'From', minWidth: 170, align: 'center' },
  { id: 'sellerAddr', label: 'To', minWidth: 170, align: 'center' },
  { id: 'marketTime', label: 'Time', minWidth: 170, align: 'center' },
];
const EventNames = { "BuyOrder": "Sale", "CreateOrderForSale": "Listed", "Mint": "Minted" }
const btnGroup = { 
  status: ["Sale", "Listed", "Minted"],
}
export default function ActivityExplorer() {
  const sessionDispMode = sessionStorage.getItem("disp-mode")
  const sessionFilterProps = JSON.parse(sessionStorage.getItem("activity-filter-props")) || {}
  // const params = useParams(); // params.key
  const location = useLocation();
  const { type='' } = location.state || {}
  const btnFilterByParam = []
  const btnId = btnGroup.status.indexOf(type)
  if(btnId>=0) {
    btnFilterByParam.push(btnId)
  }
  const drawerWidth = 360;
  const { openTopAlert } = useSignin()
  const APP_BAR_MOBILE = 72+(openTopAlert?50:0);
  const APP_BAR_DESKTOP = 88+(openTopAlert?50:0);
  const rangeBtnId = 10
  const adultBtnId = 11
  const emptyRange = {min: '', max: ''}
  const defaultDispMode = isMobile?1:0
  const isOffset = useOffSetTop(20);
  const navigate = useNavigate();
  const [activities, setActivity] = React.useState([]);
  const [infoByAddress, setInfoByAddress] = React.useState({});
  const [addressGroup, setAddressByGroup] = React.useState([]);
  const [selectedBtns, setSelectedBtns] = React.useState([...new Set([...(sessionFilterProps.selectedBtns || []), ...btnFilterByParam])]);
  const [dispmode, setDispmode] = React.useState(sessionDispMode!==null?parseInt(sessionDispMode, 10):defaultDispMode);
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    ...sessionFilterProps
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [period, setPeriod] = React.useState(4);
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

  React.useEffect(() => {
    addressGroup.forEach((addr) => {
      if(!infoByAddress[addr]) {
        getDidInfoFromAddress(addr)
          .then((info) => {
            if(info.name){
              setInfoByAddress((prevState) => {
                const tempInfo = {...prevState};
                tempInfo[addr] = {name: info.name};
                return tempInfo;
              })
              if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2')
                fetchProfileData(info.did, addr)
            }
          })
          .catch((e) => {})
      }
    })
  }, [addressGroup])

  const fetchProfileData = (targetDid, address)=>{
    queryName(targetDid)
      .then((res)=>{
        if(res.find_message && res.find_message.items.length) {
          const displayName = res.find_message.items[0].display_name
          setInfoByAddress((prevState) => {
            const tempInfo = {...prevState};
            tempInfo[address] = {name: displayName};
            return tempInfo;
          })
        }
        queryKycMe(targetDid).then((res)=>{
          if(res.find_message && res.find_message.items.length){
            setInfoByAddress((prevState) => {
              const tempInfo = {...prevState};
              tempInfo[address].kyc = true;
              return tempInfo;
            })
          }
        })
      })
      .catch(e=>{})
  }

  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);
    let statusFilter = btnGroup.status.filter((name, index)=>selectedBtns.indexOf(index)>=0)
    statusFilter = ((statusFilter.length===0)?btnGroup.status.join(","):statusFilter.join(",")).toLowerCase()
    setLoadingActivity(true);

    if(!loadNext)
      setActivity([])
    fetchFrom(`api/v2/sticker/listnft?`+
      `event=${statusFilter}&`+
      `duration=${period}&`+
      `pageNumStr=${page}&`+
      `pageSizeStr=${showCount}`, { signal })
      .then(response => {
        response.json().then(jsonAssets => {
          if(jsonAssets.data){
            setTotalCount(jsonAssets.data.total)
            setPages(Math.ceil(jsonAssets.data.total/showCount));
            if(loadNext)
              setActivity([...activities, ...jsonAssets.data.data]);
            else {
              setActivity(jsonAssets.data.data);
              // window.scrollTo(0,0)
            }
            const tempAddressGroup = [...addressGroup]
            jsonAssets.data.data.forEach(trans => {
              tempAddressGroup.push(trans.buyerAddr)
              tempAddressGroup.push(trans.sellerAddr)
            });
            const uniqueAddresses = [...new Set(tempAddressGroup)];
            setAddressByGroup(uniqueAddresses)
          }
          setLoadNext(false)
          setLoadingActivity(false)
        })
      }).catch(e => {
        setLoadingActivity(false);
      });
    sessionStorage.setItem("activity-filter-props", JSON.stringify({selectedBtns}))
    setFilterForm({selectedBtns})
  }, [page, showCount, selectedBtns, period]);
  
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
              sx={{ flexGrow: 1, width: { xs: '100%', md: `calc(100% - ${drawerWidth*isFilterView}px)` }, m: '-10px' }}
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
                  !isLoadingActivity&&!activities.length&&<Typography variant="h4" align='center' mt={4}>No matching activity found!</Typography>
                }
                style={{padding: '10px'}}
              >
                <MHidden width="mdDown">
                  <TableContainer>
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
                          React.useMemo(() => (
                            activities.map((trans, _i) => (
                              <ActivityTableRow trans={trans} coinPrice={coinPrice} infoByAddress={infoByAddress} COLUMNS={COLUMNS} key={_i}/>
                            ))
                          ), [activities, coinPrice, infoByAddress])
                        }
                        {
                          isLoadingActivity &&
                          loadingSkeletons.map((_, _i)=><ActivitySkeleton key={_i}/>)
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MHidden>
                <MHidden width="mdUp">
                  {
                    React.useMemo(() => (
                      activities.map((trans, _i) => (
                        <ActivityAccordion trans={trans} coinPrice={coinPrice} infoByAddress={infoByAddress} key={_i}/>
                      ))
                    ), [activities, coinPrice, infoByAddress])
                  }
                  {
                    isLoadingActivity &&
                    loadingSkeletons.map((_, _i)=><ActivitySkeleton isMobile={Boolean(true)} key={_i}/>)
                  }
                </MHidden>
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
  );
}
