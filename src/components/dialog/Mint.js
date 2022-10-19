import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import TransLoadingButton from '../TransLoadingButton';
import useMintDlg from '../../hooks/useMintDlg';

export default function Mint() {
  const { current, totalSteps, isOpenMint, isOpenAccess, setOpenMintDlg, isReadySignForMint } = useMintDlg();
  const theme = useTheme();

  const handleClose = () => {
    setOpenMintDlg(false);
  };

  const titleArr = ['Create Item', 'Enable Access', 'List on Market'];
  const statusTextArr = [
    'Creating item on the blockchain...',
    'Setting approval for Pasar marketplace contract...',
    'Listing item on the marketplace...'
  ];
  if (totalSteps !== 3) {
    titleArr.splice(1, 1);
    statusTextArr.splice(1, 1);
  }

  return (
    <Dialog open={isOpenMint && !isOpenAccess} onClose={handleClose}>
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
          {titleArr[current - 1]}
        </Typography>
        <Box
          draggable={false}
          component="img"
          src={`/static/loading-${theme.palette.mode}.gif`}
          sx={{ width: 100, m: 'auto' }}
        />
        {isReadySignForMint ? (
          <TransLoadingButton loading={Boolean(true)} />
        ) : (
          <Typography variant="subtitle2" align="center">
            {statusTextArr[current - 1]}
          </Typography>
        )}
        <Typography variant="subtitle2" align="center" color="origin.main" sx={{ my: '10px' }}>
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
