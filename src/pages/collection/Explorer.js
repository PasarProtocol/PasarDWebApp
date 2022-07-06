// material
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { styled } from '@mui/material/styles';
import { Grid, Container, Stack, Typography, Link, Button, Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
// components
import Page from '../../components/Page';
import CollectionSortSelect from '../../components/CollectionSortSelect';
import ChainSelect from '../../components/ChainSelect';
import CollectionCard from '../../components/collection/CollectionCard';
import CollectionCardSkeleton from '../../components/collection/CollectionCardSkeleton';
import NeedBuyDIADlg from '../../components/dialog/NeedBuyDIA';
import StyledButton from '../../components/signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';
import { fetchFrom, collectionTypes } from '../../utils/common';

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

// ----------------------------------------------------------------------
const sortOptions = ["Diamond (DIA) Holdings: High to Low", "Latest", "Oldest", "Trading Volume: Low to High", "Trading Volume: High to Low", "Number of Item: Low to High", "Number of Item: High to Low", "Floor Price: Low to High", "Floor Price: High to Low", "Number of Owner: Low to High", "Number of Owner: High to Low"]
export default function Explorer() {
  const navigate = useNavigate();
  const [collections, setCollections] = React.useState([]);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [orderType, setOrderType] = React.useState(0);
  const [chainType, setChainType] = React.useState(0);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [needOptionToBelow, setOptionToBelow] = React.useState(false);
  const [controller, setAbortController] = React.useState(new AbortController());
  const { diaBalance, setOpenSigninEssentialDlg, setOpenDownloadEssentialDlg, setAfterSigninPath } = useSingin()

  React.useEffect(() => {
    handleResize()
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const { signal } = newController;
    setAbortController(newController);
    setLoadingCollections(true);
    fetchFrom(`api/v2/sticker/getCollection?sort=${orderType}&marketPlace=${chainType}`, { signal })
      .then((response) => {
        response.json().then((jsonAssets) => {
          if(Array.isArray(jsonAssets.data))
            setCollections(jsonAssets.data);
          else 
            setCollections([])
          setLoadingCollections(false);
        }).catch((e) => {
          setLoadingCollections(false);
        });
      })
      .catch((e) => {
        if (e.code !== e.ABORT_ERR) setLoadingCollections(false);
      });
  }, [orderType, chainType]);
  function handleResize() {
    if(sortOptions[orderType].length>15 && window.innerWidth<750)
      setOptionToBelow(true)
    else
      setOptionToBelow(false)
  }
  window.addEventListener('resize', handleResize);
  const handleNavlink = (e)=>{
    const path = e.target.getAttribute('to')
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      if(diaBalance>=0.01)
        navigate(path)
      else
        setOpenBuyDIA(true)
      return
    }
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3')
      setOpenDownloadEssentialDlg(1)
    else
      setOpenSigninEssentialDlg(true)
    setAfterSigninPath(path)
  }

  const loadingSkeletons = Array(3).fill(null)
  return (
    <RootStyle title="Collections | PASAR">
      <Container maxWidth="xl" sx={{px: {sm: 3, md: 6, lg: 9}}}>
        <Box sx={{ position: 'relative', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h2" component="div" align="center" sx={{ position: 'relative', lineHeight: 1.1 }}>
            Collections
          </Typography>
        </Box>
        <Box sx={{mb: 2}}>
          <Stack direction='row'>
            <Typography variant="subtitle2" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {collections.length} collections
            </Typography>
            <Stack direction='row' spacing={1}>
              <StyledButton variant="contained" onClick={handleNavlink} to='/collections/create'>
                Create
              </StyledButton>
              <StyledButton variant="contained" onClick={handleNavlink} to='/collections/import'>
                Import
              </StyledButton>
              {
                !needOptionToBelow&&
                <>
                  <ChainSelect selected={chainType} onChange={setChainType} />
                  <CollectionSortSelect onChange={setOrderType} orderType={orderType} sortOptions={sortOptions} />
                </>
              }
            </Stack>
          </Stack>
          {
            needOptionToBelow&&
            <>
              <ChainSelect selected={chainType} onChange={setChainType} sx={{mt: 1, width: '100%'}}/>
              <CollectionSortSelect onChange={setOrderType} orderType={orderType} sortOptions={sortOptions} sx={{mt: 1, width: '100%'}}/>
            </>
          }
        </Box>
        <Grid container spacing={2}>
          {
            isLoadingCollections?
            loadingSkeletons.map((item, index)=>(
              <Grid item key={index} xs={12} sm={6} md={4}>
                <CollectionCardSkeleton key={index}/>
              </Grid>
            )):
            collections.map((info, index)=>
              <Grid item key={index} xs={12} sm={6} md={4}>
                <CollectionCard info={info}/>
              </Grid>
            )
          }
          {
            !isLoadingCollections && !collections.length &&
            <Grid item xs={12}>
              <Typography variant="h4" align='center'>No collection found!</Typography>
            </Grid>
          }
        </Grid>
      </Container>
      <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance} actionText="create collections"/>
    </RootStyle>
  );
}
