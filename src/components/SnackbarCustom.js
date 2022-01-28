import React, { useState } from "react";
import { Snackbar, Alert } from '@mui/material';

export default function SnackbarCustom(props) {
  const { vertical = 'top', horizontal = 'center', children, isOpen, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ 'vertical': vertical, 'horizontal': horizontal }}>
      <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  );
}