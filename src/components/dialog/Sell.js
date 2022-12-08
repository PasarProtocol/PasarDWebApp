import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import * as math from 'mathjs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  FormControl,
  Divider,
  Grid,
  Tooltip,
  Box,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import {useNavigate} from "react-router-dom";
import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import TransLoadingButton from '../TransLoadingButton';
import CoinSelect from '../marketplace/CoinSelect';
import { InputStyle, InputLabelStyle } from '../CustomInput';
import useSingin from '../../hooks/useSignin';
import {
  removeLeadingZero,
  callContractMethod,
  sendIpfsDidJson,
  isInAppBrowser,
  getCoinTypesInCurrentNetwork,
  isValidLimitPrice,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork,
  getChainTypeFromId
} from '../../utils/common';

Sell.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  tokenId: PropTypes.string,
  baseToken: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func,
  isMinter: PropTypes.bool,
  royalties: PropTypes.number
};

export default function Sell(props) {
  const { isOpen, setOpen, name, tokenId, baseToken, updateCount, handleUpdate, isMinter = false, royalties } = props;
  const [price, setPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [coinType, setCoinType] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const { diaBalance, pasarLinkChain } = useSingin();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setOnProgress(false);
    setPrice('');
    setRcvPrice(0);
    setOnValidation(false);
  };

  const handleChangePrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    if (!isValidLimitPrice(priceValue)) return;
    setPrice(priceValue);
    const royaltyFee = isMinter ? 0 : math.round((priceValue * royalties) / 10 ** 6, 4);
    setRcvPrice(math.round((priceValue * 98) / 100 - royaltyFee, 3));
  };

  const callSetApprovalForAllAndSell = (_operator, _approved, _price, _didUri) =>
    new Promise((resolve, reject) => {
      const walletConnectWeb3 = new Web3(
        isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider()
      );
      walletConnectWeb3.eth.getAccounts().then((accounts) => {
        const stickerContract = new walletConnectWeb3.eth.Contract(STICKER_CONTRACT_ABI, baseToken);
        walletConnectWeb3.eth.getGasPrice().then((_gasPrice) => {
          const gasPrice = getFilteredGasPrice(_gasPrice);
          console.log('Gas price:', gasPrice);
          const transactionParams = {
            from: accounts[0],
            gasPrice,
            gas: 5000000,
            value: 0
          };

          stickerContract.methods
            .isApprovedForAll(accounts[0], _operator)
            .call()
            .then((isApproval) => {
              console.log('isApprovalForAll=', isApproval);
              if (!isApproval)
                stickerContract.methods
                  .setApprovalForAll(_operator, true)
                  .send(transactionParams)
                  .on('receipt', (receipt) => {
                    console.log('setApprovalForAll-receipt', receipt);
                    callContractMethod('createOrderForSale', coinType, pasarLinkChain, {
                      _id: tokenId,
                      _amount: 1,
                      _price,
                      _didUri,
                      _baseAddress: baseToken
                    })
                      .then((success) => {
                        resolve(success);
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  })
                  .on('error', (error) => {
                    console.error('setApprovalForAll-error', error);
                    reject(error);
                  });
              else
                callContractMethod('createOrderForSale', coinType, pasarLinkChain, {
                  _id: tokenId,
                  _amount: 1,
                  _price,
                  _didUri,
                  _baseAddress: baseToken
                })
                  .then((success) => {
                    resolve(success);
                  })
                  .catch((error) => {
                    reject(error);
                  });
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    });

  const putOnSale = async () => {
    setOnValidation(true);
    if (!(price * 1)) return;
    const chainType = getChainTypeFromId(pasarLinkChain);
    if (chainType === 'ESC' && coinType !== 0 && diaBalance * 1 === 0) {
      enqueueSnackbar('Sorry, you need to hold a minimum of 0.01 DIA to sell nft via other ERC20 tokens.', {
        variant: 'warning'
      });
      return;
    }
    setOnProgress(true);
    const didUri = await sendIpfsDidJson();
    const sellPrice = BigInt(price * 1e18).toString();
    const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
    callSetApprovalForAllAndSell(MarketContractAddress, true, sellPrice, didUri)
      .then((result) => {
        if (result) {
          setTimeout(() => {
            handleUpdate(updateCount + 1);
          }, 3000);
          enqueueSnackbar('Sell NFT success!', { variant: 'success' });
          setOpen(false);
          setTimeout(() => {navigate('/profile/myitem/0');window.location.reload()}, 2000)
        } else {
          enqueueSnackbar('Sell NFT error!', { variant: 'error' });
          setOnProgress(false);
        }
      })
      .catch((e) => {
        enqueueSnackbar('Sell NFT error!', { variant: 'error' });
        setOnProgress(false);
        console.log(e);
      });
  };

  const coinTypes = getCoinTypesInCurrentNetwork(pasarLinkChain);
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
          List on Market
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', display: 'inline', pr: 1 }}>
          Item:
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'inline' }}>
          {name}
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
              Price
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl error={isOnValidation && !(price * 1)} variant="standard" sx={{ width: '100%' }}>
              <InputLabelStyle htmlFor="input-with-price">Enter a fixed price of each item</InputLabelStyle>
              <InputStyle
                type="number"
                id="input-with-price"
                value={price}
                onChange={handleChangePrice}
                startAdornment={' '}
                endAdornment={<CoinSelect selected={coinType} onChange={setCoinType} />}
                aria-describedby="price-error-text"
                inputProps={{
                  sx: { flexGrow: 1, width: 'auto' }
                }}
              />
              <FormHelperText id="price-error-text" hidden={!isOnValidation || (isOnValidation && price * 1)}>
                Price is required
              </FormHelperText>
            </FormControl>
            <Divider />
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
              Platform fee 2%&nbsp;
              <Tooltip
                title="We take 2% of every transaction that happens on Pasar for providing the platform to users"
                arrow
                disableInteractive
                enterTouchDelay={0}
              >
                <Icon icon="eva:info-outline" style={{ marginBottom: -4, fontSize: 18 }} />
              </Tooltip>
              {!isMinter && royalties * 1 > 0 && <>,&nbsp;Royalty fee {math.round(royalties / 1e4, 2)}%</>}
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontWeight: 'normal' }}>
              You will receive
              <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main', display: 'inline' }}>
                {' '}
                {rcvprice} {coinTypes[coinType].name}{' '}
              </Typography>
              per item
            </Typography>
          </Grid>
        </Grid>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={putOnSale}>
            List
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
