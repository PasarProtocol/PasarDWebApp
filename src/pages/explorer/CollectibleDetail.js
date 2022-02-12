// material
import React from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Card, Container, Accordion, AccordionSummary, AccordionDetails, Stack, Grid, Paper, Typography, Box, Select, MenuItem } from '@mui/material';
// components
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
import { reduceHexAddress, getAssetImage, fetchFrom } from '../../utils/common';

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
// ----------------------------------------------------------------------
const DefaultPageSize = 5;
export default function CollectibleDetail() {
  const params = useParams(); // params.collection
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
    const resCollectible = await fetchFrom(`sticker/api/v1/getCollectibleByTokenId?tokenId=${params.collection}`);
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
    fetchFrom(`sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.collection}&method=${methods}&timeOrder=${timeOrder}`, { signal }).then(response => {
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
  return (
    <RootStyle title="Collectible | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 2 }}>
            {collectible.name}
        </Typography>
        {isLoadingCollectible && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{position: 'relative'}}>
              <Box
                  draggable = {false}
                  component="img"
                  alt={collectible.name}
                  src={getAssetImage(collectible)}
                  onLoad={onImgLoad}
                  onError={(e) => {e.target.src = '/static/circle-loading.svg';}}
                  sx={{ width: '100%', borderRadius: 1, mr: 2 }}
                  ref={imageRef}
              />
              {
                isLoadedImage&&
                <Box
                    draggable = {false}
                    component="img"
                    src='/static/logo-xs-round.svg'
                    sx={{ position: 'absolute', width: '6%', left: 40, bottom: 40 }}
                />
              }
            </PaperStyle>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{height: '100%', p: '15px 32px'}}>
              <Typography variant="h5" sx={{ my: 1 }}>Item Details</Typography>
              <CarouselCustom pgsize={detailPageSize} detail={collectible}/>
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
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
