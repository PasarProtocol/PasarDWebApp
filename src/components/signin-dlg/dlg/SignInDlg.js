import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Avatar, Box, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../StyledButton';

SignInDlg.propTypes = {
  open: PropTypes.bool,
  noDID: PropTypes.bool,
  onClick: PropTypes.func
};

export default function SignInDlg(props) {
  const { open, noDID = false, onClick } = props;
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
          Sign in with your DID
        </Typography>
        <Box component="div" sx={{ maxWidth: 350, m: 'auto' }}>
          <Typography variant="p" component="div" sx={{ color: 'text.secondary' }} align="center">
            Sign in with one of the available providers or create a new one.
            <Link href="https://www.elastos.org/did" underline="hover" color="red" target="_blank">
              What is a DID?
            </Link>
          </Typography>
          <Grid container spacing={2} sx={{ my: 4 }}>
            <Grid item xs={12} sx={{ pt: '0 !important' }}>
              <Typography variant="body2" display="block" gutterBottom align="center">
                Web3.0 super wallet with Decentralized Identifier (DID)
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ pt: '8px !important' }}>
              <StyledButton
                variant="contained"
                startIcon={
                  <Avatar
                    alt="Elastos"
                    src="/static/elastos.svg"
                    sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                  />
                }
                endIcon={
                  <Typography variant="p" sx={{ fontSize: '0.875rem !important' }}>
                    <span role="img" aria-label="">
                      🔥
                    </span>
                    Popular
                  </Typography>
                }
                fullWidth
                onClick={() => onClick('EE')}
              >
                Elastos Essentials
              </StyledButton>
            </Grid>
            {!noDID && (
              <>
                <Grid item xs={12} sx={{ pt: '8px !important' }}>
                  <Typography variant="body2" display="block" gutterBottom align="center">
                    Just basic wallet and no DID
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ pt: '8px !important' }}>
                  <StyledButton
                    variant="contained"
                    startIcon={
                      <Avatar
                        alt="metamask"
                        src="/static/metamask.svg"
                        sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                      />
                    }
                    fullWidth
                    onClick={() => onClick('MM')}
                  >
                    MetaMask
                  </StyledButton>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <StyledButton variant="outlined" fullWidth onClick={() => onClick('download')}>
                I don’t have a wallet
              </StyledButton>
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
