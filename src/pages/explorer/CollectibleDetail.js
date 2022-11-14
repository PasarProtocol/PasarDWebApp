// material
import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Container, Accordion, AccordionSummary, AccordionDetails, Grid, Paper, Typography, Box } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import LoadingWrapper from '../../components/LoadingWrapper';
import { ChartArea } from '../../components/charts';
import { CarouselCustom } from '../../components/carousel';
import PaperRecord from '../../components/PaperRecord';
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail';
import DateOrderSelect from '../../components/DateOrderSelect';
import MethodSelect from '../../components/MethodSelect';
import InlineBox from '../../components/InlineBox';
import { fetchAPIFrom, getImageFromIPFSUrl } from '../../utils/common';

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
);

PaperStyle.propTypes = {
  sx: PropTypes.any,
  children: PropTypes.node
};
// ----------------------------------------------------------------------
const DefaultPageSize = 5;
export default function CollectibleDetail() {
  const params = useParams();
  const [chain, contract, tokenId] = params.args.split('&');
  const [collectible, setCollectible] = React.useState({});
  const [transRecord, setTransRecord] = React.useState([]);
  const [detailPageSize, setDetailPageSize] = React.useState(DefaultPageSize);
  const [methods, setMethods] = React.useState('');
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingCollectible, setLoadingCollectible] = React.useState(true);
  const [isLoadingTransRecord, setLoadingTransRecord] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoadedImage, setLoadedImage] = React.useState(false);
  const [isVideo, setIsVideo] = React.useState(false);
  const [videoIsLoaded, setVideoIsLoaded] = React.useState(false);
  const imageRef = React.useRef();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingCollectible(true);
      try {
        const res = await fetchAPIFrom(
          `api/v1/getCollectibleInfo?baseToken=${contract}&chain=${chain}&tokenId=${tokenId}`,
          {}
        );
        const json = await res.json();
        const collectibleDetail = { ...json.data };
        if (collectibleDetail?.contract && collectibleDetail?.chain) {
          const resCol = await fetchAPIFrom(
            `api/v1/getCollectionInfo?collection=${collectibleDetail.contract}&chain=${collectibleDetail.chain}`,
            {}
          );
          const jsonCol = await resCol.json();
          if (jsonCol) {
            collectibleDetail.is721 = jsonCol?.data?.is721 || false;
            collectibleDetail.collection = jsonCol?.data?.name || '';
          }
        }
        setCollectible(collectibleDetail);
        // check if asset is video or not
        const imgUrl = getImageFromIPFSUrl(collectibleDetail?.data?.image || collectibleDetail?.image);
        const resImg = await fetch(imgUrl);
        const contentype = resImg.headers.get('content-type');
        if (contentype.startsWith('video')) {
          setIsVideo(true);
        }
      } catch (e) {
        console.error(e);
      }
      setLoadingCollectible(false);
    };
    fetchData();

    function handleResize() {
      const { innerWidth: width } = window;
      if (width < 600 || !imageRef.current)
        // in case of xs
        setDetailPageSize(DefaultPageSize);
      else {
        const pgsize = Math.floor((imageRef.current.clientHeight - 42 - 48) / 81);
        if (pgsize < 1) setDetailPageSize(DefaultPageSize);
        else setDetailPageSize(pgsize);
      }
    }
    window.addEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      setLoadingTransRecord(true);
      try {
        const res = await fetchAPIFrom(
          `api/v1/getTransactionsOfToken?baseToken=${contract}&chain=${chain}&tokenId=${tokenId}&eventType=${methods}&sort=${timeOrder}`,
          { signal }
        );
        const json = await res.json();
        setTotalCount(json?.data?.total ?? 0);
        const grouped =
          json?.data?.data.reduce((res, item, id, arr) => {
            if (id > 0 && item.transactionHash === arr[id - 1].transactionHash) {
              res[res.length - 1].push(item);
            } else {
              res.push(id < arr.length - 1 && item.transactionHash === arr[id + 1].transactionHash ? [item] : item);
            }
            return res;
          }, []) || [];
        setTransRecord(grouped);
      } catch (e) {
        console.error(e);
      }
      setLoadingTransRecord(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods, timeOrder]);

  const onImgLoad = ({ target: img }) => {
    if (img.alt) setLoadedImage(true);
    const { innerWidth: width } = window;
    if (width < 600)
      // in case of xs
      return;
    const pgsize = Math.floor((img.offsetHeight - 42 - 48) / 81);
    if (pgsize < 1) setDetailPageSize(DefaultPageSize);
    else setDetailPageSize(pgsize);
  };

  const imageSrc = getImageFromIPFSUrl(collectible?.data?.image || collectible?.image);

  return (
    <RootStyle title="Collectible | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 2 }}>
          {collectible.name}
        </Typography>
        {isLoadingCollectible && (
          <LoadingWrapper>
            <LoadingScreen sx={{ background: 'transparent' }} />
          </LoadingWrapper>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{ position: 'relative' }}>
              {((!isVideo && !isLoadedImage) || (isVideo && !videoIsLoaded)) && (
                <Box
                  draggable={false}
                  component="img"
                  alt={collectible.name}
                  src="/static/circle-loading.svg"
                  sx={{ width: '100%', borderRadius: 1, mr: 2 }}
                />
              )}
              {!isVideo ? (
                <Box
                  draggable={false}
                  component="img"
                  alt={collectible.name}
                  src={imageSrc}
                  onLoad={onImgLoad}
                  sx={{ width: '100%', borderRadius: 1, mr: 2, display: isLoadedImage ? 'block' : 'none' }}
                  ref={imageRef}
                />
              ) : (
                <ReactPlayer
                  playing
                  loop={Boolean(true)}
                  muted={Boolean(true)}
                  url={imageSrc}
                  onReady={() => {
                    setVideoIsLoaded(true);
                  }}
                  width="100%"
                  height={videoIsLoaded ? '100%' : 0}
                />
              )}
              {((!isVideo && isLoadedImage) || (isVideo && videoIsLoaded)) &&
                !imageSrc.endsWith('broken-image.svg') && (
                  <Box
                    draggable={false}
                    component="img"
                    src="/static/logo-xs-round.svg"
                    sx={{ position: 'absolute', width: '6%', left: 40, bottom: 40 }}
                  />
                )}
            </PaperStyle>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sx={{ height: '100%', p: '15px 32px' }}>
              <Typography variant="h5" sx={{ my: 1 }}>
                Item Details
              </Typography>
              <CarouselCustom pgsize={detailPageSize} detail={collectible} />
            </PaperStyle>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              defaultExpanded={1 && true}
              sx={{
                border: '1px solid',
                borderColor: 'action.disabledBackground',
                boxShadow: (theme) => theme.customShadows.z1
              }}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="h5">Analytics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChartArea by="collectible" />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="div" sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ py: 1, pr: 1, display: 'inline-block' }}>
                    Transaction Record
                  </Typography>
                  <InlineBox>
                    <MethodSelect onChange={setMethods} />
                    <DateOrderSelect onChange={setTimeOrder} />
                  </InlineBox>
                  <Typography variant="body2" sx={{ display: 'inline-block' }}>
                    {totalCount.toLocaleString('en')} transactions
                  </Typography>
                </Typography>
              </Grid>
              {isLoadingTransRecord ? (
                <Grid item xs={12}>
                  <LoadingScreen sx={{ background: 'transparent' }} />
                </Grid>
              ) : (
                transRecord.map((item, key) => (
                  <Grid key={key} item xs={12}>
                    {Array.isArray(item) ? (
                      <Accordion
                        sx={{
                          border: '1px solid',
                          borderColor: item[0].event === 'Burn' ? '#e45f14' : 'action.disabledBackground',
                          boxShadow: (theme) => theme.customShadows.z1
                        }}
                      >
                        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                          <TransactionOrderDetail isAlone={1 && true} item={item[0]} />
                        </AccordionSummary>
                        <AccordionDetails sx={{ pr: '28px' }}>
                          <TransactionOrderDetail isAlone={1 && true} item={item[1]} noSummary={1 && true} />
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      <PaperRecord
                        sx={{ p: 2, borderColor: item.event === 'Burn' ? '#e45f14' : 'action.disabledBackground' }}
                      >
                        <TransactionOrderDetail isAlone={1 && true} item={item} />
                      </PaperRecord>
                    )}
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
