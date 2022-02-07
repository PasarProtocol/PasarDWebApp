import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, Grid, Stack, Divider} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransLoadingButton from '../TransLoadingButton';
import useMintDlg from '../../hooks/useMintDlg';

export default function Access(props) {
  const {isOpenAccess, setOpenAccessDlg, setReadySignForAccess, isReadySignForAccess, approvalFunction} = useMintDlg()

  const handleEnable = (e) => {
    setReadySignForAccess(true)
    approvalFunction()
  }
  const handleClose = () => {
    setOpenAccessDlg(false)
  }

  return (
    <Dialog open={isOpenAccess} onClose={handleClose}>
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
          Enable Access
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }}>
          Pasar requires your authorization
          to transfer all sold items from your
          wallet to the buyer’s address when a
          buy order is complete
        </Typography>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton
            loading={isReadySignForAccess}
            onClick={handleEnable}>
            Enable
          </TransLoadingButton>
        </Box>
        <Typography variant="body2" display="block" color="red" gutterBottom align="center">
          This is a one-time action only per address
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
