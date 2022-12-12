import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useLocation, useNavigate} from "react-router-dom";
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { v1marketContract as V1_MARKET_CONTRACT_ADDRESS } from '../../config';
import TransLoadingButton from '../TransLoadingButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { isInAppBrowser, getFilteredGasPrice, getContractAddressInCurrentNetwork } from '../../utils/common';
import useAuctionDlg from '../../hooks/useAuctionDlg';
import useSignin from '../../hooks/useSignin';

CancelSale.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  orderId: PropTypes.any,
  order: PropTypes.any,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func,
  v1State: PropTypes.bool
};

export default function CancelSale(props) {
  const { isOpen, setOpen, name, orderId, updateCount, handleUpdate, order } = props;
  const [onProgress, setOnProgress] = React.useState(false);
  const { updateCount: updateCount2, setUpdateCount } = useAuctionDlg();
  const { enqueueSnackbar } = useSnackbar();
  const { pasarLinkChain } = useSignin();
  const v1State = order?.chain === 'v1';
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    setOpen(false);
  };

  const callCancelOrder = async (_orderId) => {
    const walletConnectProvider = isInAppBrowser()
      ? window.elastos.getWeb3Provider()
      : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    const accounts = await walletConnectWeb3.eth.getAccounts();

    const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
    const contractAbi = PASAR_CONTRACT_ABI;
    const contractAddress = !v1State ? MarketContractAddress : V1_MARKET_CONTRACT_ADDRESS;
    const pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);

    const _gasPrice = await walletConnectWeb3.eth.getGasPrice();
    const gasPrice = getFilteredGasPrice(_gasPrice);

    console.log('Sending transaction with account address:', accounts[0]);
    const transactionParams = {
      from: accounts[0],
      gasPrice,
      gas: 5000000,
      value: 0
    };

    pasarContract.methods
      .cancelOrder(_orderId)
      .send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        if (handleUpdate)
          setTimeout(() => {
            handleUpdate(updateCount + 1);
          }, 3000);
        else
          setTimeout(() => {
            setUpdateCount(updateCount2 + 1);
          }, 1000);
        enqueueSnackbar('Cancel sale Success!', { variant: 'success' });
        setOpen(false);
        if(location.pathname.startsWith('/profile')) {
          setTimeout(() => {window.location.reload()}, 2000);
        } else {
          setTimeout(() => {navigate('/profile')}, 2000);
        }
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation', confirmationNumber, receipt);
      })
      .on('error', (error) => {
        console.error('error', error);
        enqueueSnackbar('Cancel sale Error!', { variant: 'error' });
        setOnProgress(false);
      });
  };

  const cancelSale = async () => {
    setOnProgress(true);
    const _orderId = orderId !== undefined ? orderId : order.orderId;
    await callCancelOrder(_orderId);
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
          Unlist Item
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }} align="center">
          You are about to remove{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {name}
          </Typography>
          <br />
          from the marketplace
        </Typography>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={cancelSale}>
            Remove Listing
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
