// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Paper, Typography, Link } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem'
import ShowSelect from '../../components/pagination/ShowSelect';
import Pagination from '../../components/pagination';
import PaperRecord from '../../components/PaperRecord';
import LoadingWrapper from '../../components/LoadingWrapper';
import { fetchFrom } from '../../utils/common';
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
// ----------------------------------------------------------------------

export default function SearchResult() {
  const navigate = useNavigate();
  const params = useParams(); // params.key
  const [totalCount, setTotalCount] = React.useState(0);
  const [collectibles, setCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  React.useEffect(async () => {
    setLoadingCollectibles(true);
    fetchFrom(`sticker/api/v1/search?key=${params.key}`).then(response => {
      response.json().then(jsonCollectibles => {
        setTotalCount(jsonCollectibles.data.result.length)
        setCollectibles(jsonCollectibles.data.result);
        setLoadingCollectibles(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingCollectibles(false);
    });
  }, [params.key]);
  
  const link2Detail = (tokenId)=>{
    navigate(`/explorer/collectible/detail/${tokenId}`);
  }
  return (
    <RootStyle title="Search | PASAR">
      <Container maxWidth="lg">
        <StackStyle sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{flex:1}}>
              Search Results
              <Typography variant="body2" sx={{ display: 'inline-block', pl: 1 }}>{totalCount.toLocaleString('en')} items</Typography>
          </Typography>
        </StackStyle>
        {isLoadingCollectibles && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Grid container spacing={2}>
        {!collectibles.length&&<Grid item xs={12} align="center"><h3>No matching collectible found!</h3></Grid>}
        {collectibles.map((item, key) => (
          <Grid key={key} item xs={12}>
              <PaperRecord sx={{
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={()=>link2Detail(item.tokenId)}
              >
                <CollectibleListItem
                    item={item}
                />
              </PaperRecord>
          </Grid>
        ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
