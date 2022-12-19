import React from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import * as math from 'mathjs';
import { useWeb3React } from '@web3-react/core';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Grid, Stack, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import {useNavigate} from "react-router-dom";
import { PASAR_CONTRACT_ABI } from '../../abi/pasarABI';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { walletconnect } from '../signin-dlg/connectors';
import TransLoadingButton from '../TransLoadingButton';
import useSingin from '../../hooks/useSignin';
import useAuctionDlg from '../../hooks/useAuctionDlg';
import {
  reduceHexAddress,
  getBalance,
  callContractMethod,
  isInAppBrowser,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork
} from '../../utils/common';

SettleOrder.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  name: PropTypes.string,
  info: PropTypes.any,
  address: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

export default function SettleOrder(props) {
  const [balance, setBalance] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [onProgress, setOnProgress] = React.useState(false);
  const context = useWeb3React();
  const { pasarLinkAddress, pasarLinkChain } = useSingin();
  const { updateCount, setUpdateCount } = useAuctionDlg();
  const { library, chainId, account } = context;

  const { isOpen, setOpen, info, address, updateCount: updateCountProfile, handleUpdate } = props;
  const navigate = useNavigate()

  const seller = info.sellerAddr;
  const { lastBid, lastBidder } = info;

  const handleClose = () => {
    setOpen(false);
  };

  const callEthSettleOrder = (_orderId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const MarketContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'market');
        const pasarContract = new ethers.Contract(MarketContractAddress, PASAR_CONTRACT_ABI, signer);
        signer
          .getAddress()
          .then((userAddress) => {
            provider
              .getGasPrice()
              .then((_gasPrice) => {
                const gasPrice = getFilteredGasPrice(_gasPrice);
                const transactionParams = {
                  from: userAddress,
                  gasPrice: gasPrice.toBigInt(),
                  value: 0
                };
                pasarContract
                  .settleAuctionOrder(_orderId, transactionParams)
                  .then((nftTxn) => {
                    console.log('Settling order... please wait');
                    nftTxn
                      .wait()
                      .then(() => {
                        enqueueSnackbar('Settle auction order success!', { variant: 'success' });
                        setOpen(false);
                        setOnProgress(false);

                        setTimeout(() => {navigate('/profile/myitem/0');window.location.reload()}, 2000);
                        setTimeout(() => {
                          setUpdateCount(updateCount + 1);
                        }, 1000);

                        if (handleUpdate)
                          setTimeout(() => {
                            handleUpdate(updateCountProfile + 1);
                          }, 3000);
                      })
                      .catch((error) => {
                        console.log(error);
                        enqueueSnackbar('Settle auction order error!', { variant: 'error' });
                        setOnProgress(false);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    enqueueSnackbar('Settle auction order error!', { variant: 'error' });
                    setOnProgress(false);
                  });
              })
              .catch((error) => {
                console.log(error);
                enqueueSnackbar('Settle auction order error!', { variant: 'error' });
                setOnProgress(false);
              });
          })
          .catch((error) => {
            console.log(error);
            enqueueSnackbar('Settle auction order error!', { variant: 'error' });
            setOnProgress(false);
          });
      } else {
        console.log('Ethereum object does not exist');
        enqueueSnackbar('Settle auction order error!', { variant: 'error' });
        setOnProgress(false);
      }
    } catch (err) {
      setOnProgress(false);
      enqueueSnackbar('Settle auction order error!', { variant: 'error' });
      console.log(err);
    }
  };

  const callSettleOrder = (_orderId) => {
    callContractMethod('settleAuctionOrder', 0, pasarLinkChain, {
      _orderId
    })
      .then((success) => {
        console.log(success);
        enqueueSnackbar('Settle auction order success!', { variant: 'success' });
        setOnProgress(false);
        setOpen(false);
        setTimeout(() => {navigate('/profile/myitem/0'); window.location.reload()}, 2000);
        setTimeout(() => {
          setUpdateCount(updateCount + 1);
        }, 1000);

        if (handleUpdate)
          setTimeout(() => {
            handleUpdate(updateCountProfile + 1);
          }, 3000);
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar('Settle auction order error!', { variant: 'error' });
        setOnProgress(false);
      });
  };

  const settleOrder = async () => {
    setOnProgress(true);
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3')
      callEthSettleOrder(info.orderId || info.OrderId);
    else if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') callSettleOrder(info.orderId || info.OrderId);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
      if (sessionLinkFlag) {
        if (sessionLinkFlag === '1' && library)
          getBalance(library.provider).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          });
        else if (sessionLinkFlag === '2') {
          if (isInAppBrowser()) {
            const elastosWeb3Provider = await window.elastos.getWeb3Provider();
            getBalance(elastosWeb3Provider).then((res) => {
              setBalance(math.round(res / 1e18, 4));
            });
          } else if (essentialsConnector.getWalletConnectProvider()) {
            getBalance(essentialsConnector.getWalletConnectProvider()).then((res) => {
              setBalance(math.round(res / 1e18, 4));
            });
          }
        } else if (sessionLinkFlag === '3')
          getBalance(walletconnect.getProvider()).then((res) => {
            setBalance(math.round(res / 1e18, 4));
          });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, pasarLinkAddress]);

  const price = lastBid;
  const platformFee = (price * 2) / 100;
  const royalties = info.SaleType === 'Primary Sale' ? 0 : (price * info.royaltyFee) / 10 ** 6;
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
          {address === seller ? 'Accept Bid' : 'Claim Item'}
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'text.secondary' }}>
          {address === seller && (
            <>
              You are about to accept{' '}
              <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
                {`${math.round(lastBid / 1e18, 3)} ELA`}
              </Typography>
              <br />
            </>
          )}
          {address === seller ? 'in exchange for ' : 'You are about to claim '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {info.name}
          </Typography>
          <br />
          from{' '}
          <Typography variant="h5" sx={{ display: 'inline', color: 'text.primary' }}>
            {reduceHexAddress(address === seller ? lastBidder : seller)}
          </Typography>
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          {address === seller ? 'Top Bid' : 'Your Winning Bid'}
          <br />
          {math.round(lastBid / 1e18, 3)} ELA
        </Typography>
        <Grid container sx={{ mt: 2, display: 'block' }}>
          <Grid item xs={12}>
            {address === lastBidder && (
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
            )}
            <Divider sx={{ mb: 0.5 }} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Platform fee 2%
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {platformFee/10**18} ELA
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                Creator will get (royalties)
              </Typography>
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {royalties/10**18} ELA
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row">
              {address === seller ? (
                <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }} color="origin.main">
                  You will get
                </Typography>
              ) : (
                <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }}>
                  Seller will get
                </Typography>
              )}
              <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary' }}>
                {(price - platformFee - royalties)/10**18} ELA
              </Typography>
            </Stack>
          </Grid>
          {address === lastBidder && (
            <Grid item xs={12}>
              <Stack direction="row">
                <Typography variant="body2" display="block" gutterBottom sx={{ flex: 1 }} color="origin.main">
                  You will pay
                </Typography>
                <Typography variant="body2" display="block" gutterBottom align="right">
                  {price/10**18} ELA
                </Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
        <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
          <TransLoadingButton loading={onProgress} onClick={settleOrder}>
            {address === seller ? 'Accept' : 'Claim'}
          </TransLoadingButton>
        </Box>
        <Typography variant="body2" display="block" color="red" gutterBottom align="center">
          Please check all item details before {address === seller ? 'accepting the bid' : 'claming the item'}
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
