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
import Scrollbar from '../../components/Scrollbar';
import LoadingWrapper from '../../components/LoadingWrapper';
import { ChartArea } from '../../components/charts';
import { CarouselCustom } from '../../components/carousel';
import PaperRecord from '../../components/PaperRecord';
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail'
import TransactionCollectibleDetail from '../../components/explorer/TransactionList/TransactionCollectibleDetail'
import DateOrderSelect from '../../components/DateOrderSelect';
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

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const PaperStyle = (props) => (
  <Paper
    sx={{
        border: '1px solid',
        borderColor: 'action.disabledBackground',
        boxShadow: (theme) => theme.customShadows.z1,
        p: '1.2vw',
        ...props.sm
    }}
  >
    {props.children}
  </Paper>
)
// ----------------------------------------------------------------------

export default function CollectibleDetail() {
  const params = useParams(); // params.collection
  const [collectible, setCollectible] = React.useState({});
  const [isLoadingCollectible, setLoadingCollectible] = React.useState(true);
  React.useEffect(async () => {
    const resCollectible = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/search?key=${params.collection}`
    );
    const jsonCollectible = await resCollectible.json();
    if(jsonCollectible.data.result.length){
      setCollectible(jsonCollectible.data.result[0]);
    }
    setLoadingCollectible(false);
  }, []);

  return (
    <RootStyle title="Collectible | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 2 }}>
            {collectible.name}
        </Typography>
        {isLoadingCollectible && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PaperStyle>
              <Box
                  component="img"
                  alt={collectible.name}
                  src={getThumbnail(collectible.thumbnail)}
                  onError={(e) => e.target.src = '/static/circle-loading.svg'}
                  sx={{ width: '100%', borderRadius: 1, mr: 2 }}
              />
            </PaperStyle>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaperStyle sm={{height: '100%', p: '15px 32px'}}>
              <Typography variant="h5" sx={{ my: 1 }}>Collectible Detail</Typography>
              <CarouselCustom detail={collectible}/>
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
                <ChartArea />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{flex:1}}>
                  Transaction Record
                  <Select
                    defaultValue={1}
                    value={1}
                    onChange={()=>{}}
                    inputProps={{ 'aria-label': 'Without label' }}
                    size="small"
                    sx={{mx: 1}}
                  >
                    <MenuItem value={1}>All</MenuItem>
                  </Select>
                  <DateOrderSelect/>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <PaperRecord>
                  <TransactionCollectibleDetail
                    item={{
                        timestamp: getTime(new Date()/1000),
                        tokenIdHex: reduceHexAddress("0x44016ed8638f5B517a5beC7a722A56d1DEBefef7"),
                        gasfee: (1000 / 10 ** 8).toFixed(7),
                        value: 10
                    }}
                  />
                </PaperRecord>
              </Grid>
              <Grid item xs={12}>
                <PaperRecord>
                  <TransactionOrderDetail
                    isAlone={1&&true}
                    item={{
                        from: "0x22016ed8638f5B517a5beC7a722A56d1DEBefef7",
                        to: "0x33016ed8638f5B517a5beC7a722A56d1DEBefef7",
                        tokenIdHex: "0x44016ed8638f5B517a5beC7a722A56d1DEBefef7",
                        value: 100,
                        gasfee: (1000 / 10 ** 8).toFixed(7),
                        method: 'transfer',
                        timestamp: getTime(new Date()/1000)
                    }}
                  />
                </PaperRecord>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
