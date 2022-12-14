import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { round } from 'mathjs';
import ReactPlayer from 'react-player/lazy';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import { Icon } from '@iconify/react';
import { useWeb3React } from '@web3-react/core';
import { styled } from '@mui/material/styles';
import {
  Link,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Grid,
  Paper,
  Tooltip,
  Typography,
  Box,
  Modal,
  Backdrop,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Toolbar,
  SvgIcon,
  Avatar
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

// components
import { MFab, MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import CollectibleHandleSection from './CollectibleHandleSection';
import LoadingScreen from '../../components/LoadingScreen';
import AssetDetailInfo from '../../components/marketplace/AssetDetailInfo';
import CollectibleHistory from '../../components/marketplace/CollectibleHistory';
import BidList from '../../components/marketplace/BidList';
import AssetCard from '../../components/marketplace/AssetCard';
import KYCBadge from '../../components/badge/KYCBadge';
import DIABadge from '../../components/badge/DIABadge';
import Jazzicon from '../../components/Jazzicon';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import ScrollManager from '../../components/ScrollManager';
import AddressCopyButton from '../../components/AddressCopyButton';
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup';
import useSingin from '../../hooks/useSignin';
import useAuctionDlg from '../../hooks/useAuctionDlg';
import { queryName, queryKycMe, downloadAvatar } from '../../components/signin-dlg/HiveAPI';
import {
  reduceHexAddress,
  getDiaTokenInfo,

  getDidInfoFromAddress,
  isInAppBrowser,
  getTotalCountOfCoinTypes,
  getShortUrl,
  collectionTypes,
  chainTypes,
  fetchAPIFrom,
  getImageFromIPFSUrl,
  getChainIndexFromChain,
  getCoinTypeFromToken, setAllTokenPrice2, getHiveHubImageFromIPFSUrl
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

const SectionSx = {
  border: '1px solid',
  borderColor: 'action.disabledBackground',
  boxShadow: (theme) => theme.customShadows.z1
};

const PaperStyle = (props) => (
  <Paper
    sx={{
      ...SectionSx,
      p: '20px',
      ...props.sx
    }}
  >
    {props.children}
  </Paper>
);

PaperStyle.propTypes = {
  sx: PropTypes.any,
  children: PropTypes.node
};

const ToolGroupStyle = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
}));

const AvatarStyle = styled(Box)(({ src }) => ({
  width: 40,
  height: 40,
  borderRadius: '100%',
  backgroundColor: src ? 'unset' : 'black',
  marginRight: 8
}));

const Property = ({ type, name, percentage }) => (
  <Paper
    sx={{
      border: '1px solid',
      borderColor: 'action.disabledBackground',
      p: '20px',
      display: 'inline-block',
      textAlign: 'center'
    }}
  >
    <Typography variant="subtitle2" color="origin.main">
      {type}
    </Typography>
    <Typography variant="body2">{name}</Typography>
    {!!percentage && (
      <Typography variant="body2" color="text.secondary">
        {percentage}% trait
      </Typography>
    )}
  </Paper>
);

Property.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  percentage: PropTypes.number
};

const BackdropStyle = styled(Backdrop)({
  background: 'rgba(0, 0, 0, 0.8)'
});

const BidStatus = ({ isReserveMet }) => (
  <Typography variant="h5" component="div" color="origin.main" sx={{ display: 'inline-flex', alignItems: 'center' }}>
    {`Reserve Price ${isReserveMet ? 'Met' : 'Not Met'}`}
    <Box
      sx={{
        width: 26,
        height: 26,
        borderRadius: 2,
        ml: 1,
        p: '5px',
        backgroundColor: isReserveMet ? '#7CB342' : '#D60000',
        display: 'inline-flex'
      }}
    >
      <SvgIcon sx={{ fontSize: 18, color: 'success.contrastText' }}>
        <ShoppingCartIcon />
      </SvgIcon>
    </Box>
  </Typography>
);

BidStatus.propTypes = {
  isReserveMet: PropTypes.bool
};

// ----------------------------------------------------------------------
export default function CollectibleDetail() {
  const params = useParams();
  const [chain, contract, tokenId] = params.args.split('&');
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isOpenSharePopup, setOpenSharePopup] = React.useState(null);
  const [isOpenMorePopup, setOpenMorePopup] = React.useState(null);
  const [address, setAddress] = React.useState('');
  const [shareUrl, setShareUrl] = React.useState(window.location.href);
  const [collectible, setCollectible] = React.useState({});
  const [collection, setCollection] = React.useState(null);
  const [badge, setBadge] = React.useState({ creator: { dia: 0, kyc: false }, owner: { dia: 0, kyc: false } });
  const [collectionBadge] = React.useState({ dia: 0, kyc: false });
  const [didName, setDidName] = React.useState({ creator: '', owner: '' });
  const [avatarUrl, setAvatarUrl] = React.useState({ creator: null, owner: null });
  const [transRecord, setTransRecord] = React.useState([]);
  const [collectiblesInCollection, setCollectiblesInCollection] = React.useState([]);
  const [isLoadingCollectible, setLoadingCollectible] = React.useState(true);
  const [isLoadingTransRecord, setLoadingTransRecord] = React.useState(true);
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoadedImage, setLoadedImage] = React.useState(false);
  const [isPropertiesAccordionOpen, setPropertiesAccordionOpen] = React.useState(false);
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const [dispCountInCollection, setDispCountInCollection] = React.useState(3);
  const [isVideo, setIsVideo] = React.useState(false);
  const [videoIsLoaded, setVideoIsLoaded] = React.useState(false);
  const { pasarLinkAddress } = useSingin();
  const { updateCount } = useAuctionDlg();

  const imageRef = React.useRef();
  const imageBoxRef = React.useRef();

  const context = useWeb3React();
  const { account } = context;

  const defaultCollection = collectionTypes[0];

  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  };

  React.useEffect(() => {
    setAllTokenPrice2(setCoinPriceByType);
  }, []);

  React.useEffect(() => {
    getShortUrl(window.location.href).then((shortUrl) => {
      setShareUrl(shortUrl);
    });
    determineDispCount();
  }, [tokenId]);

  function determineDispCount() {
    const { innerWidth: width } = window;
    if (width > 900)
      // in case of md
      setDispCountInCollection(4);
    else if (width > 700) setDispCountInCollection(3);
    else setDispCountInCollection(2);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
      if (sessionLinkFlag) {
        if (sessionLinkFlag === '1') setAddress(account);
        if (sessionLinkFlag === '2') {
          if (isInAppBrowser()) setAddress(await window.elastos.getWeb3Provider().address);
          else if (essentialsConnector.getWalletConnectProvider())
            setAddress(essentialsConnector.getWalletConnectProvider().wc.accounts[0]);
        }
        if (sessionLinkFlag === '3') walletconnect.getAccount().then(setAddress);
      }
    };
    fetchData();
  }, [account, pasarLinkAddress]);

  React.useEffect(() => {
    const fetchData = async () => {
      window.scrollTo(0, 0);
      setLoadingCollectible(true);
      try {
        try {
          const res = await fetchAPIFrom(
            `api/v1/getCollectibleInfo?baseToken=${contract}&chain=${chain}&tokenId=${tokenId}`,
            {}
          );
          const json = await res.json();
          let collectibleDetail = json?.data || {};
          if (collectibleDetail?.uniqueKey) {
            const resSaleType = await fetchAPIFrom('api/v1/checkFirstSale', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify([collectibleDetail.uniqueKey])
            });
            const jsonSaleType = await resSaleType.json();
            if ((jsonSaleType?.data || []).length)
              collectibleDetail = { ...collectibleDetail, isFirstSale: jsonSaleType.data[0]?.isFirstSale || false };
          }
          if (collectibleDetail?.order?.orderId) {
            const resBid = await fetchAPIFrom(
              `api/v1/getBidsHistory?chain=${chain === 'v1'? 'ela' : chain}&orderId=${collectibleDetail.order.orderId}`,
              {}
            );
            const jsonBid = await resBid.json();
            collectibleDetail = { ...collectibleDetail, bidList: jsonBid?.data || [] };
          }
          setCollectible(collectibleDetail);
          const imgUrl = (collectibleDetail.type === 'FeedsChannel' || collectibleDetail.type === 'HiveNode')
              ? getHiveHubImageFromIPFSUrl(collectibleDetail.data.avatar)
              : getImageFromIPFSUrl(collectibleDetail?.data?.image || collectibleDetail?.image);
          setImageUrl(imgUrl);
          try {
            const resImg = await fetch(imgUrl);
            if (resImg.headers.get('content-type').startsWith('video')) setIsVideo(true);
          } catch (e) {
            console.error(e);
          }
          if ((collectibleDetail?.attributes || []).length) setPropertiesAccordionOpen(true);
          else setPropertiesAccordionOpen(false);
          try {
            const creatorDia = await getDiaTokenInfo(collectibleDetail?.royaltyOwner);
            const ownerDia = await getDiaTokenInfo(collectibleDetail?.tokenOwner);
            setBadgeOfUser('creator', 'dia', creatorDia * 1);
            setBadgeOfUser('owner', 'dia', ownerDia * 1);
          } catch (e) {
            console.error(e);
          }
          try {
            if (collectibleDetail?.royaltyOwner) {
              const creatorInfo = await getDidInfoFromAddress(collectibleDetail.royaltyOwner);
              setDidName({ creator: creatorInfo.name, owner: creatorInfo.name });
              if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') fetchProfileData(creatorInfo.did);
            }
            if (collectibleDetail?.tokenOwner && collectibleDetail.royaltyOwner !== collectibleDetail.tokenOwner) {
              const ownerInfo = await getDidInfoFromAddress(collectibleDetail.tokenOwner);
              setDidNameOfUser('owner', ownerInfo.name || '');
              if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') fetchProfileData(ownerInfo.did, 'owner');
            }
          } catch (e) {
            console.error(e);
          }
        } catch (e) {
          console.error(e);
        }
        try {
          const res = await fetchAPIFrom(`api/v1/getCollectionInfo?chain=${chain}&collection=${contract}`, {});
          const json = await res.json();
          const collectionInfo = json?.data || {};
          setCollection({
            ...collectionInfo,
            avatar: getImageFromIPFSUrl(collectionInfo?.data?.avatar),
            socials: collectionInfo?.data?.socials || []
          });
        } catch (e) {
          console.error(e);
        }
        try {
          const res = await fetchAPIFrom(
            `api/v1/getCollectiblesOfCollection?collection=${contract}&chain=${chain}&num=4&exceptToken=${tokenId}`,
            {}
          );
          const json = await res.json();
          setCollectiblesInCollection(json?.data || []);
        } catch (e) {
          console.error(e);
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingCollectible(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, contract, tokenId]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingTransRecord(true);
      try {
        const res = await fetchAPIFrom(
          `api/v1/getTransactionsOfToken?baseToken=${contract}&chain=${chain}&tokenId=${tokenId}&eventType=&sort=-1`,
          {}
        );
        const json = await res.json();
        const grouped =
          json?.data?.data.reduce((res, item, id, arr) => {
            if (id > 0 && item.transactionHash === arr[id - 1].transactionHash) {
              res[res.length - 1].push(item);
            } else {
              res.push(id < arr.length - 1 && item.transactionHash === arr[id + 1].transactionHash ? [item] : item);
            }
            return res;
          }, []) || [];
        setTransRecord(grouped.slice(0, 10));
      } catch (e) {
        console.error(e);
      }
      setLoadingTransRecord(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCount, tokenId]);

  const fetchProfileData = (targetDid, type = 'all') => {
    queryName(targetDid)
      .then((res) => {
        if (res.find_message && res.find_message.items.length) {
          const displayName = res.find_message.items[0].display_name;
          if (type === 'all') setDidName({ creator: displayName, owner: displayName });
          else setDidNameOfUser(type, displayName);
        }
        downloadAvatar(targetDid).then((res) => {
          if (res && res.length) {
            const base64Content = res.reduce((content, code) => {
              content = `${content}${String.fromCharCode(code)}`;
              return content;
            }, '');
            const displayAvatar = `data:image/png;base64,${base64Content}`;
            if (type === 'all')
              setAvatarUrl((prevState) => {
                if (!prevState.creator) return { creator: displayAvatar, owner: displayAvatar };
                return prevState;
              });
            else
              setAvatarUrl((prevState) => {
                const tempAvatar = { ...prevState };
                if (!tempAvatar[type]) tempAvatar[type] = displayAvatar;
                return tempAvatar;
              });
          }
        });
        queryKycMe(targetDid).then((res) => {
          if (res.find_message && res.find_message.items.length) {
            if (type === 'all')
              setBadge((prevState) => {
                const tempState = { ...prevState };
                tempState.creator.kyc = true;
                tempState.owner.kyc = true;
                return tempState;
              });
            else setBadgeOfUser(type, 'kyc', true);
          } else if (type === 'all')
            setBadge((prevState) => {
              const tempState = { ...prevState };
              tempState.creator.kyc = false;
              tempState.owner.kyc = false;
              return tempState;
            });
          else setBadgeOfUser(type, 'kyc', false);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onImgLoad = ({ target: img }) => {
    if (img.alt && img.src) setLoadedImage(true);
    handleResize();
  };

  const openSharePopupMenu = (event) => {
    setOpenSharePopup(event.currentTarget);
  };
  const openMorePopupMenu = (event) => {
    setOpenMorePopup(event.currentTarget);
  };

  const handleCloseSharePopup = () => {
    setOpenSharePopup(null);
  };
  const handleCloseMorePopup = () => {
    setOpenMorePopup(null);
  };

  const setBadgeOfUser = (usertype, badgetype, value) => {
    setBadge((prevState) => {
      const tempBadge = { ...prevState };
      tempBadge[usertype][badgetype] = value;
      return tempBadge;
    });
  };

  const setDidNameOfUser = (type, value) => {
    setDidName((prevState) => {
      const tempDidName = { ...prevState };
      tempDidName[type] = value;
      return tempDidName;
    });
  };

  function handleResize() {
    determineDispCount();
    if (!imageRef.current) return;
    const { innerWidth: winWidth, innerHeight: winHeight } = window;
    const { clientWidth: imgWidth, clientHeight: imgHeight } = imageRef.current;
    if (imageBoxRef.current) {
      if (imgWidth / winWidth > imgHeight / winHeight) {
        imageBoxRef.current.style.width = 'calc(100% - 24px)';
        imageBoxRef.current.style.height = '';
      } else {
        imageBoxRef.current.style.width = 'fit-content';
        imageBoxRef.current.style.height = 'calc(100% - 24px)';
      }
    }
  }
  window.addEventListener('resize', handleResize);

  const handleErrorImage = (e) => {
    e.target.src = '/static/broken-image.svg';
    setImageUrl(e.target.src);
  };

  const properties = collectible?.attributes || [];
  const chainType = getChainIndexFromChain(chain) - 1;
  const tempChainTypes = [...chainTypes];
  tempChainTypes[0].name = 'Elastos Smart Chain (ESC)';

  return (
    <RootStyle title="Collectible | PASAR">
      <ScrollManager scrollKey="asset-detail-key" />
      <Box
        sx={{
          py: 6,
          mb: 2,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : '#060c14')
        }}
      >
        <Container maxWidth="lg" align="center" sx={{ position: 'relative', px: { sm: 3, md: 12 } }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            {((!isVideo && !isLoadedImage) || (isVideo && !videoIsLoaded)) && (
              <Box
                draggable={false}
                component="img"
                alt={collectible.name}
                src="/static/circle-loading.svg"
                sx={{ maxHeight: 400, borderRadius: 1 }}
              />
            )}
            {!isVideo ? (
              <Box
                draggable={false}
                component="img"
                alt={collectible.name}
                src={imageUrl}
                onLoad={onImgLoad}
                onError={handleErrorImage}
                sx={{ maxHeight: 400, borderRadius: 1, display: isLoadedImage ? 'block' : 'none' }}
                ref={imageRef}
              />
            ) : (
              <ReactPlayer
                playing
                loop={Boolean(true)}
                muted={Boolean(true)}
                url={imageUrl}
                onReady={() => setVideoIsLoaded(true)}
                width="100%"
                height={videoIsLoaded ? 360 : 0}
              />
            )}
            {address !== collectible.tokenOwner &&
              ((!isVideo && isLoadedImage) || (isVideo && videoIsLoaded)) &&
              !imageUrl.endsWith('broken-image.svg') && (
                <Box
                  draggable={false}
                  component="img"
                  src="/static/logo-xs-round.svg"
                  sx={{ position: 'absolute', width: '6%', left: '8%', bottom: '8%' }}
                />
              )}
          </Box>
          <ToolGroupStyle>
            <MFab
              size="small"
              onClick={() => setFullScreen(!isFullScreen)}
              disabled={
                (!isVideo && !isLoadedImage) || (isVideo && !videoIsLoaded) || imageUrl.endsWith('broken-image.svg')
              }
            >
              <FullscreenIcon />
            </MFab>
            <MFab size="small" sx={{ ml: 1 }} onClick={openSharePopupMenu}>
              <ShareOutlinedIcon />
            </MFab>
            <Menu
              keepMounted
              id="simple-menu"
              anchorEl={isOpenSharePopup}
              onClose={handleCloseSharePopup}
              open={Boolean(isOpenSharePopup)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleCloseSharePopup}>
                <FacebookShareButton
                  url={shareUrl}
                  description="share item"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <FacebookIcon size={32} round />
                  &nbsp;&nbsp;Share on Facebook
                </FacebookShareButton>
              </MenuItem>
              <MenuItem onClick={handleCloseSharePopup}>
                <TwitterShareButton
                  url={shareUrl}
                  description="share item"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <TwitterIcon size={32} round />
                  &nbsp;&nbsp;Share on Twitter
                </TwitterShareButton>
              </MenuItem>
            </Menu>
            <MFab size="small" sx={{ ml: 1, display: 'none' }} onClick={openMorePopupMenu}>
              <MoreHorizIcon />
            </MFab>
            <Menu
              keepMounted
              id="simple-menu"
              anchorEl={isOpenMorePopup}
              onClose={handleCloseMorePopup}
              open={Boolean(isOpenMorePopup)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleCloseMorePopup}>
                <ThumbDownOffAltIcon />
                &nbsp;Report Creator
              </MenuItem>
              <MenuItem onClick={handleCloseMorePopup}>
                <ThumbDownOffAltIcon />
                &nbsp;Report Owner
              </MenuItem>
            </Menu>
          </ToolGroupStyle>
          <Modal
            open={isFullScreen}
            onClose={() => setFullScreen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropComponent={BackdropStyle}
          >
            <Box>
              <Toolbar
                sx={{
                  position: 'fixed',
                  top: 0,
                  width: '100vw',
                  backgroundColor: 'rgba(0,0,0,.5)',
                  zIndex: 1
                }}
              >
                <Box sx={{ flexGrow: 1 }} />
                <IconButton edge="start" aria-label="menu" sx={{ color: 'white' }} onClick={() => setFullScreen(false)}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                ref={imageBoxRef}
              >
                {!isVideo ? (
                  <Box
                    draggable={false}
                    component="img"
                    alt={collectible.name}
                    src={imageUrl}
                    onError={(e) => {
                      e.target.src = '/static/broken-image.svg';
                    }}
                    sx={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <ReactPlayer
                    playing
                    loop={Boolean(true)}
                    muted={Boolean(true)}
                    url={imageUrl}
                    width="100%"
                    height="100%"
                  />
                )}
                {address !== collectible.tokenOwner && ((!isVideo && isLoadedImage) || (isVideo && videoIsLoaded)) && (
                  <Box
                    draggable={false}
                    component="img"
                    src="/static/logo-xs-round.svg"
                    sx={{ position: 'absolute', width: '6%', left: '8%', bottom: '8%' }}
                  />
                )}
              </Box>
            </Box>
          </Modal>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PaperStyle>
              <Typography variant="h4" sx={{ wordBreak: 'break-all' }}>
                {collectible.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                {collectible.description}
              </Typography>
              <Stack sx={{ mt: 2 }} spacing={1}>
                <Typography variant="subtitle2">Minted By</Typography>
                <Stack direction="row">
                  <Typography variant="body2" component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link
                      to={`/profile/others/${collectible.royaltyOwner}`}
                      component={RouterLink}
                      color="text.primary"
                      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1 }}
                    >
                      {avatarUrl.creator ? (
                        <Avatar alt="user" src={avatarUrl.creator} sx={{ width: 40, height: 40, mr: 1 }} />
                      ) : (
                        <Jazzicon address={collectible.royaltyOwner} />
                      )}
                      {didName.creator ? didName.creator : reduceHexAddress(collectible.royaltyOwner)}
                    </Link>
                    <Stack spacing={0.6} direction="row">
                      {badge.creator.kyc && (
                        <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                          <Box>
                            <KYCBadge />
                          </Box>
                        </Tooltip>
                      )}
                      {badge.creator.dia > 0 && <DIABadge balance={badge.creator.dia} />}
                    </Stack>
                  </Typography>
                </Stack>
                <Typography variant="subtitle2">Owner</Typography>
                <Stack direction="row">
                  <Typography variant="body2" component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link
                      to={`/profile/others/${collectible.tokenOwner}`}
                      component={RouterLink}
                      color="text.primary"
                      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1 }}
                    >
                      {avatarUrl.owner ? (
                        <Avatar alt="user" src={avatarUrl.owner} sx={{ width: 40, height: 40, mr: 1 }} />
                      ) : (
                        <Jazzicon address={collectible.tokenOwner} />
                      )}
                      {didName.owner ? didName.owner : reduceHexAddress(collectible.tokenOwner)}
                    </Link>
                    <Stack spacing={0.6} direction="row">
                      {badge.owner.kyc && (
                        <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                          <Box>
                            <KYCBadge />
                          </Box>
                        </Tooltip>
                      )}
                      {badge.owner.dia > 0 && <DIABadge balance={badge.owner.dia} />}
                    </Stack>
                  </Typography>
                </Stack>
                <Typography variant="subtitle2">Collection</Typography>
                {collection ? (
                  <Link
                    to={`/collections/detail/${[collection.chain, collection.token].join('&')}`}
                    component={RouterLink}
                    sx={{ color: 'inherit' }}
                  >
                    <Stack direction="row">
                      {collection?.avatar ? (
                        <AvatarStyle draggable={false} component="img" src={collection?.avatar} />
                      ) : (
                        <AvatarStyle sx={{ p: 1 }} />
                      )}
                      <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ alignItems: 'center', wordBreak: 'break-all' }}>
                          {collection.name} ({collection.symbol})
                        </Typography>
                      </Box>
                    </Stack>
                  </Link>
                ) : (
                  <Stack direction="row">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '100%',
                        p: 1,
                        backgroundColor: 'black',
                        display: 'flex',
                        mr: 1
                      }}
                    >
                      <Box draggable={false} component="img" src={defaultCollection.avatar} />
                    </Box>
                    <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ alignItems: 'center', wordBreak: 'break-all' }}>
                        {defaultCollection.name} ({defaultCollection.symbol})
                      </Typography>
                    </Box>
                  </Stack>
                )}
                <Typography variant="subtitle2">Blockchain</Typography>
                <Stack direction="row">
                  {chainType < 0 ? (
                    <AvatarStyle draggable={false} sx={{ background: (theme) => theme.palette.origin.main }} />
                  ) : (
                    <>
                      <Box sx={{ borderRadius: '100%', overflow: 'hidden', mr: 1 }}>
                        <AvatarStyle
                          component="img"
                          src={`/static/${tempChainTypes[chainType].icon}`}
                          draggable={false}
                          sx={{
                            background: tempChainTypes[chainType].color,
                            p: '9px',
                            borderRadius: 0,
                            mr: 0
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ alignItems: 'center', wordBreak: 'break-all' }}>
                          {tempChainTypes[chainType].name}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </Stack>
            </PaperStyle>
            <PaperStyle sx={{ mt: 2, minHeight: { xs: 'unset', sm: 200 } }}>
              {isLoadingCollectible ? <LoadingScreen /> : <CollectibleHandleSection {...{ collectible, address }} />}
            </PaperStyle>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{ height: '100%', p: '15px 20px', position: 'relative' }}>
              <Typography variant="h5" sx={{ my: 1 }}>
                Item Details
              </Typography>
              <AssetDetailInfo detail={collectible} />
              <Button
                to={`/explorer/collectible/detail/${[collectible.chain, collectible.contract, collectible.tokenId].join(
                  '&'
                )}`}
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
                sx={{ position: 'absolute', right: 32, bottom: 15 }}
              >
                See more details on Pasar Explorer
              </Button>
            </PaperStyle>
          </Grid>
          {(collectible?.order?.bids ?? 0) > 0 && (
            <Grid item xs={12}>
              <PaperStyle>
                <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
                  Bids
                  {!!((collectible?.order?.reservePrice ?? 0) * 1) && (
                    <>
                      {' '}
                      -{' '}
                      <BidStatus
                        isReserveMet={collectible.bidList[0].price / 1e18 >= collectible.reservePrice / 1e18}
                      />
                    </>
                  )}
                </Typography>
                <BidList dataList={collectible.bidList} coinType={getCoinTypeFromToken(collectible)} />
              </PaperStyle>
            </Grid>
          )}
          {isPropertiesAccordionOpen && (
            <Grid item xs={12}>
              <Accordion defaultExpanded={Boolean(true)} sx={{ ...SectionSx }}>
                <AccordionSummary
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                  sx={{ px: '20px' }}
                >
                  <Typography variant="h5">Properties</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: '20px' }}>
                  <Grid container spacing={1}>
                    {properties.map((item, index) => (
                      <Grid item key={index}>
                        <Property
                          type={item?.trait_type || ''}
                          name={item?.value || ''}
                          percentage={round((item?.percentage ?? 0) * 100, 2)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
          <Grid item xs={12}>
            <Accordion defaultExpanded={Boolean(true)} sx={{ ...SectionSx }}>
              <AccordionSummary
                expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                sx={{ px: '20px' }}
              >
                <Typography variant="h5">History</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pb: '50px', position: 'relative', px: '20px' }}>
                <CollectibleHistory
                  isLoading={isLoadingTransRecord}
                  dataList={transRecord}
                  creator={{ address: collectible?.royaltyOwner || '', name: didName?.creator || '' }}
                />
                <Button
                  to={`/explorer/collectible/detail/${[
                    collectible.chain,
                    collectible.contract,
                    collectible.tokenId
                  ].join('&')}`}
                  size="small"
                  color="inherit"
                  component={RouterLink}
                  endIcon={<Icon icon={arrowIosForwardFill} />}
                  sx={{ position: 'absolute', right: 32, bottom: 16 }}
                >
                  See more details on Pasar Explorer
                </Button>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {collection && (
            <Grid item xs={12}>
              <Accordion defaultExpanded={Boolean(true)} sx={{ ...SectionSx }}>
                <AccordionSummary
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                  sx={{ px: '20px' }}
                >
                  <Typography variant="h5">About this collection</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: '50px', position: 'relative', px: '20px' }}>
                  <Stack direction="row" spacing={2}>
                    <MHidden width="smDown">
                      <Link
                        to={`/collections/detail/${[collection.chain, collection.token].join('&')}`}
                        component={RouterLink}
                        sx={{ display: 'flex', color: 'inherit' }}
                      >
                        {collection?.avatar ? (
                          <AvatarStyle
                            draggable={false}
                            component="img"
                            src={collection?.avatar}
                            sx={{ minWidth: 40 }}
                          />
                        ) : (
                          <AvatarStyle sx={{ p: 1, minWidth: 40 }} />
                        )}
                      </Link>
                    </MHidden>
                    <Stack spacing={1} sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Stack direction="row">
                        <MHidden width="smUp">
                          <Link
                            to={`/collections/detail/${[collection.chain, collection.token].join('&')}`}
                            component={RouterLink}
                            sx={{ display: 'flex', color: 'inherit' }}
                          >
                            {collection?.avatar ? (
                              <AvatarStyle
                                draggable={false}
                                component="img"
                                src={collection?.avatar}
                                sx={{ minWidth: 40 }}
                              />
                            ) : (
                              <AvatarStyle sx={{ p: 1, minWidth: 40 }} />
                            )}
                          </Link>
                        </MHidden>
                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                          {collection?.name || ''}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        {collection?.data?.description || ''}
                      </Typography>
                      {!!collection.owner && !!collection.token && (
                        <Box>
                          <Tooltip title="Owner Address" arrow enterTouchDelay={0}>
                            <Box sx={{ mr: 1, mb: 1, display: 'inline-flex' }}>
                              <AddressCopyButton type="diamond" address={collection.owner} />
                            </Box>
                          </Tooltip>
                          <Tooltip title="Contract Address" arrow enterTouchDelay={0}>
                            <Box sx={{ display: 'inline-flex' }}>
                              <AddressCopyButton type="contract" address={collection.token} />
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                      <IconLinkButtonGroup {...collection.socials} align="left" />
                      <Stack spacing={1} sx={{}}>
                        {collectionBadge.dia > 0 && <DIABadge balance={collectionBadge.dia} />}
                        {collectionBadge.kyc && (
                          <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                            <Box sx={{ display: 'inline-flex' }}>
                              <KYCBadge />
                            </Box>
                          </Tooltip>
                        )}
                        {collectiblesInCollection.length > 0 ? (
                          <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
                            <Typography variant="subtitle2">More from this collection</Typography>
                            <Box
                              display="grid"
                              gridTemplateColumns={`repeat(${dispCountInCollection}, minmax(0px, 1fr))`}
                              gap={1.5}
                            >
                              {collectiblesInCollection.slice(0, dispCountInCollection).map((item, _i) => {
                                const coinType = getCoinTypeFromToken(item);
                                return (
                                  <AssetCard
                                    key={_i}
                                    {...item}
                                    thumbnail={ (item.type === 'FeedsChannel' || item.type === 'HiveNode') ? getHiveHubImageFromIPFSUrl(item.data.avatar): getImageFromIPFSUrl(item?.data?.image || item?.image)}
                                    type={0}
                                    isLink={Boolean(true)}
                                    coinUSD={coinPrice[coinType.index]}
                                    coinType={coinType}
                                    isMoreLink={
                                      collectiblesInCollection.slice(0, dispCountInCollection).length === _i + 1
                                    }
                                  />
                                );
                              })}
                            </Box>
                          </Stack>
                        ) : (<Typography variant="subtitle2">No other collectibles in this collection</Typography>)}
                      </Stack>
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
          <Grid item xs={12}>
            <Link
              to={`/explorer/collectible/detail/${[chain, contract, tokenId].join('&')}`}
              component={RouterLink}
              underline="none"
            >
              <PaperStyle sx={{ position: 'relative' }}>
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ my: 1, flex: 1 }}>
                    Analytics and transaction record
                  </Typography>
                  <ArrowForwardIcon />
                </Stack>
              </PaperStyle>
            </Link>
          </Grid>
        </Grid>
        {!isLoadingCollectible && <CollectibleHandleSection {...{ collectible, address }} onlyHandle={Boolean(true)} />}
      </Container>
    </RootStyle>
  );
}
