import React, { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Button, Dialog, Stack, DialogTitle, DialogContent, DialogActions,
  DialogContentText, IconButton, Typography, Grid, Avatar, Box, Link, Menu, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PropTypes from 'prop-types';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { MIconButton, MFab } from '../@material-extend';
import { injected, walletconnect, walletlink } from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hook";
import CopyButton from '../CopyButton';
import PaperRecord from '../PaperRecord';
import { reduceHexAddress } from '../../utils/common';

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
  const context = useWeb3React()
  const { connector, activate, active, error, library, chainId, account } = context;
  const [openSignin, setOpenSigninDlg] = useState(false);
  const [openDownload, setOpenDownloadDlg] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState(null);
  const [isOpenAccountPopup, setOpenAccountPopup] = React.useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const classes = useStyles();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  React.useEffect(() => {
    setWalletAddress(account)
  }, [account])

  // ------------ Connect Wallet ------------
  const handleChooseWallet = async (wallet) => {
    let currentConnector = null;
    if(wallet === 'metamask') currentConnector = injected;
    else if(wallet === 'elastos') currentConnector = walletlink;
    else if(wallet === 'walletconnect') currentConnector = walletconnect;
    setActivatingConnector(currentConnector);
    await activate(currentConnector);
    setOpenSigninDlg(false);
  };

  // ------------ Handle Transaction ------------
  const handleTransaction = async (to, value) => {
    if (library) {
      const accounts = await library.listAccounts();
      if(to.length !== 42)
        alert("Invalid recipient address.");
      const params = [
        {
          'from': accounts[0],
          'to': to, // "0x24e16f04e84d435F0Bb0380801a6f8C1a543618A",
          'value': ethers.utils.parseUnits(value).toHexString(),
          'chainId': 21, // 20
        },
      ];
      await library
        .send("eth_sendTransaction", params)
        .then()
        .catch((err) => {
          console.log(err);
        });
    }
  };
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
  
  const openAccountMenu = (event) => {
    setOpenAccountPopup(event.currentTarget);
  };
  const closeAccountMenu = () => {
    setOpenAccountPopup(null);
  };
  return (
    walletAddress?(
      <>
        <MFab size="small" onClick={openAccountMenu}>
          <AccountCircleOutlinedIcon />
        </MFab>
        <Menu 
          keepMounted
          id="simple-menu"
          anchorEl={isOpenAccountPopup}
          onClose={closeAccountMenu}
          open={Boolean(isOpenAccountPopup)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{px: 2, py: '6px'}}>
            <Typography variant="h6">{reduceHexAddress(walletAddress)} <CopyButton text={walletAddress} sx={{mt: '-3px'}}/></Typography>
            <Typography variant="body2" color="text.secondary">did:elastos:xxx..xxxx <CopyButton text={walletAddress}/></Typography>
            <Stack spacing={1}>
              <PaperRecord sx={{
                  p:1.5,
                  textAlign: 'center',
                  minWidth: 300
                }}
              >
                <Typography variant="h6">Total Balance</Typography>
                <Typography variant="h3" color="origin.main">USD 400</Typography>
                <Button variant="outlined" fullWidth sx={{textTransform: 'none'}}>Add funds</Button>
              </PaperRecord>
              <PaperRecord sx={{ p:1.5 }}>
                <Stack direction="row" alignItems="center" spacing={2} >
                  <Box
                      draggable = {false}
                      component="img"
                      alt=""
                      src='/static/elastos.svg'
                      sx={{ width: 24, height: 24 }}
                  />
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2"> ELA </Typography>
                      <Typography variant="body2" color='text.secondary'> Elastos (ESC) </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" align="right"> 100 </Typography>
                    <Typography variant="body2" align="right" color='text.secondary'> USD 400 </Typography>
                  </Box>
                </Stack>
              </PaperRecord>
              <PaperRecord sx={{ p:1.5 }}>
                <Stack direction="row" alignItems="center" spacing={2} >
                  <Box
                      draggable = {false}
                      component="img"
                      alt=""
                      src='/static/badges/diamond.svg'
                      sx={{ width: 24, height: 24 }}
                  />
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="body2"> DIA </Typography>
                      <Typography variant="body2" color='text.secondary'> Diamond (ESC) </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" align="right"> 0 </Typography>
                    <Typography variant="body2" align="right" color='text.secondary'> 0 </Typography>
                  </Box>
                </Stack>
              </PaperRecord>
            </Stack>
          </Box>
          <MenuItem to='/marketplace/myitem' onClick={closeAccountMenu} component={RouterLink}>
            <BookOutlinedIcon/>&nbsp;My Items
          </MenuItem>
          <MenuItem onClick={closeAccountMenu}>
            <SettingsOutlinedIcon/>&nbsp;Settings
          </MenuItem>
          <MenuItem onClick={closeAccountMenu}>
            <LogoutOutlinedIcon/>&nbsp;Sign Out
          </MenuItem>
        </Menu>
      </>
    ):(
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
                    onClick={()=>{handleChooseWallet('metamask')}}
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
    )
  );
}

SignInDialog.propTypes = {
  onChange: PropTypes.func,
};
