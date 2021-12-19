// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid } from '@mui/material';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import MainLogo from '../components/main-logo';
import SearchBox from '../components/SearchBox';
import StatisticPanel from '../components/explorer/StatisticPanel'
import NewestCollectibles from '../components/explorer/CollectionView/NewestCollectibles'
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

export default function Explorer() {
  const [newestCollectibles, setNewestCollectibles] = React.useState([]);
  const [latestTransactions, setLatestTransactions] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  const [isLoadingTransactions, setLoadingTransactions] = React.useState(false);
  React.useEffect(async () => {
    setLoadingCollectibles(true);
    const resCollectibles = await fetch(
      'https://assist.trinity-feeds.app/sticker/api/v1/listStickers?pageNum=1&pagSize=10'
    );
    const jsonCollectibles = await resCollectibles.json();
    setNewestCollectibles(jsonCollectibles.data.result);
    setLoadingCollectibles(false);

    setLoadingTransactions(true);
    const resTransactions = await fetch(
      'https://assist.trinity-feeds.app/sticker/api/v1/listStickers?pageNum=1&pagSize=10'
    );
    const jsonTransactions = await resTransactions.json();
    setLatestTransactions(jsonTransactions.data.result);
    setLoadingTransactions(false);
  }, []);

  return (
    <RootStyle title="Explorer | PASAR">
      <MainLogo />
      <Container maxWidth="lg">
        <Stack spacing={6} sx={{mb:3}}>
          <MHidden width="mdDown">
            <SearchBox/>
          </MHidden>
          <StatisticPanel />
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            
            <NewestCollectibles title="Newest Collectibles" dataList={newestCollectibles} isLoading={isLoadingCollectibles}/>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <NewestCollectibles title="Latest Transactions" dataList={latestTransactions} isLoading={isLoadingTransactions}/>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
