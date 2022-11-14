// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem';
import PaperRecord from '../../components/PaperRecord';
import LoadingWrapper from '../../components/LoadingWrapper';
import { fetchAPIFrom } from '../../utils/common';
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
    flexDirection: 'column'
  }
}));
// ----------------------------------------------------------------------

export default function SearchResult() {
  const navigate = useNavigate();
  const params = useParams(); // params.key
  const [totalCount, setTotalCount] = React.useState(0);
  const [collectibles, setCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingCollectibles(true);
      try {
        const res = await fetchAPIFrom(`api/v1/searchTokens?keyword=${params.key}`, {});
        const json = await res.json();
        setTotalCount(json?.data.length ?? 0);
        setCollectibles(json?.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoadingCollectibles(false);
    };
    fetchData();
  }, [params.key]);

  const link2Detail = (contract, chain, tokenId) => {
    navigate(`/explorer/collectible/detail/${[chain, contract, tokenId].join('&')}`);
  };

  return (
    <RootStyle title="Search | PASAR">
      <Container maxWidth="lg">
        <StackStyle sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ flex: 1 }}>
            Search Results
            <Typography variant="body2" sx={{ display: 'inline-block', pl: 1 }}>
              {totalCount.toLocaleString('en')} items
            </Typography>
          </Typography>
        </StackStyle>
        {isLoadingCollectibles && (
          <LoadingWrapper>
            <LoadingScreen sx={{ background: 'transparent' }} />
          </LoadingWrapper>
        )}
        <Grid container spacing={2}>
          {!isLoadingCollectibles && !collectibles.length && (
            <Grid item xs={12} align="center">
              <h3>No matching collectible found!</h3>
            </Grid>
          )}
          {collectibles.map((item, key) => (
            <Grid key={key} item xs={12}>
              <PaperRecord
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => link2Detail(item.contract, item.chain, item.tokenId)}
              >
                <CollectibleListItem item={item} />
              </PaperRecord>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
