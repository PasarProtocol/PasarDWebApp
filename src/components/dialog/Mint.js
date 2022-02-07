import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransLoadingButton from '../TransLoadingButton';

export default function Mint(props) {
  const { setProp, totalSteps } = props
  const { isOpen, current, isReadySign } = props.dlgProp
  const handleClose = () => {
    setProp({...props.dlgProp, isOpen: false})
  };

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
          {current===1?"Create Item":"List on Market"}
        </Typography>
        <Box draggable = {false} component="img" src="/static/loading-light.gif" sx={{width: 100, m:'auto'}} />
        {
          isReadySign?
          <TransLoadingButton loading={Boolean(true)}/>:
          <Typography variant="subtitle2" align="center">
            Creating item on the blockchain...
          </Typography>
        }
        <Typography variant="subtitle2" align="center" color='origin.main' sx={{my: '10px'}}>
          Step {current} of {totalSteps}
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
