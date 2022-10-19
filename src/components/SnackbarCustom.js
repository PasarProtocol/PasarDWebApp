import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

SnackbarCustom.propTypes = {
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func
};

export default function SnackbarCustom(props) {
  const { vertical = 'top', horizontal = 'center', children, isOpen, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
      <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  );
}
