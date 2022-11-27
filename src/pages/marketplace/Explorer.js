// material
import React from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isMobile } from 'react-device-detect';
import {
  Container,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Divider,
  Backdrop,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha, styled } from '@mui/material/styles';
import AppsIcon from '@mui/icons-material/Apps';
import SquareIcon from '@mui/icons-material/Square';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import ChainSelect from '../../components/ChainSelect';
import AssetSortSelect from '../../components/AssetSortSelect';
import AssetFilterPan from '../../components/marketplace/AssetFilterPan';
import AssetGrid from '../../components/marketplace/AssetGrid';
import Scrollbar from '../../components/Scrollbar';
import ScrollManager from '../../components/ScrollManager';
import useOffSetTop from '../../hooks/useOffSetTop';
import useSignin from '../../hooks/useSignin';
import { chainTypes, fetchAPIFrom } from '../../utils/common';

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
  const sessionDispMode = sessionStorage.getItem('disp-mode');
  const sessionFilterProps = JSON.parse(sessionStorage.getItem('marketplace-filter-props')) || {};
  const params = useParams(); // params.key
  const drawerWidth = 360;
  const btnGroup = {
    status: ['Buy Now', 'On Auction', 'Not Met', 'Has Bids', 'Has Ended'],
    type: ['General', 'Avatar']
  };
  const chains = [{ token: 'all' }, ...chainTypes];
  const { openTopAlert } = useSignin();
  const APP_BAR_MOBILE = 72 + (openTopAlert ? 50 : 0);
  const APP_BAR_DESKTOP = 88 + (openTopAlert ? 50 : 0);
  const rangeBtnId = 10;
  const adultBtnId = 11;
  const emptyRange = { min: '', max: '' };
  const defaultDispMode = isMobile ? 1 : 0;
  const isOffset = useOffSetTop(20);

  const [assets, setAssets] = React.useState([]);
  const [selectedCollections, setSelectedCollections] = React.useState(sessionFilterProps.selectedCollections || []);
  const [selectedTokens, setSelectedTokens] = React.useState(sessionFilterProps.selectedTokens || []);
  const [selectedBtns, setSelectedBtns] = React.useState(sessionFilterProps.selectedBtns || []);
  const [range, setRange] = React.useState(sessionFilterProps.range || { min: '', max: '' });
  const [adult, setAdult] = React.useState(sessionFilterProps.adult || false);
  const [isAlreadyMounted, setAlreadyMounted] = React.useState(true);
  const [dispMode, setDispMode] = React.useState(
    sessionDispMode !== null ? parseInt(sessionDispMode, 10) : defaultDispMode
  );
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    selectedCollections: sessionFilterProps.selectedCollections || [],
    selectedTokens: sessionFilterProps.selectedTokens || [],
    range: sessionFilterProps.range || { min: '', max: '' },
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
  const [showCount] = React.useState(30);

  const fetchMoreData = () => {
    if (!loadNext) {
      setLoadNext(true);
      setPage(page + 1);
    }
  };

  const handleDispInLaptopSize = () => {
    const sessionDispMode = sessionStorage.getItem('disp-mode');
    if (sessionDispMode !== null) return;
    const hypotenuse = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const hypotenuseInch = hypotenuse / 96;
    let tempDefaultDispMode = defaultDispMode;
    if (hypotenuseInch > 12 && hypotenuseInch < 16) tempDefaultDispMode = 1;
    if (dispMode !== tempDefaultDispMode) setDispMode(tempDefaultDispMode);
  };
  window.addEventListener('resize', handleDispInLaptopSize);

  React.useEffect(() => {
    handleDispInLaptopSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);

      const itemTypes = btnGroup.type.filter((_, index) => selectedBtns.indexOf(index + btnGroup.status.length) >= 0);
      const type =
        itemTypes.length === btnGroup.type.length || itemTypes.length === 0 ? 'all' : itemTypes[0].toLowerCase();

      setLoadingAssets(true);
      const bodyParams = {
        pageNum: page,
        pageSize: showCount,
        chain: chains[chainType].token.toLowerCase(),
        status: selectedBtns.filter((el) => el >= 0 && el <= 4).sort(),
        sort: order,
        collection: selectedCollections.map((el) => `${el.chain}-${el.token}`),
        token: selectedTokens,
        type,
        adult,
        keyword: params?.key || ''
      };
      if (range.min !== '') bodyParams.minPrice = range.min * 1;
      if (range.max !== '') bodyParams.maxPrice = range.max * 1;
      if (!loadNext) setAssets([]);
      try {
        const res = await fetchAPIFrom('api/v1/marketplace', {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyParams),
          signal
        });
        const json = await res.json();
        const totalCnt = json.data.total ?? 0;
        setTotalCount(totalCnt);
        setPages(Math.ceil(totalCnt / showCount));
        if (loadNext) setAssets([...assets, ...(json?.data?.data || [])]);
        else setAssets(json?.data?.data || []);
        setAlreadyMounted(false);
        setLoadNext(false);
      } catch (e) {
        console.error(e);
      }
      setLoadingAssets(false);

      sessionStorage.setItem(
        'marketplace-filter-props',
        JSON.stringify({ selectedBtns, range, selectedCollections, selectedTokens, adult, order, chainType })
      );
      setFilterForm({ selectedBtns, range, selectedCollections, selectedTokens, adult, order, chainType });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showCount, selectedBtns, selectedCollections, selectedTokens, adult, range, order, chainType, params.key]);

  const changeDispMode = (event, mode) => {
    if (mode === null) return;
    sessionStorage.setItem('disp-mode', mode);
    setDispMode(mode);
  };

  const handleSingleFilterBtn = (btnId) => {
    if (btnId === rangeBtnId) {
      handleFilter('range', emptyRange);
      return;
    }
    if (btnId === adultBtnId) {
      handleFilter('adult', false);
      return;
    }
    const selBtns = [...selectedBtns];
    if (selBtns.includes(btnId)) {
      const findIndex = selBtns.indexOf(btnId);
      selBtns.splice(findIndex, 1);
    } else selBtns.push(btnId);
    setSelectedBtns(selBtns);
  };

  const clearAllFilterBtn = () => {
    setSelectedBtns([]);
    setRange(emptyRange);
    setAdult(false);
  };

  const setSelectedByValue = (value, btnId) => {
    setSelectedBtns((prevState) => {
      const selBtns = [...prevState];
      if (value) {
        if (!selBtns.includes(btnId)) {
          selBtns.push(btnId);
          return selBtns;
        }
      } else if (selBtns.includes(btnId)) {
        const findIndex = selBtns.indexOf(btnId);
        selBtns.splice(findIndex, 1);
        return selBtns;
      }
      return selBtns;
    });
  };

  const handleSingleMobileFilterBtn = (btnId) => {
    if (btnId === rangeBtnId) handleMobileFilter('range', emptyRange);
    else if (btnId === adultBtnId) handleMobileFilter('adult', false);
    else handleMobileFilter('statype', btnId);
  };

  const handleFilter = (key, value) => {
    setPage(1);
    switch (key) {
      case 'statype':
        handleSingleFilterBtn(value);
        break;
      case 'token':
        setSelectedTokens((prevState) => {
          const selTokens = [...prevState];
          if (!selTokens.includes(value)) {
            selTokens.push(value);
          } else {
            const findIndex = selTokens.indexOf(value);
            selTokens.splice(findIndex, 1);
          }
          return selTokens;
        });
        break;
      case 'range':
        setSelectedByValue(value.min || value.max, rangeBtnId);
        setRange(value);
        break;
      case 'collection':
        setSelectedCollections((prevState) => {
          const selCollections = [...prevState];
          const index = selCollections.findIndex((item) => item.key === value.key);
          if (index === -1) selCollections.push(value);
          else selCollections.splice(index, 1);
          return selCollections;
        });
        break;
      case 'selectedBtns':
        setSelectedBtns(value);
        break;
      case 'selectedTokens':
        setSelectedTokens(value);
        break;
      case 'selectedCollections':
        setSelectedCollections(value);
        break;
      case 'adult':
        setSelectedByValue(value, adultBtnId);
        setAdult(value);
        break;
      default:
        break;
    }
  };

  const handleMobileFilter = (key, value) => {
    const tempForm = { ...filterForm };
    const tempBtns = [...filterForm.selectedBtns];
    tempForm[key] = value;
    if (key === 'clear_all') {
      tempForm.selectedBtns = [];
      tempForm.range = emptyRange;
      tempForm.adult = false;
      setFilterForm(tempForm);
      return;
    }
    if (key === 'statype') {
      if (tempBtns.includes(value)) {
        const findIndex = tempBtns.indexOf(value);
        tempBtns.splice(findIndex, 1);
      } else tempBtns.push(value);
    } else if (key === 'range') {
      if (value.min || value.max) {
        if (!tempBtns.includes(rangeBtnId)) tempBtns.push(rangeBtnId);
      } else if (tempBtns.includes(rangeBtnId)) {
        const findIndex = tempBtns.indexOf(rangeBtnId);
        tempBtns.splice(findIndex, 1);
      }
    } else if (key === 'token') {
      if (!tempForm.selectedTokens.includes(value)) {
        tempForm.selectedTokens.push(value);
      } else {
        const findIndex = tempForm.selectedTokens.indexOf(value);
        tempForm.selectedTokens.splice(findIndex, 1);
      }
    } else if (key === 'collection') {
      const index = tempForm.selectedCollections.findIndex((item) => item.key === value.key);
      if (index === -1) tempForm.selectedCollections.push(value);
      else tempForm.selectedCollections.splice(index, 1);
    } else if (key === 'adult') {
      if (value) {
        if (!tempBtns.includes(adultBtnId)) tempBtns.push(adultBtnId);
      } else if (tempBtns.includes(adultBtnId)) {
        const findIndex = tempBtns.indexOf(adultBtnId);
        tempBtns.splice(findIndex, 1);
      }
    }
    tempForm.selectedBtns = tempBtns;
    setFilterForm(tempForm);
  };

  const applyFilterForm = () => {
    const tempForm = { ...filterForm };
    delete tempForm.statype;
    delete tempForm.clear_all;
    delete tempForm.collection;
    delete tempForm.token;
    Object.keys(tempForm).forEach((key) => handleFilter(key, tempForm[key]));
    setFilterForm(tempForm);
    closeFilter();
  };

  const handleChangeChainType = (type) => {
    setChainType(type);
    setSelectedCollections([]);
    setSelectedTokens([]);
  };

  const closeFilter = () => {
    setFilterView(!isFilterView && 1);
  };

  const loadingSkeletons = Array(25).fill(null);

  return (
    <ScrollManager scrollKey="asset-list-key" isAlreadyMounted={isAlreadyMounted}>
      {() => (
        <RootStyle title="Marketplace | PASAR">
          <Stack direction="row">
            <Container maxWidth={false}>
              <AppBarStyle
                sx={{
                  boxShadow: 0,
                  bgcolor: 'transparent',
                  top: isOffset ? APP_BAR_MOBILE : APP_BAR_DESKTOP,
                  zIndex: 1099
                }}
              >
                <ToolbarStyle
                  sx={{
                    ...(isOffset && {
                      bgcolor: 'background.default'
                    })
                  }}
                >
                  <Stack width="100%" direction="row">
                    <Box sx={{ flex: 1 }}>
                      <Button
                        variant="contained"
                        color="origin"
                        startIcon={isFilterView ? <Icon icon={arrowIosBackFill} /> : ''}
                        endIcon={isFilterView ? '' : <Icon icon={arrowIosForwardFill} />}
                        onClick={closeFilter}
                      >
                        Filters
                      </Button>
                      <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>
                        {totalCount.toLocaleString('en')} items
                      </Typography>
                      <Stack spacing={1} sx={{ display: 'inline', pl: 1 }} direction="row">
                        {selectedBtns.map((nameId, index) => {
                          let buttonName = [...btnGroup.status, ...btnGroup.type][nameId];
                          if (nameId === rangeBtnId) {
                            buttonName = `${range.min || 0} to ${range.max === '' ? 'inf' : range.max} ELA`;
                          } else if (nameId === adultBtnId) {
                            buttonName = `Explicit & Sensitive`;
                          }
                          return (
                            <Button
                              key={index}
                              variant="outlined"
                              color="origin"
                              endIcon={<CloseIcon />}
                              onClick={() => handleSingleFilterBtn(nameId)}
                            >
                              {buttonName}
                            </Button>
                          );
                        })}
                        {selectedBtns.length > 0 && (
                          <Button color="inherit" onClick={clearAllFilterBtn}>
                            Clear All
                          </Button>
                        )}
                      </Stack>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <AssetSortSelect selected={order} onChange={setOrder} />
                      <ChainSelect selected={chainType} onChange={handleChangeChainType} />
                      <ToggleButtonGroup value={dispMode} exclusive onChange={changeDispMode} size="small">
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
              </AppBarStyle>
              <Box sx={{ display: 'flex' }}>
                <Box
                  component="nav"
                  sx={{
                    width: drawerWidth * isFilterView,
                    flexShrink: 0,
                    display: { xs: 'none', sm: 'none', md: 'block' },
                    transition: 'width ease .5s'
                  }}
                  aria-label="mailbox folders"
                >
                  <AssetFilterPan
                    chain={chains[chainType].token.toLowerCase()}
                    btnGroup={btnGroup}
                    handleFilter={handleFilter}
                    filterProps={{ selectedBtns, selectedCollections, selectedTokens, range, adult, order }}
                    scrollMaxHeight={`calc(100vh - ${isOffset ? APP_BAR_MOBILE : APP_BAR_DESKTOP}px - 48px)`}
                    sx={{
                      pt: 3,
                      '& .MuiDrawer-paper': {
                        transition: 'all ease .5s',
                        width: drawerWidth,
                        top: isOffset ? APP_BAR_MOBILE + 48 : APP_BAR_DESKTOP + 48,
                        left: drawerWidth * (isFilterView - 1)
                      }
                    }}
                  />
                </Box>
                <Box
                  component="main"
                  sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth * isFilterView}px)` }, m: '-10px' }}
                >
                  <MHidden width="mdUp">
                    <Box sx={{ display: 'flex', p: '10px', pb: 1 }}>
                      <AssetSortSelect selected={order} onChange={setOrder} sx={{ flex: 1 }} />
                      <MHidden width="smDown">
                        <ChainSelect selected={chainType} onChange={handleChangeChainType} />
                      </MHidden>
                      <ToggleButtonGroup value={dispMode} exclusive onChange={changeDispMode} size="small">
                        <ToggleButton value={0}>
                          <SquareIcon />
                        </ToggleButton>
                        <ToggleButton value={1}>
                          <GridViewSharpIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                    <MHidden width="smUp">
                      <Box sx={{ px: '10px' }}>
                        <ChainSelect selected={chainType} onChange={handleChangeChainType} sx={{ width: '100%' }} />
                      </Box>
                    </MHidden>
                  </MHidden>
                  <InfiniteScroll
                    dataLength={assets.length}
                    next={fetchMoreData}
                    hasMore={page < pages}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      !isLoadingAssets &&
                      !assets.length && (
                        <Typography variant="h4" align="center">
                          No matching collectible found!
                        </Typography>
                      )
                    }
                    style={{ padding: '10px' }}
                  >
                    <AssetGrid {...{ assets: isLoadingAssets ? [...assets, ...loadingSkeletons] : assets, dispMode }} />
                  </InfiniteScroll>
                </Box>
              </Box>
            </Container>
          </Stack>
          <MHidden width="mdUp">
            <FilterBtnContainerStyle>
              <Button size="large" variant="contained" color="origin" onClick={closeFilter}>
                Filters
                {filterForm.selectedBtns && filterForm.selectedBtns.length > 0 && (
                  <FilterBtnBadgeStyle>{filterForm.selectedBtns.length}</FilterBtnBadgeStyle>
                )}
              </Button>
            </FilterBtnContainerStyle>

            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isFilterView !== 1}
              onClick={closeFilter}
            />
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
                {filterForm.selectedBtns && filterForm.selectedBtns.length > 0 && (
                  <>
                    <Box sx={{ pt: 2, pb: 1, pr: 1, pl: 2.5 }}>
                      {filterForm.selectedBtns.map((nameId, index) => {
                        let buttonName = [...btnGroup.status, ...btnGroup.type][nameId];
                        if (nameId === rangeBtnId) {
                          buttonName = `${filterForm.range.min || 0} to ${
                            filterForm.range.max === '' ? 'inf' : filterForm.range.max
                          } ELA`;
                        } else if (nameId === adultBtnId) {
                          buttonName = `Explicit & Sensitive`;
                        }
                        return (
                          <Button
                            key={index}
                            variant="outlined"
                            color="origin"
                            endIcon={<CloseIcon />}
                            onClick={() => {
                              handleSingleMobileFilterBtn(nameId);
                            }}
                            sx={{ mr: 1, mb: 1 }}
                          >
                            {buttonName}
                          </Button>
                        );
                      })}
                      <Button
                        color="inherit"
                        onClick={() => {
                          handleMobileFilter('clear_all', null);
                        }}
                        sx={{ mb: 1 }}
                      >
                        Clear All
                      </Button>
                    </Box>
                    <Divider />
                  </>
                )}
                <Box style={{ display: 'contents' }}>
                  <Scrollbar>
                    <AssetFilterPan
                      chain={chains[chainType].token.toLowerCase()}
                      btnGroup={btnGroup}
                      handleFilter={handleMobileFilter}
                      filterProps={filterForm}
                      sx={{}}
                    />
                  </Scrollbar>
                </Box>
                <Divider />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ py: 2, pr: 1, pl: 2.5 }}
                >
                  <Typography variant="subtitle1">Filters</Typography>
                  <Button endIcon={<CheckIcon />} onClick={applyFilterForm} color="inherit">
                    Done
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </MHidden>
        </RootStyle>
      )}
    </ScrollManager>
  );
}
