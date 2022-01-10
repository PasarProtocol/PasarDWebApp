import React, { useState } from "react";
import { Button, Dialog, TextField, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, Typography, Grid, Avatar, Box, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  iconAbsolute1: {
    paddingLeft: 40,
    paddingRight: 80,
    position: "relative",
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 16
    },
    "& .MuiButton-endIcon": {
      position: "absolute",
      right: 16
    }
  },
  iconAbsolute2: {
    paddingLeft: 40,
    paddingRight: 40,
    position: "relative",
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 16
    }
  }
});
export default function SignInDialog({ onChange }) {
  const [openSignin, setOpenSigninDlg] = useState(false);
  const [openDownload, setOpenDownloadDlg] = useState(false);
  const classes = useStyles();

  const handleClickOpenSinginDlg = () => {
    setOpenSigninDlg(true);
  };
  const handleClickOpenDownloadDlg = () => {
    setOpenSigninDlg(false);
    setOpenDownloadDlg(true);
  };
  const handleGoBack = () => {
    setOpenSigninDlg(true);
    setOpenDownloadDlg(false);
  };
  const handleCloseSigninDlg = () => {
    setOpenSigninDlg(false);
  };
  const handleCloseDownloadDlg = () => {
    setOpenDownloadDlg(false);
  };
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpenSinginDlg}>
        Sign In
      </Button>

      <Dialog open={openSignin} onClose={handleCloseSigninDlg}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseSigninDlg}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" component="div" sx={{color: 'text.primary'}} align="center">
            Sign in with your DID
          </Typography>
          <Box component="div" sx={{ px: 12 }}>
            <Typography variant="p" component="div" sx={{color: 'text.secondary'}} align="center">
              Sign in with one of the available providers or
              create a new one. <Link href="#" underline="hover" color="red">What is a DID?</Link>
            </Typography>
            <Grid container spacing={2} sx={{my: 4}}>
              <Grid item xs={12} sx={{pt: '0 !important'}}>
                <Typography variant="body2" display="block" gutterBottom align="center">
                  Web3.0 super wallet with Decentralized Identifier (DID)
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pt: '8px !important'}}>
                <Button variant="contained" 
                  startIcon={
                    <Avatar
                      alt="Elastos"
                      src="/static/elastos.svg"
                      sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                    />
                  }
                  endIcon={
                    <Typography variant="p" sx={{fontSize: '0.875rem !important'}}>
                      <span role="img" aria-label="">🔥</span>Popular
                    </Typography>
                  }
                  className={classes.iconAbsolute1}
                  fullWidth
                >
                  Elastos Essentials
                </Button>
              </Grid>
              <Grid item xs={12} sx={{pt: '8px !important'}}>
                <Typography variant="body2" display="block" gutterBottom align="center">
                  Just basic wallet and no DID
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pt: '8px !important'}}>
                <Button variant="contained" 
                  startIcon={
                    <Avatar
                      alt="metamask"
                      src="/static/metamask.svg"
                      sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                    />
                  }
                  className={classes.iconAbsolute2}
                  fullWidth
                >
                  MetaMask
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" 
                  startIcon={
                    <Avatar
                      alt="metamask"
                      src="/static/walletconnect.svg"
                      sx={{ width: 24, height: 24, backgroundColor: 'white', p: '5px' }}
                    />
                  }
                  className={classes.iconAbsolute2}
                  fullWidth
                >
                  Wallet Connect
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" fullWidth onClick={handleClickOpenDownloadDlg}>
                  I don’t have a wallet
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="caption" display="block" sx={{color: 'text.secondary'}} gutterBottom align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog open={openDownload} onClose={handleCloseDownloadDlg}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDownloadDlg}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" component="div" sx={{color: 'text.primary'}} align="center">
            Download Essentials
          </Typography>
          <Box component="div" sx={{ px: 12 }}>
            <Typography variant="p" component="div" sx={{color: 'text.secondary'}} align="center">
              Get Elastos Essentials now to kickstart your journey! 
              It is your gateway to Web3.0!
            </Typography>
            <Grid container spacing={2} sx={{my: 4}}>
              <Grid item xs={12} sx={{pt: '0 !important'}}>
                <Typography variant="body2" display="block" gutterBottom align="center">
                  Web3.0 super wallet with Decentralized Identifier (DID)
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pt: '8px !important'}}>
                <Button variant="contained" href="#" startIcon={<AdbIcon />} className={classes.iconAbsolute2} fullWidth>
                  Google Play
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" href="#" startIcon={<AppleIcon />} className={classes.iconAbsolute2} fullWidth>
                  App Store
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <Button
                  color="inherit"
                  startIcon={<Icon icon={arrowIosBackFill} />}
                  onClick={handleGoBack}
                >
                  Go back
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="caption" display="block" sx={{color: 'text.secondary'}} gutterBottom align="center">
            We do not own your private keys and cannot access your funds without your confirmation.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}

SignInDialog.propTypes = {
  onChange: PropTypes.func,
};
