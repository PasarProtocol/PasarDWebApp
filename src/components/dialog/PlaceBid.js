import React from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { ethers } from 'ethers';
import * as math from 'mathjs';
import { useWeb3React } from '@web3-react/core';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Box,
  Grid,
  Stack,
  Divider,
  FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import {useNavigate} from "react-router-dom";
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { ERC20_CONTRACT_ABI } from '../../abi/erc20ABI';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { walletconnect } from '../signin-dlg/connectors';
import TransLoadingButton from '../TransLoadingButton';
import CoinTypeLabel from '../CoinTypeLabel';
import { InputStyle, InputLabelStyle } from '../CustomInput';
import useSingin from '../../hooks/useSignin';
import useAuctionDlg from '../../hooks/useAuctionDlg';
import {
  reduceHexAddress,
  getBalanceByAllCoinTypes,
  sendIpfsDidJson,
  isInAppBrowser,
  getTotalCountOfCoinTypes,
  removeLeadingZero,
  isValidLimitPrice,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork
} from '../../utils/common';
import { blankAddress } from '../../config';

PlaceBid.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  info: PropTypes.any,
  coinType: PropTypes.any
};

export default function PlaceBid(props) {
  const [balanceArray, setBalanceArray] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const [bidPrice, setBidPrice] = React.useState('');
  const [isBuynow, setBuynow] = React.useState(false);

  const context = useWeb3React();
  const { pasarLinkAddress, pasarLinkChain } = useSingin();
  const { updateCount, setUpdateCount } = useAuctionDlg();

  const { library, chainId, account } = context;
  const { isOpen, setOpen, info, coinType = {} } = props;
  const coinBalance = balanceArray[coinType.index];
  const coinName = coinType.name;
  const targetPrice = isBuynow ? math.round(info.order.buyoutPrice / 1e18, 3) : bidPrice;
  const actionText = isBuynow ? 'Buy NFT' : 'Bid NFT';
  const navigate = useNavigate()

  const handleClose = () => {
    setOpen(false);
    setBuynow(false);
    setBidPrice('');
  };

  const handleChangeBidPrice = (event) => {
    let priceValue = event.target.value;
    if (priceValue < 0) return;
    priceValue = removeLeadingZero(priceValue);
    if (!isValidLimitPrice(priceValue)) return;
    if (!!(info.order.buyoutPrice * 1) && priceValue >= info.order.buyoutPrice / 1e18) setBuynow(true);
    else setBuynow(false);
    setBidPrice(priceValue);
  };

  const callEthBidOrder = async (_orderId, _price) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pasarContract = new ethers.Contract(MarketContractAddress, PASAR_CONTRACT_ABI, signer);
        signer
          .getAddress()
          .then(async (userAddress) => {
            if (coinType.address !== blankAddress) {
              const erc20Contract = new ethers.Contract(coinType.address, ERC20_CONTRACT_ABI, signer);
              const erc20BidderApproved = BigInt(await erc20Contract.allowance(userAddress, MarketContractAddress));
              console.log(erc20BidderApproved);
              const _gasPrice = await provider.getGasPrice();
              const gasPrice = getFilteredGasPrice(_gasPrice);
              if (erc20BidderApproved < _price * 1) {
                console.log('Pasar marketplace not enough ERC20 allowance from bidder');
                const txParams = {
                  from: userAddress,
                  gasPrice,
                  value: 0
                };
                const approveTxn = await erc20Contract.approve(MarketContractAddress, _price, txParams);
                const erc20BidderApproveStatus = await approveTxn.wait();
                if (!erc20BidderApproveStatus) {
                  enqueueSnackbar(`Approve Transaction Error!`, { variant: 'error' });
                  setOnProgress(false);
                }
              }
            }

            provider
              .getGasPrice()
              .then((_gasPrice) => {
                const gasPrice = getFilteredGasPrice(_gasPrice);
                const transactionParams = {
                  from: userAddress,
                  gasPrice: gasPrice.toBigInt(),
                  gasLimit: 5000000,
                  value: coinType.address === blankAddress ? _price : 0
                };

                const contractMethod = pasarContract.bidForOrder(_orderId, _price, '', transactionParams);
                contractMethod
                  .then((nftTxn) => {
                    console.log('Biding... please wait');
                    nftTxn
                      .wait()
                      .then(() => {
                        enqueueSnackbar(`${actionText} Success!`, { variant: 'success' });
                        setOpen(false);
                        setOnProgress(false);
                        setTimeout(() => {
                          setUpdateCount(updateCount + 1);
                        }, 1000);
                        setTimeout(() => {navigate('/profile/myitem/2');}, 2000)
                      })
                      .catch((error) => {
                        console.log(error);
                        enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
                        setOnProgress(false);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
                    setOnProgress(false);
                  });
              })
              .catch((error) => {
                console.log(error);
                enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
                setOnProgress(false);
              });
          })
          .catch((error) => {
            console.log(error);
            enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
            setOnProgress(false);
          });
      } else {
        console.log('Ethereum object does not exist');
        enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
        setOnProgress(false);
      }
    } catch (err) {
      setOnProgress(false);
      enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
      console.log(err);
    }
  };

  const callBidOrder = async (_orderId, _didUri, _price) => {
    const walletConnectProvider = isInAppBrowser()
      ? window.elastos.getWeb3Provider()
      : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    const accounts = await walletConnectWeb3.eth.getAccounts();

    const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
    const pasarContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, MarketContractAddress);
    if (coinType.address !== blankAddress) {
      const erc20Contract = new walletConnectWeb3.eth.Contract(ERC20_CONTRACT_ABI, coinType.address);
      const erc20BidderApproved = BigInt(
        await erc20Contract.methods.allowance(accounts[0], MarketContractAddress).call()
      );
      const _gasPrice = await walletConnectWeb3.eth.getGasPrice();
      const gasPrice = getFilteredGasPrice(_gasPrice);
      if (erc20BidderApproved < _price * 1) {
        console.log('Pasar marketplace not enough ERC20 allowance from bidder');
        const txParams = {
          from: accounts[0],
          gasPrice,
          value: 0
        };
        const erc20BidderApproveStatus = await erc20Contract.methods
          .approve(MarketContractAddress, _price)
          .send(txParams);
        if (!erc20BidderApproveStatus) {
          enqueueSnackbar(`Approve Transaction Error!`, { variant: 'error' });
          setOnProgress(false);
        }
      }
    }
    const _gasPrice = await walletConnectWeb3.eth.getGasPrice();
    const gasPrice = getFilteredGasPrice(_gasPrice);

    console.log('Sending transaction with account address:', accounts[0]);
    const transactionParams = {
      from: accounts[0],
      gasPrice,
      value: coinType.address === blankAddress ? _price : 0
    };
    const contractMethod = pasarContract.methods.bidForOrder(_orderId, _price, _didUri);
    contractMethod
      .send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        enqueueSnackbar(`${actionText} Success!`, { variant: 'success' });
        setOpen(false);
        setOnProgress(false);
        setTimeout(() => {
          setUpdateCount(updateCount + 1);
        }, 1000);
      })
      .on('error', (error) => {
        console.error('error', error);
        enqueueSnackbar(`${actionText} Error!`, { variant: 'error' });
        setOnProgress(false);
      });

    // callContractMethod('buyOrder', {'_orderId': _orderId, '_didUri': _didUri})
  };

  const bidNft = async () => {
    if (!bidPrice) {
      enqueueSnackbar('Bid amount is required', { variant: 'warning' });
    } else if (bidPrice <= info.order?.lastBid / 1e18 && info.order?.lastBid) {
      enqueueSnackbar('Your Bid amount must be higher than Current Bid', { variant: 'warning' });
    } else if (bidPrice < info.order?.price / 1e18) {
      enqueueSnackbar('Your Bid amount cannot be lower than Starting Price', { variant: 'warning' });
    } else {
      setOnProgress(true);
      const bidPriceStr = BigInt(targetPrice * 1e18).toString();
      if (
        sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' ||
        sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'
      ) {
        callEthBidOrder(info.order?.orderId, bidPriceStr);
      } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        const biderDidUri = await sendIpfsDidJson();
        console.log('didUri:', biderDidUri);
        callBidOrder(info.order?.orderId, biderDidUri, bidPriceStr);
      }
    }
  };

  const setBalanceByCoinType = (coindex, balance) => {
    setBalanceArray((prevState) => {
      const tempBalance = [...prevState];
      tempBalance[coindex] = balance;
      return tempBalance;
    });
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
      setBalanceArray(Array(getTotalCountOfCoinTypes()).fill(0));
      if (sessionLinkFlag) {
        if (sessionLinkFlag === '1' && library)
          getBalanceByAllCoinTypes(library.provider, pasarLinkChain, setBalanceByCoinType);
        else if (sessionLinkFlag === '2') {
          if (isInAppBrowser()) {
            const elastosWeb3Provider = await window.elastos.getWeb3Provider();
            getBalanceByAllCoinTypes(elastosWeb3Provider, pasarLinkChain, setBalanceByCoinType);
          } else if (essentialsConnector.getWalletConnectProvider()) {
            getBalanceByAllCoinTypes(
              essentialsConnector.getWalletConnectProvider(),
              pasarLinkChain,
              setBalanceByCoinType
            );
          }
        } else if (sessionLinkFlag === '3')
          getBalanceByAllCoinTypes(walletconnect.getProvider(), pasarLinkChain, setBalanceByCoinType);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, pasarLinkAddress, pasarLinkChain]);

  const price = Math.max(info.order?.price / 10**18, targetPrice);
  const platformFee = math.round((price * 2) / 100, 4);
  const royalties = info.isFirstSale === 'Primary Sale' ? 0 : math.round((price * info.royaltyFee) / 10 ** 6, 4);
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
          {isBuynow ? 'Checkout' : 'Place Bid'}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: 'text.secondary', lineHeight: 1.1, fontWeight: 'normal', pb: 1 }}
        >
          You are about to {isBuynow ? 'purchase' : 'bid'}{' '}
          <Typography variant="h6" sx={{ ...TypographyStyle, color: 'text.primary' }}>
            {info.name}
          </Typography>
          <br />
          from{' '}
          <Typography variant="h6" sx={{ ...TypographyStyle, color: 'text.primary' }}>
            {reduceHexAddress(info.tokenOwner)}
          </Typography>
          {isBuynow && (
            <>
              <br />
              for{' '}
              <Typography variant="h6" sx={{ ...TypographyStyle, color: 'text.primary' }}>
                {math.round(info.buyoutPrice / 1e18, 3)} {coinName}
              </Typography>
            </>
          )}
        </Typography>
        <Typography variant="h6" sx={{ ...TypographyStyle, color: 'origin.main', fontWeight: 'normal' }}>
          {info.order?.lastBid ? 'Current Bid:' : 'Starting Price:'}
        </Typography>{' '}
        <Typography variant="h6" sx={{ ...TypographyStyle, color: 'text.primary' }}>
          {math.round((info.order?.lastBid || info.order?.price) / 1e18, 3)} {coinName}
        </Typography>
        <Grid container sx={{ pt: 2, pb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 'normal' }}>
              Your Bid
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <InputLabelStyle htmlFor="input-with-price">Enter bid amount</InputLabelStyle>
              <InputStyle
                type="number"
                id="input-with-price"
                value={bidPrice}
                onChange={handleChangeBidPrice}
                startAdornment={' '}
                endAdornment={<CoinTypeLabel type={coinType} />}
                inputProps={{
                  sx: { flexGrow: 1, width: 'auto' }
                }}
              />
            </FormControl>
            <Divider />
            {isBuynow && (
              <Typography variant="body2" display="block" color="red" gutterBottom>
                Your bid is equal or higher than the Buy Now price - {math.round(info.order.buyoutPrice / 1e18, 3)} {coinName}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container sx={{ display: 'block' }}>
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
                {coinBalance} {coinName}
              </Typography>
            </Stack>
            <Divider sx={{ mb: 0.5 }} />
          </Grid>
          {!isBuynow && (
            <Grid item xs={12}>
              <Typography variant="body2" display="block" sx={{ color: 'origin.main' }}>
                In the case of a successful bid
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Platform fee 2%
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {platformFee} {coinName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Creator will get (royalties)
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {royalties} {coinName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Seller will get
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {(price * 10**18 - platformFee * 10**18 - royalties* 10**18)/10**18} {coinName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1, color: 'origin.main' }}>
                You will pay
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right">
                {price} {coinName}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {Math.max(targetPrice, info.order?.price / 1e18) <= coinBalance ? (
          <>
            <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
              <TransLoadingButton loading={onProgress} onClick={bidNft}>
                {isBuynow ? `Buy Now for ${math.round(info.order.buyoutPrice / 1e18, 3)} ${coinName}` : 'Bid'}
              </TransLoadingButton>
            </Box>
            <Typography variant="body2" display="block" color="red" gutterBottom align="center">
              Please check all item details before making a {isBuynow ? 'purchase' : 'bid'}
            </Typography>
          </>
        ) : (
          <>
            <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
              <Button variant="outlined" href="https://glidefinance.io/swap" target="_blank" fullWidth>
                Add funds
              </Button>
            </Box>
            <Typography variant="body2" display="block" color="red" gutterBottom align="center">
              Insufficient funds in {coinName}
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
