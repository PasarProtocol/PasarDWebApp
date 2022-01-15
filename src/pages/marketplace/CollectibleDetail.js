// material
import React from 'react';
import { useParams } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Card, Container, Accordion, AccordionSummary, AccordionDetails, Stack, Grid, Paper, Typography, Box, Select, Menu, MenuItem, Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

// components
import { MFab } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import LoadingWrapper from '../../components/LoadingWrapper';
import { ChartArea } from '../../components/charts';
import { CarouselCustom } from '../../components/carousel';
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
// ----------------------------------------------------------------------
const DefaultPageSize = 5;
export default function CollectibleDetail() {
  const params = useParams(); // params.collection
  const [isFullScreen, setFullScreen] = React.useState(false);
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const [collectible, setCollectible] = React.useState({});
  const [transRecord, setTransRecord] = React.useState([]);
  const [detailPageSize, setDetailPageSize] = React.useState(DefaultPageSize);
  const [methods, setMethods] = React.useState("");
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingCollectible, setLoadingCollectible] = React.useState(true);
  const [isLoadingTransRecord, setLoadingTransRecord] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoadedImage, setLoadedImage] = React.useState(false);
  const imageRef = React.useRef();
  React.useEffect(async () => {
    const resCollectible = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.collection}`
    );
    const jsonCollectible = await resCollectible.json();
    setCollectible(jsonCollectible.data);
    setLoadingCollectible(false);

    
    function handleResize() {
      const { innerWidth: width } = window;
      if(width<600||!imageRef.current) // in case of xs
        setDetailPageSize(DefaultPageSize)
      else {
        const pgsize = Math.floor((imageRef.current.clientHeight - 42 - 48) / 81)
        if(pgsize<1)
          setDetailPageSize(DefaultPageSize)
        else
          setDetailPageSize(pgsize)
      }
    }
    window.addEventListener('resize', handleResize);
  }, []);
  
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingTransRecord(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.collection}&method=${methods}&timeOrder=${timeOrder}`, { signal }).then(response => {
      response.json().then(jsonTransactions => {
        setTotalCount(jsonTransactions.data.length)
        const grouped = jsonTransactions.data.reduce((res, item, id, arr) => {
            if (id>0 && item.tHash === arr[id - 1].tHash) {
                res[res.length - 1].push(item);
            } else {
                res.push(id<arr.length-1&&item.tHash === arr[id + 1].tHash ? [item] : item);
            }
            return res;
        }, []);
        setTransRecord(grouped);
        setLoadingTransRecord(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingTransRecord(false);
    });
  }, [methods, timeOrder]);

  const onImgLoad = ({target:img}) => {
    if(img.alt)
      setLoadedImage(true)
    const { innerWidth: width } = window
    if(width<600) // in case of xs
      return
    const pgsize = Math.floor((img.offsetHeight - 42 - 48) / 81)
    if(pgsize<1)
      setDetailPageSize(DefaultPageSize)
    else
      setDetailPageSize(pgsize)
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
                  <Typography variant="body2" sx={{display: 'flex', alignItems: 'center'}}>
                    {reduceHexAddress(collectible.royaltyOwner)}
                    {/* <Badge name="pasar" sx={{ml: 2}}/>
                    <Badge name="diamond"/>
                    <Badge name="user"/>
                    <Badge name="thumbup" value="5"/>
                    <Badge name="custom" value="100 ELA"/> */}
                  </Typography>
                </Stack>
                <Typography variant="body2">Owner</Typography>
                <Stack direction='row'>
                  <AvatarStyle draggable = {false} component="img" src="/static/glide.png"/>
                  <Typography variant="body2" sx={{display: 'flex', alignItems: 'center'}}>
                    {reduceHexAddress(collectible.holder)}
                    {/* <Badge name="thumbdown" value="13" sx={{ml: 2}}/> */}
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
              <Typography variant="h3">100 ELA</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>≈ USD 300.26</Typography>
              <Button variant="contained" fullWidth onClick={()=>{}} sx={{mt: 2}}>
                Buy
              </Button>
            </PaperStyle>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{height: '100%', p: '15px 32px'}}>
              <Typography variant="h5" sx={{ my: 1 }}>Collectible Detail</Typography>
              <CarouselCustom pgsize={detailPageSize} detail={collectible}/>
            </PaperStyle>
          </Grid>
          {/* <Grid item xs={12}>
            <Accordion
              defaultExpanded={1&&true}
              sx={{
                border: '1px solid',
                borderColor: 'action.disabledBackground',
                boxShadow: (theme) => theme.customShadows.z1
              }}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                <Typography variant="h5">Analytics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChartArea by="collectible"/>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="div" sx={{flex:1}}>
                  <Typography variant="h4" sx={{py: 1, pr:1, display: 'inline-block'}}>
                      Transaction Record
                  </Typography>
                  <InlineBox>
                    <MethodSelect onChange={setMethods}/>
                    <DateOrderSelect onChange={setTimeOrder}/>
                  </InlineBox>
                  <Typography variant="body2" sx={{ display: 'inline-block' }}>{totalCount.toLocaleString('en')} transactions</Typography>
                </Typography>
              </Grid>
              {isLoadingTransRecord?(
                <Grid item xs={12}><LoadingScreen sx={{background: 'transparent'}}/></Grid>
              ):(
                transRecord.map((item, key) => (
                  <Grid key={key} item xs={12}>
                  {
                    Array.isArray(item)?
                    <Accordion 
                      // defaultExpanded={1&&true}
                      sx={{
                        border: '1px solid',
                        borderColor: 'action.disabledBackground',
                        boxShadow: (theme) => theme.customShadows.z1
                      }}
                    >
                      <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                        <TransactionOrderDetail
                            isAlone={1&&true}
                            item={item[0]}
                        />
                      </AccordionSummary>
                      <AccordionDetails sx={{pr: '28px'}}>
                        <TransactionOrderDetail
                            isAlone={1&&true}
                            item={item[1]}
                            noSummary={1&&true}
                        />
                      </AccordionDetails>
                    </Accordion>:
                    
                    <PaperRecord sx={{p:2}}>
                      <TransactionOrderDetail
                        isAlone={1&&true}
                        item={ item }
                      />
                    </PaperRecord>
                  }
                  </Grid>
                ))
              )}
            </Grid>
          </Grid> */}
        </Grid>
      </Container>
    </RootStyle>
  );
}
