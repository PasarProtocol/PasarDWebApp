// material
import React from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isMobile } from 'react-device-detect';
import {
  Container,
  Stack,
  Typography,
  Paper,
  Divider,
  Backdrop,
  Tooltip,
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
import AssetSortSelect from '../../components/AssetSortSelect';
import CollectionFilterPan from '../../components/collection/CollectionFilterPan';
import AssetGrid from '../../components/marketplace/AssetGrid';
import RingAvatar from '../../components/RingAvatar';
import AddressCopyButton from '../../components/AddressCopyButton';
import StatisticPanel from '../../components/collection/StatisticPanel';
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup';
import KYCBadge from '../../components/badge/KYCBadge';
import DIABadge from '../../components/badge/DIABadge';
import { fetchAPIFrom, getImageFromIPFSUrl } from '../../utils/common';
import { queryKycMe } from '../../components/signin-dlg/HiveAPI';

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
  const sessionDispMode = sessionStorage.getItem('disp-mode');
  const sessionFilterProps = JSON.parse(sessionStorage.getItem('collection-filter-props')) || {};
  const params = useParams(); // params.collection
  const drawerWidth = 360;
  const btnGroup = {
    status: ['Buy Now', 'On Auction', 'Not Met', 'Has Bids', 'Has Ended'],
    type: ['General', 'Avatar']
  };
  const rangeBtnId = 10;
  const adultBtnId = 11;
  const emptyRange = { min: '', max: '' };
  const defaultDispMode = isMobile ? 1 : 0;

  const [chain, token] = params.collection.split('&');
  const [collection, setCollection] = React.useState({});
  const [didName, setDidName] = React.useState('');
  const [assets, setAssets] = React.useState([]);
  const [selectedTokens, setSelectedTokens] = React.useState(sessionFilterProps.selectedTokens || []);
  const [selectedBtns, setSelectedBtns] = React.useState(sessionFilterProps.selectedBtns || []);
  const [selectedAttributes, setSelectedAttributes] = React.useState(sessionFilterProps.selectedAttributes || {});
  const [range, setRange] = React.useState(sessionFilterProps.range || { min: '', max: '' });
  const [adult, setAdult] = React.useState(sessionFilterProps.adult || false);
  const [dispMode, setDispMode] = React.useState(
    sessionDispMode !== null ? parseInt(sessionDispMode, 10) : defaultDispMode
  );
  const [isFilterView, setFilterView] = React.useState(1);
  const [filterForm, setFilterForm] = React.useState({
    selectedBtns: sessionFilterProps.selectedBtns || [],
    selectedAttributes: sessionFilterProps.selectedAttributes || [],
    selectedTokens: sessionFilterProps.selectedTokens || [],
    range: sessionFilterProps.range || { min: '', max: '' },
    ...sessionFilterProps
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [order, setOrder] = React.useState(sessionFilterProps.order || 0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);
  const [loadNext, setLoadNext] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [showCount] = React.useState(30);
  const [badge, setBadge] = React.useState({ dia: 0, kyc: false });

  const avatar = getImageFromIPFSUrl(collection?.data?.avatar);
  const description = collection?.data?.description || '';
  const socials = collection?.data?.socials || {};

  const fetchMoreData = () => {
    if (!loadNext) {
      setLoadNext(true);
      setPage(page + 1);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAPIFrom(`api/v1/getCollectionInfo?chain=${chain}&collection=${token}`);
        const json = await res.json();
        setCollection(json?.data || {});
        setDidName(json?.data?.creator?.name || '');
        setBadge({ ...badge, dia: (json?.data?.dia ?? 0) / 1e18 });
        if (json?.data?.creator?.did) {
          try {
            const res = await queryKycMe(json.data.creator.did);
            if (res.find_message && res.find_message.items.length) setBadge({ ...badge, kyc: true });
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, token]);

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);

      setLoadingAssets(true);
      const bodyParams = {
        pageNum: page,
        pageSize: showCount,
        chain,
        collection: token,
        status: selectedBtns.filter((el) => el >= 0 && el <= 4).sort(),
        token: selectedTokens,
        sort: order
      };
      if (Object.keys(selectedAttributes).length) bodyParams.attribute = selectedAttributes;
      if (range.min !== '') bodyParams.minPrice = range.min * 1;
      if (range.max !== '') bodyParams.maxPrice = range.max * 1;
      if (!loadNext) setAssets([]);
      try {
        const res = await fetchAPIFrom('api/v1/listCollectibleOfCollection', {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyParams),
          signal
        });
        const json = await res.json();
        const totalCnt = json?.data?.total ?? 0;
        setTotalCount(totalCnt);
        setPages(Math.ceil(totalCnt / showCount));
        if (loadNext) setAssets([...assets, ...(json?.data?.data || [])]);
        else setAssets(json?.data?.data || []);
        setLoadNext(false);
      } catch (e) {
        console.error(e);
      }
      setLoadingAssets(false);

      sessionStorage.setItem(
        'collection-filter-props',
        JSON.stringify({ selectedBtns, selectedAttributes, range, selectedTokens, adult, order })
      );
      setFilterForm({ selectedBtns, selectedAttributes, range, selectedTokens, adult, order });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showCount, selectedBtns, selectedAttributes, selectedTokens, adult, range, order, params.key]);

  const changeDispMode = (_, mode) => {
    if (mode === null) return;
    sessionStorage.setItem('disp-mode', mode);
    setDispMode(mode);
  };

  // remove selected filter buttons
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
      case 'statype': // status btn
        handleSingleFilterBtn(value);
        break;
      case 'token': // quote token
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
      case 'range': // price range
        setSelectedByValue(value.min || value.max, rangeBtnId);
        setRange(value);
        break;
      case 'attributes': // attribute
        setSelectedAttributes((prevState) => {
          const selAttributes = { ...prevState };
          const arrSubGroup = selAttributes[value.groupName];
          if (arrSubGroup) {
            const index = arrSubGroup.indexOf(value.name);
            if (index >= 0) {
              arrSubGroup.splice(index, 1);
              if (!arrSubGroup.length) delete selAttributes[value.groupName];
            } else arrSubGroup.push(value.name);
          } else selAttributes[value.groupName] = [value.name];
          return selAttributes;
        });
        break;
      case 'selectedBtns':
        setSelectedBtns(value);
        break;
      case 'selectedTokens':
        setSelectedTokens(value);
        break;
      case 'selectedAttributes':
        setSelectedAttributes(value);
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
    } else if (key === 'attributes') {
      const { groupName, name } = value;
      const arrSubGroup = tempForm.selectedAttributes[groupName];
      if (arrSubGroup) {
        const index = arrSubGroup.indexOf(value.name);
        if (index >= 0) {
          arrSubGroup.splice(index, 1);
          if (!arrSubGroup.length) delete tempForm.selectedAttributes[groupName];
        } else arrSubGroup.push(name);
      } else tempForm.selectedAttributes[groupName] = [name];
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

  const applyFilterForm = (e) => {
    const tempForm = { ...filterForm };
    delete tempForm.statype;
    delete tempForm.clear_all;
    delete tempForm.attributes;
    delete tempForm.token;
    Object.keys(tempForm).forEach((key) => handleFilter(key, tempForm[key]));
    setFilterForm(tempForm);
    closeFilter(e);
  };

  const closeFilter = () => {
    setFilterView(!isFilterView && 1);
  };

  const loadingSkeletons = Array(25).fill(null);

  return (
    <RootStyle title="CollectionDetail | PASAR">
      <Stack direction="row">
        <Container maxWidth={false}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: isMobile ? 1 : 1.5 }}>
            <RingAvatar isImage={Boolean(true)} size={isMobile ? 80 : 100} avatar={avatar} />
          </Box>
          <Typography
            variant="h2"
            component="div"
            align="center"
            sx={{ maxWidth: 900, m: 'auto !important', lineHeight: 1.1, wordBreak: 'break-all' }}
          >
            {collection.name}
          </Typography>
          {!!didName && (
            <Typography variant="body2" component="div" align="center">
              by{' '}
              <Typography variant="body2" color="origin.main" sx={{ display: 'inline' }}>
                {didName}
              </Typography>
            </Typography>
          )}
          <Stack spacing={2}>
            {!!collection.owner && !!collection.token && (
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mt: 1 }}>
                <Tooltip title="Owner Address" arrow enterTouchDelay={0}>
                  <div>
                    <AddressCopyButton type="diamond" address={collection.owner} />
                  </div>
                </Tooltip>
                <Tooltip title="Contract Address" arrow enterTouchDelay={0}>
                  <div>
                    <AddressCopyButton type="contract" address={collection.token} />
                  </div>
                </Tooltip>
              </Stack>
            )}
            <Box>
              <StatisticPanel {...collection} />
            </Box>
            <Typography
              variant="body2"
              component="div"
              align="center"
              color="text.secondary"
              sx={{ maxWidth: 900, m: 'auto !important', pt: 2, wordBreak: 'break-all' }}
            >
              {description}
            </Typography>
            <IconLinkButtonGroup {...socials} />
            <Stack sx={{ justifyContent: 'center' }} spacing={1} direction="row">
              {badge.dia > 0 && <DIABadge balance={badge.dia} />}
              {badge.kyc && (
                <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                  <Box sx={{ display: 'inline-flex' }}>
                    <KYCBadge />
                  </Box>
                </Tooltip>
              )}
            </Stack>
            <MHidden width="smDown">
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
                      let buttonName = btnGroup.status[nameId];
                      if (nameId === rangeBtnId) {
                        buttonName = `${range.min || 0} to ${range.max === '' ? 'inf' : range.max} ELA`;
                      }
                      return (
                        <Button
                          key={index}
                          variant="outlined"
                          color="origin"
                          endIcon={<CloseIcon />}
                          onClick={() => {
                            handleSingleFilterBtn(nameId);
                          }}
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
            </MHidden>
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{
                  width: drawerWidth * isFilterView,
                  flexShrink: 0,
                  display: { xs: 'none', sm: 'none', md: 'block' },
                  transition: 'width ease .5s',
                  position: 'relative'
                }}
              >
                <CollectionFilterPan
                  token={token}
                  chain={chain}
                  btnGroup={btnGroup}
                  filterProps={{ selectedBtns, selectedTokens, selectedAttributes, range, adult, order }}
                  handleFilter={handleFilter}
                  sx={{
                    position: 'absolute',
                    width: drawerWidth,
                    height: '1400px',
                    left: drawerWidth * (isFilterView - 1) - 24,
                    transition: 'all ease .5s',
                    p: 1
                  }}
                />
              </Box>
              <Box
                component="main"
                sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth * isFilterView}px)`, m: '-10px' } }}
              >
                <MHidden width="smUp">
                  <Box sx={{ display: 'flex', p: '10px', pb: 1 }}>
                    <AssetSortSelect selected={order} onChange={setOrder} sx={{ flex: 1 }} />
                    <ToggleButtonGroup value={dispMode} exclusive onChange={changeDispMode} size="small">
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
          </Stack>
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
                    let buttonName = btnGroup.status[nameId];
                    if (nameId === rangeBtnId) {
                      buttonName = `${filterForm.range.min || 0} to ${
                        filterForm.range.max === '' ? 'inf' : filterForm.range.max
                      } ELA`;
                    }
                    return (
                      <Button
                        key={index}
                        variant="outlined"
                        color="origin"
                        endIcon={<CloseIcon />}
                        onClick={() => handleSingleMobileFilterBtn(nameId)}
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
            <CollectionFilterPan
              token={token}
              chain={chain}
              btnGroup={btnGroup}
              filterProps={filterForm}
              handleFilter={handleMobileFilter}
              sx={{
                display: 'contents'
              }}
            />
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
