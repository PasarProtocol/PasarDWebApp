import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, Grid, Stack, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function NeedBuyDIA(props) {
  const context = useWeb3React();
  const { library, chainId, account } = context;

  const { isOpen, setOpen, balance } = props;
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(async () => {
  }, [account, chainId]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
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
          Insufficient Funds
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }} align="center">
          You need to hold a minimum value of<br/>
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            0.01 DIA
          </Typography>
          {' '}in order to transfer items
        </Typography>
        <Grid container sx={{ mt: 2, display: 'block' }}>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" sx={{ flex: 1, mb: 0.5 }}>
                Wallet Balance
              </Typography>
              <Typography
                variant="body2"
                display="block"
                gutterBottom
                align="right"
                sx={{ color: 'text.secondary', mb: 0.5 }}
              >
                {balance} DIA
              </Typography>
            </Stack>
            <Divider sx={{ mb: 0.5 }} />
          </Grid>
        </Grid>
        <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
          <Button
            variant="contained"
            href="https://glidefinance.io/swap"
            target="_blank"
            fullWidth
          >
            Buy DIA
          </Button>
        </Box>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
