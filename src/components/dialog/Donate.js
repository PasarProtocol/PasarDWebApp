import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Stack, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MHidden } from '../@material-extend';
import AddressCopyButton from '../AddressCopyButton';
import useSettings from '../../hooks/useSettings';
import { donationAddress } from '../../config';

Donate.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func
};

export default function Donate(props) {
  const { isOpen, setOpen } = props;
  const { themeMode } = useSettings();
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
        <Stack align="center">
          <Typography variant="h3" sx={{ color: 'text.primary' }}>
            Donation
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            Thank you for your great generosity!
            <br />
            Your support is invaluable to us, thank you again!
          </Typography>
          <Typography variant="h6" sx={{ color: 'origin.main' }}>
            Pasar Protocol Donation Address
          </Typography>
          <Typography variant="body2">Elastos Smart Chain (ESC)</Typography>
          <Box sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
            <MHidden width="smDown">
              <Box sx={{ p: 2, mb: 2, borderRadius: 1, backgroundColor: themeMode === 'light' ? '#ccc' : '#3f4e5f' }}>
                <Box sx={{ p: 2, backgroundColor: 'white' }}>
                  <QRCode value={donationAddress} size={200} />
                </Box>
              </Box>
            </MHidden>
            <AddressCopyButton address={donationAddress} />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
