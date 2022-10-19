import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  FormControl,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormHelperText,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import { useSnackbar } from 'notistack';

import { InputStyle, InputLabelStyle } from '../CustomInput';
// import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import { TOKEN_721_ABI } from '../../abi/token721ABI';
import { TOKEN_1155_ABI } from '../../abi/token1155ABI';
import {
  isInAppBrowser,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork,
  getERCType
} from '../../utils/common';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import TransLoadingButton from '../TransLoadingButton';
import useSingin from '../../hooks/useSignin';

Transfer.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  tokenId: PropTypes.string,
  baseToken: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

export default function Transfer(props) {
  const { isOpen, setOpen, name, baseToken, tokenId, updateCount, handleUpdate } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [isOpenAdvanced, setOpenAdvanced] = React.useState(false);
  const [memo, setMemo] = React.useState('');
  const [isOnValidation, setOnValidation] = React.useState(false);
  const { pasarLinkChain } = useSingin();
  const collectionABIs = [TOKEN_721_ABI, TOKEN_1155_ABI];

  const handleClose = () => {
    setOnValidation(false);
    setOnProgress(false);
    setOpen(false);
    setAddress('');
    setMemo('');
    setOpenAdvanced(false);
  };

  const callSafeTransferFrom = (_to, _id, _value) => {
    const PasarContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'sticker');
    let walletConnectProvider = Web3.givenProvider;
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2')
      walletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    walletConnectWeb3.eth
      .getAccounts()
      .then((accounts) => {
        walletConnectWeb3.eth
          .getGasPrice()
          .then((_gasPrice) => {
            const gasPrice = getFilteredGasPrice(_gasPrice);
            console.log('Sending transaction with account address:', accounts[0]);
            const transactionParams = {
              from: accounts[0],
              gasPrice,
              gas: 5000000,
              value: 0
            };

            const contractAddress = baseToken || PasarContractAddress;
            getERCType(contractAddress, walletConnectProvider)
              .then((collectionType) => {
                const contractAbi = collectionABIs[collectionType];
                const stickerContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
                let contractMethod;
                if (collectionType === 0)
                  contractMethod = stickerContract.methods.safeTransferFrom(accounts[0], _to, _id);
                else contractMethod = stickerContract.methods.safeTransferFrom(accounts[0], _to, _id, _value);
                contractMethod
                  .send(transactionParams)
                  .on('transactionHash', (hash) => {
                    console.log('transactionHash', hash);
                  })
                  .on('receipt', (receipt) => {
                    console.log('receipt', receipt);
                    setTimeout(() => {
                      handleUpdate(updateCount + 1);
                    }, 3000);
                    enqueueSnackbar('Transfer NFT success!', { variant: 'success' });
                    setOnProgress(false);
                    setOpen(false);
                  })
                  .on('confirmation', (confirmationNumber, receipt) => {
                    console.log('confirmation', confirmationNumber, receipt);
                  })
                  .on('error', (error) => {
                    console.error('error', error);
                    enqueueSnackbar('Transfer NFT error!', { variant: 'warning' });
                    setOnProgress(false);
                  });
              })
              .catch((e) => {
                console.error(e);
                enqueueSnackbar('Transfer NFT error!', { variant: 'error' });
                setOnProgress(false);
              });
          })
          .catch((e) => {
            console.error(e);
            enqueueSnackbar('Transfer NFT error!', { variant: 'error' });
            setOnProgress(false);
          });
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar('Transfer NFT error!', { variant: 'error' });
        setOnProgress(false);
      });
  };

  const transferNft = async () => {
    setOnValidation(true);
    if (!address.length) {
      enqueueSnackbar('Enter recipient wallet address', { variant: 'warning' });
      return;
    }
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
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
          Transfer Item
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', display: 'inline', pr: 1, py: 2 }}>
          Item:
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'inline' }}>
          {name}
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
              Wallet Address
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" error={isOnValidation && !address.length} sx={{ width: '100%' }}>
              <InputLabelStyle htmlFor="input-with-price">Enter recipient wallet address</InputLabelStyle>
              <InputStyle
                id="input-with-price"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                startAdornment={' '}
              />
              <FormHelperText hidden={!isOnValidation || (isOnValidation && address.length > 0)}>
                Wallet address is required
              </FormHelperText>
            </FormControl>
            <Divider />
          </Grid>
        </Grid>
        <Accordion expanded={isOpenAdvanced} sx={{ my: 0 }}>
          <AccordionSummary
            onClick={() => setOpenAdvanced(!isOpenAdvanced)}
            sx={{ p: 0, '& .MuiAccordionSummary-content': { justifyContent: 'center' } }}
          >
            <Typography variant="body2" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              Advanced Settings{' '}
              <Icon icon={isOpenAdvanced ? arrowIosUpwardFill : arrowIosDownwardFill} width={20} height={20} />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                  Memo
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ width: '100%' }}>
                  <InputLabelStyle htmlFor="input-with-price">Enter memo Transferred via Pasar</InputLabelStyle>
                  <InputStyle
                    id="input-with-price"
                    value={memo}
                    onChange={(e) => {
                      setMemo(e.target.value);
                    }}
                    startAdornment={' '}
                  />
                </FormControl>
                <Divider />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={transferNft}>
            Transfer
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
