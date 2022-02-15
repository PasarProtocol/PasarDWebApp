import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import * as math from 'mathjs';
import { useWeb3React } from '@web3-react/core';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, Grid, Stack, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS } from '../../config';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { walletconnect } from '../signin-dlg/connectors';
import TransLoadingButton from '../TransLoadingButton';
import useSingin from '../../hooks/useSignin';
import { reduceHexAddress, getBalance, callContractMethod, sendIpfsDidJson, isInAppBrowser } from '../../utils/common';

export default function Purchase(props) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const context = useWeb3React();
  const { pasarLinkAddress } = useSingin()
  const { library, chainId, account } = context;

  const { isOpen, setOpen, info } = props;
  const handleClose = () => {
    setOpen(false);
  };

  const callEthBuyOrder = async (_orderId, _didUri, _price) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pasarContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, PASAR_CONTRACT_ABI, signer);
        signer.getAddress().then(userAddress=>{
          provider.getGasPrice().then(gasPrice=>{
            const transactionParams = {
              'from': userAddress,
              'gasPrice': gasPrice.toBigInt(),
              'value': _price
            };
            pasarContract.buyOrder(_orderId, _didUri, transactionParams).then((nftTxn)=>{
              console.log("Buying... please wait")
              nftTxn.wait().then(()=>{
                // console.log("bought")
                enqueueSnackbar('Buy NFT Success!', { variant: 'success' });
                setOpen(false);
                setOnProgress(false);
                setTimeout(()=>{
                  navigate('/profile/myitem/1')
                }, 3000)
              }).catch((error) => {
                console.log(error)
                enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
                setOnProgress(false);
              })
            }).catch((error) => {
              console.log(error)
              enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
              setOnProgress(false);
            })
          }).catch((error) => {
            console.log(error)
            enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
            setOnProgress(false);
          })
        }).catch((error) => {
          console.log(error)
          enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
          setOnProgress(false);
        })
        
      } else {
        console.log("Ethereum object does not exist");
        enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
        setOnProgress(false);
      }
    } catch (err) {
      setOnProgress(false);
      enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
      console.log(err);
    }
  }

  const callBuyOrder = async (_orderId, _didUri, _price) => {
    const walletConnectProvider = isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    const accounts = await walletConnectWeb3.eth.getAccounts();

    const contractAbi = PASAR_CONTRACT_ABI;
    const contractAddress = MARKET_CONTRACT_ADDRESS;
    const pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);

    const gasPrice = await walletConnectWeb3.eth.getGasPrice();

    console.log('Sending transaction with account address:', accounts[0]);
    const transactionParams = {
      'from': accounts[0],
      'gasPrice': gasPrice,
      'gas': 5000000,
      'value': _price
    };

    pasarContract.methods
      .buyOrder(_orderId, _didUri)
      .send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        enqueueSnackbar('Buy NFT Success!', { variant: 'success' });
        setOpen(false);
        setOnProgress(false);
        setTimeout(()=>{
          navigate('/profile/myitem/1')
        }, 3000)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation', confirmationNumber, receipt);
      })
      .on('error', (error, receipt) => {
        console.error('error', error);
        enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
        setOnProgress(false);
      });

    // callContractMethod('buyOrder', {'_orderId': _orderId, '_didUri': _didUri})
  };

  const buyNft = async () => {
    setOnProgress(true);
    const buyerDidUri = await sendIpfsDidJson();
    console.log('didUri:', buyerDidUri);
    const buyPrice = BigInt(info.Price).toString();
    if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
        callEthBuyOrder(info.OrderId, buyerDidUri, buyPrice);
    }
    else if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '2') {
        callBuyOrder(info.OrderId, buyerDidUri, buyPrice);
    }
  };

  React.useEffect(async () => {
    const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    if (sessionLinkFlag) {
      if (sessionLinkFlag === '1' && library)
        getBalance(library.provider).then((res) => {
          setBalance(math.round(res / 1e18, 4));
        })
      else if (sessionLinkFlag === '2'){
        if (isInAppBrowser()) {
          const elastosWeb3Provider = await window.elastos.getWeb3Provider();
          getBalance(elastosWeb3Provider).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          });
        } else if(essentialsConnector.getWalletConnectProvider()) {
          getBalance(essentialsConnector.getWalletConnectProvider()).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          })
        }
      }
      else if (sessionLinkFlag === '3')
        getBalance(walletconnect.getProvider()).then((res) => {
          setBalance(math.round(res / 1e18, 4));
        });
    }
  }, [account, chainId, pasarLinkAddress]);

  const price = info.Price / 1e18;
  const platformFee = math.round((price * 2) / 100, 4);
  const royalties = info.SaleType === 'Primary Sale' ? 0 : math.round((price * info.royalties) / 10 ** 6, 4);
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
          Checkout
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }}>
          You are about to purchase{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {info.name}
          </Typography>
          <br />
          from{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {reduceHexAddress(info.holder)}
          </Typography>
          <br />
          for{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {math.round(info.Price / 1e18, 3)} ELA
          </Typography>
        </Typography>
        <Grid container sx={{ mt: 2, display: 'block' }}>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" sx={{ flex: 1, mb: 0.5 }}>
                Wallet Balance
              </Typography>
              <Typography
                variant="body2"
                display="block"
                gutterBottom
                align="right"
                sx={{ color: 'text.secondary', mb: 0.5 }}
              >
                {balance} ELA
              </Typography>
            </Stack>
            <Divider sx={{ mb: 0.5 }} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Platform fee 2%
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {platformFee} ELA
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Creator will get (royalties)
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {royalties} ELA
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Seller will get
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {price - platformFee - royalties} ELA
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }} color="red">
                You will pay
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right">
                {price} ELA
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {price <= balance ? (
          <>
            <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
              <TransLoadingButton
                loading={onProgress}
                onClick={buyNft}>
                Buy
              </TransLoadingButton>
            </Box>
            <Typography variant="body2" display="block" color="red" gutterBottom align="center">
              Please check all item details before making a purchase
            </Typography>
          </>
        ) : (
          <>
            <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
              <Button
                variant="outlined"
                href="https://glidefinance.io/swap"
                target="_blank"
                fullWidth
              >
                Add funds
              </Button>
            </Box>
            <Typography variant="body2" display="block" color="red" gutterBottom align="center">
              Insufficient funds in ELA
            </Typography>
          </>
        )}
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
