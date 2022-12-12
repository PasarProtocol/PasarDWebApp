import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
import * as math from 'mathjs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  FormControl,
  Divider,
  Grid,
  Tooltip,
  Box,
  FormHelperText,
  Link
} from '@mui/material';
import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import CoinSelect from '../marketplace/CoinSelect';
import TransLoadingButton from '../TransLoadingButton';
import CoinTypeLabel from '../CoinTypeLabel';
import { InputStyle, InputLabelStyle } from '../CustomInput';
import DIABadge from '../badge/DIABadge';
import {
  removeLeadingZero,
  getCoinTypesInCurrentNetwork,
  callContractMethod,
  isValidLimitPrice,
  getDiaBalanceDegree
} from '../../utils/common';
import { auctionOrderType } from '../../config';
import useSignin from '../../hooks/useSignin';
import { PATH_PAGE } from '../../routes/paths';

UpdatePrice.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  orderId: PropTypes.any,
  state: PropTypes.object,
  orderType: PropTypes.any,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func,
  v1State: PropTypes.bool,
  royalties: PropTypes.number
};

export default function UpdatePrice(props) {
  const {
    isOpen,
    setOpen,
    name,
    orderId,
    state,
    orderType,
    updateCount,
    handleUpdate,
    v1State = false,
    royalties
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [reservePrice, setReservePrice] = React.useState('');
  const [buyoutPrice, setBuyoutPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [coinType, setCoinType] = React.useState(0);
  const [isOnValidation, setOnValidation] = React.useState(false);

  const { diaBalance, pasarLinkChain } = useSignin();
  const navigate = useNavigate()
  const location = useLocation();
  const handleClose = () => {
    setOpen(false);
    setOnProgress(false);
    setPrice('');
    setReservePrice('');
    setBuyoutPrice('');
    setRcvPrice(0);
    setCoinType(0);
    setOnValidation(false);
  };

  const handleChangePrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    if (!isValidLimitPrice(priceValue)) return;
    setPrice(priceValue);
    const royaltyFee = state.isFirstSale ? 0 : math.round((priceValue * royalties) / 10 ** 6, 4);
    setRcvPrice(math.round((priceValue * 98) / 100 - royaltyFee, 3));
  };

  const handleChangeReservePrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    if (!isValidLimitPrice(priceValue)) return;
    setReservePrice(priceValue);
  };

  const handleChangeBuyoutPrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    if (!isValidLimitPrice(priceValue)) return;
    setBuyoutPrice(priceValue);
  };

  const callChangeOrderPrice = async (_orderId, _price, _reservePrice, _buyoutPrice) => {
    callContractMethod(
      orderType === auctionOrderType ? 'changeAuctionOrderPrice' : 'changeSaleOrderPrice',
      coinType,
      pasarLinkChain,
      {
        _orderId,
        _price,
        _reservePrice,
        _buyoutPrice,
        v1State
      }
    )
      .then((success) => {
        setTimeout(() => {
          handleUpdate(updateCount + 1);
        }, 3000);
        enqueueSnackbar('Update price success!', { variant: 'success' });
        setOpen(false);
        if(location.pathname.startsWith('/profile')) {
          setTimeout(() => {window.location.reload()}, 2000);
        } else {
          setTimeout(() => {navigate('/profile/myitem/1')}, 2000);
        }
      })
      .catch((e) => {
        enqueueSnackbar('Update price error!', { variant: 'error' });
        setOnProgress(false);
      });
  };

  const changePrice = async () => {
    setOnValidation(true);
    if (!(price * 1)) return;

    setOnProgress(true);
    const _updatedPrice = BigInt(price * 1e18).toString();
    const _reservePrice = BigInt(reservePrice * 1e18).toString();
    const _buyoutPrice = BigInt(buyoutPrice * 1e18).toString();
    console.log(_updatedPrice);
    callChangeOrderPrice(orderId, _updatedPrice, _reservePrice, _buyoutPrice);
  };

  const DiaDegree = getDiaBalanceDegree(diaBalance, pasarLinkChain);
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
              {orderType === auctionOrderType ? 'Starting Price' : 'Price'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl error={isOnValidation && !(price * 1)} variant="standard" sx={{ width: '100%' }}>
              <InputLabelStyle htmlFor="input-with-price">
                Enter a {orderType === auctionOrderType ? 'starting' : 'fixed'} price of each item
              </InputLabelStyle>
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
              {!state.isFirstSale && royalties * 1 > 0 && <>,&nbsp;Royalty fee {math.round(royalties / 1e4, 2)}%</>}
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
        {orderType === auctionOrderType && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Reserve Price
                {DiaDegree === 0 && (
                  <Stack direction="row" spacing={1} sx={{ display: 'inline-flex', pl: 2 }}>
                    <DIABadge degree={1} isRequire={Boolean(true)} />
                    <DIABadge degree={2} isRequire={Boolean(true)} />
                    <DIABadge degree={3} isRequire={Boolean(true)} />
                  </Stack>
                )}
              </Typography>
            </Grid>
            {DiaDegree === 0 ? (
              <Grid item xs={12} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
                  Only available for Bronze, Silver and Gold DIA (Diamond) token holders. More info{' '}
                  <Link underline="always" component={RouterLink} to={PATH_PAGE.features} color="origin.main">
                    here
                  </Link>
                </Typography>
                <Divider />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ width: '100%' }}>
                  <InputLabelStyle htmlFor="input-with-price">Enter a reserve price</InputLabelStyle>
                  <InputStyle
                    type="number"
                    id="input-reserve-price"
                    value={reservePrice}
                    onChange={handleChangeReservePrice}
                    startAdornment={' '}
                    endAdornment={<CoinTypeLabel type={coinTypes[coinType]} />}
                    inputProps={{
                      sx: { flexGrow: 1, width: 'auto' }
                    }}
                  />
                </FormControl>
                <Divider />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Buy Now Price
                {DiaDegree === 0 && (
                  <Stack direction="row" spacing={1} sx={{ display: 'inline-flex', pl: 2 }}>
                    <DIABadge degree={1} isRequire={Boolean(true)} />
                    <DIABadge degree={2} isRequire={Boolean(true)} />
                    <DIABadge degree={3} isRequire={Boolean(true)} />
                  </Stack>
                )}
              </Typography>
            </Grid>
            {DiaDegree === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
                  Only available for Bronze, Silver and Gold DIA (Diamond) token holders. More info{' '}
                  <Link underline="always" component={RouterLink} to={PATH_PAGE.features} color="origin.main">
                    here
                  </Link>
                </Typography>
                <Divider />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ width: '100%' }}>
                  <InputLabelStyle htmlFor="input-with-price">Enter a buy now price</InputLabelStyle>
                  <InputStyle
                    type="number"
                    id="input-buyout-price"
                    value={buyoutPrice}
                    onChange={handleChangeBuyoutPrice}
                    startAdornment={' '}
                    endAdornment={<CoinTypeLabel type={coinTypes[coinType]} />}
                    inputProps={{
                      sx: { flexGrow: 1, width: 'auto' }
                    }}
                  />
                </FormControl>
                <Divider />
              </Grid>
            )}
          </Grid>
        )}
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
