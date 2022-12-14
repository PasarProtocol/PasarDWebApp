import React from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { addDays } from 'date-fns';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Stack,
  Divider,
  FormControl,
  Tooltip,
  FormControlLabel,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import TransLoadingButton from '../TransLoadingButton';
import StartingDateSelect from '../marketplace/StartingDateSelect';
import ExpirationDateSelect from '../marketplace/ExpirationDateSelect';
import CoinSelect from '../marketplace/CoinSelect';
import { InputStyle, InputLabelStyle } from '../CustomInput';
import CustomSwitch from '../custom-switch';
import CoinTypeLabel from '../CoinTypeLabel';
import DIABadge from '../badge/DIABadge';
import { STICKER_CONTRACT_ABI } from '../../abi/stickerABI';
import {
  callContractMethod,
  sendIpfsDidJson,
  isInAppBrowser,
  removeLeadingZero,
  getDateTimeString,
  isValidLimitPrice,
  getDiaBalanceDegree,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork,
  getCoinTypesInCurrentNetwork
} from '../../utils/common';
import useSignin from '../../hooks/useSignin';
import { PATH_PAGE } from '../../routes/paths';

Auction.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  tokenId: PropTypes.string,
  baseToken: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

export default function Auction(props) {
  const { isOpen, setOpen, name, tokenId, baseToken, updateCount, handleUpdate } = props;
  const [onProgress, setOnProgress] = React.useState(false);
  const [startingPrice, setStartingPrice] = React.useState('');
  const [buyoutPrice, setBuyoutPrice] = React.useState('');
  const [reservePrice, setReservePrice] = React.useState('');
  const [startingDate, setStartingDate] = React.useState(0);
  const [isBuynowForAuction, setBuynowForAuction] = React.useState(false);
  const [isReserveForAuction, setReserveForAuction] = React.useState(false);
  const [expirationDate, setExpirationDate] = React.useState(addDays(new Date(), 1));
  const [dateCount, setDateCount] = React.useState(0);
  const [coinType, setCoinType] = React.useState(0);

  const { enqueueSnackbar } = useSnackbar();
  const { pasarLinkChain, diaBalance } = useSignin();
  const coinTypes = getCoinTypesInCurrentNetwork(pasarLinkChain);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      if (isOpen) setExpirationDate(addDays(new Date(), 1));
    };
    fetchData();
  }, [isOpen]);

  const handleExpirationDate = (date) => {
    setExpirationDate(date);
    setDateCount(dateCount + 1);
  };

  const handleClose = () => {
    setOpen(false);
    setStartingPrice('');
    setReservePrice('');
    setBuyoutPrice('');
    setBuynowForAuction(false);
    setReserveForAuction(false);
    setOnProgress(false);
  };

  const handleChangePrice = (event, type) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    if (!isValidLimitPrice(priceValue)) return;
    if (type === 'starting') setStartingPrice(priceValue);
    else if (type === 'reserve') setReservePrice(priceValue);
    else if (type === 'buyout') setBuyoutPrice(priceValue);
  };

  const handleBuynowForAuction = (event) => {
    if (!event.target.checked) setBuyoutPrice('');
    setBuynowForAuction(event.target.checked);
  };

  const handleReserveForAuction = (event) => {
    if (!event.target.checked) setReservePrice('');
    setReserveForAuction(event.target.checked);
  };

  const callSetApprovalForAllAndAuction = (_operator, _startingPrice, _reservePrice, _buyoutPrice, _didUri) =>
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
                    callContractMethod('createOrderForAuction', coinType, pasarLinkChain, {
                      _id: tokenId,
                      _amount: 1,
                      _baseAddress: baseToken,
                      _minPrice: _startingPrice,
                      _reservePrice,
                      _buyoutPrice,
                      _endTime: (expirationDate.getTime() / 1000).toFixed(),
                      _didUri
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
                callContractMethod('createOrderForAuction', coinType, pasarLinkChain, {
                  _id: tokenId,
                  _amount: 1,
                  _baseAddress: baseToken,
                  _minPrice: _startingPrice,
                  _reservePrice,
                  _buyoutPrice,
                  _endTime: (expirationDate.getTime() / 1000).toFixed(),
                  _didUri
                })
                  .then((success) => {
                    resolve(success);
                  })
                  .catch((error) => {
                    reject(error);
                  });
            });
        });
      });
    });

  const auctionNft = async () => {
    if (!(startingPrice * 1)) enqueueSnackbar('Starting price is required.', { variant: 'warning' });
    else if (isReserveForAuction && !reservePrice.length)
      enqueueSnackbar('Reserve price is required.', { variant: 'warning' });
    else if (isBuynowForAuction && !buyoutPrice.length)
      enqueueSnackbar('Buy Now price is required.', { variant: 'warning' });
    else if (reservePrice.length && startingPrice * 1 > reservePrice * 1)
      enqueueSnackbar('Starting price must be less than Reserve price.', { variant: 'warning' });
    else if (buyoutPrice.length && startingPrice * 1 >= buyoutPrice * 1)
      enqueueSnackbar('Starting price must be less than Buy Now price.', { variant: 'warning' });
    else if (reservePrice.length && buyoutPrice.length && reservePrice * 1 >= buyoutPrice * 1)
      enqueueSnackbar('Reserve price must be less than Buy Now price.', { variant: 'warning' });
    else {
      setOnProgress(true);
      const didUri = await sendIpfsDidJson();
      const _startingPrice = BigInt(startingPrice * 1e18).toString();
      const _reservePrice = BigInt(reservePrice * 1e18).toString();
      const _buyoutPrice = BigInt(buyoutPrice * 1e18).toString();
      const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
      callSetApprovalForAllAndAuction(MarketContractAddress, _startingPrice, _reservePrice, _buyoutPrice, didUri)
        .then((result) => {
          if (result) {
            setTimeout(() => {
              handleUpdate(updateCount + 1);
            }, 3000);
            enqueueSnackbar('Auction success!', { variant: 'success' });
            setOpen(false);
            setTimeout(() => {navigate('/profile/myitem/0'); window.location.reload()}, 2000);
          } else {
            enqueueSnackbar('Auction error!', { variant: 'error' });
            setOnProgress(false);
          }
        })
        .catch((e) => {
          enqueueSnackbar('Auction error!', { variant: 'error' });
          setOnProgress(false);
          console.log(e);
        });
    }
  };
  const DiaDegree = getDiaBalanceDegree(diaBalance, pasarLinkChain);

  const TypographyStyle = { display: 'inline', lineHeight: 1.1 };
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
        <Typography
          variant="h6"
          component="div"
          sx={{ color: 'text.secondary', lineHeight: 1.1, fontWeight: 'normal' }}
        >
          Item:{' '}
          <Typography variant="h6" sx={{ ...TypographyStyle, color: 'text.primary' }}>
            {name}
          </Typography>
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', mt: 1 }}>
          Starting Price
        </Typography>
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <InputLabelStyle htmlFor="input-with-price">Enter starting price</InputLabelStyle>
          <InputStyle
            type="number"
            id="input-with-price"
            value={startingPrice}
            onChange={(e) => {
              handleChangePrice(e, 'starting');
            }}
            startAdornment={' '}
            endAdornment={<CoinSelect selected={coinType} onChange={setCoinType} />}
            inputProps={{
              sx: { flexGrow: 1, width: 'auto' }
            }}
          />
        </FormControl>
        <Divider />
        <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
          Bids below this amount won't be allowed
          <br />
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
        <Typography variant="h5" sx={{ fontWeight: 'normal', mt: 1 }}>
          Starting Date
        </Typography>
        <StartingDateSelect selected={startingDate} onChange={setStartingDate} />
        <Divider />
        <Typography variant="h5" sx={{ fontWeight: 'normal', mt: 1 }}>
          Expiration Date
        </Typography>
        <ExpirationDateSelect onChangeDate={handleExpirationDate} />
        <Divider />
        <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
          Auction ends on {getDateTimeString(expirationDate)}
        </Typography>

        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
            Include Reserve Price
            {DiaDegree === 0 && (
              <Stack direction="row" spacing={1} sx={{ display: 'inline-flex', pl: 2 }}>
                <DIABadge degree={1} isRequire={Boolean(true)} />
                <DIABadge degree={2} isRequire={Boolean(true)} />
                <DIABadge degree={3} isRequire={Boolean(true)} />
              </Stack>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row">
            <InputLabelStyle sx={{ fontSize: 12, flex: 1 }}>
              Set a minimum price before auction can complete
            </InputLabelStyle>
            <FormControlLabel
              control={<CustomSwitch onChange={handleReserveForAuction} disabled={DiaDegree === 0} />}
              sx={{ mt: -2, mr: 0 }}
              label=""
            />
          </Stack>
          {DiaDegree === 0 && (
            <>
              <Divider />
              <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
                Only available for Bronze, Silver and Gold DIA (Diamond) token holders. More info{' '}
                <Link underline="always" component={RouterLink} to={PATH_PAGE.features} color="origin.main">
                  here
                </Link>
              </Typography>
            </>
          )}
        </Grid>
        {isReserveForAuction && (
          <>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Reserve Price
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabelStyle htmlFor="input-reserve-price">Enter reserve price</InputLabelStyle>
                <InputStyle
                  type="number"
                  id="input-reserve-price"
                  value={reservePrice}
                  onChange={(e) => {
                    handleChangePrice(e, 'reserve');
                  }}
                  startAdornment={' '}
                  endAdornment={<CoinTypeLabel type={coinTypes[coinType]} />}
                  inputProps={{
                    sx: { flexGrow: 1, width: 'auto' }
                  }}
                />
              </FormControl>
              <Divider />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
            Include Buy Now Price
            {DiaDegree === 0 && (
              <Stack direction="row" spacing={1} sx={{ display: 'inline-flex', pl: 2 }}>
                <DIABadge degree={1} isRequire={Boolean(true)} />
                <DIABadge degree={2} isRequire={Boolean(true)} />
                <DIABadge degree={3} isRequire={Boolean(true)} />
              </Stack>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row">
            <InputLabelStyle sx={{ fontSize: 12, flex: 1, pr: 1 }}>
              Set instant purchase price (auction ends immediately after a sale)
            </InputLabelStyle>
            <FormControlLabel
              control={<CustomSwitch onChange={handleBuynowForAuction} disabled={DiaDegree === 0} />}
              sx={{ mt: -2, mr: 0 }}
              label=""
            />
          </Stack>
          {DiaDegree === 0 && (
            <>
              <Divider />
              <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
                Only available for Bronze, Silver and Gold DIA (Diamond) token holders. More info{' '}
                <Link underline="always" component={RouterLink} to={PATH_PAGE.features} color="origin.main">
                  here
                </Link>
              </Typography>
            </>
          )}
        </Grid>
        {isBuynowForAuction && (
          <>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Buy Now Price
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabelStyle htmlFor="input-buynow-price">Enter buy now price</InputLabelStyle>
                <InputStyle
                  type="number"
                  id="input-buynow-price"
                  value={buyoutPrice}
                  onChange={(e) => {
                    handleChangePrice(e, 'buyout');
                  }}
                  startAdornment={' '}
                  endAdornment={<CoinTypeLabel type={coinTypes[coinType]} />}
                  inputProps={{
                    sx: { flexGrow: 1, width: 'auto' }
                  }}
                />
              </FormControl>
              <Divider />
            </Grid>
          </>
        )}
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={auctionNft}>
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
