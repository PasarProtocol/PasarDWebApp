// material
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import { isMobile } from 'react-device-detect';
import { Container, Stack, Typography, AppBar, Toolbar, Paper, Divider, Backdrop, 
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
import AssetSortSelect from '../../components/AssetSortSelect';
import AssetFilterPan from '../../components/marketplace/AssetFilterPan';
import AssetGrid from '../../components/marketplace/AssetGrid';
import Scrollbar from '../../components/Scrollbar';
import ScrollManager from '../../components/ScrollManager'
import useOffSetTop from '../../hooks/useOffSetTop';
import useSignin from '../../hooks/useSignin';
import { fetchFrom } from '../../utils/common';

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
export default function MarketExplorer() {
  const sessionDispMode = sessionStorage.getItem("disp-mode")
  const sessionFilterProps = JSON.parse(sessionStorage.getItem("filter-props")) || {}
  const params = useParams(); // params.key
  const drawerWidth = 360;
  const btnGroup = {
    status: ["Buy Now", "On Auction", "Not Met", "Has Bids", "Has Ended"],
    type: ["General", "Avatar"],
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
  const [assets, setAssets] = React.useState([]);
  const [selectedCollections, setSelectedCollections] = React.useState(sessionFilterProps.selectedCollections || []);
  const [selectedTokens, setSelectedTokens] = React.useState(sessionFilterProps.selectedTokens || []);
  const [selectedBtns, setSelectedBtns] = React.useState(sessionFilterProps.selectedBtns || []);
  const [range, setRange] = React.useState(sessionFilterProps.range || {min:'', max:''});
  const [adult, setAdult] = React.useState(sessionFilterProps.adult || false);
  const [isAlreadyMounted, setAlreadyMounted] = React.useState(true);
  const [dispmode, setDispmode] = React.useState(sessionDispMode!==null?parseInt(sessionDispMode, 10):defaultDispMode);
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    selectedCollections: sessionFilterProps.selectedCollections || [],
    selectedTokens: sessionFilterProps.selectedTokens || [],
    range: sessionFilterProps.range || {min:'', max:''},
    ...sessionFilterProps
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [order, setOrder] = React.useState(sessionFilterProps.order || 0);
  const [chainType, setChainType] = React.useState(sessionFilterProps.chainType || 0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);

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
  React.useEffect(() => {
    handleDispInLaptopSize()
  }, [])
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);
    let statusFilter = btnGroup.status.filter((name, index)=>selectedBtns.indexOf(index)>=0)
    statusFilter = (statusFilter.length===btnGroup.status.length || statusFilter.length===0)?'All':statusFilter.join(",")
    let itemTypeFilter = btnGroup.type.filter((name, index)=>selectedBtns.indexOf(index+btnGroup.status.length)>=0)
    itemTypeFilter = (itemTypeFilter.length===btnGroup.type.length || itemTypeFilter.length===0)?'All':itemTypeFilter[0].toLowerCase()
    if(itemTypeFilter==='general')
      itemTypeFilter = itemTypeFilter.concat(',image')
    setLoadingAssets(true);
    let collectionTypeStr = ''
    let chainTypeForCollection = 0
    selectedCollections.forEach((collectionAddr, _i)=>{
      collectionTypeStr = collectionTypeStr.concat(collectionTypeStr.length?',':'', collectionAddr.substr(2))
      if(chainTypeForCollection !== collectionAddr.charAt(0)*1 && chainTypeForCollection < 3)
      chainTypeForCollection += collectionAddr.charAt(0)*1
    })
    chainTypeForCollection %= 3

    let tokenTypeStr = ''
    let chainTypeForToken = 0
    selectedTokens.forEach((tokenAddr, _i)=>{
      tokenTypeStr = tokenTypeStr.concat(tokenTypeStr.length?',':'', tokenAddr.substr(2))
      if(chainTypeForToken !== tokenAddr.charAt(0)*1 && chainTypeForToken < 3)
        chainTypeForToken += tokenAddr.charAt(0)*1
    })
    chainTypeForToken %= 3
    console.log(chainTypeForToken, tokenTypeStr)
    // const tokenTypeStr = selectedTokens.map(tokenAddr=>tokenAddr.substr(2)).join(',')
    // const chainTypeForToken = selectedTokens.map(tokenAddr=>tokenAddr.charAt(0)*1).join(',')
    if(!loadNext)
      setAssets([])
    fetchFrom(`api/v2/sticker/getDetailedCollectibles?`+
      `collectionType=${collectionTypeStr}&`+
      `tokenType=${tokenTypeStr}&`+
      `status=${statusFilter}&`+
      `itemType=${itemTypeFilter}&`+
      `adult=${adult}&`+
      `minPrice=${range.min!==''?range.min*1e18:''}&`+
      `maxPrice=${range.max!==''?range.max*1e18:''}&`+
      `order=${order}&`+
      `marketPlace=${chainTypeForCollection || chainTypeForToken || chainType}&`+
      `keyword=${params.key?params.key:''}&`+
      `pageNum=${page}&`+
      `pageSize=${showCount}`, { signal })
      .then(response => {
        response.json().then(jsonAssets => {
          if(jsonAssets.data){
            setTotalCount(jsonAssets.data.total)
            setPages(Math.ceil(jsonAssets.data.total/showCount));
            if(loadNext)
              setAssets([...assets, ...jsonAssets.data.result]);
            else {
              setAssets(jsonAssets.data.result);
              // window.scrollTo(0,0)
            }
          }
          setAlreadyMounted(false)
          setLoadNext(false)
          setLoadingAssets(false)
        })
      }).catch(e => {
        if(e.code !== e.ABORT_ERR)
          setLoadingAssets(false);
      });
    sessionStorage.setItem("filter-props", JSON.stringify({selectedBtns, range, selectedCollections, selectedTokens, adult, order, chainType}))
    setFilterForm({selectedBtns, range, selectedCollections, selectedTokens, adult, order, chainType})
  }, [page, showCount, selectedBtns, selectedCollections, selectedTokens, adult, range, order, chainType, params.key]);
  
  const handleDispmode = (event, mode) => {
    if(mode===null)
      return
    sessionStorage.setItem('disp-mode', mode);
    setDispmode(mode)
  };
  const handleBtns = (num)=>{
    if(num === rangeBtnId){
      handleFilter('range', emptyRange)
      return
    }
    if(num === adultBtnId){
      handleFilter('adult', false)
      return
    }
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
    if(num === rangeBtnId)
      handleFilterMobile('range', emptyRange)
    else if(num === adultBtnId)
      handleFilterMobile('adult', false)
    else handleFilterMobile('statype', num)
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
  const handleSelectedCollections = (value)=>{
    setSelectedCollections((prevState) => {
      const tempCollections = [...prevState]
      if(!tempCollections.includes(value)){
        tempCollections.push(value)
      } else {
        const findIndex = tempCollections.indexOf(value)
        tempCollections.splice(findIndex, 1)
      }
      return tempCollections
    })
  }
  const handleSelectedTokens = (value)=>{
    setSelectedTokens((prevState) => {
      const tempTokens = [...prevState]
      if(!tempTokens.includes(value)){
        tempTokens.push(value)
      } else {
        const findIndex = tempTokens.indexOf(value)
        tempTokens.splice(findIndex, 1)
      }
      return tempTokens
    })
  }

  const handleFilter = (key, value)=>{
    setPage(1)
    switch(key){
      case 'statype':
        handleBtns(value)
        break
      case 'selectedBtns':
        setSelectedBtns(value)
        break
      case 'range':
        setSelectedByValue(value.min || value.max, rangeBtnId)
        setRange(value)
        break
      case 'collection':
        handleSelectedCollections(value)
        break
      case 'token':
        handleSelectedTokens(value)
        break
      case 'selectedCollections':
        setSelectedCollections(value)
        break
      case 'selectedTokens':
        setSelectedTokens(value)
        break
      case 'adult':
        setSelectedByValue(value, adultBtnId)
        setAdult(value)
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
    if(key==='statype'){
      if(tempBtns.includes(value)){
        const findIndex = tempBtns.indexOf(value)
        tempBtns.splice(findIndex, 1)
      }
      else
        tempBtns.push(value)
    }
    else if(key==='range'){
      if(value.min || value.max){
        if(!tempBtns.includes(rangeBtnId))
          tempBtns.push(rangeBtnId)
      } else if(tempBtns.includes(rangeBtnId)){
        const findIndex = tempBtns.indexOf(rangeBtnId)
        tempBtns.splice(findIndex, 1)
      }
    }
    else if(key==='collection'){
      if(!tempForm.selectedCollections.includes(value)){
        tempForm.selectedCollections.push(value)
      } else {
        const findIndex = tempForm.selectedCollections.indexOf(value)
        tempForm.selectedCollections.splice(findIndex, 1)
      }
    }
    else if(key==='token'){
      if(!tempForm.selectedTokens.includes(value)){
        tempForm.selectedTokens.push(value)
      } else {
        const findIndex = tempForm.selectedTokens.indexOf(value)
        tempForm.selectedTokens.splice(findIndex, 1)
      }
    }
    else if(key==='adult'){
      if(value){
        if(!tempBtns.includes(adultBtnId))
          tempBtns.push(adultBtnId)
      } else if(tempBtns.includes(adultBtnId)){
        const findIndex = tempBtns.indexOf(adultBtnId)
        tempBtns.splice(findIndex, 1)
      }
    }
    tempForm.selectedBtns = tempBtns
    setFilterForm(tempForm)
  }
  const applyFilterForm = (e)=>{
    const tempForm = {...filterForm}
    delete tempForm.statype
    delete tempForm.clear_all
    delete tempForm.collection
    delete tempForm.token
    Object.keys(tempForm).forEach(key => handleFilter(key, tempForm[key]))
    setFilterForm(tempForm)
    closeFilter(e)
  }
  const handleClearAll = ()=>{
    setSelectedBtns([])
    setRange(emptyRange)
    setAdult(false)
  }
  const handleChangeChainType = (type)=>{
    setChainType(type)
    setSelectedCollections([])
    setSelectedTokens([])
  }
  const link2Detail = (tokenId, baseToken)=>{
    navigate(`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`);
  }
  const closeFilter = (e)=>{
    setFilterView(!isFilterView&&1)
  }
  const loadingSkeletons = Array(25).fill(null)
  return (
    <ScrollManager scrollKey="asset-list-key" isAlreadyMounted={isAlreadyMounted}>
      {({ connectScrollTarget, ...props }) => 
        <RootStyle title="Marketplace | PASAR">
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
                            let buttonName = [...btnGroup.status, ...btnGroup.type][nameId]
                            if(nameId === rangeBtnId){
                              buttonName = `${range.min || 0} to ${range.max === ''?'inf':range.max} ELA`
                            }
                            else if(nameId === adultBtnId){
                              buttonName = `Explicit & Sensitive`
                            }
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
                      <AssetSortSelect selected={order} onChange={setOrder}/>
                      <ChainSelect selected={chainType} onChange={handleChangeChainType}/>
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
                {/* {isOffset && <ToolbarShadowStyle />} */}
              </AppBarStyle>
              {/* {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>} */}
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
                    filterProps = {{selectedBtns, selectedCollections, selectedTokens, range, adult, order, chainType}}
                    {...{btnGroup, handleFilter}}
                  />
                </Box>
                <Box
                  component="main"
                  sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth*isFilterView}px)` }, m: '-10px' }}
                >
                  <MHidden width="mdUp">
                    <Box sx={{display: 'flex', p: '10px', pb: 1}}>
                      <AssetSortSelect selected={order} onChange={setOrder} sx={{flex: 1}}/>
                      <MHidden width="smDown">
                        <ChainSelect selected={chainType} onChange={handleChangeChainType}/>
                      </MHidden>
                      <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                        <ToggleButton value={0}>
                          <SquareIcon />
                        </ToggleButton>
                        <ToggleButton value={1}>
                          <GridViewSharpIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                    <MHidden width="smUp">
                      <Box sx={{px: '10px'}}>
                        <ChainSelect selected={chainType} onChange={handleChangeChainType} sx={{width: '100%'}}/>
                      </Box>
                    </MHidden>
                  </MHidden>
                  <InfiniteScroll
                    dataLength={assets.length}
                    next={fetchMoreData}
                    hasMore={page<pages}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      !isLoadingAssets&&!assets.length&&<Typography variant="h4" align='center'>No matching collectible found!</Typography>
                    }
                    style={{padding: '10px'}}
                  >
                    <AssetGrid {...{assets: isLoadingAssets ? [...assets, ...loadingSkeletons] : assets, dispmode}}/>
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
                          let buttonName = [...btnGroup.status, ...btnGroup.type][nameId]
                          if(nameId === rangeBtnId){
                            buttonName = `${filterForm.range.min || 0} to ${filterForm.range.max === ''?'inf':filterForm.range.max} ELA`
                          }
                          else if(nameId === adultBtnId){
                            buttonName = `Explicit & Sensitive`
                          }
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
                <Box style={{display: 'contents'}}>
                  <Scrollbar>
                    <AssetFilterPan 
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
