import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Link, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import {useLocation, useNavigate} from "react-router-dom";
import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import { TOKEN_721_ABI } from '../../abi/token721ABI';
import { TOKEN_1155_ABI } from '../../abi/token1155ABI';
import { blankAddress } from '../../config';
import {
  reduceHexAddress,
  isInAppBrowser,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork
} from '../../utils/common';
import TransLoadingButton from '../TransLoadingButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import useSingin from '../../hooks/useSignin';

DeleteItem.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  tokenId: PropTypes.string,
  baseToken: PropTypes.string,
  is721: PropTypes.bool,
  chain: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

export default function DeleteItem(props) {
  const { isOpen, setOpen, name, baseToken, tokenId, updateCount, handleUpdate, is721, chain } = props;
  const [onProgress, setOnProgress] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { pasarLinkChain } = useSingin();
  const navigate = useNavigate()
  const location = useLocation();

  const handleClose = () => {
    setOpen(false);
  };

  const callBurn = async (_id, _value) => {
    const walletConnectProvider = isInAppBrowser()
      ? window.elastos.getWeb3Provider()
      : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    const accounts = await walletConnectWeb3.eth.getAccounts();

    const PasarContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'sticker');
    const contractAbi = is721 ? TOKEN_721_ABI : STICKER_CONTRACT_ABI;
    const contractAddress = baseToken || PasarContractAddress;
    const stickerContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);

    const _gasPrice = await walletConnectWeb3.eth.getGasPrice();
    const gasPrice = getFilteredGasPrice(_gasPrice);

    console.log('Sending transaction with account address:', accounts[0]);
    const transactionParams = {
      from: accounts[0],
      gasPrice,
      gas: 5000000,
      value: 0
    };

    let methodEvent;
    if(is721) {
      methodEvent = stickerContract.methods.burn(_id);
    } else {
      methodEvent = stickerContract.methods.burn(_id, _value);
    }
      methodEvent.send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        setTimeout(() => {
          handleUpdate(updateCount + 1);
        }, 3000);
        enqueueSnackbar('Burn NFT success!', { variant: 'success' });
        setOpen(false);
        if(location.pathname === '/profile/myitem/1') {
          setTimeout(() => {window.location.reload()}, 2000);
        } else {
          setTimeout(() => {navigate('/profile/myitem/1');window.location.reload()}, 2000);
        }
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation', confirmationNumber, receipt);
      })
      .on('error', (error) => {
        console.error('error', error);
        enqueueSnackbar('Burn NFT error!', { variant: 'error' });
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
            {name}
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
