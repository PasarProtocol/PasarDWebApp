// material
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import { isMobile } from 'react-device-detect';
import { Container, Stack, Typography, AppBar, Toolbar, Paper, Divider, Backdrop, Tooltip,
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
import AssetSortSelect from '../../components/AssetSortSelect';
import useOffSetTop from '../../hooks/useOffSetTop';
import CollectionFilterPan from '../../components/collection/CollectionFilterPan';
import AssetGrid from '../../components/marketplace/AssetGrid';
import Scrollbar from '../../components/Scrollbar';
import ScrollManager from '../../components/ScrollManager'
import RingAvatar from '../../components/RingAvatar';
import AddressCopyButton from '../../components/AddressCopyButton';
import StatisticPanel from '../../components/collection/StatisticPanel'
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup'
import Badge from '../../components/Badge';
import DIABadge from '../../components/DIABadge';
import { fetchFrom, getIpfsUrl, reduceHexAddress, getDidInfoFromAddress } from '../../utils/common';

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
export default function CollectionDetail() {
  const sessionDispMode = sessionStorage.getItem("disp-mode")
  const sessionFilterProps = JSON.parse(sessionStorage.getItem("filter-props-other")) || {}
  const params = useParams(); // params.key
  const drawerWidth = 360;
  const btnGroup = {
    status: ["Buy Now", "On Auction", "Not Met", "Has Bids", "Has Ended"],
    type: ["General", "Avatar"],
  }
  const rangeBtnId = 10
  const adultBtnId = 11
  const emptyRange = {min: '', max: ''}
  const defaultDispMode = isMobile?1:0

  const isOffset = useOffSetTop(20);
  const navigate = useNavigate();
  let description = ''
  let avatar = ''
  let socials = {}

  const [isLoadingCollection, setLoadingCollection] = React.useState(true);
  const [collection, setCollection] = React.useState({});
  const [metaObj, setMetaObj] = React.useState({});
  const [didName, setDidName] = React.useState('');
  const [assets, setAssets] = React.useState([]);
  const [selectedTokens, setSelectedTokens] = React.useState(sessionFilterProps.selectedTokens || []);
  const [selectedBtns, setSelectedBtns] = React.useState(sessionFilterProps.selectedBtns || []);
  const [selectedAttributes, setSelectedAttributes] = React.useState(sessionFilterProps.selectedAttributes || {});
  const [range, setRange] = React.useState(sessionFilterProps.range || {min:'', max:''});
  const [adult, setAdult] = React.useState(sessionFilterProps.adult || false);
  const [isAlreadyMounted, setAlreadyMounted] = React.useState(true);
  const [dispmode, setDispmode] = React.useState(sessionDispMode!==null?parseInt(sessionDispMode, 10):defaultDispMode);
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    selectedAttributes: sessionFilterProps.selectedAttributes || [],
    selectedTokens: sessionFilterProps.selectedTokens || [],
    range: sessionFilterProps.range || {min:'', max:''},
    ...sessionFilterProps
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [order, setOrder] = React.useState(sessionFilterProps.order || 0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);

  const [loadNext, setLoadNext] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(30);
  const [badge, setBadge] = React.useState({dia: 0, kyc: false});

  const fetchMoreData = () => {
    if(!loadNext){
      setLoadNext(true)
      setPage(page+1)
    }
  }
  
  React.useEffect(async () => {
    setLoadingCollection(true);
    fetchFrom(`api/v2/sticker/getCollection/${params.collection}`)
      .then((response) => {
        response.json().then((jsonAssets) => {
          setCollection(jsonAssets.data);
          getDidInfoFromAddress(jsonAssets.data.owner)
            .then((info) => {
              if(info.name)
                setDidName(info.name)
            })
            .catch((e) => {})
          
          const metaUri = getIpfsUrl(jsonAssets.data.uri)
          if(metaUri) {
            fetch(metaUri)
              .then(response => response.json())
              .then(data => {
                setMetaObj(data)
              });
          }
          setLoadingCollection(false);
        }).catch((e) => {
          setLoadingCollection(false);
        });
      })
      .catch((e) => {
        if (e.code !== e.ABORT_ERR) setLoadingCollection(false);
      });
  }, [params.collection]);
  
  if(metaObj.data) {
    avatar = getIpfsUrl(metaObj.data.avatar)
    description = metaObj.data.description
    socials = metaObj.data.socials
  }

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

    const bodyParams = {
      baseToken: params.collection,
      attribute: Object.keys(selectedAttributes).length?selectedAttributes:"",
      status: statusFilter,
      itemType: itemTypeFilter,
      minPrice: range.min!==''?range.min*1e18:'',
      maxPrice: range.max!==''?range.max*1e18:'',
      order,
      keyword: params.key?params.key:'',
      pageNum: page,
      pageSize: showCount,
      tokenType: selectedTokens.join(',')
    }
    fetchFrom('api/v2/sticker/getDetailedCollectiblesInCollection', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyParams),
      signal
    })
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
      })
      .catch(e => {
        if(e.code !== e.ABORT_ERR)
          setLoadingAssets(false);
      });
    sessionStorage.setItem("filter-props-other", JSON.stringify({selectedBtns, selectedAttributes, range, selectedTokens, adult, order}))
    setFilterForm({selectedBtns, selectedAttributes, range, selectedTokens, adult, order})
  }, [page, showCount, selectedBtns, selectedAttributes, selectedTokens, adult, range, order, params.key, params.collection]);
  
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
  const handleSelectedAttributes = (value)=>{
    const {groupName, field} = value
    setSelectedAttributes((prevState) => {
      const tempAttributes = {...prevState}
      const tempSubGroup = tempAttributes[groupName]
      if(tempSubGroup){
        if(tempSubGroup.includes(field)){
          const findIndex = tempSubGroup.indexOf(field)
          tempSubGroup.splice(findIndex, 1)
          if(!tempSubGroup.length)
            delete tempAttributes[groupName]
        } else {
          tempSubGroup.push(field)
        }
      } else {
        tempAttributes[groupName] = [field]
      }
      return tempAttributes
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
      case 'attributes':
        handleSelectedAttributes(value)
        break
      case 'token':
        handleSelectedTokens(value)
        break
      case 'selectedTokens':
        setSelectedTokens(value)
        break
      case 'selectedAttributes':
        setSelectedAttributes(value)
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
    else if(key==='token'){
      if(!tempForm.selectedTokens.includes(value)){
        tempForm.selectedTokens.push(value)
      } else {
        const findIndex = tempForm.selectedTokens.indexOf(value)
        tempForm.selectedTokens.splice(findIndex, 1)
      }
    }
    else if(key==='attributes'){
      const {groupName, field} = value
      const tempSubGroup = tempForm.selectedAttributes[groupName]
      if(tempSubGroup){
        if(tempSubGroup.includes(field)){
          const findIndex = tempSubGroup.indexOf(field)
          tempSubGroup.splice(findIndex, 1)
          if(!tempSubGroup.length)
            delete tempForm.selectedAttributes[groupName]
        } else {
          tempSubGroup.push(field)
        }
      } else {
        tempForm.selectedAttributes[groupName] = [field]
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
    delete tempForm.attributes
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
  const link2Detail = (tokenId, baseToken)=>{
    navigate('/explorer/collectible/detail', {state: {tokenId, baseToken}});
  }
  const closeFilter = (e)=>{
    setFilterView(!isFilterView&&1)
  }
  const loadingSkeletons = Array(25).fill(null)
  return (
    // <ScrollManager scrollKey="collection-asset-key" isAlreadyMounted={isAlreadyMounted}>
    //   {({ connectScrollTarget, ...props }) => 
        <RootStyle title="CollectionDetail | PASAR">
          <Stack direction="row">
            <Container maxWidth={false}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: isMobile?1:1.5 }}>
                <RingAvatar
                  isImage={Boolean(true)}
                  size={isMobile ? 80 : 100}
                  avatar={avatar}
                />
              </Box>
              <Typography variant="h2" component="div" align="center" sx={{ maxWidth: 900, m: 'auto !important', lineHeight: 1.1, wordBreak: 'break-all' }}>
                {collection.name}
              </Typography>
              {
                !!didName&&
                <Typography variant="body2" component='div' align='center'>
                  by <Typography variant="body2" color='origin.main' sx={{ display: 'inline'}}>{didName}</Typography>
                </Typography>
              }
              <Stack spacing={2}>
                {
                  !!collection.owner && !!collection.token &&
                  <Stack direction="row" spacing={1} sx={{justifyContent: 'center', mt: 1}}>
                    <Tooltip title="Owner Address" arrow enterTouchDelay={0}>
                      <div>
                        <AddressCopyButton type='diamond' address={collection.owner}/>
                      </div>
                    </Tooltip>
                    <Tooltip title="Contract Address" arrow enterTouchDelay={0}>
                      <div>
                        <AddressCopyButton type='contract' address={collection.token}/>
                      </div>
                    </Tooltip>
                  </Stack>
                }
                <Box>
                  <StatisticPanel address={collection.token}/>
                </Box>
                <Typography variant="body2" component="div" align="center" color='text.secondary' sx={{ maxWidth: 900, m: 'auto !important', pt: 2, wordBreak: 'break-all' }}>
                  {description}
                </Typography>
                <IconLinkButtonGroup {...socials}/>
                <Stack sx={{justifyContent: 'center'}} spacing={1} direction="row">
                  {
                    badge.dia>0 && <DIABadge balance={badge.dia}/>
                  }
                  {
                    badge.kyc&&
                    <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                      <Box sx={{display: 'inline-flex'}}><Badge name="kyc"/></Box>
                    </Tooltip>
                  }
                </Stack>
                <MHidden width="smDown">
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
                            let buttonName = btnGroup.status[nameId]
                            if(nameId === rangeBtnId){
                              buttonName = `${range.min || 0} to ${range.max === ''?'inf':range.max} ELA`
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
                </MHidden>
                {/* {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>} */}
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{ width: drawerWidth*isFilterView, flexShrink: 0, display: {xs: 'none', sm: 'none', md: 'block'}, transition: 'width ease .5s', position: 'relative' }}
                    aria-label="mailbox folders"
                  >
                    <CollectionFilterPan 
                      sx={{
                        position: 'absolute',
                        width: drawerWidth,
                        left: drawerWidth*(isFilterView-1)-24,
                        transition: 'all ease .5s',
                        p: 1
                      }}
                      filterProps = {{selectedBtns, selectedTokens, selectedAttributes, range, adult, order}}
                      {...{btnGroup, handleFilter, address: params.collection}}
                    />
                  </Box>
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth*isFilterView}px)`, m: '-10px' } }}
                  >
                    <MHidden width="smUp">
                      <Box sx={{display: 'flex', p: '10px', pb: 1}}>
                        <AssetSortSelect selected={order} onChange={setOrder} sx={{flex: 1}}/>
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
                      {
                        !isLoadingAssets?
                        <AssetGrid assets={assets} dispmode={dispmode}/>:
                        <AssetGrid assets={loadNext?[...assets, ...loadingSkeletons]:loadingSkeletons} dispmode={dispmode}/>
                      }
                    </InfiniteScroll>
                  </Box>
                </Box>
              </Stack>
              
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
                          let buttonName = btnGroup.status[nameId]
                          if(nameId === rangeBtnId){
                            buttonName = `${filterForm.range.min || 0} to ${filterForm.range.max === ''?'inf':filterForm.range.max} ELA`
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
                    <CollectionFilterPan 
                      sx={{
                      }}
                      filterProps = {filterForm}
                      handleFilter = {handleFilterMobile}
                      {...{btnGroup, address: params.collection}}
                    />
                  </Scrollbar>
                </Box>
                <Divider />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                  <Typography variant="subtitle1">Filters</Typography>
                  <Button
                    endIcon={<CheckIcon/>}
                    onClick={applyFilterForm}
                  >
                    Done
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </MHidden>
        </RootStyle>
    //   }
    // </ScrollManager>
  );
}
