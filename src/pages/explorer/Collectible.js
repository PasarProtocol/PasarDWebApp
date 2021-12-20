// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Paper, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem'
import ShowSelect from '../../components/pagination/ShowSelect';
import Pagination from '../../components/pagination';
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

const LoadingWrapper = styled('div')(({ theme }) => ({
    position: 'fixed',
    left: '50%',
    top: '50%',
    webkitTransform: 'translateX(-50%) translateY(-50%)',
    transform: 'translateX(-50%) translateY(-50%)',
    'z-index': 1
}));

// ----------------------------------------------------------------------

export default function Collectible() {
  const [collectibles, setCollectibles] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  React.useEffect(async () => {
    setLoadingCollectibles(true);
    const resCollectibles = await fetch(
      `https://assist.trinity-feeds.app/sticker/api/v1/listStickers?pageNum=${page}&pageSize=${showCount}`
    );
    const jsonCollectibles = await resCollectibles.json();
    setPages(Math.ceil(jsonCollectibles.data.total/showCount));
    setCollectibles(jsonCollectibles.data.result);
    setLoadingCollectibles(false);
  }, [page, showCount]);
  const changeShowCount = (event) => {setShowCount(event.target.value)};

  return (
    <RootStyle title="Collectible | PASAR">
      <Container maxWidth="lg">
        <Stack sx={{flexDirection: 'row', mb: 2}}>
            <Typography variant="h4" sx={{flex:1}}>
                Newest Collectibles
            </Typography>
            <Pagination page={page} pages={pages} onChange={setPage} />
        </Stack>
        {isLoadingCollectibles && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Scrollbar>
            <Grid container spacing={2}>
            {collectibles.map((item, key) => (
                <Grid key={key} item xs={12}>
                    <Paper
                        sx={{
                            textAlign: 'center',
                            border: '1px solid',
                            borderColor: 'action.disabledBackground',
                            boxShadow: (theme) => theme.customShadows.z1
                        }}
                    >
                        <CollectibleListItem
                            item={{
                                image: getThumbnail(item.thumbnail),
                                timestamp: getTime(item.createTime),
                                name: item.name,
                                tokenIdHex: reduceHexAddress(item.tokenIdHex),
                                gasfee: (item.royalties / 10 ** 8).toFixed(7),
                                value: item.value!==undefined?item.value:0
                            }}
                        />
                    </Paper>
                </Grid>
            ))}
            </Grid>
        </Scrollbar>
        {
            collectibles.length>0&&
            <Stack sx={{flexDirection: 'row', mt: 2}}>
                <ShowSelect count={showCount} onChange={changeShowCount} sx={{flex:1}}/>
                <Pagination page={page} pages={pages} onChange={setPage} />
            </Stack>
        }
        
      </Container>
    </RootStyle>
  );
}
