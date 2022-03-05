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
import MyItemsSortSelect from '../../components/MyItemsSortSelect';
import CollectionCard from '../../components/collection/CollectionCard';
import Jazzicon from '../../components/Jazzicon';
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
export default function MyItems() {
  const navigate = useNavigate();
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [orderType, setOrderType] = React.useState(0);
  const [controller, setAbortController] = React.useState(new AbortController());

  React.useEffect(() => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const { signal } = newController;
    setAbortController(newController);
  
    // fetchFrom(`sticker/api/v1/getCollections?address=${walletAddress}&orderType=${orderType}`, { signal })
    //   .then((response) => {
    //     response.json().then((jsonAssets) => {
    //       setAssetsOfType(i, jsonAssets.data);
    //       setLoadingCollections(false);
    //     }).catch((e) => {
    //       setLoadingCollections(false);
    //     });
    //   })
    //   .catch((e) => {
    //     if (e.code !== e.ABORT_ERR) setLoadingCollections(false);
    //   });
  }, [orderType]);

  const loadingSkeletons = Array(10).fill(null)

  return (
    <RootStyle title="Collections | PASAR">
      <Container maxWidth={false}>
        <Box sx={{ position: 'relative', justifyContent: 'center' }}>
          <Typography variant="h2" component="div" align="center" sx={{ position: 'relative', lineHeight: 1.1 }}>
            Collections
          </Typography>
        </Box>
        <Stack direction='row'>
          <Typography variant="subtitle2" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {collections.length} collections
          </Typography>
          <MyItemsSortSelect onChange={setOrderType} />
        </Stack>
        <Grid container spacing={2}>
          {
            collections.map((info, index)=>
              <Grid item xs={12} sm={6} md={4}>
                <CollectionCard info={info}/>
              </Grid>
            )
          }
        </Grid>
      </Container>
    </RootStyle>
  );
}
