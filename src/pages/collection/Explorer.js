// material
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { styled } from '@mui/material/styles';
import { Grid, Container, Stack, Typography, Link, Button, Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import { useWeb3React } from '@web3-react/core';
import jwtDecode from 'jwt-decode';
// components
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import { walletconnect } from '../../components/signin-dlg/connectors';
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import CollectionSortSelect from '../../components/CollectionSortSelect';
import CollectionCard from '../../components/collection/CollectionCard';
import CollectionCardSkeleton from '../../components/collection/CollectionCardSkeleton';
import Jazzicon from '../../components/Jazzicon';
import StyledButton from '../../components/signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';
import { reduceHexAddress, getDiaTokenInfo, fetchFrom, getInfoFromDID, getDidInfoFromAddress, isInAppBrowser, getCredentialInfo, collectionTypes } from '../../utils/common';

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
export default function Explorer() {
  const navigate = useNavigate();
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [orderType, setOrderType] = React.useState(0);
  const [controller, setAbortController] = React.useState(new AbortController());
  const { setOpenSigninEssentialDlg, setOpenDownloadEssentialDlg, setAfterSigninPath } = useSingin()

  React.useEffect(() => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const { signal } = newController;
    setAbortController(newController);
    setLoadingCollections(true);
    fetchFrom(`api/v2/sticker/getCollection?orderType=${orderType}`, { signal })
      .then((response) => {
        response.json().then((jsonAssets) => {
          setCollections(jsonAssets.data);
          setLoadingCollections(false);
        }).catch((e) => {
          setLoadingCollections(false);
        });
      })
      .catch((e) => {
        if (e.code !== e.ABORT_ERR) setLoadingCollections(false);
      });
  }, [orderType]);

  const handleNavlink = (e)=>{
    const path = e.target.getAttribute('to')
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      navigate(path)
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
      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h2" component="div" align="center" sx={{ position: 'relative', lineHeight: 1.1 }}>
            Collections
          </Typography>
        </Box>
        <Stack direction='row' sx={{mb: 2}}>
          <Typography variant="subtitle2" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {collections.length} collections
          </Typography>
          <Stack direction='row' spacing={1}>
            <StyledButton variant="contained" onClick={handleNavlink} to='/collection/create'>
              Create
            </StyledButton>
            <StyledButton variant="contained" onClick={handleNavlink} to='/collection/import'>
              Import
            </StyledButton>
            <CollectionSortSelect onChange={setOrderType} />
          </Stack>
        </Stack>
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
        </Grid>
      </Container>
    </RootStyle>
  );
}
