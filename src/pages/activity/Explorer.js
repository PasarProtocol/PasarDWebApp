import React from 'react';
import { useLocation } from 'react-router-dom';
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
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  Box
} from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha, styled } from '@mui/material/styles';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

// components
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import ActivityPeriodSelect from '../../components/ActivityPeriodSelect';
import ActivityFilterPan from '../../components/activity/ActivityFilterPan';
import ActivitySkeleton from '../../components/activity/ActivitySkeleton';
import ActivityAccordion from '../../components/activity/ActivityAccordion';
import ActivityTableRow from '../../components/activity/ActivityTableRow';
import Scrollbar from '../../components/Scrollbar';
import { queryName, queryKycMe } from '../../components/signin-dlg/HiveAPI';
import useOffSetTop from '../../hooks/useOffSetTop';
import useSignin from '../../hooks/useSignin';
import {
  
  getTotalCountOfCoinTypes,
  getDidInfoFromAddress,
  fetchAPIFrom,
  setAllTokenPrice2
} from '../../utils/common';

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
const COLUMNS = [
  { id: 'type', label: 'Type', minWidth: 170, align: 'center' },
  { id: 'image', label: 'Item', minWidth: 170, align: 'center' },
  { id: 'price', label: 'Price', minWidth: 170 },
  { id: 'sellerAddr', label: 'From', minWidth: 170, align: 'center' },
  { id: 'buyerAddr', label: 'To', minWidth: 170, align: 'center' },
  { id: 'marketTime', label: 'Time', minWidth: 170, align: 'center' }
];
const btnGroup = {
  status: ['Sold', 'Listed', 'Minted']
};
export default function ActivityExplorer() {
  const sessionDispMode = sessionStorage.getItem('disp-mode');
  const sessionFilterProps = JSON.parse(sessionStorage.getItem('activity-filter-props')) || {};
  const location = useLocation();
  const { type = '' } = location.state || {};
  const btnFilterByParam = [];
  const btnId = btnGroup.status.indexOf(type);
  if (btnId >= 0) {
    btnFilterByParam.push(btnId);
  }
  const drawerWidth = 360;
  const { openTopAlert } = useSignin();
  const APP_BAR_MOBILE = 72 + (openTopAlert ? 50 : 0);
  const APP_BAR_DESKTOP = 88 + (openTopAlert ? 50 : 0);
  const emptyRange = { min: '', max: '' };
  const defaultDispMode = isMobile ? 1 : 0;
  const isOffset = useOffSetTop(20);
  const [activities, setActivity] = React.useState([]);
  const [infoByAddress, setInfoByAddress] = React.useState({});
  const [addressGroup, setAddressByGroup] = React.useState([]);
  const [selectedBtns, setSelectedBtns] = React.useState([
    ...new Set([...(sessionFilterProps.selectedBtns || []), ...btnFilterByParam])
  ]);
  const [dispmode, setDispmode] = React.useState(
    sessionDispMode !== null ? parseInt(sessionDispMode, 10) : defaultDispMode
  );
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    ...sessionFilterProps
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [period, setPeriod] = React.useState({ index: 4, value: 90 });
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingActivity, setLoadingActivity] = React.useState(false);
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
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
    if (dispmode !== tempDefaultDispMode) setDispmode(tempDefaultDispMode);
  };
  window.addEventListener('resize', handleDispInLaptopSize);

  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  };

  React.useEffect(() => {
    handleDispInLaptopSize();
    setAllTokenPrice2(setCoinPriceByType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    addressGroup.forEach((addr) => {
      if (!infoByAddress[addr]) {
        getDidInfoFromAddress(addr)
          .then((info) => {
            if (info.name) {
              setInfoByAddress((prevState) => {
                const tempInfo = { ...prevState };
                tempInfo[addr] = { name: info.name };
                return tempInfo;
              });
              if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') fetchProfileData(info.did, addr);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressGroup]);

  const fetchProfileData = (targetDid, address) => {
    queryName(targetDid)
      .then((res) => {
        if (res.find_message && res.find_message.items.length) {
          const displayName = res.find_message.items[0].display_name;
          setInfoByAddress((prevState) => {
            const tempInfo = { ...prevState };
            tempInfo[address] = { name: displayName };
            return tempInfo;
          });
        }
        queryKycMe(targetDid).then((res) => {
          if (res.find_message && res.find_message.items.length) {
            setInfoByAddress((prevState) => {
              const tempInfo = { ...prevState };
              tempInfo[address].kyc = true;
              return tempInfo;
            });
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      let status = btnGroup.status.filter((_, index) => selectedBtns.indexOf(index) >= 0);
      status = (status.length === 0 ? btnGroup.status.join(',') : status.join(',')).toLowerCase();
      setLoadingActivity(true);

      if (!loadNext) setActivity([]);
      const curDate = new Date();
      curDate.setDate(curDate.getDate() - period.value);
      const after = period.index === 6 ? period.value : parseInt(curDate.getTime() / 1e3, 10);
      try {
        const res = await fetchAPIFrom(
          `api/v1/listCollectibles?type=${status}&after=${after}&pageNum=${page}&pageSize=${showCount}`,
          { signal }
        );
        const json = await res.json();
        const totalCnt = json?.data?.total ?? 0;
        const arrData = json?.data?.data || [];
        setTotalCount(totalCnt);
        setPages(Math.ceil(totalCnt / showCount));
        if (loadNext) setActivity([...activities, ...arrData]);
        else setActivity(arrData);
        const resAddressGroup = [...addressGroup];
        arrData.forEach((item) => {
          resAddressGroup.push(item?.order?.buyerAddr);
          resAddressGroup.push(item?.order?.sellerAddr);
        });
        const uniqueAddresses = [...new Set(resAddressGroup)];
        setAddressByGroup(uniqueAddresses);
        setLoadNext(false);
      } catch (e) {
        console.error(e);
      }
      setLoadingActivity(false);

      sessionStorage.setItem('activity-filter-props', JSON.stringify({ selectedBtns }));
      setFilterForm({ selectedBtns });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showCount, selectedBtns, period]);

  const handleSingleFilterBtn = (btnId) => {
    const selBtns = [...selectedBtns];
    if (selBtns.includes(btnId)) {
      const findIndex = selBtns.indexOf(btnId);
      selBtns.splice(findIndex, 1);
    } else selBtns.push(btnId);
    setSelectedBtns(selBtns);
  };

  const handleFilter = (key, value) => {
    setPage(1);
    switch (key) {
      case 'eventype':
        handleSingleFilterBtn(value);
        break;
      case 'selectedBtns':
        setSelectedBtns(value);
        break;
      default:
        break;
    }
  };

  const handleSingleMobileFilterBtn = (btnId) => {
    handleMobileFilter('eventype', btnId);
  };

  const handleMobileFilter = (key, value) => {
    const tempForm = { ...filterForm };
    const selBtns = [...filterForm.selectedBtns];
    tempForm[key] = value;
    if (key === 'clear_all') {
      tempForm.selectedBtns = [];
      tempForm.range = emptyRange;
      tempForm.adult = false;
      setFilterForm(tempForm);
      return;
    }
    if (key === 'eventype') {
      if (selBtns.includes(value)) {
        const findIndex = selBtns.indexOf(value);
        selBtns.splice(findIndex, 1);
      } else selBtns.push(value);
    }
    tempForm.selectedBtns = selBtns;
    setFilterForm(tempForm);
  };

  const applyFilterForm = (e) => {
    const tempForm = { ...filterForm };
    delete tempForm.statype;
    delete tempForm.clear_all;
    Object.keys(tempForm).forEach((key) => handleFilter(key, tempForm[key]));
    setFilterForm(tempForm);
    closeFilter(e);
  };

  const handleClearAll = () => {
    setSelectedBtns([]);
  };

  const closeFilter = (e) => {
    setFilterView(!isFilterView && 1);
    console.error(e);
  };

  const loadingSkeletons = Array(10).fill(null);

  return (
    <RootStyle title="Activity | PASAR">
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
                    {selectedBtns.map((btnId, index) => {
                      const buttonName = [...btnGroup.status][btnId];
                      return (
                        <Button
                          key={index}
                          variant="outlined"
                          color="origin"
                          endIcon={<CloseIcon />}
                          onClick={() => handleSingleFilterBtn(btnId)}
                        >
                          {buttonName}
                        </Button>
                      );
                    })}
                    {selectedBtns.length > 0 && (
                      <Button color="inherit" onClick={handleClearAll}>
                        Clear All
                      </Button>
                    )}
                  </Stack>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <ActivityPeriodSelect selected={period} onChange={setPeriod} />
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
              <ActivityFilterPan
                sx={{
                  pt: 3,
                  '& .MuiDrawer-paper': {
                    transition: 'all ease .5s',
                    width: drawerWidth,
                    top: isOffset ? APP_BAR_MOBILE + 48 : APP_BAR_DESKTOP + 48,
                    left: drawerWidth * (isFilterView - 1)
                  }
                }}
                scrollMaxHeight={`calc(100vh - ${isOffset ? APP_BAR_MOBILE : APP_BAR_DESKTOP}px - 48px)`}
                filterProps={{ selectedBtns }}
                {...{ btnGroup, handleFilter }}
              />
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { xs: '100%', md: `calc(100% - ${drawerWidth * isFilterView}px)` },
                m: '-10px'
              }}
            >
              <MHidden width="mdUp">
                <Box sx={{ display: 'flex', p: '10px', pb: 1 }}>
                  <ActivityPeriodSelect selected={period} onChange={setPeriod} />
                </Box>
              </MHidden>
              <InfiniteScroll
                dataLength={activities.length}
                next={fetchMoreData}
                hasMore={page < pages}
                loader={<h4>Loading...</h4>}
                endMessage={
                  !isLoadingActivity &&
                  !activities.length && (
                    <Typography variant="h4" align="center" mt={4}>
                      No matching activity found!
                    </Typography>
                  )
                }
                style={{ padding: '10px' }}
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
                        {React.useMemo(
                          () =>
                            activities.map((trans, _i) => (
                              <ActivityTableRow
                                trans={trans}
                                coinPrice={coinPrice}
                                infoByAddress={infoByAddress}
                                COLUMNS={COLUMNS}
                                key={_i}
                              />
                            )),
                          [activities, coinPrice, infoByAddress]
                        )}
                        {isLoadingActivity && loadingSkeletons.map((_, _i) => <ActivitySkeleton key={_i} />)}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MHidden>
                <MHidden width="mdUp">
                  {React.useMemo(
                    () =>
                      activities.map((trans, _i) => (
                        <ActivityAccordion trans={trans} coinPrice={coinPrice} infoByAddress={infoByAddress} key={_i} />
                      )),
                    [activities, coinPrice, infoByAddress]
                  )}
                  {isLoadingActivity &&
                    loadingSkeletons.map((_, _i) => <ActivitySkeleton isMobile={Boolean(true)} key={_i} />)}
                </MHidden>
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

        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isFilterView !== 1} onClick={closeFilter} />
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
                    const buttonName = [...btnGroup.status][nameId];
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
            <Box style={{ height: '100%' }}>
              <Scrollbar>
                <ActivityFilterPan
                  sx={{}}
                  filterProps={filterForm}
                  handleFilter={handleMobileFilter}
                  {...{ btnGroup }}
                />
              </Scrollbar>
            </Box>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
              <Typography variant="subtitle1">Filters</Typography>
              <Button endIcon={<CheckIcon />} onClick={applyFilterForm} color="inherit">
                Done
              </Button>
            </Stack>
          </Paper>
        </Box>
      </MHidden>
    </RootStyle>
  );
}
