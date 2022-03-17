import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {round} from 'mathjs'
// material
import { Box, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { MHidden } from '../../components/@material-extend';
import StyledButton from '../../components/signin-dlg/StyledButton';
import PurchaseDlg from '../../components/dialog/Purchase'
import PlaceBidDlg from '../../components/dialog/PlaceBid'
import Countdown from '../../components/Countdown';
import useSingin from '../../hooks/useSignin';
import { getTime } from '../../utils/common';
import { auctionOrderType } from '../../config';
// ----------------------------------------------------------------------

export default function CollectibleHandleSection(props) {
  const navigate = useNavigate();
  const {collectible, coinUSD, address} = props
  const [buyClicked, setBuyClicked] = useState(false);
  const [didSignin, setSignin] = useState(false);
  const [isOpenPurchase, setPurchaseOpen] = useState(false);
  const [isOpenPlaceBid, setPlaceBidOpen] = useState(false);
  const { pasarLinkAddress } = useSingin()

  useEffect(async() => {
    const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    setSignin(!!sessionLinkFlag)
    if(buyClicked&&!!sessionLinkFlag){
      setBuyClicked(false)
      setTimeout(()=>{setPurchaseOpen(true)}, 300)
    }
  }, [pasarLinkAddress]);
  
  const openSignin = (e)=>{
    if(document.getElementById("signin")){
      setBuyClicked(true)
      document.getElementById("signin").click()
    }
  }

  let statusText = 'On sale for a fixed price of'
  let priceText = `${round(collectible.Price/1e18, 3)} ELA`
  let usdPriceText = `≈ USD ${round(coinUSD*collectible.Price/1e18, 3)}`
  let handleField = null
  const currentBid = collectible.listBid.length?collectible.listBid[0].price:0
  let deadline = ''
  let auctionTextField = null
  if(collectible.orderType === auctionOrderType) {
    const tempDeadLine = getTime(collectible.endTime)
    deadline = `${tempDeadLine.date} ${tempDeadLine.time}`
    if(collectible.endTime*1000 > Date.now()) { // not end yet
      if(!currentBid)
        statusText = 'Starting Price'
      else {
        statusText = 'Current Bid'
        priceText = `${round(currentBid/1e18, 3)} ELA`
        usdPriceText = `≈ USD ${round(coinUSD*currentBid/1e18, 3)}`
      }

      if(address!==collectible.holder && address!==collectible.royaltyOwner)
        handleField = 
          didSignin?
          <Stack direction="row" spacing={1} sx={{mt: 2}}>
            <StyledButton variant="contained" fullWidth onClick={(e)=>{setPlaceBidOpen(true)}}>
              Place bid
            </StyledButton>
            {
              collectible.buyoutPrice&&
              <StyledButton variant="outlined" fullWidth onClick={(e)=>{setPurchaseOpen(true)}}>
                Buy now for {round(collectible.buyoutPrice/1e18, 3)} ELA
              </StyledButton>
            }
          </Stack>:
          <StyledButton variant="contained" fullWidth onClick={openSignin} sx={{mt: 2}}>
            Sign in to Place bid
          </StyledButton>
      else
        auctionTextField = 
          <Typography variant="h4" component='div' align='center' sx={{pt: 2}}>
            Your Buy Now Price: <Typography variant="h4" color="origin.main" sx={{display: 'inline'}}>{round(collectible.buyoutPrice/1e18, 3)} ELA</Typography>
          </Typography>
    }
    else
      if(!currentBid){
        statusText = 'Starting Price'
        if(address === collectible.holder)
          handleField = 
            <StyledButton variant="contained" fullWidth onClick={(e)=>{}} sx={{mt: 2}}>
              Remove Listing
            </StyledButton>
        else
          auctionTextField = 
            <Typography variant="h4" color="origin.main" align='center' sx={{pt: 2}}>
              Auction Has Ended
            </Typography>
      }
      else {
        statusText = 'Top Bid'
        priceText = `${round(currentBid/1e18, 3)} ELA`
        usdPriceText = `≈ USD ${round(coinUSD*currentBid/1e18, 3)}`
        const topBuyer = collectible.listBid[0].buyerAddr
        const seller = collectible.listBid[0].sellerAddr
        if(address === topBuyer)
          statusText = 'You Won!'
        if(address!==topBuyer && address!==seller)
          auctionTextField = 
            <Typography variant="h4" color="origin.main" align='center' sx={{pt: 2}}>
              Auction Has Ended
            </Typography>
        else
          handleField = 
            <StyledButton variant="contained" fullWidth onClick={(e)=>{}} sx={{mt: 2}}>
              Close Order
            </StyledButton>
      }
  }
  else
    if(collectible.SaleType === "Not on sale") {
      statusText = 'This item is currently'
      priceText = 'Not on Sale'
      handleField = 
        <StyledButton variant="contained" fullWidth onClick={(e)=>{navigate('/marketplace')}} sx={{mt: 2}}>
          Go back to Marketplace
        </StyledButton>
    } else if(address!==collectible.holder && address!==collectible.royaltyOwner) {
      handleField = 
        didSignin?
        <StyledButton variant="contained" fullWidth onClick={(e)=>{setPurchaseOpen(true)}} sx={{mt: 2}}>
          Buy
        </StyledButton>:

        <StyledButton variant="contained" fullWidth onClick={openSignin} sx={{mt: 2}}>
          Sign in to Buy
        </StyledButton>
    }
  return (
    <>
      {
        collectible.orderType===auctionOrderType?
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
                <Typography variant="body2" color='text.secondary'>Ends {deadline}</Typography>
              </Stack>
              <Countdown deadline={collectible.endTime*1000}/>
            </Box>
          </Stack>
          {auctionTextField}
          <MHidden width="smDown">{handleField}</MHidden>
        </Box>:

        <Box>
          <Typography variant="h4">{statusText}</Typography>
          <Typography variant="h3" color="origin.main">{priceText}</Typography>
          {
            collectible.SaleType!=="Not on sale" &&
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{usdPriceText}</Typography>
          }
          <MHidden width="smDown">{handleField}</MHidden>
        </Box>
      }
      <PurchaseDlg
        isOpen={isOpenPurchase}
        setOpen={setPurchaseOpen}
        info={collectible}
      />
      <PlaceBidDlg 
        isOpen={isOpenPlaceBid}
        setOpen={setPlaceBidOpen}
        info={{ ...collectible, currentBid }}
      />
    </>
  )
}