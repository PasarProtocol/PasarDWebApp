import React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { isMobile } from 'react-device-detect';
import { styled } from '@mui/material/styles';
import {
  Container,
  Stack,
  Typography,
  Tab,
  Tabs,
  Link,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Grid
} from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/akar-icons/edit';
import { useWeb3React } from '@web3-react/core';
import jwtDecode from 'jwt-decode';
import InfiniteScroll from 'react-infinite-scroll-component';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import StyledButton from '../../components/signin-dlg/StyledButton';
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import AssetGrid from '../../components/marketplace/AssetGrid';
import RingAvatar from '../../components/RingAvatar';
import KYCBadge from '../../components/badge/KYCBadge';
import DIABadge from '../../components/badge/DIABadge';
import AddressCopyButton from '../../components/AddressCopyButton';
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup';
import CollectionCard from '../../components/collection/CollectionCard';
import CollectionCardSkeleton from '../../components/collection/CollectionCardSkeleton';
import NeedBuyDIADlg from '../../components/dialog/NeedBuyDIA';
import ChainSelect from '../../components/ChainSelect';
import AssetSortSelect from '../../components/AssetSortSelect';
import useSingin from '../../hooks/useSignin';
import {
  queryName,
  queryDescription,
  queryWebsite,
  queryTwitter,
  queryDiscord,
  queryTelegram,
  queryMedium,
  queryKycMe,
  downloadAvatar
} from '../../components/signin-dlg/HiveAPI';
import {
  reduceHexAddress,
  getDiaTokenInfo,
  isInAppBrowser,
  getChainTypeFromId,
  fetchAPIFrom,
  chainTypes,
  getDIDInfoFromAddress
} from '../../utils/common';

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

// ----------------------------------------------------------------------
export default function MyProfile() {
  const defaultDispMode = isMobile ? 1 : 0;
  const sessionDispMode = sessionStorage.getItem('disp-mode');
  const params = useParams(); // params.address
  const navigate = useNavigate();
  const [dispMode, setDispMode] = React.useState(
    sessionDispMode !== null ? parseInt(sessionDispMode, 10) : defaultDispMode
  );
  const [controller, setAbortController] = React.useState(new AbortController());
  const [tabValue, setTabValue] = React.useState(params.type !== undefined ? parseInt(params.type, 10) : 0);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [myAddress, setMyAddress] = React.useState(null);
  const [didInfo, setDidInfo] = React.useState({ name: '', description: '' });
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [updateCount, setUpdateCount] = React.useState(0);
  const [order, setOrder] = React.useState(0);
  const [chainType, setChainType] = React.useState(0);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [badge, setBadge] = React.useState({ dia: 0, kyc: false });
  const [socials, setSocials] = React.useState({});
  const { diaBalance, pasarLinkChain } = useSingin();
  const [isLoadingAssets, setLoadingAssets] = React.useState([false, false, false]);
  const [assetCount, setAssetCount] = React.useState([0, 0, 0, 0, 0, 0]);
  const [assets, setAssets] = React.useState([[], [], [], [], [], []]);
  const [loadNext, setLoadNext] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState([0, 0, 0, 0, 0, 0]);
  const [showCount] = React.useState(30);
  const context = useWeb3React();
  const { account } = context;

  // --------------------------------- Profile ------------------------------------- //

  const queryProfileSocials = {
    website: queryWebsite,
    twitter: queryTwitter,
    discord: queryDiscord,
    telegram: queryTelegram,
    medium: queryMedium
  };

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  React.useEffect(() => {
    const getMyAddress = async () => {
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1') {
        setMyAddress(account);
        setWalletAddress(account);
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        const strWalletAddress = isInAppBrowser()
          ? await window.elastos.getWeb3Provider().address
          : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
        setMyAddress(strWalletAddress);
        setWalletAddress(strWalletAddress);
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
        const strWalletAddress = await walletconnect.getAccount();
        setMyAddress(strWalletAddress);
        setWalletAddress(strWalletAddress);
      } else if (!params.address) {
        navigate('/marketplace');
      }
      // ----------------------------------------------------------
      if (params.address) {
        setWalletAddress(params.address);
        try {
          const info = await getDIDInfoFromAddress(params.address);
          setDidInfo({ name: info?.name || '', description: info?.description || '' });
        } catch (e) {
          console.error(e);
        }
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        const targetDid = `did:elastos:${sessionStorage.getItem('PASAR_DID')}`;
        const token = sessionStorage.getItem('PASAR_TOKEN');
        const user = jwtDecode(token);
        try {
          await fetchProfileData(targetDid, user);
        } catch (e) {
          console.error(e);
        }
      } else {
        setDidInfo({ name: '', description: '' });
      }
    };
    getMyAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, params.address]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dia = await getDiaTokenInfo(walletAddress);
        setEachOfObject('setBadge', 'dia', dia * 1);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [walletAddress]);
  const fetchProfileData = async (targetDid, didInfo) => {
    try {
      const res = await queryName(targetDid);
      if (res?.find_message && (res?.find_message?.items || []).length)
        setEachOfObject('setDidInfo', 'name', res.find_message.items[0].display_name);
      else setEachOfObject('setDidInfo', 'name', didInfo?.name || '');
    } catch (e) {
      console.error(e);
    }
    try {
      const res = await queryDescription(targetDid);
      if (res?.find_message && (res?.find_message?.items || []).length)
        setEachOfObject('setDidInfo', 'description', res.find_message.items[0].display_name);
      else setEachOfObject('setDidInfo', 'description', didInfo?.bio || '');
    } catch (e) {
      console.error(e);
    }
    try {
      const res = await downloadAvatar(targetDid);
      if (res && res.length) {
        const base64Content = res.reduce((content, code) => {
          content = `${content}${String.fromCharCode(code)}`;
          return content;
        }, '');
        setAvatarUrl((prevState) => {
          if (!prevState) return `data:image/png;base64,${base64Content}`;
          return prevState;
        });
      }
    } catch (e) {
      console.error(e);
    }
    try {
      const res = await queryKycMe(targetDid);
      if (res?.find_message && (res?.find_message?.items || []).length) setEachOfObject('setBadge', 'kyc', true);
      else setEachOfObject('setBadge', 'kyc', false);
    } catch (e) {
      console.error(e);
    }
    try {
      Object.keys(queryProfileSocials).forEach(async (field) => {
        const res = await queryProfileSocials[field](targetDid);
        if (res?.find_message && (res?.find_message?.items || []).length) {
          setSocials((prevState) => {
            const curState = { ...prevState };
            curState[field] = res.find_message.items[0].display_name;
            return curState;
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const setEachOfObject = (type, index, value) => {
    let setFunction = null;
    switch (type) {
      case 'setDidInfo':
        setFunction = setDidInfo;
        break;
      case 'setBadge':
        setFunction = setBadge;
        break;
      default:
        setFunction = null;
        break;
    }
    if (setFunction === null) return;
    setFunction((prevState) => {
      const nextState = { ...prevState };
      nextState[index] = value;
      return nextState;
    });
  };

  const fetchMoreData = () => {
    if (!loadNext) {
      setLoadNext(true);
      setPage(page + 1);
    }
  };

  const setEachOfArray = (type, index, value) => {
    let setFunction = null;
    switch (type) {
      case 'setLoadingAssets':
        setFunction = setLoadingAssets;
        break;
      case 'setAssets':
        setFunction = setAssets;
        break;
      case 'setAssetCount':
        setFunction = setAssetCount;
        break;
      case 'setPages':
        setFunction = setPages;
        break;
      default:
        setFunction = null;
        break;
    }
    if (setFunction === null) return;
    setFunction((prevState) => {
      const nextState = [...prevState];
      nextState[index] = value;
      return nextState;
    });
  };

  const apiNames = [
    'getListedCollectiblesByWalletAddr',
    'getOwnedCollectiblesByWalletAddr',
    'getBidsCollectiblesByWalletAddr',
    'getMintedCollectiblesByWalletAddr',
    'getSoldCollectiblesByWalletAddr',
    'getCollectionsByWalletAddr'
  ];
  const typeNames = ['listed', 'owned', 'bid', 'minted', 'sold', 'collections'];

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);

      const chain = chainType === 0 ? 'all' : chainTypes[chainType - 1].token.toLowerCase();
      Array(6)
        .fill(0)
        .forEach(async (_, i) => {
          setEachOfArray('setLoadingAssets', i, true);
          if (!loadNext) setAssets([[], [], [], [], [], []]);
          try {
            const res = await fetchAPIFrom(
              `api/v1/${apiNames[i]}?walletAddr=${walletAddress}&chain=${chain}&sort=${order}&pageNum=${page}&pageSize=${showCount}`,
              {
                signal
              }
            );
            const json = await res.json();
            const totalCnt = json?.data?.total ?? 0;
            setEachOfArray('setPages', i, Math.ceil(totalCnt / showCount));
            setEachOfArray('setAssetCount', i, totalCnt);
            if (loadNext) setEachOfArray('setAssets', i, [...assets[i], ...(json?.data?.data || [])]);
            else setEachOfArray('setAssets', i, json?.data?.data || []);
            setLoadNext(false);
          } catch (e) {
            console.error(e);
          }
          setEachOfArray('setLoadingAssets', i, false);
        });
    };
    if (walletAddress) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, showCount, page, order, chainType]);

  const handleDispMode = (_, mode) => {
    if (mode === null) return;
    sessionStorage.setItem('disp-mode', mode);
    setDispMode(mode);
  };

  const handleNavlink = (e) => {
    const currentChain = getChainTypeFromId(pasarLinkChain);
    const path = e.target.getAttribute('to');
    if (currentChain !== 'ESC' || diaBalance >= 0.01) navigate(path);
    else setOpenBuyDIA(true);
  };
  const loadingSkeletons = Array(showCount).fill(null);

  return (
    <RootStyle title="MyProfile | PASAR">
      <Container maxWidth={false}>
        <Box sx={{ position: 'relative', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: isMobile ? 1 : 1.5 }}>
            <RingAvatar avatar={avatarUrl} isImage={!!avatarUrl} address={walletAddress} size={isMobile ? 80 : 100} />
          </Box>
          <Typography variant="h2" component="div" align="center" sx={{ position: 'relative', lineHeight: 1.1 }}>
            <Stack direction="row" sx={{ justifyContent: 'center' }}>
              <Link to={`/explorer/transaction/detail/${walletAddress}`} component={RouterLink} color="text.primary">
                <span role="img" aria-label="">
                  {didInfo.name || reduceHexAddress(walletAddress)}
                </span>
              </Link>
              <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                {badge.kyc && (
                  <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                    <Box sx={{ display: 'inline-flex' }} ml={2}>
                      <KYCBadge size="large" />
                    </Box>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
            {(didInfo.name.length > 0 || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') && (
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mt: 1.5 }}>
                {didInfo.name.length > 0 && <AddressCopyButton address={walletAddress} />}
                {sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && (
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    endIcon={<Icon icon={editIcon} />}
                    to="edit"
                    color="inherit"
                  >
                    Edit Profile
                  </Button>
                )}
              </Stack>
            )}
            {didInfo.description.length > 0 && (
              <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary', pt: 1 }}>
                {didInfo.description}
              </Typography>
            )}
          </Typography>
          <Box sx={{ py: 1.5 }}>
            <IconLinkButtonGroup {...socials} />
          </Box>
          <Stack sx={{ justifyContent: 'center' }} spacing={1} direction="row">
            {badge.dia > 0 && <DIABadge balance={badge.dia} />}
          </Stack>
          <MHidden width="smUp">
            <Stack spacing={1} pt={1} px="10px">
              <Stack direction="row" sx={{ justifyContent: 'end' }}>
                <AssetSortSelect selected={order} onChange={setOrder} sx={{ flex: 1 }} />
                <ToggleButtonGroup value={dispMode} exclusive onChange={handleDispMode} size="small">
                  <ToggleButton value={0}>
                    <GridViewSharpIcon />
                  </ToggleButton>
                  <ToggleButton value={1}>
                    <AppsIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <ChainSelect selected={chainType} onChange={setChainType} sx={{ width: '100%' }} />
            </Stack>
          </MHidden>
        </Box>
        <Box sx={{ display: 'flex', position: 'relative', justifyContent: 'center' }} align="center">
          <Tabs
            value={tabValue}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(_, newValue) => setTabValue(newValue)}
            TabIndicatorProps={{
              style: { background: '#FF5082' }
            }}
            TabScrollButtonProps={{
              sx: {
                '&.MuiTabs-scrollButtons': {
                  display: 'inherit',
                  '&.Mui-disabled': {
                    display: 'none'
                  }
                }
              }
            }}
          >
            <Tab label={`Listed (${assetCount[0]})`} value={0} />
            <Tab label={`Owned (${assetCount[1]})`} value={1} />
            <Tab label={`Bids (${assetCount[2]})`} value={2} />
            <Tab label={`Minted (${assetCount[3]})`} value={3} />
            <Tab label={`Sold (${assetCount[4]})`} value={4} />
            <Tab label={`Collections (${assetCount[5]})`} value={5} />
          </Tabs>
        </Box>
        <MHidden width="smDown">
          <Stack spacing={1} pt={1} px="10px">
            <Stack direction="row" sx={{ justifyContent: 'end' }}>
              <AssetSortSelect selected={order} onChange={setOrder} />
              <ChainSelect selected={chainType} onChange={setChainType} />
              <ToggleButtonGroup value={dispMode} exclusive onChange={handleDispMode} size="small">
                <ToggleButton value={0}>
                  <GridViewSharpIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <AppsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </MHidden>
        <Box
          sx={{
            width: '100%'
          }}
        >
          <SwipeableViews
            index={tabValue}
            onChangeIndex={(value) => setTabValue(value)}
            containerStyle={{
              transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
            }}
          >
            {assets.map((tabAssets, i) => (
              <Box key={i} sx={{ minHeight: 200, p: '10px' }}>
                <InfiniteScroll
                  dataLength={tabAssets.length}
                  next={fetchMoreData}
                  hasMore={page < pages[i]}
                  loader={<h4>Loading...</h4>}
                  endMessage={
                    !isLoadingAssets[i] &&
                    !tabAssets.length &&
                    (i !== assets.length - 1 ? (
                      <Typography variant="subtitle2" align="center" sx={{ mb: 3 }}>
                        No {typeNames[i]} collectible found!
                      </Typography>
                    ) : (
                      <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h3" align="center">
                          {' '}
                          No Collections Found{' '}
                        </Typography>
                        <Typography variant="subtitle2" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                          We could not find any of your collections
                        </Typography>
                        {sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && (
                          <>
                            <StyledButton
                              variant="contained"
                              onClick={handleNavlink}
                              to="/collections/create"
                              sx={{ mb: 2 }}
                            >
                              Create new collection
                            </StyledButton>
                            <StyledButton variant="contained" onClick={handleNavlink} to="/collections/import">
                              Import existing collection
                            </StyledButton>
                          </>
                        )}
                      </Stack>
                    ))
                  }
                  style={{ padding: '10px' }}
                >
                  {i !== assets.length - 1 ? (
                    <AssetGrid
                      assets={
                        isLoadingAssets[i] && assetCount[i] > tabAssets.length
                          ? [...tabAssets, ...loadingSkeletons]
                          : tabAssets
                      }
                      type={i + 1}
                      dispMode={dispMode}
                      myaddress={myAddress}
                      updateCount={updateCount}
                      handleUpdate={setUpdateCount}
                    />
                  ) : (
                    <>
                      {isLoadingAssets[i] ? (
                        <Grid container spacing={2}>
                          {Array(3)
                            .fill(0)
                            .map((item, index) => (
                              <Grid item key={index} xs={12} sm={6} md={4}>
                                <CollectionCardSkeleton key={index} />
                              </Grid>
                            ))}
                        </Grid>
                      ) : (
                        <Grid container spacing={2}>
                          {sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && tabAssets.length && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                              <Stack direction="row" spacing={2}>
                                <StyledButton variant="contained" onClick={handleNavlink} to="/collections/create">
                                  Create
                                </StyledButton>
                                <StyledButton variant="contained" onClick={handleNavlink} to="/collections/import">
                                  Import
                                </StyledButton>
                              </Stack>
                            </Grid>
                          )}
                          {tabAssets.map((info, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                              <CollectionCard info={info} isOwned={Boolean(true)} />
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </>
                  )}
                </InfiniteScroll>
              </Box>
            ))}
          </SwipeableViews>
        </Box>
      </Container>
      <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance} actionText="create collections" />
    </RootStyle>
  );
}
