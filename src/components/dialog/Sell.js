import React, { useState } from 'react';
import Web3 from 'web3';
import * as math from 'mathjs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Input,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  Tooltip,
  Icon,
  Button,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import {
  stickerContract as CONTRACT_ADDRESS,
  marketContract as MARKET_CONTRACT_ADDRESS,
  blankAddress
} from '../../config';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import TransLoadingButton from '../TransLoadingButton';
import CoinSelect from '../marketplace/CoinSelect';
import { removeLeadingZero, callContractMethod, sendIpfsDidJson, isInAppBrowser } from '../../utils/common';

const InputStyle = styled(Input)(({ theme }) => ({
  '&:before': {
    borderWidth: 0
  }
}));

export default function Sell(props) {
  const { isOpen, setOpen, title, tokenId, updateCount, handleUpdate } = props;
  const [price, setPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    setPrice(priceValue);
    setRcvPrice(math.round((priceValue * 98) / 100, 3));
  };

  const callSetApprovalForAllAndSell = (_operator, _approved, _price, _didUri) => (
    new Promise((resolve, reject) => {
      const walletConnectWeb3 = new Web3(isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
      // const accounts = await walletConnectWeb3.eth.getAccounts();
      walletConnectWeb3.eth.getAccounts().then((accounts)=>{

        const contractAbi = STICKER_CONTRACT_ABI;
        const contractAddress = CONTRACT_ADDRESS; // Elastos Testnet
        const stickerContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
        
        walletConnectWeb3.eth.getGasPrice().then((gasPrice)=>{
          console.log("Gas price:", gasPrice);
          // console.log("Sending transaction with account address:", accounts[0]);
          const transactionParams = {
              'from': accounts[0],
              'gasPrice': gasPrice,
              'gas': 5000000,
              'value': 0
          };
    
          stickerContract.methods.isApprovedForAll(accounts[0], _operator).call().then(isApproval=>{
            console.log("isApprovalForAll=", isApproval);
            if (!isApproval)
              stickerContract.methods.setApprovalForAll(_operator, true).send(transactionParams)
              .on('receipt', (receipt) => {
                  console.log("setApprovalForAll-receipt", receipt);
                  callContractMethod('createOrderForSale', {
                    '_id': tokenId,
                    '_amount': 1,
                    '_price': _price,
                    '_didUri': _didUri
                  }).then((success) => {
                    resolve(success)
                  }).catch(error=>{
                    reject(error)
                  })
              })
              .on('error', (error, receipt) => {
                  console.error("setApprovalForAll-error", error);
                  reject(error)
              });
            else
              callContractMethod('createOrderForSale', {
                '_id': tokenId,
                '_amount': 1,
                '_price': _price,
                '_didUri': _didUri
              }).then((success) => {
                resolve(success)
              }).catch(error=>{
                reject(error)
              })
          })
        })
        
      })
    })
  )

  const putOnSale = async () => {
    setOnProgress(true);
    const didUri = await sendIpfsDidJson();
    const sellPrice = BigInt(price*1e18).toString();
    console.log('--------', tokenId, '--', sellPrice, '--', didUri, '--');
    callSetApprovalForAllAndSell(MARKET_CONTRACT_ADDRESS, true, sellPrice, didUri).then(result=>{
      if(result){
        setTimeout(()=>{handleUpdate(updateCount+1)}, 3000)
        enqueueSnackbar('Sell NFT success!', { variant: 'success' });
        setOpen(false);
      } else {
        enqueueSnackbar('Sell NFT error!', { variant: 'warning' });
      }
    }).catch(e=>{
      console.log(e)
    });
  }

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
          {title}
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
              Price
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <InputLabel htmlFor="input-with-price">Enter a fixed price of each item</InputLabel>
              <InputStyle
                type="number"
                id="input-with-price"
                value={price}
                onChange={handleChangePrice}
                startAdornment={' '}
                endAdornment={<CoinSelect />}
              />
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
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontWeight: 'normal' }}>
              You will receive
              <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main', display: 'inline' }}> {rcvprice} ELA </Typography>
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
