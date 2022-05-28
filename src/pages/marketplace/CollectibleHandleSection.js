import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {round} from 'mathjs'
// material
import { Box, Stack, Typography, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';

import { MHidden } from '../../components/@material-extend';
import StyledButton from '../../components/signin-dlg/StyledButton';
import DisclaimerDlg from '../../components/dialog/Disclaimer'
import PurchaseDlg from '../../components/dialog/Purchase'
import PlaceBidDlg from '../../components/dialog/PlaceBid'
import SettleOrderDlg from '../../components/dialog/SettleOrder'
import CancelDlg from '../../components/dialog/CancelSale';
import Countdown from '../../components/Countdown';
import useSingin from '../../hooks/useSignin';
import { getTime, getCoinTypeFromToken, getCoinUSD, getDiaTokenPrice, getERC20TokenPrice, coinTypes } from '../../utils/common';
import { auctionOrderType } from '../../config';
// ----------------------------------------------------------------------

const StickyPaperStyle = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  boxShadow: `${theme.palette.mode==='dark'?'rgb(6 12 20)':'rgb(230 230 230)'} 0px -5px 12px`,
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '16px 16px 0 0'
}));

export default function CollectibleHandleSection(props) {
  const navigate = useNavigate();
  const {collectible, address, onlyHandle=false} = props
  const [clickedType, setClickedType] = useState('');
  const [didSignin, setSignin] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [disclaimerOpen, setOpenDisclaimer] = useState(false);
  const [isOpenPurchase, setPurchaseOpen] = useState(false);
  const [isOpenPlaceBid, setPlaceBidOpen] = useState(false);
  const [isOpenSettleOrder, setSettleOrderOpen] = useState(false);
  const [isOpenCancel, setCancelOpen] = useState(false);
  const [continuePurchase, setContinuePurchase] = useState(false);
  const [coinPrice, setCoinPrice] = useState(Array(coinTypes.length).fill(0));
  const { pasarLinkAddress } = useSingin()

  useEffect(async() => {
    const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    setSignin(!!sessionLinkFlag)
    if(clickedType&&!!sessionLinkFlag){
      setClickedType('')
      if(clickedType === 'buy')
        setTimeout(handlePurchase, 300)
      else if(clickedType === 'bid')
        setTimeout(()=>{setPlaceBidOpen(true)}, 300)
    }
  }, [pasarLinkAddress]);

  useEffect(() => {
    checkHasEnded()
    getCoinUSD().then((res) => {
      setCoinPriceByType(0, res)
    });
    getDiaTokenPrice().then((res) => {
      setCoinPriceByType(1, res.token.derivedELA * res.bundle.elaPrice)
    })
    coinTypes.forEach((token, _i)=>{
      if(_i<2)
        return
      getERC20TokenPrice(token.address).then((res) => {
        setCoinPriceByType(_i, res.token.derivedELA * res.bundle.elaPrice)
      })
    })
  }, [collectible]);

  useEffect(() => {
    if(continuePurchase && !disclaimerOpen){
      setPurchaseOpen(true)
    }
  }, [disclaimerOpen]);

  const handlePurchase = ()=>{
    if(localStorage.getItem('pa-yes') === '1'){
      setPurchaseOpen(true)
      return
    }
    setOpenDisclaimer(true)
    setContinuePurchase(true)
  }
  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  }

  const openSignin = (e)=>{
    const actionType = e.target.getAttribute("actiontype")
    if(document.getElementById("signin")){
      setClickedType(actionType)
      document.getElementById("signin").click()
    }
  }

  const checkHasEnded  = () => {
    const tempEndTime = collectible.endTime*1000
    if(!tempEndTime || tempEndTime<=Date.now())
      setAuctionEnded(true)
    else {
      setAuctionEnded(false)
      setTimeout(()=>checkHasEnded(), 1000)
    }
  }
  const coinType = getCoinTypeFromToken(collectible)
  const coinName = coinTypes[coinType].name
  const coinUSD = coinPrice[coinType]
  let statusText = 'On sale for a fixed price of'
  let priceText = `${round(collectible.Price/1e18, 3)} ${coinName}`
  let usdPriceText = `≈ USD ${round(coinUSD*collectible.Price/1e18, 3)}`
  let handleField = null
  const currentBid = collectible.listBid&&collectible.listBid.length?collectible.listBid[0].price:0
  let deadline = ''
  let auctionTextField = null
  if(collectible.orderType === auctionOrderType && collectible.SaleType !== 'Not on sale') {
    const tempDeadLine = getTime(collectible.endTime)
    deadline = `${auctionEnded?'Ended':'Ends'} ${tempDeadLine.date} ${tempDeadLine.time}`
    if(!auctionEnded) { // not end yet
      if(!currentBid)
        statusText = 'Starting Price'
      else {
        statusText = 'Current Bid'
        priceText = `${round(currentBid/1e18, 3)} ${coinName}`
        usdPriceText = `≈ USD ${round(coinUSD*currentBid/1e18, 3)}`
      }

      if(address!==collectible.holder && address!==collectible.royaltyOwner)
        handleField = 
          didSignin?
          <Stack direction="row" spacing={1}>
            <StyledButton variant="contained" fullWidth onClick={(e)=>{setPlaceBidOpen(true)}}>
              Place bid
            </StyledButton>
            {
              !!(collectible.buyoutPrice*1)&&
              <StyledButton variant="outlined" fullWidth onClick={handlePurchase}>
                Buy now for {round(collectible.buyoutPrice/1e18, 3)} {coinName}
              </StyledButton>
            }
          </Stack>:
          <StyledButton variant="contained" actiontype='bid' fullWidth onClick={openSignin}>
            Sign in to Place bid
          </StyledButton>
      else if(address === collectible.holder && !currentBid && collectible.SaleType !== "Not on sale")
        handleField = 
          <StyledButton variant="contained" fullWidth onClick={(e)=>{setCancelOpen(true)}}>
            Cancel sale
          </StyledButton>
      else if(collectible.buyoutPrice*1)
        auctionTextField = 
          <Typography variant="h4" component='div' align='center' sx={{pt: 2}}>
            Your Buy Now Price: <Typography variant="h4" color="origin.main" sx={{display: 'inline'}}>{round(collectible.buyoutPrice/1e18, 3)} {coinName}</Typography>
          </Typography>
    }
    else
      if(!currentBid || currentBid<collectible.reservePrice){
        statusText = !currentBid?'Starting Price':'Top Bid'
        if(currentBid)
          priceText = `${round(currentBid/1e18, 3)} ${coinName}`
        if(address === collectible.holder && collectible.SaleType !== "Not on sale")
          handleField = 
            <StyledButton variant="contained" fullWidth onClick={(e)=>{setCancelOpen(true)}}>
              Cancel sale
            </StyledButton>
        else
          auctionTextField = 
            <Typography variant="h4" color="origin.main" align='center' sx={{pt: 2}}>
              {!currentBid?"Auction Has Ended":"Reserve Price Not Met"}
            </Typography>
      }
      else {
        statusText = 'Top Bid'
        priceText = `${round(currentBid/1e18, 3)} ${coinName}`
        usdPriceText = `≈ USD ${round(coinUSD*currentBid/1e18, 3)}`
        const topBuyer = collectible.listBid[0].buyerAddr
        const seller = collectible.listBid[0].sellerAddr
        
        if(address===seller && collectible.SaleType !== "Not on sale")
          handleField = 
            <StyledButton variant="contained" fullWidth onClick={(e)=>{setSettleOrderOpen(true)}}>
              Accept Bid
            </StyledButton>
        else if(address===topBuyer && collectible.SaleType !== "Not on sale") {
          statusText = 'You Won!'
          handleField = 
            <StyledButton variant="contained" fullWidth onClick={(e)=>{setSettleOrderOpen(true)}}>
              Claim Item
            </StyledButton>
        }
        else
          auctionTextField = 
            <Typography variant="h4" color="origin.main" align='center' sx={{pt: 2}}>
              Auction Has Ended
            </Typography>
      }
  }
  else
    if(collectible.SaleType === "Not on sale") {
      statusText = 'This item is currently'
      priceText = 'Not on Sale'
      handleField = 
        <StyledButton variant="contained" fullWidth onClick={(e)=>{navigate('/marketplace')}}>
          Go back to Marketplace
        </StyledButton>
    } else if(address === collectible.holder && collectible.SaleType !== "Not on sale") {
      handleField = 
        <StyledButton variant="contained" fullWidth onClick={(e)=>{setCancelOpen(true)}}>
          Cancel sale
        </StyledButton>
    } else if(address!==collectible.holder && address!==collectible.royaltyOwner) {
      handleField = 
        didSignin?
        <StyledButton variant="contained" fullWidth onClick={handlePurchase}>
          Buy
        </StyledButton>:

        <StyledButton variant="contained" actiontype='buy' fullWidth onClick={openSignin}>
          Sign in to Buy
        </StyledButton>
    }
  return (
    <>
      {
        onlyHandle?
        <MHidden width="smUp">
          {
            handleField!==null&&
            <StickyPaperStyle>
              {handleField}
            </StickyPaperStyle>
          }
        </MHidden>:
        <>
          {
            collectible.orderType===auctionOrderType && collectible.SaleType!=="Not on sale"?
            <Box>
              <Stack direction="row">
                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h4">{statusText}</Typography>
                  <Typography variant="h3" color="origin.main">{priceText}</Typography>
                  <Typography variant="body2" color='text.secondary'>{usdPriceText}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" sx={{minHeight: {xs: 30, md: 36}, alignItems: 'center'}}>
                    <AccessTimeIcon/>&nbsp;
                    <Typography variant="body2" color='text.secondary'>{deadline}</Typography>
                  </Stack>
                  <Countdown deadline={collectible.endTime*1000}/>
                </Box>
              </Stack>
              {auctionTextField}
              <MHidden width="smDown">
                <Box sx={{mt: 2}}>
                  {handleField}
                </Box>
              </MHidden>
            </Box>:

            <Box>
              <Typography variant="h4">{statusText}</Typography>
              <Typography variant="h3" color="origin.main">{priceText}</Typography>
              {
                collectible.SaleType!=="Not on sale" &&
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{usdPriceText}</Typography>
              }
              <MHidden width="smDown">
                <Box sx={{mt: 2}}>
                  {handleField}
                </Box>
              </MHidden>
            </Box>
          }
        </>
      }
      <DisclaimerDlg isOpen={disclaimerOpen} setOpen={setOpenDisclaimer}/>
      <PurchaseDlg
        isOpen={isOpenPurchase}
        setOpen={setPurchaseOpen}
        info={collectible}
        coinType={coinType}
      />
      <PlaceBidDlg 
        isOpen={isOpenPlaceBid}
        setOpen={setPlaceBidOpen}
        info={{ ...collectible, currentBid }}
        coinType={coinType}
      />
      <SettleOrderDlg
        isOpen={isOpenSettleOrder}
        setOpen={setSettleOrderOpen}
        info={collectible}
        address={address}
      />
      <CancelDlg
        isOpen={isOpenCancel}
        setOpen={setCancelOpen}
        {...collectible}
      />
    </>
  )
}