// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Container, Stack, Grid, Paper, Typography, Link } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem'
import ShowSelect from '../../components/pagination/ShowSelect';
import Pagination from '../../components/pagination';
import PaperRecord from '../../components/PaperRecord';
import LoadingWrapper from '../../components/LoadingWrapper';
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
// ----------------------------------------------------------------------

export default function SearchResult() {
  const params = useParams(); // params.key
  const [collectibles, setCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  React.useEffect(async () => {
    setLoadingCollectibles(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/search?key=${params.key}`, {}).then(response => {
      response.json().then(jsonCollectibles => {
        setCollectibles(jsonCollectibles.data.result);
        setLoadingCollectibles(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingCollectibles(false);
    });
  }, [params.key]);
  
  return (
    <RootStyle title="Search | PASAR">
      <Container maxWidth="lg">
        <StackStyle sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{flex:1}}>
              Search Result
          </Typography>
        </StackStyle>
        {isLoadingCollectibles && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Grid container spacing={2}>
        {!collectibles.length&&<Grid item xs={12} align="center"><h3>No matching collectible found!</h3></Grid>}
        {collectibles.map((item, key) => (
          <Grid key={key} item xs={12}>
            <Link to={`/explorer/collectible/detail/${item.tokenId}`} component={RouterLink} style={{ textDecoration: 'none' }} >
              <PaperRecord sx={{
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <CollectibleListItem
                    item={{
                        image: getThumbnail(item.thumbnail),
                        createTime: item.createTime,
                        name: item.name,
                        tokenIdHex: item.tokenIdHex,
                        holder: item.holder
                    }}
                />
              </PaperRecord>
            </Link>
          </Grid>
        ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
