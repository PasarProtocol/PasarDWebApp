import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { round } from 'mathjs';
// material
import { Box, Stack, Typography, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';
import { MHidden } from '../../components/@material-extend';
import StyledButton from '../../components/signin-dlg/StyledButton';
import DisclaimerDlg from '../../components/dialog/Disclaimer';
import PurchaseDlg from '../../components/dialog/Purchase';
import PlaceBidDlg from '../../components/dialog/PlaceBid';
import SettleOrderDlg from '../../components/dialog/SettleOrder';
import CancelDlg from '../../components/dialog/CancelSale';
import Countdown from '../../components/Countdown';
import useSingin from '../../hooks/useSignin';
import {
  getTime,
  getTotalCountOfCoinTypes,
  
  getCoinTypeFromToken,
  setAllTokenPrice2
} from '../../utils/common';
import { auctionOrderType } from '../../config';
// ----------------------------------------------------------------------

const StickyPaperStyle = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  boxShadow: `${theme.palette.mode === 'dark' ? 'rgb(6 12 20)' : 'rgb(230 230 230)'} 0px -5px 12px`,
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '16px 16px 0 0'
}));

CollectibleHandleSection.propTypes = {
  collectible: PropTypes.any,
  address: PropTypes.string,
  onlyHandle: PropTypes.bool
};

export default function CollectibleHandleSection(props) {
  const navigate = useNavigate();
  const { collectible = {}, address, onlyHandle = false } = props;
  const { order = {}, bidList = [], tokenOwner, listed = false } = collectible;
  const { endTime = 0, orderType = 0, price = 0, lastBid = 0, buyoutPrice = 0, reservePrice = 0 } = order;
  const [clickedType, setClickedType] = React.useState('');
  const [didSignin, setSignin] = React.useState(false);
  const [auctionEnded, setAuctionEnded] = React.useState(false);
  const [disclaimerOpen, setOpenDisclaimer] = React.useState(false);
  const [isOpenPurchase, setPurchaseOpen] = React.useState(false);
  const [isOpenPlaceBid, setPlaceBidOpen] = React.useState(false);
  const [isOpenSettleOrder, setSettleOrderOpen] = React.useState(false);
  const [isOpenCancel, setCancelOpen] = React.useState(false);
  const [continuePurchase, setContinuePurchase] = React.useState(false);
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const { pasarLinkAddress } = useSingin();

  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const curPrice = [...prevState];
      curPrice[type] = value;
      return curPrice;
    });
  };

  React.useEffect(() => {
    setAllTokenPrice2(setCoinPriceByType);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
      setSignin(!!sessionLinkFlag);
      if (clickedType && !!sessionLinkFlag) {
        setClickedType('');
        if (clickedType === 'buy') setTimeout(handlePurchase, 300);
        else if (clickedType === 'bid')
          setTimeout(() => {
            setPlaceBidOpen(true);
          }, 300);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasarLinkAddress]);

  React.useEffect(() => {
    checkHasEnded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectible]);

  React.useEffect(() => {
    if (continuePurchase && !disclaimerOpen) {
      setPurchaseOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclaimerOpen]);

  const handlePurchase = () => {
    if (localStorage.getItem('pa-yes') === '1') {
      setPurchaseOpen(true);
      return;
    }
    setOpenDisclaimer(true);
    setContinuePurchase(true);
  };

  const openSignin = (e) => {
    const actionType = e.target.getAttribute('actiontype');
    if (document.getElementById('signin')) {
      setClickedType(actionType);
      document.getElementById('signin').click();
    }
  };

  const checkHasEnded = () => {
    const endTimeInMS = endTime * 1000;
    if (!endTimeInMS || endTimeInMS <= Date.now()) setAuctionEnded(true);
    else {
      setAuctionEnded(false);
      setTimeout(() => checkHasEnded(), 1000);
    }
  };
  const coinType = getCoinTypeFromToken(collectible);
  const coinName = coinType.name;
  const coinUSD = coinPrice[coinType.index];
  let statusText = 'On sale for a fixed price of';
  let priceText = `${round(price / 1e18, 3)} ${coinName}`;
  let usdPriceText = `≈ USD ${round((coinUSD * price) / 1e18, 3)}`;
  let handleField = null;
  let deadline = '';
  let auctionTextField = null;

  if (orderType === auctionOrderType && listed) {
    const objDeadLine = getTime(endTime);
    deadline = `${auctionEnded ? 'Ended' : 'Ends'} ${objDeadLine.date} ${objDeadLine.time}`;
    if (!auctionEnded) {
      // not end yet
      if (!lastBid) statusText = 'Starting Price';
      else {
        statusText = 'Current Bid';
        priceText = `${round(lastBid / 1e18, 3)} ${coinName}`;
        usdPriceText = `≈ USD ${round((coinUSD * lastBid) / 1e18, 3)}`;
      }

      if (address !== tokenOwner)
        handleField = didSignin ? (
          <Stack direction="row" spacing={1}>
            <StyledButton variant="contained" fullWidth onClick={() => setPlaceBidOpen(true)}>
              Place bid
            </StyledButton>
            {!!(buyoutPrice * 1) && (
              <StyledButton variant="outlined" fullWidth onClick={handlePurchase}>
                Buy now for {round(buyoutPrice / 1e18, 3)} {coinName}
              </StyledButton>
            )}
          </Stack>
        ) : (
          <StyledButton variant="contained" actiontype="bid" fullWidth onClick={openSignin}>
            Sign in to Place bid
          </StyledButton>
        );
      else if (address === tokenOwner && !lastBid && listed)
        handleField = (
          <StyledButton variant="contained" fullWidth onClick={() => setCancelOpen(true)}>
            Cancel sale
          </StyledButton>
        );
      else if (buyoutPrice * 1)
        auctionTextField = (
          <Typography variant="h4" component="div" align="center" sx={{ pt: 2 }}>
            Your Buy Now Price:{' '}
            <Typography variant="h4" color="origin.main" sx={{ display: 'inline' }}>
              {round(buyoutPrice / 1e18, 3)} {coinName}
            </Typography>
          </Typography>
        );
    } else if (!lastBid || lastBid < reservePrice) {
      statusText = !lastBid ? 'Starting Price' : 'Top Bid';
      if (lastBid) priceText = `${round(lastBid / 1e18, 3)} ${coinName}`;
      if (address === tokenOwner && listed)
        handleField = (
          <StyledButton variant="contained" fullWidth onClick={() => setCancelOpen(true)}>
            Cancel sale
          </StyledButton>
        );
      else
        auctionTextField = (
          <Typography variant="h4" color="origin.main" align="center" sx={{ pt: 2 }}>
            {!lastBid ? 'Auction Has Ended' : 'Reserve Price Not Met'}
          </Typography>
        );
    } else {
      statusText = 'Top Bid';
      priceText = `${round(lastBid / 1e18, 3)} ${coinName}`;
      usdPriceText = `≈ USD ${round((coinUSD * lastBid) / 1e18, 3)}`;
      const topBuyer = bidList[0].buyerAddr;
      const seller = bidList[0].sellerAddr;

      if (address === seller && listed)
        handleField = (
          <StyledButton variant="contained" fullWidth onClick={() => setSettleOrderOpen(true)}>
            Accept Bid
          </StyledButton>
        );
      else if (address === topBuyer && listed) {
        statusText = 'You Won!';
        handleField = (
          <StyledButton variant="contained" fullWidth onClick={() => setSettleOrderOpen(true)}>
            Claim Item
          </StyledButton>
        );
      } else
        auctionTextField = (
          <Typography variant="h4" color="origin.main" align="center" sx={{ pt: 2 }}>
            Auction Has Ended
          </Typography>
        );
    }
  } else if (!listed) {
    statusText = 'This item is currently';
    priceText = 'Not on Sale';
    handleField = (
      <StyledButton variant="contained" fullWidth onClick={() => navigate('/marketplace')}>
        Go back to Marketplace
      </StyledButton>
    );
  } else if (address === tokenOwner && listed) {
    handleField = (
      <StyledButton variant="contained" fullWidth onClick={() => setCancelOpen(true)}>
        Cancel sale
      </StyledButton>
    );
  } else if (address !== tokenOwner) {
    handleField = didSignin ? (
      <StyledButton variant="contained" fullWidth onClick={handlePurchase}>
        Buy
      </StyledButton>
    ) : (
      <StyledButton variant="contained" actiontype="buy" fullWidth onClick={openSignin}>
        Sign in to Buy
      </StyledButton>
    );
  }

  return (
    <>
      {onlyHandle ? (
        <MHidden width="smUp">{handleField !== null && <StickyPaperStyle>{handleField}</StickyPaperStyle>}</MHidden>
      ) : (
        <>
          {orderType === auctionOrderType && listed ? (
            <Box>
              <Stack direction="row">
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4">{statusText}</Typography>
                  <Typography variant="h3" color="origin.main">
                    {priceText}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {usdPriceText}
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" sx={{ minHeight: { xs: 30, md: 36 }, alignItems: 'center' }}>
                    <AccessTimeIcon />
                    &nbsp;
                    <Typography variant="body2" color="text.secondary">
                      {deadline}
                    </Typography>
                  </Stack>
                  <Countdown deadline={endTime * 1000} />
                </Box>
              </Stack>
              {auctionTextField}
              <MHidden width="smDown">
                <Box sx={{ mt: 2 }}>{handleField}</Box>
              </MHidden>
            </Box>
          ) : (
            <Box>
              <Typography variant="h4">{statusText}</Typography>
              <Typography variant="h3" color="origin.main">
                {priceText}
              </Typography>
              {listed && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {usdPriceText}
                </Typography>
              )}
              <MHidden width="smDown">
                <Box sx={{ mt: 2 }}>{handleField}</Box>
              </MHidden>
            </Box>
          )}
        </>
      )}
      <DisclaimerDlg isOpen={disclaimerOpen} setOpen={setOpenDisclaimer} />
      <PurchaseDlg isOpen={isOpenPurchase} setOpen={setPurchaseOpen} info={collectible} coinType={coinType} />
      <PlaceBidDlg
        isOpen={isOpenPlaceBid}
        setOpen={setPlaceBidOpen}
        info={{ ...collectible, lastBid }}
        coinType={coinType}
      />
      <SettleOrderDlg isOpen={isOpenSettleOrder} setOpen={setSettleOrderOpen} info={collectible} address={address} />
      <CancelDlg isOpen={isOpenCancel} setOpen={setCancelOpen} {...collectible} />
    </>
  );
}
