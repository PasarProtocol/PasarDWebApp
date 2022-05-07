import React, { useState } from 'react';
import Web3 from 'web3';
import * as math from 'mathjs';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Input, FormControl, InputLabel, Divider, Grid, Tooltip, Icon, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';

import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import CoinSelect from '../marketplace/CoinSelect';
import TransLoadingButton from '../TransLoadingButton';
import CoinTypeLabel from '../CoinTypeLabel';
import { InputStyle, InputLabelStyle } from '../CustomInput';
import { removeLeadingZero, isInAppBrowser, coinTypes, callContractMethod } from '../../utils/common';
import { stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS, auctionOrderType } from '../../config';


export default function UpdatePrice(props) {
  const { isOpen, setOpen, name, orderId, orderType, updateCount, handleUpdate } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [reservePrice, setReservePrice] = React.useState('');
  const [buyoutPrice, setBuyoutPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [coinType, setCoinType] = React.useState(0);
  const handleClose = () => {
    setOpen(false);
    setOnProgress(false)
    setPrice('')
    setReservePrice('')
    setBuyoutPrice('')
    setRcvPrice(0)
    setCoinType(0)
  };

  const handlePrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    return priceValue
  };

  const handleChangePrice = (event) => {
    const priceValue = handlePrice(event);
    setPrice(priceValue);
    setRcvPrice(math.round((priceValue * 98) / 100, 3));
  };

  const handleChangeReservePrice = (event) => {
    const priceValue = handlePrice(event);
    setReservePrice(priceValue);
  };

  const handleChangeBuyoutPrice = (event) => {
    const priceValue = handlePrice(event);
    setBuyoutPrice(priceValue);
  };

  const callChangeOrderPrice = async (_orderId, _price, _reservePrice, _buyoutPrice) => {
    callContractMethod(orderType===auctionOrderType?'changeAuctionOrderPrice':'changeSaleOrderPrice', coinType, {_orderId, _price, _reservePrice, _buyoutPrice})
      .then((success) => {
        setTimeout(()=>{handleUpdate(updateCount+1)}, 3000)
        enqueueSnackbar('Update price success!', { variant: 'success' });
        setOpen(false);
      })
      .catch(error=>{
        enqueueSnackbar('Update price error!', { variant: 'error' });
        setOnProgress(false);
      })
  };

  const changePrice = async () => {
    setOnProgress(true);
    console.log('orderId:', orderId);
    const _updatedPrice = BigInt(price*1e18).toString();
    const _reservePrice = BigInt(reservePrice*1e18).toString();
    const _buyoutPrice = BigInt(buyoutPrice*1e18).toString();
    console.log(_updatedPrice);
    callChangeOrderPrice(orderId, _updatedPrice, _reservePrice, _buyoutPrice);
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
          Update Price
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
              {orderType===auctionOrderType?'Starting Price':'Price'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <InputLabelStyle htmlFor="input-with-price">Enter a {orderType===auctionOrderType?'starting':'fixed'} price of each item</InputLabelStyle>
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
              <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main', display: 'inline' }}>
                {' '}{rcvprice} {coinTypes[coinType].name}{' '}
              </Typography>
              per item
            </Typography>
          </Grid>
        </Grid>
        {
          orderType===auctionOrderType &&
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Reserve Price
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabelStyle htmlFor="input-with-price">Enter a reserve price</InputLabelStyle>
                <InputStyle
                  type="number"
                  id="input-reserve-price"
                  value={reservePrice}
                  onChange={handleChangeReservePrice}
                  startAdornment={' '}
                  endAdornment={<CoinTypeLabel type={coinType}/>}
                />
              </FormControl>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Buy Now Price
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabelStyle htmlFor="input-with-price">Enter a buy now price</InputLabelStyle>
                <InputStyle
                  type="number"
                  id="input-buyout-price"
                  value={buyoutPrice}
                  onChange={handleChangeBuyoutPrice}
                  startAdornment={' '}
                  endAdornment={<CoinTypeLabel type={coinType}/>}
                />
              </FormControl>
              <Divider />
            </Grid>
          </Grid>
        }
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={changePrice}>
            Update
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
