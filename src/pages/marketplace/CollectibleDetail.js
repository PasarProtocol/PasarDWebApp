import React from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {round} from 'mathjs'
import Lightbox from 'react-image-lightbox';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from "react-share";
import { Icon } from '@iconify/react';
import { useWeb3React } from "@web3-react/core";
import { styled } from '@mui/material/styles';
import { Link, Container, Accordion, AccordionSummary, AccordionDetails, Stack, Grid, Paper, Tooltip,
  Typography, Box, Modal, Backdrop, Menu, MenuItem, Button, IconButton, Toolbar } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

// components
import { MFab, MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Countdown from '../../components/Countdown';
import AssetDetailInfo from '../../components/marketplace/AssetDetailInfo';
import CollectibleHistory from '../../components/marketplace/CollectibleHistory';
import BidList from '../../components/marketplace/BidList';
import Badge from '../../components/Badge';
import Jazzicon from '../../components/Jazzicon';
import PurchaseDlg from '../../components/dialog/Purchase'
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import ScrollManager from '../../components/ScrollManager'
import useSingin from '../../hooks/useSignin';
import {blankAddress, marketContract} from '../../config'
import { reduceHexAddress, getAssetImage, getTime, getCoinUSD, getDiaTokenInfo, fetchFrom, getInfoFromDID, getDidInfoFromAddress, isInAppBrowser } from '../../utils/common';

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

const PaperStyle = (props) => (
  <Paper
    sx={{
        border: '1px solid',
        borderColor: 'action.disabledBackground',
        boxShadow: (theme) => theme.customShadows.z1,
        p: '20px',
        ...props.sx
    }}
  >
    {props.children}
  </Paper>
)
const ToolGroupStyle = styled(Box)(({ theme }) => ({
  // display: block
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
}));
const AvatarStyle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '100%',
  backgroundColor: 'black',
  marginRight: 8
}));
const StickyPaperStyle = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  boxShadow: 'rgb(230 230 230) 0px -5px 12px',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '16px 16px 0 0'
}));
const Property = ({type, name}) => (
  <Paper
    sx={{
        border: '1px solid',
        borderColor: 'action.disabledBackground',
        p: '20px',
        display: 'inline-block'
    }}
  >
    <Typography variant="body2" color="origin.main">{type}</Typography>
    <Typography variant="body2">{name}</Typography>
  </Paper>
)
const BackdropStyle = styled(Backdrop)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.8)'
}));
// ----------------------------------------------------------------------
export default function CollectibleDetail() {
  const navigate = useNavigate();
  const params = useParams(); // params.collection
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isOpenSharePopup, setOpenSharePopup] = React.useState(null);
  const [isOpenMorePopup, setOpenMorePopup] = React.useState(null);
  const [coinUSD, setCoinUSD] = React.useState(0);
  const [address, setAddress] = React.useState('');

  const [collectible, setCollectible] = React.useState({});
  const [diaBadge, setDiaBadge] = React.useState({creator: false, owner: false});
  const [didName, setDidName] = React.useState({creator: '', owner: ''});
  const [isForAuction, setForAuction] = React.useState(false);
  const [transRecord, setTransRecord] = React.useState([]);
  const [bidList, setBidList] = React.useState([]);
  const [isLoadingCollectible, setLoadingCollectible] = React.useState(true);
  const [isLoadingTransRecord, setLoadingTransRecord] = React.useState(true);
  const [isLoadingBidList, setLoadingBid] = React.useState(true);
  const [isLoadedImage, setLoadedImage] = React.useState(false);
  const [isPropertiesAccordionOpen, setPropertiesAccordionOpen] = React.useState(false);
  const [isOpenPurchase, setPurchaseOpen] = React.useState(false);
  const [didSignin, setSignin] = React.useState(false);
  const [buyClicked, setBuyClicked] = React.useState(false);
  const { pasarLinkAddress } = useSingin()

  const imageRef = React.useRef();
  const imageBoxRef = React.useRef();
  
  const context = useWeb3React()
  const { account } = context;
  React.useEffect(async() => {
    const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    setSignin(!!sessionLinkFlag)
    if(buyClicked&&!!sessionLinkFlag){
      setBuyClicked(false)
      setTimeout(()=>{setPurchaseOpen(true)}, 300)
    }
  }, [pasarLinkAddress]);

  React.useEffect(async() => {
    const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS')
    if(sessionLinkFlag){
      if(sessionLinkFlag==='1')
        setAddress(account)
      if(sessionLinkFlag==='2'){
        if(isInAppBrowser())
          setAddress(await window.elastos.getWeb3Provider().address)
        else if(essentialsConnector.getWalletConnectProvider())
          setAddress(essentialsConnector.getWalletConnectProvider().wc.accounts[0])
      }
      if(sessionLinkFlag==='3')
        walletconnect.getAccount().then(setAddress)
    }
  }, [account]);
  React.useEffect(async () => {
    window.scrollTo(0,0)
    setCoinUSD(await getCoinUSD())
    const resCollectible = await fetchFrom(`sticker/api/v1/getCollectibleByTokenId?tokenId=${params.collection}`);
    const jsonCollectible = await resCollectible.json();
    if(jsonCollectible.data){
      try{
        setCollectible(jsonCollectible.data);
        getDiaTokenInfo(jsonCollectible.data.royaltyOwner).then(dia=>{
          if(dia!=='0')
            setDiaBadgeOfUser('creator', true)
        })
        getDiaTokenInfo(jsonCollectible.data.holder).then(dia=>{
          if(dia!=='0')
            setDiaBadgeOfUser('owner', true)
        })
        if(jsonCollectible.data.royaltyOwner === jsonCollectible.data.holder){
          getDidInfoFromAddress(jsonCollectible.data.royaltyOwner)
            .then((info) => {
              if(info.name)
                setDidName({creator: info.name, owner: info.name})
            })
            .catch((e) => {
            })
        } else {
          getDidInfoFromAddress(jsonCollectible.data.royaltyOwner)
            .then((info) => {
              setDidNameOfUser('creator', info.name || '')
            })
            .catch((e) => {
            })
  
          getDidInfoFromAddress(jsonCollectible.data.holder)
            .then((info) => {
              setDidNameOfUser('owner', info.name || '')
            })
            .catch((e) => {
            })
        }
        if(jsonCollectible.data.properties && Object.keys(jsonCollectible.data.properties).length>0)
          setPropertiesAccordionOpen(true)
      } catch(e) {
        console.log(e)
      }
    }
    setLoadingCollectible(false);
    // setForAuction(true);

    const tempBidArr = [
      {'price': 50000000000000000000, 'to': '0x504342BF737Cce34F764E1EB0951AfbB1a3fcd10', 'date': 1641398431},
      {'price': 60000000000000000000, 'to': '0x604342BF737Cce34F764E1EB0951AfbB1a3fcd10', 'date': 1641398431},
      {'price': 70000000000000000000, 'to': '0x704342BF737Cce34F764E1EB0951AfbB1a3fcd10', 'date': 1641398431}
    ]
    setBidList(tempBidArr)
    setLoadingBid(false)
  }, []);
  
  React.useEffect(async () => {
    setLoadingTransRecord(true);
    fetchFrom(`sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.collection}&method=&timeOrder=-1`).then(response => {
      response.json().then(jsonTransactions => {
        setTransRecord(jsonTransactions.data.filter((trans)=>
          !((trans.event==="SafeTransferFrom"||trans.event==="SafeTransferFromWithMemo") && (trans.to===blankAddress||trans.to===marketContract))
        ).slice(0,10));
        setLoadingTransRecord(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingTransRecord(false);
    });
  }, []);

  const onImgLoad = ({target:img}) => {
    if(img.alt)
      setLoadedImage(true)
    handleResize()
  }
  
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
  
  const setDiaBadgeOfUser = (type, value) => {
    setDiaBadge((prevState) => {
      const tempDiaBadge = {...prevState};
      tempDiaBadge[type] = value;
      return tempDiaBadge;
    });
  };
  
  const setDidNameOfUser = (type, value) => {
    setDidName((prevState) => {
      const tempDidName = {...prevState};
      tempDidName[type] = value;
      return tempDidName;
    });
  };

  function handleResize() {
    if(!imageRef.current)
      return
    const { innerWidth: winWidth, innerHeight: winHeight } = window;
    const { clientWidth: imgWidth, clientHeight: imgHeight } = imageRef.current;
    if(imageBoxRef.current){
      if(imgWidth/winWidth > imgHeight/winHeight){
        imageBoxRef.current.style.width = 'calc(100% - 24px)'
        imageBoxRef.current.style.height = ''
      }
      else {
        imageBoxRef.current.style.width = 'fit-content'
        imageBoxRef.current.style.height = 'calc(100% - 24px)'
      }
    }
  }
  
  const openSignin = (e)=>{
    if(document.getElementById("signin")){
      setBuyClicked(true)
      document.getElementById("signin").click()
    }
  }
  
  window.addEventListener('resize', handleResize);
  const properties = collectible&&collectible.properties?collectible.properties:{}

  const tempDeadLine = getTime(new Date('2022-01-25').getTime()/1000)
  return (
    <RootStyle title="Collectible | PASAR">
      <ScrollManager scrollKey="asset-detail-key"/>
      <Box
        sx={{
          py: 6,
          mb: 2,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
        }}
      >
        <Container maxWidth="lg" align="center" sx={{position: 'relative', px: {sm: 3, md: 12}}}>
          <Box sx={{position: 'relative', display: 'inline-block'}}>
            <Box
                draggable = {false}
                component="img"
                alt={collectible.name}
                src={getAssetImage(collectible)}
                onLoad={onImgLoad}
                onError={(e) => {e.target.src = '/static/circle-loading.svg';}}
                sx={{ maxHeight: 400, borderRadius: 1 }}
                ref={imageRef}
            />
            {
              address!==collectible.holder&&isLoadedImage&&
              <Box
                  draggable = {false}
                  component="img"
                  src='/static/logo-xs-round.svg'
                  sx={{ position: 'absolute', width: '6%', left: '8%', bottom: '8%' }}
              />
            }
          </Box>
          <ToolGroupStyle>
            <MFab size="small" onClick={()=>{setFullScreen(!isFullScreen)}}>
              <FullscreenIcon />
            </MFab>
            <MFab size="small" sx={{ml: 1}} onClick={openSharePopupMenu}>
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
                  url={window.location.href}
                  // quote="Check out this item on Pasar"
                  description="share item"
                  style={{display: 'flex', alignItems: 'center'}}
                >
                  <FacebookIcon size={32} round />&nbsp;&nbsp;Share on Facebook
                </FacebookShareButton>
              </MenuItem>
              <MenuItem onClick={handleCloseSharePopup}>
                <TwitterShareButton
                  url={window.location.href}
                  description="share item"
                  style={{display: 'flex', alignItems: 'center'}}
                >
                  <TwitterIcon size={32} round />&nbsp;&nbsp;Share on Twitter
                </TwitterShareButton>
              </MenuItem>
            </Menu>
            <MFab size="small" sx={{ml: 1, display: 'none'}} onClick={openMorePopupMenu}>
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
                <ThumbDownOffAltIcon/>&nbsp;Report Creator
              </MenuItem>
              <MenuItem onClick={handleCloseMorePopup}>
                <ThumbDownOffAltIcon/>&nbsp;Report Owner
              </MenuItem>
              {/* <MenuItem onClick={handleCloseMorePopup}>
                <ShareOutlinedIcon/>&nbsp;Share
              </MenuItem> */}
            </Menu>
          </ToolGroupStyle>

          <Modal
            open={isFullScreen}
            onClose={()=>setFullScreen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropComponent={BackdropStyle}
          >
            <Box>
              <Toolbar sx={{
                  position: 'fixed',
                  top: 0,
                  width: '100vw',
                  backgroundColor: 'rgba(0,0,0,.5)',
                  zIndex: 1
                }}>
                <Box sx={{ flexGrow: 1 }}/>
                <IconButton
                  edge="start"
                  aria-label="menu"
                  sx={{color: "white"}}
                  onClick={()=>setFullScreen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
                ref={imageBoxRef}>
                <Box
                    draggable = {false}
                    component="img"
                    alt={collectible.name}
                    src={getAssetImage(collectible)}
                    onLoad={onImgLoad}
                    onError={(e) => {e.target.src = '/static/circle-loading.svg';}}
                    sx={{ width: '100%', height: '100%' }}
                />
                {
                  address!==collectible.holder&&isLoadedImage&&
                  <Box
                      draggable = {false}
                      component="img"
                      src='/static/logo-xs-round.svg'
                      sx={{ position: 'absolute', width: '6%', left: '8%', bottom: '8%' }}
                  />
                }
              </Box>
            </Box>
          </Modal>
        </Container>
      </Box>
      <Container maxWidth="lg">
        {/* {isLoadingCollectible && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>} */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PaperStyle>
              <Typography variant="h4">
                  {collectible.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{collectible.description}</Typography>
              <Stack sx={{mt: 2}} spacing={1}>
                <Typography variant="subtitle2">Creator</Typography>
                <Stack direction='row'>
                  <Typography variant="body2" component="span" sx={{display: 'flex', alignItems: 'center'}}>
                    <Link to={`/profile/others/${collectible.royaltyOwner}`} component={RouterLink} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1 }}>
                      <Jazzicon address={collectible.royaltyOwner}/>
                      {didName.creator?didName.creator:reduceHexAddress(collectible.royaltyOwner)}
                    </Link>
                    <Stack spacing={.6} direction="row">
                      {
                        diaBadge.creator&&
                        <Tooltip title="Diamond (DIA) token holder" arrow enterTouchDelay={0}>
                          <Box><Badge name="diamond"/></Box>
                        </Tooltip>
                      }
                      {/* <Badge name="pasar"/>
                      <Badge name="diamond"/>
                      <Badge name="user"/>
                      <Badge name="thumbup" value="5"/>
                      <Badge name="custom" value="100 ELA"/> */}
                    </Stack>
                  </Typography>
                </Stack>
                <Typography variant="subtitle2">Owner</Typography>
                <Stack direction='row'>
                  <Typography variant="body2" component="span" sx={{display: 'flex', alignItems: 'center'}}>
                    <Link to={`/profile/others/${collectible.holder}`} component={RouterLink} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1 }}>
                      <Jazzicon address={collectible.holder}/>
                      {didName.owner?didName.owner:reduceHexAddress(collectible.holder)}
                    </Link>
                    <Stack spacing={.6} direction="row">
                      {
                        diaBadge.owner&&
                        <Tooltip title="Diamond (DIA) token holder" arrow enterTouchDelay={0}>
                          <Box><Badge name="diamond"/></Box>
                        </Tooltip>
                      }
                      {/* <Badge name="thumbdown" value="13"/> */}
                    </Stack>
                  </Typography>
                </Stack>
                <Typography variant="subtitle2">Collection</Typography>
                <Stack direction='row'>
                  <AvatarStyle draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ p: 1 }} />
                  <Typography variant="body2" sx={{display: 'flex', alignItems: 'center'}}>Feeds NFT Sticker (FSTK)</Typography>
                </Stack>
              </Stack>
            </PaperStyle>
            {
              isForAuction?(
                <PaperStyle sx={{mt: 2, minHeight: {xs: 'unset', sm: 200}}}>
                  <Grid container direction="row">
                    <Grid item xs={6}>
                      <Typography variant="h4">Current bid</Typography>
                      <Typography variant="h3" color="origin.main">50 ELA</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>≈ USD 150.11</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack direction="row">
                        <AccessTimeIcon/>&nbsp;
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ends {tempDeadLine.date} {tempDeadLine.time}</Typography>
                      </Stack>
                      <Countdown deadline="2022-01-25"/>
                    </Grid>
                  </Grid>
                  <MHidden width="smDown">
                    <Button variant="contained" fullWidth onClick={()=>{}} sx={{mt: 2, textTransform: 'none'}}>
                      Place a bid
                    </Button>
                  </MHidden>
                </PaperStyle>
              ):(
                <PaperStyle sx={{mt: 2, minHeight: {xs: 'unset', sm: 200}}}>
                {
                  isLoadingCollectible?
                  <LoadingScreen/>:
                  <>
                    {
                      collectible.SaleType === "Not on sale"?
                      <>
                        <Typography variant="h4">This item is currently</Typography>
                        <Typography variant="h3" color="origin.main">Not on Sale</Typography>
                        <MHidden width="smDown">
                          <Button variant="contained" fullWidth onClick={(e)=>{navigate('/marketplace')}} sx={{mt: 2}}>Go back to Marketplace</Button>
                        </MHidden>
                      </>:
                      <>
                        <Typography variant="h4">On sale for a fixed price of</Typography>
                        <Typography variant="h3" color="origin.main">{round(collectible.Price/1e18, 3)} ELA</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>≈ USD {round(coinUSD*collectible.Price/1e18, 3)}</Typography>
                        {
                          address!==collectible.holder && address!==collectible.royaltyOwner &&
                          <MHidden width="smDown">
                            {
                              didSignin?
                              <Button variant="contained" fullWidth onClick={(e)=>{setPurchaseOpen(true)}} sx={{mt: 2}}>
                                Buy
                              </Button>:
                              <Button variant="contained" fullWidth onClick={openSignin} sx={{mt: 2}}>
                                Sign in to Buy
                              </Button>
                            }
                          </MHidden>
                        }
                      </>
                    }
                  </>
                }
                </PaperStyle>
              )
            }

          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{height: '100%', p: '15px 32px', position: 'relative'}}>
              <Typography variant="h5" sx={{ my: 1 }}>Item Details</Typography>
              <AssetDetailInfo detail={collectible}/>
              <Button
                to={`/explorer/collectible/detail/${collectible.tokenId}`}
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
                sx={{position: 'absolute', right: 32, bottom: 15}}
              >
                See more details on Pasar Explorer
              </Button>
            </PaperStyle>
          </Grid>
          {
            isForAuction&&(
              <Grid item xs={12}>
                <PaperStyle>
                  <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>Bids</Typography>
                  <BidList isLoading={isLoadingBidList} dataList={bidList}/>
                </PaperStyle>
              </Grid>
            )
          }
          {
            isPropertiesAccordionOpen&&
            <Grid item xs={12}>
              <Accordion
                defaultExpanded={1&&true}
                sx={{
                  border: '1px solid',
                  borderColor: 'action.disabledBackground',
                  boxShadow: (theme) => theme.customShadows.z1
                }}
              >
                <AccordionSummary 
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                  <Typography variant="h5">Properties</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {
                      Object.keys(properties).map((type, index)=>(
                        <Grid item key={index}>
                          <Property type={type} name={properties[type]}/>
                        </Grid>
                      ))
                    }
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          }
          <Grid item xs={12}>
            <Accordion
                defaultExpanded={1&&true}
                sx={{
                  border: '1px solid',
                  borderColor: 'action.disabledBackground',
                  boxShadow: (theme) => theme.customShadows.z1
                }}
              >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                <Typography variant="h5">History</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{pb: '50px', position: 'relative', px: 4}}>
                <CollectibleHistory isLoading={isLoadingTransRecord} dataList={transRecord} creator={{address: collectible.royaltyOwner, name: didName.creator}}/>
                <Button
                  to={`/explorer/collectible/detail/${collectible.tokenId}`}
                  size="small"
                  color="inherit"
                  component={RouterLink}
                  endIcon={<Icon icon={arrowIosForwardFill} />}
                  sx={{position: 'absolute', right: 32, bottom: 16}}
                >
                  See more details on Pasar Explorer
                </Button>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Link to={`/explorer/collectible/detail/${collectible.tokenId}`} component={RouterLink} underline="none">
              <PaperStyle sx={{position: 'relative'}}>
                <Stack direction="row" sx={{alignItems: 'center'}}>
                  <Typography variant="h5" sx={{ my: 1, flex: 1 }}>
                      Analytics and transaction record
                  </Typography>
                  <ArrowForwardIcon/>
                </Stack>
              </PaperStyle>
            </Link>
          </Grid>
        </Grid>
        <MHidden width="smUp">
          {
            isForAuction&&
            <StickyPaperStyle>
              <Button variant="contained" fullWidth onClick={()=>{}}>
                Place a bid
              </Button>
            </StickyPaperStyle>
          }
          {
            !isForAuction && 
            <>
              {
                collectible.SaleType === "Not on sale"?
                <StickyPaperStyle>
                  <Button variant="contained" fullWidth onClick={(e)=>{navigate('/marketplace')}} sx={{mt: 2}}>Go back to Marketplace</Button>
                </StickyPaperStyle>:
                address!==collectible.holder && address!==collectible.royaltyOwner &&
                <StickyPaperStyle>
                  {
                    didSignin?
                    <Button variant="contained" fullWidth onClick={()=>{setPurchaseOpen(true)}}>
                      Buy
                    </Button>:
                    <Button variant="contained" fullWidth onClick={openSignin}>
                      Sign in to Buy
                    </Button>
                  }
                </StickyPaperStyle>
              }
            </>
          }
        </MHidden>
      </Container>
      <PurchaseDlg isOpen={isOpenPurchase} setOpen={setPurchaseOpen} info={collectible}/>
    </RootStyle>
  );
}