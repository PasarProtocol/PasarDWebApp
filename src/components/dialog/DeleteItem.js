import React, { useState } from 'react';
import Web3 from 'web3';
import * as math from 'mathjs';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Link, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import {
  stickerContract as CONTRACT_ADDRESS,
  marketContract as MARKET_CONTRACT_ADDRESS,
  blankAddress
} from '../../config';
import { reduceHexAddress, isInAppBrowser } from '../../utils/common';
import TransLoadingButton from '../TransLoadingButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';

export default function DeleteItem(props) {
  const { isOpen, setOpen, title, tokenId, updateCount, handleUpdate } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const callBurn = async (_id, _value) => {
    const walletConnectProvider = isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider();
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
      .burn(_id, _value)
      .send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        setTimeout(()=>{handleUpdate(updateCount+1)}, 3000)
        enqueueSnackbar('Burn NFT success!', { variant: 'success' });
        setOpen(false);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation', confirmationNumber, receipt);
      })
      .on('error', (error, receipt) => {
        console.error('error', error);
        enqueueSnackbar('Burn NFT error!', { variant: 'warning' });
        setOnProgress(false);
      });
  };
  const burnNft = async () => {
    setOnProgress(true);
    callBurn(tokenId, 1);
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
        <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
          Delete Item
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          You are about to send{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {title}
          </Typography>{' '}
          to the burn address below
        </Typography>
        <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2, textAlign: 'center' }}>
          <Link href="#" color="red">
            {reduceHexAddress(blankAddress)}
          </Link>
        </Box>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={burnNft}>
            Delete Item
          </TransLoadingButton>
        </Box>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
