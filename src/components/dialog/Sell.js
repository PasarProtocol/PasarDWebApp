import React, { useState } from 'react';
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
import { LoadingButton } from '@mui/lab';

import CoinSelect from '../marketplace/CoinSelect';
import { removeLeadingZero, callContractMethod, sendIpfsDidJson } from '../../utils/common';

const InputStyle = styled(Input)(({ theme }) => ({
  '&:before': {
    borderWidth: 0
  }
}));

export default function Sell(props) {
  const { isOpen, setOpen, title, tokenId } = props;
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
              >
                <Icon icon="eva:info-outline" style={{ marginBottom: -4, fontSize: 18 }} />
              </Tooltip>
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontWeight: 'normal' }}>
              You will receive
              <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main', display: 'inline' }}>
                {' '}
                {rcvprice} ELA{' '}
              </Typography>
              per item
            </Typography>
          </Grid>
        </Grid>
        <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
          <LoadingButton
            loading={onProgress}
            variant="contained"
            fullWidth
            onClick={async () => {
              setOnProgress(true);
              const didUri = await sendIpfsDidJson();
              console.log('--------', tokenId, '--', price, '--', didUri, '--');
              await callContractMethod('createOrderForSale', {
                _id: tokenId,
                _amount: 1,
                _price: price,
                _didUri: didUri
              });
              enqueueSnackbar('Sell NFT success!', { variant: 'success' });
              setOpen(false);
            }}
          >
            List
          </LoadingButton>
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
