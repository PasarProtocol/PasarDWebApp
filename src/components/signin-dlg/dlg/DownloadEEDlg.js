import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Button, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import StyledButton from '../StyledButton';

DownloadEEDlg.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func
};

export default function DownloadEEDlg(props) {
  const { open, onClick } = props;
  return (
    <Dialog open={open} onClose={() => onClick('close')}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => onClick('close')}
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
          Download Essentials
        </Typography>
        <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
          Get Elastos Essentials now to kickstart your journey!
          <br />
          It is your gateway to Web3.0!
        </Typography>
        <Typography variant="body2" display="block" gutterBottom align="center" sx={{ mt: 4 }}>
          Web3.0 super wallet with Decentralized Identifier (DID)
        </Typography>
        <Box component="div" sx={{ maxWidth: 300, m: 'auto' }}>
          <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} sx={{ pt: '8px !important' }}>
              <StyledButton
                variant="contained"
                href="https://play.google.com/store/apps/details?id=org.elastos.essentials.app"
                target="_blank"
                startIcon={<AdbIcon />}
                fullWidth
              >
                Google Play
              </StyledButton>
            </Grid>
            <Grid item xs={12}>
              <StyledButton
                variant="outlined"
                href="https://apps.apple.com/us/app/elastos-essentials/id1568931743"
                target="_blank"
                startIcon={<AppleIcon />}
                fullWidth
              >
                App Store
              </StyledButton>
            </Grid>
            <Grid item xs={12} align="center">
              <Button color="inherit" startIcon={<Icon icon={arrowIosBackFill} />} onClick={() => onClick('goback')}>
                Go back
              </Button>
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
