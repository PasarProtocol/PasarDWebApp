// material
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
  Grid,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip
} from '@mui/material';
// import { TabContext, TabList, TabPanel } from '@mui/lab';
import SquareIcon from '@mui/icons-material/Square';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { Icon } from '@iconify/react';
import { useWeb3React } from '@web3-react/core';
import jwtDecode from 'jwt-decode';
// components
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import MyItemsSortSelect from '../../components/MyItemsSortSelect';
import AssetGrid from '../../components/marketplace/AssetGrid';
import { useEagerConnect } from '../../components/signin-dlg/hook';
import RingAvatar from '../../components/RingAvatar';
import Badge from '../../components/badge/Badge';
import KYCBadge from '../../components/badge/KYCBadge';
import DIABadge from '../../components/badge/DIABadge';
import AddressCopyButton from '../../components/AddressCopyButton';
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup';
import CollectionCard from '../../components/collection/CollectionCard';
import CollectionCardSkeleton from '../../components/collection/CollectionCardSkeleton';
import {
  queryAvatarUrl,
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
import { downloadFromUrl } from '../../components/signin-dlg/HiveService';
import {
  reduceHexAddress,
  getDiaTokenInfo,
  fetchFrom,
  getInfoFromDID,
  getDidInfoFromAddress,
  isInAppBrowser,
  getCredentialInfo
} from '../../utils/common';
import { getUserCredentials } from '../../components/signin-dlg/LoadCredentials';

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

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const ToolGroupStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));
// ----------------------------------------------------------------------
export default function MyItems() {
  const defaultDispMode = isMobile ? 1 : 0;
  const sessionDispMode = sessionStorage.getItem('disp-mode');
  const params = useParams(); // params.address
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([[], [], []]);
  const [collections, setCollections] = React.useState([]);
  const [isLoadingCollection, setLoadingCollection] = React.useState(false);
  const [isLoadingAssets, setLoadingAssets] = React.useState([false, false, false]);
  const [dispmode, setDispmode] = React.useState(
    sessionDispMode !== null ? parseInt(sessionDispMode, 10) : defaultDispMode
  );
  const [orderType, setOrderType] = React.useState(0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [tabValue, setTabValue] = React.useState(params.type !== undefined ? parseInt(params.type, 10) : 0);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [myAddress, setMyAddress] = React.useState(null);
  const [didInfo, setDidInfo] = React.useState({ name: '', description: '' });
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [updateCount, setUpdateCount] = React.useState(0);
  const [badge, setBadge] = React.useState({ dia: 0, kyc: false });
  const [socials, setSocials] = React.useState({});

  const context = useWeb3React();
  const { account } = context;

  const queryProfileSocials = {
    website: queryWebsite,
    twitter: queryTwitter,
    discord: queryDiscord,
    telegram: queryTelegram,
    medium: queryMedium
  };
  React.useEffect(() => {
    if (params.address && params.address !== myAddress) {
      setWalletAddress(params.address);
      getDidInfoFromAddress(params.address)
        .then((info) => {
          setDidInfo({ name: info.name || '', description: info.description || '' });
          if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2')
            fetchProfileData(info.did, { name: info.name || '', bio: info.description || '' });
        })
        .catch((e) => {});
    } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      setWalletAddress(myAddress);
      const targetDid = `did:elastos:${sessionStorage.getItem('PASAR_DID')}`;
      const token = sessionStorage.getItem('PASAR_TOKEN');
      const user = jwtDecode(token);
      const { name, bio } = user;
      fetchProfileData(targetDid, user);
    } else {
      setWalletAddress(myAddress);
      setDidInfo({ name: '', description: '' });
    }
  }, [myAddress, params.address]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // const triedEager = useEagerConnect();
  React.useEffect(async () => {
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1') {
      setMyAddress(account);
      // setWalletAddress(account);
    } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      const strWalletAddress = isInAppBrowser()
        ? await window.elastos.getWeb3Provider().address
        : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
      setMyAddress(strWalletAddress);
      // setWalletAddress(strWalletAddress);
    } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
      const strWalletAddress = await walletconnect.getAccount();
      setMyAddress(strWalletAddress);
      // setWalletAddress(strWalletAddress);
    } else if (!params.address) {
      navigate('/marketplace');
    }
    // ----------------------------------------------------------
  }, [account, params.address]);

  React.useEffect(() => {
    const getCredentialsList = async () => {
      const info = await getDidInfoFromAddress(params.address);
      console.log('++++++++++++', info);
      const credentials = await getUserCredentials(info.did);
      console.log('+++++++++', credentials);

      const myCredentials = await getUserCredentials(`did:elastos:${sessionStorage.getItem('PASAR_DID')}`);
      console.log('+++++++++', myCredentials);
    };
    getCredentialsList();
  }, []);

  const fetchProfileData = (targetDid, didInfo) => {
    queryName(targetDid)
      .then((res) => {
        if (res.find_message && res.find_message.items.length)
          setDidInfoValue('name', res.find_message.items[0].display_name);
        else setDidInfoValue('name', didInfo.name);

        queryDescription(targetDid).then((res) => {
          if (res.find_message && res.find_message.items.length)
            setDidInfoValue('description', res.find_message.items[0].display_name);
          else setDidInfoValue('description', didInfo.bio);
        });
        queryAvatarUrl(targetDid).then((res) => {
          if (res.find_message && res.find_message.items.length) {
            const avatarUrl = res.find_message.items[0].display_name;
            downloadFromUrl(avatarUrl).then((avatarData) => {
              if (avatarData && avatarData.length) {
                const base64Content = `data:image/png;base64,${avatarData.toString('base64')}`;
                setAvatarUrl(base64Content);
              }
            });
          }
        });
        downloadAvatar(targetDid).then((res) => {
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
        });
        queryKycMe(targetDid).then((res) => {
          if (res.find_message && res.find_message.items.length) setBadgeFlag('kyc', true);
          else setBadgeFlag('kyc', false);
        });
        Object.keys(queryProfileSocials).forEach((field) => {
          queryProfileSocials[field](targetDid).then((res) => {
            if (res.find_message && res.find_message.items.length)
              setSocials((prevState) => {
                const tempState = { ...prevState };
                tempState[field] = res.find_message.items[0].display_name;
                return tempState;
              });
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setDidInfoValue = (field, value) => {
    setDidInfo((prevState) => {
      const tempState = { ...prevState };
      tempState[field] = value;
      return tempState;
    });
  };

  const handleSwitchTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSwitchSwiper = (value) => {
    setTabValue(value);
  };

  const setLoadingAssetsOfType = (index, value) => {
    setLoadingAssets((prevState) => {
      const tempLoadingAssets = [...prevState];
      tempLoadingAssets[index] = value;
      return tempLoadingAssets;
    });
  };

  const setAssetsOfType = (index, value) => {
    if (!value) return;
    setAssets((prevState) => {
      const tempAssets = [...prevState];
      tempAssets[index] = value;
      return tempAssets;
    });
  };

  const setBadgeFlag = (type, value) => {
    setBadge((prevState) => {
      const tempFlag = { ...prevState };
      tempFlag[type] = value;
      return tempFlag;
    });
  };
  const apiNames = ['getListedCollectiblesByAddress', 'getOwnCollectiblesByAddress', 'getCreatedCollectiblesByAddress'];
  const typeNames = ['listed', 'owned', 'minted'];
  React.useEffect(async () => {
    if (walletAddress) {
      getDiaTokenInfo(walletAddress).then((dia) => {
        if (dia !== '0') setBadgeFlag('dia', dia);
        else setBadgeFlag('dia', 0);
      });
    }
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const { signal } = newController;
    setAbortController(newController);

    Array(3)
      .fill(0)
      .forEach((_, i) => {
        setLoadingAssetsOfType(i, true);
        fetchFrom(`api/v2/sticker/${apiNames[i]}/${walletAddress}?orderType=${orderType}`, { signal })
          .then((response) => {
            response
              .json()
              .then((jsonAssets) => {
                setAssetsOfType(i, jsonAssets.data);
                setLoadingAssetsOfType(i, false);
              })
              .catch((e) => {
                setLoadingAssetsOfType(i, false);
              });
          })
          .catch((e) => {
            if (e.code !== e.ABORT_ERR) setLoadingAssetsOfType(i, false);
          });
      });
  }, [walletAddress, orderType, updateCount]);

  React.useEffect(async () => {
    if (walletAddress) {
      setLoadingCollection(true);
      fetchFrom(`api/v2/sticker/getCollectionByOwner/${walletAddress}`)
        .then((response) => {
          response
            .json()
            .then((jsonAssets) => {
              setCollections(jsonAssets.data);
              setLoadingCollection(false);
            })
            .catch((e) => {
              setLoadingCollection(false);
            });
        })
        .catch((e) => {
          if (e.code !== e.ABORT_ERR) setLoadingCollection(false);
        });
    }
  }, [walletAddress]);

  const handleDispmode = (event, mode) => {
    if (mode === null) return;
    sessionStorage.setItem('disp-mode', mode);
    setDispmode(mode);
  };
  const link2Detail = (tokenId, baseToken) => {
    navigate(`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`);
  };
  const loadingSkeletons = Array(10).fill(null);

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
                    <Box sx={{display: 'inline-flex'}} ml={2}><KYCBadge size="large"/></Box>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
            {didInfo.name.length > 0 && (
              <Typography variant="subtitle2" noWrap>
                {reduceHexAddress(walletAddress)}
              </Typography>
            )}
            {didInfo.description.length > 0 && (
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
          {/* <MHidden width="smUp">
            <ToolGroupStyle>
              <MyItemsSortSelect onChange={setOrderType} sx={{ flex: 1 }} />
              <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                <ToggleButton value={0}>
                  <SquareIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <GridViewSharpIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </ToolGroupStyle>
          </MHidden> */}
        </Box>
        <Box sx={{ display: 'flex', position: 'relative', mb: 2, justifyContent: 'center' }} align="center">
          <Tabs value={tabValue} onChange={handleSwitchTab} TabIndicatorProps={{ style: { background: '#FF5082' } }}>
            <Tab label={`Listed (${assets[0].length})`} value={0} />
            <Tab label={`Owned (${assets[1].length})`} value={1} />
            <Tab label={`Minted (${assets[2].length})`} value={2} />
            <Tab label={`Collections (${collections.length})`} value={3} />
          </Tabs>
          {/* <MHidden width="smDown">
            <ToolGroupStyle>
              <MyItemsSortSelect onChange={setOrderType} />
              <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
                <ToggleButton value={0}>
                  <GridViewSharpIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <AppsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </ToolGroupStyle>
          </MHidden> */}
        </Box>
        <Box
          sx={{
            width: '100%',
            m: '-10px'
          }}
        >
          <SwipeableViews
            index={tabValue}
            onChangeIndex={handleSwitchSwiper}
            containerStyle={{
              transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
            }}
          >
            {assets.map((group, i) => (
              <Box key={i} sx={{ minHeight: 200, p: '10px' }}>
                {/* {isLoadingAssets[i] && <LoadingScreen sx={{ background: 'transparent' }} />} */}
                {!isLoadingAssets[i] ? (
                  <Box component="main">
                    {group.length > 0 ? (
                      <AssetGrid
                        assets={group}
                        type={i + 1}
                        dispmode={dispmode}
                        myaddress={myAddress}
                        updateCount={updateCount}
                        handleUpdate={setUpdateCount}
                      />
                    ) : (
                      <Typography variant="subtitle2" align="center" sx={{ mb: 3 }}>
                        No {typeNames[i]} collectible found!
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box component="main">
                    <AssetGrid
                      assets={loadingSkeletons}
                      type={i + 1}
                      dispmode={dispmode}
                      myaddress={myAddress}
                      updateCount={updateCount}
                      handleUpdate={setUpdateCount}
                    />
                  </Box>
                )}
              </Box>
            ))}
            <Box sx={{ minHeight: 200, p: '10px' }}>
              {!isLoadingCollection ? (
                <Box component="main">
                  {collections.length > 0 ? (
                    <Grid container spacing={2}>
                      {collections.map((info, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                          <CollectionCard info={info} isOwned={Boolean(true)} />
                        </Grid>
                      ))}
                    </Grid>
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
                  )}
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {Array(3)
                    .fill(0)
                    .map((item, index) => (
                      <Grid item key={index} xs={12} sm={6} md={4}>
                        <CollectionCardSkeleton key={index} />
                      </Grid>
                    ))}
                </Grid>
              )}
            </Box>
          </SwipeableViews>
        </Box>
      </Container>
    </RootStyle>
  );
}
