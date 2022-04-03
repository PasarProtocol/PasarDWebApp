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
import { stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS, auctionOrderType } from '../../config';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { walletconnect } from '../signin-dlg/connectors';
import TransLoadingButton from '../TransLoadingButton';
import StyledButton from '../signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';
import { reduceHexAddress, getBalance, callContractMethod, sendIpfsDidJson, isInAppBrowser } from '../../utils/common';

export default function SettleOrder(props) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const context = useWeb3React();
  const { pasarLinkAddress } = useSingin()
  const { library, chainId, account } = context;

  const { isOpen, setOpen, info, address } = props;

  // let priceInfo = info.Price;
  // if(info.orderType===auctionOrderType && info.buyoutPrice)
  //   priceInfo = info.buyoutPrice

  let topBuyer = ''
  const seller = info.holder
  let currentBid = 0
  if(info.listBid && info.listBid.length) {
    topBuyer = info.listBid[0].buyerAddr
    // seller = info.listBid[0].sellerAddr
    currentBid = info.listBid[0].price
  }

  const handleClose = () => {
    setOpen(false);
  };

  const callEthSettleOrder = (_orderId) => {
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
              'value': 0
            };
            pasarContract.settleAuctionOrder(_orderId, transactionParams).then((nftTxn)=>{
              console.log("Settling order... please wait")
              nftTxn.wait().then(()=>{
                // console.log("bought")
                enqueueSnackbar('Settle auction order success!', { variant: 'success' });
                setOpen(false);
                setOnProgress(false);
                // setTimeout(()=>{
                //   navigate('/profile/myitem/1')
                // }, 3000)
              }).catch((error) => {
                console.log(error)
                enqueueSnackbar('Settle auction order error!', { variant: 'error' });
                setOnProgress(false);
              })
            }).catch((error) => {
              console.log(error)
              enqueueSnackbar('Settle auction order error!', { variant: 'error' });
              setOnProgress(false);
            })
          }).catch((error) => {
            console.log(error)
            enqueueSnackbar('Settle auction order error!', { variant: 'error' });
            setOnProgress(false);
          })
        }).catch((error) => {
          console.log(error)
          enqueueSnackbar('Settle auction order error!', { variant: 'error' });
          setOnProgress(false);
        })
        
      } else {
        console.log("Ethereum object does not exist");
        enqueueSnackbar('Settle auction order error!', { variant: 'error' });
        setOnProgress(false);
      }
    } catch (err) {
      setOnProgress(false);
      enqueueSnackbar('Settle auction order error!', { variant: 'error' });
      console.log(err);
    }
  }

  const callSettleOrder = (_orderId) => {
    callContractMethod('settleAuctionOrder', 0, {
      _orderId,
    }).then((success) => {
      enqueueSnackbar('Settle auction order success!', { variant: 'success' });
      setOnProgress(false)
      setOpen(false)
      // setTimeout(()=>{
      //   navigate('/profile/myitem/1')
      // }, 3000)
    }).catch(error=>{
      enqueueSnackbar('Settle auction order error!', { variant: 'error' })
      setOnProgress(false)
    })
  };

  const settleOrder = async () => {
    setOnProgress(true);
    if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3')
      callEthSettleOrder(info.OrderId);
    else if(sessionStorage.getItem("PASAR_LINK_ADDRESS") === '2')
      callSettleOrder(info.OrderId);
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

  const price = currentBid / 1e18;
  const platformFee = math.round((price * 2) / 100, 4);
  const royalties = info.SaleType === 'Primary Sale' ? 0 : math.round((price * info.royalties) / 10 ** 6, 4);
  console.log(address, seller)
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
          {address===seller?"Accept Bid":"Claim Item"}
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }}>
          {
            address===seller&&
            <>
              You are about to accept{' '}
              <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
                {`${math.round(currentBid/1e18, 3)} ELA`}
              </Typography>
              <br />
            </>
          }
          {
            address===seller?
            'in exchange for ':
            'You are about to claim '
          }
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {info.name}
          </Typography>
          <br />
          from{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {reduceHexAddress(info.holder)}
          </Typography>
        </Typography>
        <Typography variant='h4' sx={{mt: 1}}>
          {address===seller?"Top Bid":"Your Winning Bid"}<br/>
          {math.round(currentBid / 1e18, 3)} ELA
        </Typography>
        <Grid container sx={{ mt: 2, display: 'block' }}>
          <Grid item xs={12}>
            {
              address===topBuyer&&
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
            }
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
              {
                address===seller?
                <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }} color="origin.main">
                  You will get
                </Typography>:
                <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                  Seller will get
                </Typography>
              }
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {price - platformFee - royalties} ELA
              </Typography>
            </Stack>
          </Grid>
          {
            address===topBuyer&&
            <Grid item xs={12}>
              <Stack direction="row">
                <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }} color="origin.main">
                  You will pay
                </Typography>
                <Typography variant="body2" display="block" gutterBottom align="right">
                  {price} ELA
                </Typography>
              </Stack>
            </Grid>
          }
        </Grid>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton
            loading={onProgress}
            onClick={settleOrder}>
            {address===seller?"Accept":"Claim"}
          </TransLoadingButton>
        </Box>
        <Typography variant="body2" display="block" color="red" gutterBottom align="center">
          Please check all item details before {address===seller?"accepting the bid":"claming the item"}
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }} gutterBottom align="center">
          We do not own your private keys and cannot access your funds
          <br />
          without your confirmation.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
