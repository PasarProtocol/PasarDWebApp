import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { addDays } from 'date-fns';
import * as math from 'mathjs';
import { useWeb3React } from '@web3-react/core';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, Grid, Stack, Divider, FormControl, Input, InputLabel, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS } from '../../config';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { walletconnect } from '../signin-dlg/connectors';
import TransLoadingButton from '../TransLoadingButton';
import useSingin from '../../hooks/useSignin';
import StartingDateSelect from '../marketplace/StartingDateSelect'
import ExpirationDateSelect from '../marketplace/ExpirationDateSelect'
import CoinSelect from '../marketplace/CoinSelect';
import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import { reduceHexAddress, getBalance, callContractMethod, sendIpfsDidJson, isInAppBrowser, removeLeadingZero, getDateTimeString } from '../../utils/common';

const InputStyle = styled(Input)(({ theme }) => ({
  '&:before': {
    borderWidth: 0
  }
}));

export default function Auction(props) {
  const { isOpen, setOpen, title, tokenId, updateCount, handleUpdate } = props;
  const navigate = useNavigate();
  // const [balance, setBalance] = useState(0);
  const [onProgress, setOnProgress] = useState(false);
  const [price, setPrice] = useState('');
  const [startingDate, setStartingDate] = React.useState(0);
  const [expirationDate, setExpirationDate] = React.useState(addDays(new Date(), 1));
  const [dateCount, setDateCount] = React.useState(0);
  const [coinType, setCoinType] = React.useState(0);
  
  const { enqueueSnackbar } = useSnackbar();

  const context = useWeb3React();
  const { pasarLinkAddress } = useSingin()
  const { library, chainId, account } = context;

  React.useEffect(async () => {
    if(isOpen)
      setExpirationDate(addDays(new Date(), 1))
  }, [isOpen])

  React.useEffect(async () => {
    // const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    // if (sessionLinkFlag) {
    //   if (sessionLinkFlag === '2'){
    //     if (isInAppBrowser()) {
    //       const elastosWeb3Provider = await window.elastos.getWeb3Provider();
    //       getBalance(elastosWeb3Provider).then((res) => {
    //         setBalance(math.round(res / 1e18, 4));
    //       });
    //     } else if(essentialsConnector.getWalletConnectProvider()) {
    //       getBalance(essentialsConnector.getWalletConnectProvider()).then((res) => {
    //         setBalance(math.round(res / 1e18, 4));
    //       })
    //     }
    //   }
    //   else if (sessionLinkFlag === '3')
    //     getBalance(walletconnect.getProvider()).then((res) => {
    //       setBalance(math.round(res / 1e18, 4));
    //     });
    // }
  }, [account, chainId, pasarLinkAddress]);

  const handleExpirationDate = (date)=>{
    setExpirationDate(date)
    setDateCount(dateCount+1)
  }
  const handleClose = () => {
    setOpen(false);
    setOnProgress(false);
  }

  const handleChangePrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    setPrice(priceValue);
  }

  const callSetApprovalForAllAndAuction = (_operator, _price, _didUri) => (
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
                  callContractMethod('createOrderForAuction', coinType, {
                    '_id': tokenId,
                    '_amount': 1,
                    '_minPrice': _price,
                    '_endTime': (expirationDate.getTime() / 1000).toFixed(),
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
              callContractMethod('createOrderForAuction', coinType, {
                '_id': tokenId,
                '_amount': 1,
                '_minPrice': _price,
                '_endTime': (expirationDate.getTime() / 1000).toFixed(),
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

  const auctionNft = async () => {
    setOnProgress(true);
    const didUri = await sendIpfsDidJson();
    const bidPrice = BigInt(price*1e18).toString();
    console.log('--------', tokenId, '--', bidPrice, '--', didUri, '--');
    callSetApprovalForAllAndAuction(MARKET_CONTRACT_ADDRESS, bidPrice, didUri).then(result=>{
      if(result){
        setTimeout(()=>{handleUpdate(updateCount+1)}, 3000)
        enqueueSnackbar('Auction success!', { variant: 'success' });
        setOpen(false);
      } else {
        enqueueSnackbar('Auction error!', { variant: 'error' });
        setOnProgress(false);
      }
    }).catch(e=>{
      enqueueSnackbar('Auction error!', { variant: 'error' });
      setOnProgress(false);
      console.log(e)
    });
  }

  const TypographyStyle = {display: 'inline', lineHeight: 1.1}
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
        <Typography variant="h3" component="div" sx={{ color: 'text.primary', pb: 1 }} align="center">
          Auction
        </Typography>
        <Typography variant="h6" component="div" sx={{ color: 'text.secondary', lineHeight: 1.1, fontWeight: 'normal' }}>
          Item: <Typography variant="h6" sx={{ ...TypographyStyle, color: 'text.primary' }}>{title}</Typography>
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', mt:1 }}>
          Starting Price
        </Typography>
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <InputLabel htmlFor="input-with-price">Enter starting price</InputLabel>
          <InputStyle
            type="number"
            id="input-with-price"
            value={price}
            onChange={handleChangePrice}
            startAdornment={' '}
            endAdornment={<CoinSelect selected={coinType} onChange={setCoinType}/>}
          />
        </FormControl>
        <Divider />
        <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
          Bids below this amount won't be allowed<br/>
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
        <Typography variant="h5" sx={{ fontWeight: 'normal', mt:1 }}>
          Starting Date
        </Typography>
        <StartingDateSelect selected={startingDate} onChange={setStartingDate}/>
        <Divider />
        <Typography variant="h5" sx={{ fontWeight: 'normal', mt:1 }}>
          Expiration Date
        </Typography>
        <ExpirationDateSelect onChangeDate={handleExpirationDate}/>
        <Divider />
        <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
          Auction ends on {getDateTimeString(expirationDate)}
        </Typography>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton
            loading={onProgress}
            onClick={auctionNft}>
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
