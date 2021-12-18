// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid } from '@mui/material';
// components
import Page from '../components/Page';
import MainLogo from '../components/main-logo';
import SearchBox from '../components/SearchBox';
import StatisticPanel from '../components/explorer/StatisticPanel'
import NewestCollectibles from '../components/explorer/CollectionView/NewestCollectibles'
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11)
  }
}));

// ----------------------------------------------------------------------

export default function ComponentsOverview() {
  const [newestCollectibles, setNewestCollectibles] = React.useState([]);
  const [loadingCollectibles, setLoadingCollectibles] = React.useState(false);
  React.useEffect(async () => {
    setLoadingCollectibles(true);
    const res = await fetch(
      'https://assist.trinity-feeds.app/sticker/api/v1/listStickers?pageNum=1&pagSize=10'
    );
    const json = await res.json();
    setNewestCollectibles(json.data.result);
    setLoadingCollectibles(false);
  }, []);

  return (
    <RootStyle title="Explorer | PASAR">
      <MainLogo />
      <Container maxWidth="lg">
        <Stack spacing={6} sx={{mb:3}}>
          <SearchBox/>
          <StatisticPanel />
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <NewestCollectibles title="Newest Collectibles" dataList={newestCollectibles}/>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <NewestCollectibles title="Latest Transactions" dataList={newestCollectibles}/>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
