import React from 'react';
import * as math from 'mathjs';
import Imgix from "react-imgix";
import { useSnackbar } from 'notistack';
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";
import Countdown from "react-countdown";

// material
import { Icon } from '@iconify/react';
import { Box, Grid, Button, Link, IconButton, Menu, MenuItem, Typography, Stack, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SyncAltSharpIcon from '@mui/icons-material/SyncAltSharp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GavelIcon from '@mui/icons-material/Gavel';

import Badge from '../Badge';
import PaperRecord from '../PaperRecord';
import DisclaimerDlg from '../dialog/Disclaimer';
import SellDlg from '../dialog/Sell';
import UpdateDlg from '../dialog/UpdatePrice';
import CancelDlg from '../dialog/CancelSale';
import DeleteDlg from '../dialog/DeleteItem';
import TransferDlg from '../dialog/Transfer';
import NeedBuyDIADlg from '../dialog/NeedBuyDIA';
import AuctionDlg from '../dialog/Auction';
import SettleOrderDlg from '../dialog/SettleOrder'
import CardImgBox from '../CardImgBox';
import useSingin from '../../hooks/useSignin';
import BadgeProfile from './BadgeProfile'
import StyledButton from '../signin-dlg/StyledButton';
import { auctionOrderType, stickerContract as STICKER_ADDRESS } from '../../config';
import { getDiaTokenInfo, getCredentialInfo, coinTypes, fetchFrom, collectionTypes, getIpfsUrl } from '../../utils/common';

// ----------------------------------------------------------------------
const TimeCountBoxStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 50,
  right: 8,
  zIndex: 2,
  borderRadius: theme.spacing(2),
  padding: '2px 8px',
  backdropFilter: 'blur(6px)',
  // background: alpha(theme.palette.background.default, 0.5),
  background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box`,
  border: '2px solid transparent'
}));

export default function AssetCard(props) {
  const { name="???", description, quantity=1, price=0, coinType=0, isLink, isMoreLink, tokenId, type, orderId, orderType, status, endTime, currentBid, baseToken='', saleType, showPrice=false, 
   myaddress, royaltyOwner, royalties, holder, updateCount, handleUpdate, coinUSD, defaultCollectionType=0, isDragging=false, reservePrice=0, buyoutPrice=0, v1State=false } = props
  
  const [collection, setCollection] = React.useState(null);
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [disclaimerOpen, setOpenDisclaimer] = React.useState(false);
  const [sellOpen, setOpenSell] = React.useState(false);
  const [auctionOpen, setOpenAuction] = React.useState(false);
  const [updateOpen, setOpenUpdate] = React.useState(false);
  const [cancelOpen, setOpenCancel] = React.useState(false);
  const [deleteOpen, setOpenDelete] = React.useState(false);
  const [transferOpen, setOpenTransfer] = React.useState(false);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [settleOpen, setSettleOrderOpen] = React.useState(false);
  const [auctionEnded, setAuctionEnded] = React.useState(false);
  const [continueAction, setContinueAction] = React.useState('');

  const { diaBalance, setOpenDownloadEssentialDlg } = useSingin()
  const { enqueueSnackbar } = useSnackbar();
  
  const isCreatedByMe = myaddress===royaltyOwner
  const isListedOwnedByMe = (myaddress===royaltyOwner&&saleType==="Primary Sale") || (myaddress===holder&&saleType==="Secondary Sale")
  const isUnlistedOwnedByMe = myaddress===holder&&saleType==="Not on sale"
  const isListedByOthers = myaddress!==royaltyOwner&&myaddress!==holder&&saleType!=="Not on sale"
  const isUnlistedByOthers = myaddress!==royaltyOwner&&myaddress!==holder&&saleType==="Not on sale"

  React.useEffect(() => {
    const interval = setInterval(()=>checkHasEnded(), 1000)
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    if(baseToken) {
      fetchFrom(`api/v2/sticker/getCollection/${baseToken}`)
        .then((response) => {
          response.json().then((jsonAssets) => {
            if(!jsonAssets.data || !isMounted)
              return
            setCollection(jsonAssets.data);
            const metaUri = getIpfsUrl(jsonAssets.data.uri)
            if(metaUri) {
              fetch(metaUri)
                .then(response => response.json())
                .then(data => {
                  setCollection((prevState)=>{
                    const tempState = {...prevState}
                    tempState.avatar = getIpfsUrl(data.data.avatar)
                    tempState.description = data.data.description
                    return tempState
                  });
                })
                .catch(console.log);
            }
          }).catch((e) => {
          });
        })
    }
    return () => { isMounted = false };
  }, [baseToken]);

  React.useEffect(() => {
    if(continueAction && !disclaimerOpen){
      if(continueAction==='sell')
        setOpenSell(true)
      else if(continueAction==='auction')
        setOpenAuction(true)
    }
  }, [disclaimerOpen]);

  const handlePutOnAction = (type)=>{
    if(localStorage.getItem('pa-yes') === '1'){
      if(type==='sell')
        setOpenSell(true)
      else if(type==='auction')
        setOpenAuction(true)
      return
    }
    setOpenDisclaimer(true)
    setContinueAction(type)
  }

  const checkHasEnded  = () => {
    const tempEndTime = endTime*1000
    if(!tempEndTime)
      return
    if(!auctionEnded&&tempEndTime<=Date.now())
      setAuctionEnded(true)
  }
  
  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleSell = (event) => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
      setOpenDownloadEssentialDlg(true)
      return
    }
    handlePutOnAction('sell')
  }
  const handleClosePopup = (e) => {
    const type = e.target.getAttribute("value")
    switch(type){
      case 'sell':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        handlePutOnAction('sell')
        break;
      case 'auction':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        handlePutOnAction('auction')
        break;
      case 'update':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        if(currentBid.length && status==='MarketBid' && !auctionEnded){
          enqueueSnackbar('Already has been bid', { variant: 'warning' });
          return
        }
        setOpenUpdate(true)
        break;
      case 'cancel':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        if(currentBid.length && status==='MarketBid' && !auctionEnded){
          enqueueSnackbar('Already has been bid', { variant: 'warning' });
          return
        }
        setOpenCancel(true)
        break;
      case 'claim':
        setSettleOrderOpen(true)
        break;
      case 'delete':
        setOpenDelete(true)
        break;
      case 'transfer':
        if(diaBalance>=0.01)
          setOpenTransfer(true)
        else
          setOpenBuyDIA(true)
        break;
      default:
        break;
    }
    setOpenPopup(null);
  };
  const dlgProps = {name, tokenId, orderId, updateCount, handleUpdate, baseToken, v1State}
  const currentBidPrice = currentBid && currentBid.length>0 && status==='MarketBid' ? currentBid[0].price : 0
  return (
      <Box>
        <PaperRecord
          sx={{
            mb: '2px',
            position: 'relative',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            transform: 'translateY(0px)',
            '&:hover': {
              boxShadow: '0 4px 8px 0px rgb(0 0 0 / 30%)',
              transform: 'translateY(-4px)',
              '& .card-img:after': {
                transform: 'rotate(25deg)',
                top: '-30%',
                opacity: 0.18
              }
            }
          }}
        >
          <Stack sx={{p:2, pb: 1}} direction="row">
            <Stack sx={{flexGrow:1}} direction="row" spacing={.5}>
              <BadgeProfile type={1} collection={collection} defaultCollectionType={defaultCollectionType}/>
              {
                holder&&<BadgeProfile type={2} walletAddress={holder}/>
              }
              {!!(reservePrice*1)&&saleType!=="Not on sale"&&<BadgeProfile type={3} reservePriceFlag={currentBidPrice/1e18 >= reservePrice/1e18}/>}
              {!!(buyoutPrice*1)&&saleType!=="Not on sale"&&<BadgeProfile type={4}/>}
            </Stack>
            <Box>
              {
                (
                  (type===1 && myaddress===holder) || (type===2 && (isListedOwnedByMe || isUnlistedOwnedByMe))
                ) &&
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{p: 0}}
                  onClick={isLink ? openPopupMenu : ()=>{}}
                  disabled={
                    !(
                      sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && (
                        (type===1 && myaddress===holder && (auctionEnded || (!auctionEnded && !currentBidPrice))) || 
                        (type===2 && ((isListedOwnedByMe && (auctionEnded || (!auctionEnded && !currentBidPrice))) || isUnlistedOwnedByMe))
                      )
                    )
                  }
                >
                  <MoreHorizIcon />
                </IconButton>
              }
              <Menu 
                keepMounted
                id="simple-menu"
                anchorEl={isOpenPopup}
                onClose={handleClosePopup}
                open={Boolean(isOpenPopup)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {
                  type===0&&
                  <div>
                    <MenuItem onClick={handleClosePopup}>
                      <ThumbDownOffAltIcon/>&nbsp;Report Creator
                    </MenuItem>
                    <MenuItem onClick={handleClosePopup}>
                      <ThumbDownOffAltIcon/>&nbsp;Report Owner
                    </MenuItem>
                    <MenuItem onClick={handleClosePopup}>
                      <ShareOutlinedIcon/>&nbsp;Share
                    </MenuItem>
                  </div>
                }
                {
                  type===1&&myaddress===holder&&sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2'&&
                  <div>
                    {
                      !auctionEnded?
                      <>
                        {
                          !currentBidPrice&&
                          <div>
                            <MenuItem value='update' onClick={handleClosePopup}>
                              <LocalOfferOutlinedIcon/>&nbsp;Update Price
                            </MenuItem>
                            <MenuItem value='cancel' onClick={handleClosePopup}>
                              <CancelOutlinedIcon/>&nbsp;Cancel Sale
                            </MenuItem>
                          </div>    
                        }
                      </>:

                      <>
                      {
                        (!currentBidPrice || currentBidPrice<reservePrice)?
                        <div>
                          <MenuItem value='cancel' onClick={handleClosePopup}>
                            <CancelOutlinedIcon/>&nbsp;Cancel Sale
                          </MenuItem>
                        </div>:
                        <div>
                          <MenuItem value='claim' onClick={handleClosePopup}>
                            <GavelIcon/>&nbsp;Claim Item
                          </MenuItem>
                        </div>
                      }
                    </>
                    }
                    {/* <MenuItem onClick={handleClosePopup}>
                      <ShareOutlinedIcon/>&nbsp;Share
                    </MenuItem> */}
                  </div>
                }
                {
                  type===2&&sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2'&&(
                    (
                      isListedOwnedByMe&&
                      <div>
                      {
                        !auctionEnded?
                        <>
                          {
                            !currentBidPrice&&
                            <div>
                              <MenuItem value='update' onClick={handleClosePopup}>
                                <LocalOfferOutlinedIcon/>&nbsp;Update Price
                              </MenuItem>
                              <MenuItem value='cancel' onClick={handleClosePopup}>
                                <CancelOutlinedIcon/>&nbsp;Cancel Sale
                              </MenuItem>
                            </div>    
                          }
                        </>:

                        <>
                        {
                          (!currentBidPrice || currentBidPrice<reservePrice)?
                          <div>
                            <MenuItem value='cancel' onClick={handleClosePopup}>
                              <CancelOutlinedIcon/>&nbsp;Cancel Sale
                            </MenuItem>
                          </div>:
                          <div>
                            <MenuItem value='claim' onClick={handleClosePopup}>
                              <GavelIcon/>&nbsp;Claim Item
                            </MenuItem>
                          </div>
                        }
                        </>
                      }
                      </div>
                    ) || (
                      isUnlistedOwnedByMe&&
                      <div>
                        <MenuItem value='sell' onClick={handleClosePopup}>
                          <StorefrontIcon/>&nbsp;Sell
                        </MenuItem>
                        <MenuItem value='auction' onClick={handleClosePopup}>
                          <GavelIcon/>&nbsp;Auction
                        </MenuItem>
                        <MenuItem value='transfer' onClick={handleClosePopup}>
                          <SyncAltSharpIcon/>&nbsp;Transfer
                        </MenuItem>
                        <MenuItem value='delete' onClick={handleClosePopup}>
                          <DeleteOutlineIcon/>&nbsp;Delete
                        </MenuItem>
                      </div>
                    )
                  )
                }
                {/* {
                  type===3&&
                  <div>
                    <MenuItem onClick={handleClosePopup}>
                      <ShareOutlinedIcon/>&nbsp;Share
                    </MenuItem>
                  </div>
                } */}
              </Menu>
            </Box>
          </Stack>
          {
            orderType===auctionOrderType && !!endTime && status!=='Not on sale' &&
            <TimeCountBoxStyle>
              {
                auctionEnded?
                <Typography variant='subtitle2' sx={{fontWeight: 'normal'}}>
                  Auction has ended
                </Typography>:
                <Typography variant='subtitle2' sx={{fontWeight: 'normal'}}>
                  <Countdown date={endTime*1000} /> <Typography variant='caption' sx={{color:'text.secondary'}}>left</Typography> ⏰
                </Typography>
              }
            </TimeCountBoxStyle>
          }
          <Box>
          {
            isLink?(
              <Link
                component={RouterLink}
                to={isMoreLink?`/collections/detail/${baseToken}`:`/marketplace/detail/${[tokenId, baseToken].join('&')}`}
                // state={{tokenId, baseToken}}
                alt=""
                underline="none"
                onClick={(e)=>{if(isDragging) e.preventDefault()}}
              >
                {
                  isMoreLink?
                  <Box sx={{position: 'relative', background: '#161c24'}}>
                    <CardImgBox {...props}/>
                    <Typography variant="h5" align='center' sx={{width: '100%', top: '50%', color: 'white', position: 'absolute', transform: 'translateY(-50%)'}}>+ more</Typography>
                  </Box>:
                  <CardImgBox {...props}/>
                }
              </Link>
            ):(
              <CardImgBox {...props}/>
            )
          }
          </Box>
          <Box sx={{p:2}}>
            <Stack direction="row">
              <Typography variant="h6" noWrap sx={{flexGrow: 1, fontSize: {xs: '1rem'}}}>{name}</Typography>
              {
                orderType===auctionOrderType?
                <Tooltip title={currentBidPrice?"Top Bid":"Starting Price"} arrow enterTouchDelay={0}>
                  <Typography variant="subtitle2" sx={{display: 'inline-table', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em'}} noWrap>
                    {math.round((currentBidPrice)/1e18, 3) || price} {coinTypes[coinType].name}
                  </Typography>
                </Tooltip>:
                <Typography variant="subtitle2" sx={{display: 'inline-table', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em'}} noWrap>
                  1/{quantity}
                </Typography>
              }
            </Stack>
            {/* <Typography variant="body2" display="block" sx={{lineHeight: 1.3}} noWrap>{description}</Typography> */}
            {/* <Typography variant="body2" display="block" sx={{lineHeight: 1.3, color: 'text.secondary'}}>Quantity: 1/{quantity}</Typography> */}
            {
              (
                (type===0&&saleType!=="Not on sale")||
                (type===0&&saleType==="Not on sale"&&showPrice)||
                type===1||
                type===2&&(isListedOwnedByMe)||
                type===2&&isListedByOthers||
                type===3&&!auctionEnded
              ) &&
              <Stack direction='row'>
                <Box component="img" src={`/static/${coinTypes[coinType].icon}`} sx={{ width: 20, m: 'auto', display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&coinType===0?'invert(1)':'none' }} />
                <Box sx={{color: "origin.main", flexGrow: 1}}>
                  &nbsp;<Typography variant="subtitle1" sx={{display: 'inline-flex'}}>{price} {coinTypes[coinType].name}</Typography>&nbsp;
                  <Typography variant="caption" sx={{color: 'text.secondary', display: 'inline-flex', alignItems: 'end'}}>≈ USD {math.round(coinUSD * price, 2)}</Typography>
                </Box>
              </Stack>
            }
            {
              (
                (type===0&&saleType==="Not on sale"&&!showPrice)||
                (type===2&&isUnlistedByOthers)
              ) &&
              <Typography variant="h6" sx={{color: "origin.main", fontSize: {xs: '1rem'}}} align='center'>
                Not on Sale
              </Typography>
            }
            {
              (type===2&&isUnlistedOwnedByMe)&&
              <StyledButton variant="contained" size="small" fullWidth sx={{mt: 1, mb: .5}} onClick={handleSell}>Sell</StyledButton>
            }
            {
              (type===3&&auctionEnded)&&
              <StyledButton variant="contained" size="small" fullWidth sx={{mt: 1, mb: .5}} onClick={(e)=>{setSettleOrderOpen(true)}}>Claim Item</StyledButton>
            }
            {/* {
              type===0&&
              <Stack spacing={.6} direction="row" sx={{minHeight: '26px'}}>
                {
                  badge.dia&&
                  <Tooltip title="Diamond (DIA) token holder" arrow enterTouchDelay={0}>
                    <Box><Badge name="diamond"/></Box>
                  </Tooltip>
                }
                {
                  badge.kyc&&
                  <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                    <Box><Badge name="user"/></Box>
                  </Tooltip>
                }
              </Stack>
            } */}
          </Box>
        </PaperRecord>
        <DisclaimerDlg isOpen={disclaimerOpen} setOpen={setOpenDisclaimer}/>
        <SellDlg isOpen={sellOpen} setOpen={setOpenSell} {...dlgProps} saleType={saleType} royalties={royalties}/>
        <UpdateDlg isOpen={updateOpen} setOpen={setOpenUpdate} {...dlgProps} orderType={orderType}/>
        <CancelDlg isOpen={cancelOpen} setOpen={setOpenCancel} {...dlgProps}/>
        <DeleteDlg isOpen={deleteOpen} setOpen={setOpenDelete} {...dlgProps}/>
        <TransferDlg isOpen={transferOpen} setOpen={setOpenTransfer} {...dlgProps}/>
        <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance}/>
        <AuctionDlg isOpen={auctionOpen} setOpen={setOpenAuction} {...dlgProps}/>
        <SettleOrderDlg isOpen={settleOpen} setOpen={setSettleOrderOpen} info={{...props, listBid: currentBid}} address={myaddress} {...{updateCount, handleUpdate}}/>
      </Box>
  );
};