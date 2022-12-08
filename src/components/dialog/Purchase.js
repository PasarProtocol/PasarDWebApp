import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import * as math from 'mathjs';
import { useWeb3React } from '@web3-react/core';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Stack, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { ERC20_CONTRACT_ABI } from '../../abi/erc20ABI';
import { v1marketContract as V1_MARKET_CONTRACT_ADDRESS, auctionOrderType, blankAddress } from '../../config';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { walletconnect } from '../signin-dlg/connectors';
import TransLoadingButton from '../TransLoadingButton';
import StyledButton from '../signin-dlg/StyledButton';
import useSingin from '../../hooks/useSignin';
import {
  reduceHexAddress,
  getContractAddressInCurrentNetwork,
  getBalanceByAllCoinTypes,
  getTotalCountOfCoinTypes,
  sendIpfsDidJson,
  isInAppBrowser,
  getFilteredGasPrice
} from '../../utils/common';

Purchase.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  info: PropTypes.any,
  coinType: PropTypes.any
};

export default function Purchase(props) {
  const navigate = useNavigate();
  const [balanceArray, setBalanceArray] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const context = useWeb3React();
  const { pasarLinkAddress, pasarLinkChain } = useSingin();
  const { library, chainId, account } = context;
  const { isOpen, setOpen, info, coinType = {} } = props;
  const orderChain = info.order?.chain ? info.order.chain : info.chain;
  const v1State = orderChain === 'v1';
  const coinBalance = balanceArray[coinType.index];
  const coinName = coinType.name;
  let priceInfo = info.order?.price ? info.order.price : info.price;
  if (info.orderType === auctionOrderType && info.buyoutPrice) priceInfo = info.buyoutPrice;
  const handleClose = () => {
    setOpen(false);
  };

  const callEthBuyOrder = async (_orderId, _price) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
        const contractAddress = !v1State ? MarketContractAddress : V1_MARKET_CONTRACT_ADDRESS;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pasarContract = new ethers.Contract(contractAddress, PASAR_CONTRACT_ABI, signer);
        signer
          .getAddress()
          .then(async (userAddress) => {
            if (coinType.address !== blankAddress) {
              const erc20Contract = new ethers.Contract(coinType.address, ERC20_CONTRACT_ABI, signer);
              const erc20BidderApproved = BigInt(await erc20Contract.allowance(userAddress, MarketContractAddress));
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

                let contractMethod = pasarContract.buyOrder(
                  _orderId,
                  'did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK',
                  transactionParams
                );
                if (info.orderType === auctionOrderType)
                  contractMethod = pasarContract.bidForOrder(_orderId, _price, '', transactionParams);

                contractMethod
                  .then((nftTxn) => {
                    console.log('Buying... please wait');
                    nftTxn
                      .wait()
                      .then(() => {
                        enqueueSnackbar('Buy NFT Success!', { variant: 'success' });
                        setOpen(false);
                        setOnProgress(false);
                        setTimeout(() => {
                          navigate('/profile/myitem/1');
                        }, 2000);
                      })
                      .catch((error) => {
                        console.log(error);
                        enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
                        setOnProgress(false);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
                    setOnProgress(false);
                  });
              })
              .catch((error) => {
                console.log(error);
                enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
                setOnProgress(false);
              });
          })
          .catch((error) => {
            console.log(error);
            enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
            setOnProgress(false);
          });
      } else {
        console.log('Ethereum object does not exist');
        enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
        setOnProgress(false);
      }
    } catch (err) {
      setOnProgress(false);
      enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
      console.log(err);
    }
  };

  const callBuyOrder = async (_orderId, _didUri, _price) => {
    const walletConnectProvider = isInAppBrowser()
      ? window.elastos.getWeb3Provider()
      : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider);
    const accounts = await walletConnectWeb3.eth.getAccounts();

    const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
    const contractAbi = PASAR_CONTRACT_ABI;
    const contractAddress = !v1State ? MarketContractAddress : V1_MARKET_CONTRACT_ADDRESS;

    const pasarContract = new walletConnectWeb3.eth.Contract(contractAbi, contractAddress);
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
    let contractMethod = pasarContract.methods.buyOrder(_orderId, _didUri);
    if (info.orderType === auctionOrderType)
      contractMethod = pasarContract.methods.bidForOrder(_orderId, _price, _didUri);

    contractMethod
      .send(transactionParams)
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt);
        enqueueSnackbar('Buy NFT Success!', { variant: 'success' });
        setOpen(false);
        setOnProgress(false);
        setTimeout(() => {
          navigate('/profile/myitem/1');
        }, 3000);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation', confirmationNumber, receipt);
      })
      .on('error', (error) => {
        console.error('error', error);
        enqueueSnackbar('Buy NFT Error!', { variant: 'error' });
        setOnProgress(false);
      });
  };

  const buyNft = async () => {
    setOnProgress(true);
    const buyPrice = BigInt(priceInfo).toString();
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
      callEthBuyOrder(info.OrderId, buyPrice);
    } else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      const buyerDidUri = await sendIpfsDidJson();
      console.log('didUri:', buyerDidUri);
      callBuyOrder(info.order.orderId, buyerDidUri, buyPrice);
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

  const price = priceInfo / 1e18;
  const platformFee = math.round((price * 2) / 100, 4);
  const royalties = math.round((price * info.royaltyFee) / 10 ** 6, 4);
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
            {reduceHexAddress(info.tokenOwner)}
          </Typography>
          <br />
          for{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {math.round(priceInfo / 1e18, 3)} {coinName}
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
                {coinBalance} {coinName}
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
                {price - platformFee - royalties} {coinName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }} color="origin.main">
                You will pay
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right">
                {price} {coinName}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {price <= coinBalance ? (
          <>
            <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
              <TransLoadingButton loading={onProgress} onClick={buyNft}>
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
              <StyledButton variant="outlined" href="https://glidefinance.io/swap" target="_blank" fullWidth>
                Add funds
              </StyledButton>
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
