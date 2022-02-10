// material
import React from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Paper, Typography, Link } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem'
import ShowSelect from '../../components/pagination/ShowSelect';
import Pagination from '../../components/pagination';
import PaperRecord from '../../components/PaperRecord';
import LoadingWrapper from '../../components/LoadingWrapper';
import DateOrderSelect from '../../components/DateOrderSelect';
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

export default function Collectible() {
  const navigate = useNavigate();
  const [collectibles, setCollectibles] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingCollectibles(true);
    fetchFrom(`sticker/api/v1/listStickers?pageNum=${page}&pageSize=${showCount}&timeOrder=${timeOrder}`, { signal }).then(response => {
      response.json().then(jsonCollectibles => {
        setTotalCount(jsonCollectibles.data.total)
        setPages(Math.ceil(jsonCollectibles.data.total/showCount));
        setCollectibles(jsonCollectibles.data.result);
        setLoadingCollectibles(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingCollectibles(false);
    });
  }, [page, showCount, timeOrder]);
  
  const changeShowCount = (event) => {
    setShowCount(event.target.value)
  };
  const handleDateOrder = (selected)=>{
    setTimeOrder(selected)
  }
  const link2Detail = (tokenId)=>{
    navigate(`/explorer/collectible/detail/${tokenId}`);
  }
  return (
    <RootStyle title="Collectible | PASAR">
      <Container maxWidth="lg">
        <StackStyle sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{flex:1}}>
                All Collectibles
                <DateOrderSelect onChange={handleDateOrder}/>
                <Typography variant="body2" sx={{ display: 'inline-block' }}>{totalCount.toLocaleString('en')} items</Typography>
            </Typography>
            <Pagination page={page} pages={pages} onChange={setPage} />
        </StackStyle>
        {isLoadingCollectibles && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Scrollbar>
            <Grid container spacing={2}>
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
        </Scrollbar>
        {
            collectibles.length>0&&
            <StackStyle  sx={{ mt: 2, display: 'block' }}>
                <Pagination page={page} pages={pages} onChange={setPage}/>
                <ShowSelect count={showCount} onChange={changeShowCount}/>
            </StackStyle>
        }
      </Container>
    </RootStyle>
  );
}
