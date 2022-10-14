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
import { getAssetImage, fetchFrom, getCollectionTypeFromImageUrl, collectionTypes } from '../../utils/common';
import { MAIN_CONTRACT } from '../../config';

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
  const [tokenId, baseToken] = params.args.split('&');
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
      fetchFrom(`api/v2/sticker/getCollectibleByTokenId/${tokenId}/${baseToken}`)
        .then((response) => {
          response.json().then((jsonCollectible) => {
            if (!jsonCollectible.data) {
              setLoadingCollectible(false);
              return;
            }
            const jsonData = jsonCollectible.data;
            if (jsonData.baseToken) {
              if (jsonData.baseToken === MAIN_CONTRACT.ESC.sticker) {
                const defaultCollection = getCollectionTypeFromImageUrl(jsonData);
                jsonData.collection = collectionTypes[defaultCollection].name;
                jsonData.is721 = false;
              } else {
                jsonData.collection = '';
                jsonData.is721 = false;
                fetchFrom(
                  `api/v2/sticker/getCollection/${jsonData.baseToken}?marketPlace=${jsonData.marketPlace}`
                ).then((response) => {
                  response
                    .json()
                    .then((jsonAssets) => {
                      if (!jsonAssets.data) return;
                      setCollectible((prevState) => {
                        const tempCollectible = { ...prevState };
                        tempCollectible.collection = jsonAssets.data.name;
                        tempCollectible.is721 = jsonAssets.data.is721;
                        return tempCollectible;
                      });
                    })
                    .catch((e) => {
                      console.error(e);
                    });
                });
              }
            }
            setCollectible(jsonData);
            setLoadingCollectible(false);
            const assetImageUrl = getAssetImage(jsonData, false);
            fetch(assetImageUrl)
              .then((response) => {
                const contentype = response.headers.get('content-type');
                if (contentype.startsWith('video')) {
                  setIsVideo(true);
                }
              })
              .catch(console.log);
          });
        })
        .catch((e) => {
          console.error(e);
          setLoadingCollectible(false);
        });

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
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      setLoadingTransRecord(true);
      fetchFrom(
        `api/v2/sticker/getTranDetailsByTokenId?tokenId=${tokenId}&baseToken=${baseToken}&method=${methods}&timeOrder=${timeOrder}`,
        { signal }
      )
        .then((response) => {
          response.json().then((jsonTransactions) => {
            setTotalCount(jsonTransactions.data.length);
            const grouped = jsonTransactions.data.reduce((res, item, id, arr) => {
              if (id > 0 && item.tHash === arr[id - 1].tHash) {
                res[res.length - 1].push(item);
              } else {
                res.push(id < arr.length - 1 && item.tHash === arr[id + 1].tHash ? [item] : item);
              }
              return res;
            }, []);
            setTransRecord(grouped);
            setLoadingTransRecord(false);
          });
        })
        .catch((e) => {
          if (e.code !== e.ABORT_ERR) setLoadingTransRecord(false);
        });
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

  const handleErrorImage = (e) => {
    if (e.target.src.indexOf('pasarprotocol.io') >= 0) {
      e.target.src = getAssetImage(collectible, false, 1);
    } else if (e.target.src.indexOf('ipfs.ela') >= 0) {
      e.target.src = getAssetImage(collectible, false, 2);
    } else {
      e.target.src = '/static/broken-image.svg';
    }
  };

  const imageUrl = getAssetImage(collectible, false);
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
                  src={imageUrl}
                  onLoad={onImgLoad}
                  onError={handleErrorImage}
                  sx={{ width: '100%', borderRadius: 1, mr: 2, display: isLoadedImage ? 'block' : 'none' }}
                  ref={imageRef}
                />
              ) : (
                <ReactPlayer
                  playing
                  loop={Boolean(true)}
                  muted={Boolean(true)}
                  url={imageUrl}
                  onReady={() => {
                    setVideoIsLoaded(true);
                  }}
                  width="100%"
                  height={videoIsLoaded ? '100%' : 0}
                />
              )}
              {((!isVideo && isLoadedImage) || (isVideo && videoIsLoaded)) &&
                !imageUrl.endsWith('broken-image.svg') && (
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
