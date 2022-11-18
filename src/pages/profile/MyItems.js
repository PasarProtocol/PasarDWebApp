import React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { isMobile } from 'react-device-detect';

import { styled } from '@mui/material/styles';
import { Container, Stack, Typography, Tab, Tabs, Link, Grid, Box, Tooltip } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import jwtDecode from 'jwt-decode';
import InfiniteScroll from 'react-infinite-scroll-component';
// components
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import Page from '../../components/Page';
import AssetGrid from '../../components/marketplace/AssetGrid';
import RingAvatar from '../../components/RingAvatar';
import KYCBadge from '../../components/badge/KYCBadge';
import DIABadge from '../../components/badge/DIABadge';
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup';
import CollectionCard from '../../components/collection/CollectionCard';
import CollectionCardSkeleton from '../../components/collection/CollectionCardSkeleton';
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
  fetchAPIFrom,
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
export default function MyItems() {
  const defaultDispMode = isMobile ? 1 : 0;
  const sessionDispMode = sessionStorage.getItem('disp-mode');
  const params = useParams(); // params.address
  const navigate = useNavigate();
  const [dispMode] = React.useState(sessionDispMode !== null ? parseInt(sessionDispMode, 10) : defaultDispMode);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [tabValue, setTabValue] = React.useState(params.type !== undefined ? parseInt(params.type, 10) : 0);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [myAddress, setMyAddress] = React.useState(null);
  const [didInfo, setDidInfo] = React.useState({ name: '', description: '' });
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [updateCount, setUpdateCount] = React.useState(0);
  const [badge, setBadge] = React.useState({ dia: 0, kyc: false });
  const [socials, setSocials] = React.useState({});
  const [isLoadingAssets, setLoadingAssets] = React.useState([false, false, false, false]);
  const [assetCount, setAssetCount] = React.useState([0, 0, 0, 0]);
  const [assets, setAssets] = React.useState([[], [], [], []]);
  const [loadNext, setLoadNext] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState([0, 0, 0, 0]);
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

  React.useEffect(() => {
    const getUserProfile = async () => {
      if (params.address && params.address !== myAddress) {
        setWalletAddress(params.address);
        try {
          const info = await getDIDInfoFromAddress(params.address);
          setDidInfo({ name: info?.name || '', description: info?.description || '' });
          if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2')
            await fetchProfileData(info.did, { name: info.name || '', bio: info.description || '' });
        } catch (e) {
          console.error(e);
        }
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        setWalletAddress(myAddress);
        const targetDid = `did:elastos:${sessionStorage.getItem('PASAR_DID')}`;
        const token = sessionStorage.getItem('PASAR_TOKEN');
        const user = jwtDecode(token);
        try {
          await fetchProfileData(targetDid, user);
        } catch (e) {
          console.error(e);
        }
      } else {
        setWalletAddress(myAddress);
        setDidInfo({ name: '', description: '' });
      }
    };
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAddress, params.address]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  React.useEffect(() => {
    const getMyAddress = async () => {
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1') {
        setMyAddress(account);
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        const strWalletAddress = isInAppBrowser()
          ? await window.elastos.getWeb3Provider().address
          : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
        setMyAddress(strWalletAddress);
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
        const strWalletAddress = await walletconnect.getAccount();
        setMyAddress(strWalletAddress);
      } else if (!params.address) {
        navigate('/marketplace');
      }
      // ----------------------------------------------------------
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

  // --------------------------------- Items ------------------------------------- //

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
    'getMintedCollectiblesByWalletAddr',
    'getCollectionsByWalletAddr'
  ];
  const typeNames = ['listed', 'owned', 'minted', 'collections'];

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      Array(4)
        .fill(0)
        .forEach(async (_, i) => {
          setEachOfArray('setLoadingAssets', i, true);
          if (!loadNext) setAssets([[], [], [], []]);
          try {
            const res = await fetchAPIFrom(
              `api/v1/${apiNames[i]}?walletAddr=${walletAddress}&chain=all&sort=0&pageNum=${page}&pageSize=${showCount}`,
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
  }, [walletAddress, showCount, page]);

  const loadingSkeletons = Array(showCount).fill(null);

  return (
    <RootStyle title="MyItems | PASAR">
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
            {didInfo.name && (
              <Typography variant="subtitle2" noWrap>
                {reduceHexAddress(walletAddress)}
              </Typography>
            )}
            {didInfo.description && (
              <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
                {didInfo.description}
              </Typography>
            )}
          </Typography>
          {Object.keys(socials).length > 0 && (
            <Box sx={{ py: 1.5 }}>
              <IconLinkButtonGroup {...socials} />
            </Box>
          )}
          <Stack sx={{ justifyContent: 'center', pt: 1 }} spacing={1} direction="row">
            {badge.dia > 0 && <DIABadge balance={badge.dia} />}
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', position: 'relative', mb: 2, justifyContent: 'center' }} align="center">
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            TabIndicatorProps={{ style: { background: '#FF5082' } }}
          >
            <Tab label={`Listed (${assetCount[0]})`} value={0} />
            <Tab label={`Owned (${assetCount[1]})`} value={1} />
            <Tab label={`Minted (${assetCount[2]})`} value={2} />
            <Tab label={`Collections (${assetCount[3]})`} value={3} />
          </Tabs>
        </Box>
        <Box
          sx={{
            width: '100%',
            m: '-10px'
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
                    (i !== 3 ? (
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
                      </Stack>
                    ))
                  }
                  style={{ padding: '10px' }}
                >
                  {i !== 3 ? (
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
                          {tabAssets.map((info, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                              <CollectionCard info={info} isOwned={myAddress === info.owner} />
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
    </RootStyle>
  );
}
