// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid } from '@mui/material';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import MainLogo from '../components/main-logo';
import SearchBox from '../components/SearchBox';
import StatisticPanel from '../components/explorer/StatisticPanel';
import NewestCollectibles from '../components/explorer/CollectionView/NewestCollectibles';
import LatestTransactions from '../components/explorer/CollectionView/LatestTransactions';
import { fetchFrom } from '../utils/common';
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
    setLoadingTransactions(true);
    fetchFrom('api/v2/sticker/listStickers?pageNum=1&pageSize=10').then((response) => {
      response.json().then((jsonAssets) => {
        setNewestCollectibles(jsonAssets.data.result);
        setLoadingCollectibles(false);
      }).catch((e) => {
        setLoadingCollectibles(false);
      });
    })
    .catch((e) => {
      setLoadingCollectibles(false);
    });

    fetchFrom('api/v2/sticker/listTrans?pageNum=1&pageSize=10').then((response) => {
      response.json().then((jsonAssets) => {
        setLatestTransactions(jsonAssets.data.results);
        setLoadingTransactions(false);
      }).catch((e) => {
        setLoadingTransactions(false);
      });
    })
    .catch((e) => {
      setLoadingTransactions(false);
    });
  }, []);

  return (
    <RootStyle title="Explorer | PASAR">
      <MainLogo />
      <Container maxWidth="lg">
        <Stack spacing={6} sx={{ mb: 3 }}>
          <MHidden width="mdDown">
            <SearchBox sx={{m: 'auto'}} />
          </MHidden>
          <StatisticPanel />
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <MHidden width="mdDown">
              <NewestCollectibles title="Newest Items" dataList={[...newestCollectibles]} isLoading={isLoadingCollectibles}/>
            </MHidden>
            <MHidden width="mdUp">
              <NewestCollectibles title="Newest Items" dataList={[...newestCollectibles].splice(0,5)} isLoading={isLoadingCollectibles}/>
            </MHidden>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MHidden width="mdDown">
              <LatestTransactions title="Latest Transactions" dataList={[...latestTransactions]} isLoading={isLoadingTransactions}/>
            </MHidden>
            <MHidden width="mdUp">
              <LatestTransactions title="Latest Transactions" dataList={[...latestTransactions].splice(0,5)} isLoading={isLoadingTransactions}/>
            </MHidden>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
