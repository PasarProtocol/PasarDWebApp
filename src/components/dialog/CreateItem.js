import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as math from 'mathjs';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Link, Stack, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../signin-dlg/StyledButton';

export default function CreateItem(props) {
  const { isOpen, setOpen, token } = props;
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
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
          Create Item
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', py: 1 }} align='center'>
          You have successfully created a collection!<br/>
          Do you want to proceed to ther next step and<br/>
          create/mint new item(s) onto your collections?
        </Typography>
        <Stack direction='column' spacing={1.5} sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
          <StyledButton variant='contained' onClick={()=>{ navigate('/create', {state: {token}}) }}>
            Yes
          </StyledButton>
          <StyledButton variant='outlined' to="/marketplace" component={RouterLink}>
            No, I will do it later
          </StyledButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
