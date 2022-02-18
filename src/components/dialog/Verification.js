import React, { useState } from 'react';
import Web3 from 'web3';
import * as math from 'mathjs';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Tooltip, Icon, Button, Box, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import StyledButton from '../signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';

export default function Verification() {
  const { openVerification, setOpenVerification } = useSingin();
  // const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const handleClose = () => {
    setOpenVerification(false);
  }

  return (
    <Dialog open={openVerification} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
          Verification
        </Typography>
        <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
          Please provide verified identity credentials to<br/>receive a KYC badge on your profile.
        </Typography>
        <Typography variant="body2" display="block" gutterBottom align="center" sx={{ mt: 4 }}>
          Web3.0 super wallet with Decentralized Identifier (DID)
        </Typography>
        <Box component="div" sx={{ maxWidth: 300, m: 'auto' }}>
          <Grid container spacing={1.5} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12}>
              <StyledButton
                variant="contained"
                startIcon={
                  <Avatar
                    alt="Elastos"
                    src="/static/elastos.svg"
                    sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                  />
                }
                fullWidth
                onClick={async () => {
                  // check if is already connected
                  // await signInWithEssentials();
                  // if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                  //   await signOutWithEssentials();
                  //   await signInWithEssentials();
                  // } else {
                  //   await signInWithEssentials();
                  // }
                }}
              >
                Provide Credentials
              </StyledButton>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" display="block" gutterBottom align="center">
                No such credentials yet?
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{pt: '4px !important'}}>
              <StyledButton
                variant="outlined"
                href="https://kyc-me.io/"
                target="_blank"
                startIcon={
                  <Avatar
                    alt="kyc"
                    src="/static/kyc.svg"
                    sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                  />
                }
                fullWidth
              >
                Get verified on KYC-me.io now
              </StyledButton>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
