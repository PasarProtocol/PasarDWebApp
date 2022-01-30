import React, { useState } from "react";
import Web3 from 'web3';
import * as math from 'mathjs';
import {Dialog, DialogTitle, DialogContent, IconButton, Typography, Input, FormControl, InputLabel, Divider, Accordion, AccordionSummary, AccordionDetails, 
    Grid, Tooltip, Button, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import {
  stickerContract as CONTRACT_ADDRESS,
  marketContract as MARKET_CONTRACT_ADDRESS,
  blankAddress
} from '../../config';
import { reduceHexAddress, removeLeadingZero } from '../../utils/common';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import CoinSelect from '../marketplace/CoinSelect';

const InputStyle = styled(Input)(({ theme }) => ({
    '&:before': {
        borderWidth: 0
    }
}));

export default function Transfer(props) {
    const {isOpen, setOpen, title, tokenId} = props
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = React.useState(false);
    const [address, setAddress] = React.useState('');
    const [isOpenAdvanced, setOpenAdvanced] = React.useState(false);
    const [memo, setMemo] = React.useState('');
    const handleClose = () => {
        setOpen(false);
    }

    const callSafeTransferFrom = async (_to, _id, _value) => {
      const walletConnectProvider = essentialsConnector.getWalletConnectProvider();
      const walletConnectWeb3 = new Web3(walletConnectProvider);
      const accounts = await walletConnectWeb3.eth.getAccounts();
  
      const contractAbi = STICKER_CONTRACT_ABI;
      const contractAddress = CONTRACT_ADDRESS;
      const stickerContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
  
      const gasPrice = await walletConnectWeb3.eth.getGasPrice();
  
      console.log('Sending transaction with account address:', accounts[0]);
      const transactionParams = {
        'from': accounts[0],
        'gasPrice': gasPrice,
        'gas': 5000000,
        'value': 0
      };
  
      stickerContract.methods
        .safeTransferFrom(accounts[0], _to, _id, _value)
        .send(transactionParams)
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash);
        })
        .on('receipt', (receipt) => {
          console.log('receipt', receipt);
          enqueueSnackbar('Transfer NFT success!', { variant: 'success' });
          setOpen(false);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log('confirmation', confirmationNumber, receipt);
        })
        .on('error', (error, receipt) => {
          console.error('error', error);
          enqueueSnackbar('Transfer NFT error!', { variant: 'warning' });
          setOnProgress(false);
        });
    };
    const transferNft = async () => {
      setOnProgress(true);
      callSafeTransferFrom(address, tokenId, 1);
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
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h3" component="div" sx={{color: 'text.primary'}} align="center">
                    Transfer Item
                </Typography>
                <Typography variant="body1" sx={{color: 'text.secondary', display: 'inline', pr: 1, py: 2}}>
                    Item: 
                </Typography>
                <Typography variant="subtitle1" sx={{display: 'inline'}}>{title}</Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{fontWeight: 'normal'}}>Wallet Address</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" sx={{width: '100%'}}>
                      <InputLabel htmlFor="input-with-price">
                        Enter recipient wallet address
                      </InputLabel>
                      <InputStyle
                        id="input-with-price"
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                        startAdornment={' '}
                        endAdornment={
                          <QrCodeScannerIcon/>
                        }
                      />
                    </FormControl>
                    <Divider/>
                  </Grid>
                </Grid>
                <Accordion expanded={isOpenAdvanced} sx={{my:0}}>
                  <AccordionSummary onClick={()=>setOpenAdvanced(!isOpenAdvanced)} sx={{p:0, '& .MuiAccordionSummary-content': {justifyContent: 'center'}}}>
                    <Typography variant="body2" sx={{display: 'inline-flex', alignItems: 'center'}}>Advanced Settings <Icon icon={isOpenAdvanced?arrowIosUpwardFill:arrowIosDownwardFill} width={20} height={20}/></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="h4" sx={{fontWeight: 'normal'}}>Memo</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width: '100%'}}>
                          <InputLabel htmlFor="input-with-price">
                            Enter memo Transferred via Pasar
                          </InputLabel>
                          <InputStyle
                            id="input-with-price"
                            value={memo}
                            onChange={(e)=>{setMemo(e.target.value)}}
                            startAdornment={' '}
                          />
                        </FormControl>
                        <Divider/>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
                  <LoadingButton loading={onProgress} variant="contained" fullWidth onClick={transferNft}>
                        Transfer
                    </LoadingButton>
                </Box>
                <Typography variant="caption" display="block" sx={{color: 'text.secondary'}} gutterBottom align="center">
                    We do not own your private keys and cannot access your funds<br/>without your confirmation.
                </Typography>
            </DialogContent>
        </Dialog>
    )
}