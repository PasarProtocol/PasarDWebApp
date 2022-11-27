import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Grid, Container, Stack, Typography, Box } from '@mui/material';
import Page from '../../components/Page';
import CollectionSortSelect from '../../components/CollectionSortSelect';
import ChainSelect from '../../components/ChainSelect';
import CategorySelect from '../../components/collection/CategorySelect';
import CollectionCard from '../../components/collection/CollectionCard';
import CollectionCardSkeleton from '../../components/collection/CollectionCardSkeleton';
import NeedBuyDIADlg from '../../components/dialog/NeedBuyDIA';
import StyledButton from '../../components/signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';
import { chainTypes, fetchAPIFrom, getChainTypeFromId } from '../../utils/common';

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
const sortOptions = [
  'Diamond (DIA) Holdings: High to Low',
  'Latest',
  'Oldest',
  'Trading Volume: Low to High',
  'Trading Volume: High to Low',
  'Number of Item: Low to High',
  'Number of Item: High to Low',
  'Floor Price: Low to High',
  'Floor Price: High to Low',
  'Number of Owner: Low to High',
  'Number of Owner: High to Low'
];

const categories = ['General', 'Art', 'Collectibles', 'Photography', 'Trading Cards', 'Utility', 'Domains'];

export default function Explorer() {
  const navigate = useNavigate();
  const [collections, setCollections] = React.useState([]);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [chainType, setChainType] = React.useState(0);
  const [orderType, setOrderType] = React.useState(0);
  const [category, setCategory] = React.useState(0);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [needOptionToBelow, setOptionToBelow] = React.useState(false);
  const [controller, setAbortController] = React.useState(new AbortController());
  const { diaBalance, setOpenSigninEssentialDlg, setOpenDownloadEssentialDlg, setAfterSigninPath, pasarLinkChain } =
    useSingin();

  React.useEffect(() => {
    const fetchData = async () => {
      handleResize();
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      setLoadingCollections(true);

      const paramChain = chainType === 0 ? 'all' : chainTypes[chainType - 1].token.toLowerCase();
      const paramCategory = category === 0 ? 'all' : categories[category - 1].toLowerCase();
      try {
        const resCnt = await fetchAPIFrom(
          `api/v1/listCollections?pageNum=1&pageSize=1&chain=${paramChain}&category=${paramCategory}&sort=${orderType}`,
          {
            signal
          }
        );
        const jsonCnt = await resCnt.json();
        const res = await fetchAPIFrom(
          `api/v1/listCollections?pageNum=1&pageSize=${
            jsonCnt?.data?.total ?? 10
          }&chain=${paramChain}&category=${paramCategory}&sort=${orderType}`,
          {
            signal
          }
        );
        const json = await res.json();
        setCollections(json?.data?.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoadingCollections(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, chainType, category]);

  const handleResize = () => {
    if (sortOptions[orderType].length > 15 && window.outerWidth < 900) setOptionToBelow(true);
    else setOptionToBelow(false);
  };

  window.addEventListener('resize', handleResize);

  const handleNavlink = (e) => {
    const currentChain = getChainTypeFromId(pasarLinkChain);
    const path = e.target.getAttribute('to');
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      if (currentChain !== 'ESC' || diaBalance >= 0.01) navigate(path);
      else setOpenBuyDIA(true);
      return;
    }
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3')
      setOpenDownloadEssentialDlg(1);
    else setOpenSigninEssentialDlg(true);
    setAfterSigninPath(path);
  };

  const loadingSkeletons = Array(3).fill(null);

  return (
    <RootStyle title="Collections | PASAR">
      <Container maxWidth="xl" sx={{ px: { sm: 3, md: 6, lg: 9 } }}>
        <Box sx={{ position: 'relative', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h2" component="div" align="center" sx={{ position: 'relative', lineHeight: 1.1 }}>
            Collections
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row">
            <Typography variant="subtitle2" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {collections.length} collections
            </Typography>
            <Stack direction="row" spacing={1}>
              <StyledButton variant="contained" onClick={handleNavlink} to="/collections/create">
                Create
              </StyledButton>
              <StyledButton variant="contained" onClick={handleNavlink} to="/collections/import">
                Import
              </StyledButton>
              {!needOptionToBelow && (
                <>
                  <ChainSelect selected={chainType} onChange={setChainType} />
                  <CollectionSortSelect onChange={setOrderType} orderType={orderType} sortOptions={sortOptions} />
                  <CategorySelect is4filter={Boolean(true)} selected={category} onChange={setCategory} />
                </>
              )}
            </Stack>
          </Stack>
          {needOptionToBelow && (
            <>
              <ChainSelect selected={chainType} onChange={setChainType} sx={{ mt: 1, width: '100%' }} />
              <CollectionSortSelect
                onChange={setOrderType}
                orderType={orderType}
                sortOptions={sortOptions}
                sx={{ mt: 1, width: '100%' }}
              />
              <CategorySelect
                is4filter={Boolean(true)}
                selected={category}
                onChange={setCategory}
                sx={{ mt: 1, width: '100%' }}
              />
            </>
          )}
        </Box>
        <Grid container spacing={2}>
          {isLoadingCollections
            ? loadingSkeletons.map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <CollectionCardSkeleton key={index} />
                </Grid>
              ))
            : collections.map((info, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <CollectionCard info={info} />
                </Grid>
              ))}
          {!isLoadingCollections && !collections.length && (
            <Grid item xs={12}>
              <Typography variant="h4" align="center">
                No collection found!
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
      <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance} actionText="create collections" />
    </RootStyle>
  );
}
