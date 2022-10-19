import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

import TransLoadingButton from '../TransLoadingButton';

RegisterCollection.propTypes = {
  type: PropTypes.number,
  current: PropTypes.number,
  isOpenDlg: PropTypes.bool,
  setOpenDlg: PropTypes.func,
  isReadySign: PropTypes.bool
};

export default function RegisterCollection(props) {
  const { type = 0, current = 0, isOpenDlg, setOpenDlg, isReadySign } = props;
  const theme = useTheme();

  const handleClose = () => {
    setOpenDlg(false);
  };

  const titleArr = ['Import Collection', 'Deploy Contract', 'Update Info'];
  let promptTitle = titleArr[type];
  if (type === 1 && current !== 1) promptTitle = 'Register Info';

  let stateString = 'Registering collection info...';
  if (type === 1 && current === 1) stateString = 'Deploying new collection contract...';
  else if (type === 2) stateString = 'Updating collection info...';
  return (
    <Dialog open={isOpenDlg} onClose={handleClose}>
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
          {promptTitle}
        </Typography>
        <Box
          draggable={false}
          component="img"
          src={`/static/loading-${theme.palette.mode}.gif`}
          sx={{ width: 100, m: 'auto' }}
        />
        {isReadySign ? (
          <TransLoadingButton loading={Boolean(true)} />
        ) : (
          <Typography variant="subtitle2" align="center">
            {stateString}
          </Typography>
        )}
        {type === 1 && (
          <Typography variant="subtitle2" align="center" color="origin.main" sx={{ my: '10px' }}>
            Step {current} of 2
          </Typography>
        )}
        <Typography
          variant="caption"
          display="block"
          sx={{ color: 'text.secondary', mt: '10px' }}
          gutterBottom
          align="center"
        >
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
