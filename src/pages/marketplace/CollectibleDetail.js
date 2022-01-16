// material
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import { Link, Container, Accordion, AccordionSummary, AccordionDetails, Stack, Grid, Paper, Typography, Box, Select, Menu, MenuItem, Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// components
import { MFab } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import LoadingWrapper from '../../components/LoadingWrapper';
import AssetDetailInfo from '../../components/marketplace/AssetDetailInfo';
import CollectibleHistory from '../../components/marketplace/CollectibleHistory';
import PaperRecord from '../../components/PaperRecord';
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail'
import TransactionCollectibleDetail from '../../components/explorer/TransactionList/TransactionCollectibleDetail'
import DateOrderSelect from '../../components/DateOrderSelect';
import MethodSelect from '../../components/MethodSelect';
import InlineBox from '../../components/InlineBox';
import Badge from '../../components/Badge';
import { reduceHexAddress, getThumbnail, getTime } from '../../utils/common';

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
// ----------------------------------------------------------------------
const DefaultPageSize = 5;
export default function CollectibleDetail() {
  const params = useParams(); // params.collection
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const [collectible, setCollectible] = React.useState({});
  const [transRecord, setTransRecord] = React.useState([]);
  const [methods, setMethods] = React.useState("");
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingCollectible, setLoadingCollectible] = React.useState(true);
  const [isLoadingTransRecord, setLoadingTransRecord] = React.useState(true);
  const [isLoadedImage, setLoadedImage] = React.useState(false);
  const imageRef = React.useRef();
  React.useEffect(async () => {
    const resCollectible = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.collection}`
    );
    const jsonCollectible = await resCollectible.json();
    setCollectible(jsonCollectible.data);
    setLoadingCollectible(false);
  }, []);
  
  React.useEffect(async () => {
    setLoadingTransRecord(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.collection}&method=&timeOrder=-1`, {}).then(response => {
      response.json().then(jsonTransactions => {
        setTransRecord(jsonTransactions.data);
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
  }
  
  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };

  return (
    <RootStyle title="Collectible | PASAR">
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
                src={getThumbnail(collectible.asset)}
                onLoad={onImgLoad}
                onError={(e) => {e.target.src = '/static/circle-loading.svg';}}
                sx={{ maxHeight: 400, borderRadius: 1 }}
                ref={imageRef}
            />
            {
              isLoadedImage&&
              <Box
                  draggable = {false}
                  component="img"
                  src='/static/logo-xs-round.svg'
                  sx={{ position: 'absolute', width: '6%', left: '8%', bottom: '8%' }}
                  ref={imageRef}
              />
            }
          </Box>
          <ToolGroupStyle>
            <MFab size="small" onClick={()=>{setFullScreen(!isFullScreen)}}>
              <FullscreenIcon />
            </MFab>
            <MFab size="small" sx={{ml: 1}} onClick={openPopupMenu}>
              <MoreHorizIcon />
            </MFab>
            <Menu 
                keepMounted
                id="simple-menu"
                anchorEl={isOpenPopup}
                onClose={handleClosePopup}
                open={Boolean(isOpenPopup)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
              <MenuItem onClick={handleClosePopup}>
                <ThumbDownOffAltIcon/>&nbsp;Report Creator
              </MenuItem>
              <MenuItem onClick={handleClosePopup}>
                <ThumbDownOffAltIcon/>&nbsp;Report Owner
              </MenuItem>
              <MenuItem onClick={handleClosePopup}>
                <ShareOutlinedIcon/>&nbsp;Share
              </MenuItem>
            </Menu>
          </ToolGroupStyle>
          {
            isFullScreen&&(
              <Lightbox
                animationDuration={120}
                mainSrc={getThumbnail(collectible.asset)}
                reactModalStyle={{
                  overlay: {
                    zIndex: 9999
                  }
                }}
                onCloseRequest={()=>{setFullScreen(false)}}
              />
            )
          }
        </Container>
      </Box>
      <Container maxWidth="lg">
        {isLoadingCollectible && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PaperStyle>
              <Typography variant="h4">
                  {collectible.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>2822 unique collectibles on the blockchain</Typography>
              <Stack sx={{mt: 2}} spacing={1}>
                <Typography variant="body2">Creator</Typography>
                <Stack direction='row'>
                  <AvatarStyle draggable = {false} component="img" src="/static/glide.png"/>
                  <Typography variant="body2" component="span" sx={{display: 'flex', alignItems: 'center'}}>
                    {reduceHexAddress(collectible.royaltyOwner)}
                    <Badge name="pasar" sx={{ml: 2}}/>
                    <Badge name="diamond"/>
                    <Badge name="user"/>
                    <Badge name="thumbup" value="5"/>
                    <Badge name="custom" value="100 ELA"/>
                  </Typography>
                </Stack>
                <Typography variant="body2">Owner</Typography>
                <Stack direction='row'>
                  <AvatarStyle draggable = {false} component="img" src="/static/glide.png"/>
                  <Typography variant="body2" component="span" sx={{display: 'flex', alignItems: 'center'}}>
                    {reduceHexAddress(collectible.holder)}
                    <Badge name="thumbdown" value="13" sx={{ml: 2}}/>
                  </Typography>
                </Stack>
                <Typography variant="body2">Collection</Typography>
                <Stack direction='row'>
                  <AvatarStyle draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ p: 1 }} />
                  <Typography variant="body2" sx={{display: 'flex', alignItems: 'center'}}>Feeds NFT Sticker (FSTK)</Typography>
                </Stack>
              </Stack>
            </PaperStyle>
            <PaperStyle sx={{mt: 2}}>
              <Typography variant="h4">On sale for a fixed price of</Typography>
              <Typography variant="h3" color="origin.main">100 ELA</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>≈ USD 300.26</Typography>
              <Button variant="contained" fullWidth onClick={()=>{}} sx={{mt: 2}}>
                Buy
              </Button>
            </PaperStyle>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{height: '100%', p: '15px 32px', position: 'relative'}}>
              <Typography variant="h5" sx={{ my: 1 }}>Collectible Detail</Typography>
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
                <Typography variant="h5">Properties</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item>
                    <Property type="Arms" name="OG Trooper A2"/>
                  </Grid>
                  <Grid item>
                    <Property type="Chest" name="OG Trooper C1"/>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <PaperStyle sx={{position: 'relative'}}>
              <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>History</Typography>
              <CollectibleHistory isLoading={isLoadingTransRecord} dataList={transRecord}/>
              <Button
                to={`/explorer/collectible/detail/${collectible.tokenId}`}
                size="small"
                color="inherit"
                component={RouterLink}
                endIcon={<Icon icon={arrowIosForwardFill} />}
                sx={{position: 'absolute', right: 20, top: 20}}
              >
                See more details on Pasar Explorer
              </Button>
            </PaperStyle>
          </Grid>
          <Grid item xs={12}>
            <PaperStyle sx={{position: 'relative'}}>
              <Stack direction="row" sx={{alignItems: 'center'}}>
                <Typography variant="h5" sx={{ mt: 1, mb: 2, flex: 1 }}>
                  <Link to={`/explorer/collectible/detail/${collectible.tokenId}`} component={RouterLink}>
                    Collectible analytics and transaction record
                  </Link>
                </Typography>
                <ArrowForwardIcon/>
              </Stack>
            </PaperStyle>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
