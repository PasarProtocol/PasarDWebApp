import React from 'react';
import * as math from 'mathjs';
import Imgix from "react-imgix";
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
import SellDlg from '../dialog/Sell';
import UpdateDlg from '../dialog/UpdatePrice';
import CancelDlg from '../dialog/CancelSale';
import DeleteDlg from '../dialog/DeleteItem';
import TransferDlg from '../dialog/Transfer';
import NeedBuyDIADlg from '../dialog/NeedBuyDIA';
import AuctionDlg from '../dialog/Auction';
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
  zIndex: 1,
  borderRadius: theme.spacing(2),
  padding: '2px 8px',
  backdropFilter: 'blur(6px)',
  // background: alpha(theme.palette.background.default, 0.5),
  background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box`,
  border: '2px solid transparent'
}));

export default function AssetCard(props) {
  const { name="???", description, quantity=1, price=0, coinType=0, isLink, tokenId, type, orderId, orderType, endTime, currentBid, baseToken='',
   saleType, myaddress, royaltyOwner, holder, updateCount, handleUpdate, coinUSD, defaultCollectionType, isDragging=false, reservePrice=0, buyoutPrice=0 } = props
  const defaultCollection = {
    ...collectionTypes[defaultCollectionType],
    token: STICKER_ADDRESS,
    description: collectionTypes[defaultCollectionType].shortDescription
  }
  const [collection, setCollection] = React.useState(defaultCollection);
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [sellOpen, setOpenSell] = React.useState(false);
  const [auctionOpen, setOpenAuction] = React.useState(false);
  const [updateOpen, setOpenUpdate] = React.useState(false);
  const [cancelOpen, setOpenCancel] = React.useState(false);
  const [deleteOpen, setOpenDelete] = React.useState(false);
  const [transferOpen, setOpenTransfer] = React.useState(false);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [auctionEnded, setAuctionEnded] = React.useState(false);
  const [badge, setBadge] = React.useState({dia: false, kyc: false});
  const { diaBalance, setOpenDownloadEssentialDlg } = useSingin()
  
  const isCreatedByMe = myaddress===royaltyOwner
  const isListedOwnedByMe = (myaddress===royaltyOwner&&saleType==="Primary Sale") || (myaddress===holder&&saleType==="Secondary Sale")
  const isUnlistedOwnedByMe = myaddress===holder&&saleType==="Not on sale"
  const isListedByOthers = myaddress!==royaltyOwner&&myaddress!==holder&&saleType!=="Not on sale"
  const isUnlistedByOthers = myaddress!==royaltyOwner&&myaddress!==holder&&saleType==="Not on sale"

  React.useEffect(() => {
    if(holder) {
      getDiaTokenInfo(holder).then(dia=>{
        if(dia!=='0')
          setBadgeFlag('dia', true)
      })
      getCredentialInfo(holder).then(proofData=>{
        if(proofData)
          setBadgeFlag('kyc', true)
      })
    }
    const interval = setInterval(()=>checkHasEnded(), 1000)
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if(baseToken && baseToken===STICKER_ADDRESS) {
      setCollection(defaultCollection);
    }
    else if(baseToken && baseToken!==STICKER_ADDRESS) {
      fetchFrom(`api/v2/sticker/getCollection/${baseToken}`)
        .then((response) => {
          response.json().then((jsonAssets) => {
            if(!jsonAssets.data)
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
                });
            }
          }).catch((e) => {
          });
        })
    }
  }, [baseToken]);

  const checkHasEnded  = () => {
    const tempEndTime = endTime*1000
    if(!tempEndTime)
      return
    if(!auctionEnded&&tempEndTime<=Date.now())
      setAuctionEnded(true)
  }
  const setBadgeFlag = (type, value) => {
    setBadge((prevState) => {
      const tempFlag = {...prevState}
      tempFlag[type] = value
      return tempFlag
    })
  }
  
  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleSell = (event) => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
      setOpenDownloadEssentialDlg(true)
      return
    }
    setOpenSell(true)
  }
  const handleClosePopup = (e) => {
    const type = e.target.getAttribute("value")
    switch(type){
      case 'sell':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        setOpenSell(true)
        break;
      case 'auction':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        setOpenAuction(true)
        break;
      case 'update':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        setOpenUpdate(true)
        break;
      case 'cancel':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        setOpenCancel(true)
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
  const dlgProps = {name, tokenId, orderId, updateCount, handleUpdate}
  const currentBidPrice = currentBid&&currentBid.length>0?currentBid[0].price:0
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
              <BadgeProfile type={1} collection={collection}/>
              {
                holder&&<BadgeProfile type={2} walletAddress={holder} badge={badge}/>
              }
              {!!(reservePrice*1)&&<BadgeProfile type={3} reservePriceFlag={currentBidPrice>=reservePrice}/>}
              {!!(buyoutPrice*1)&&<BadgeProfile type={4}/>}
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
                        (type===1 && myaddress===holder) || 
                        (type===2 && (isListedOwnedByMe || isUnlistedOwnedByMe))
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
                  type===1&&myaddress===holder&&
                  <div>
                    {
                      sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2'&&
                      <div>
                        <MenuItem value='update' onClick={handleClosePopup}>
                          <LocalOfferOutlinedIcon/>&nbsp;Update Price
                        </MenuItem>
                        <MenuItem value='cancel' onClick={handleClosePopup}>
                          <CancelOutlinedIcon/>&nbsp;Cancel Sale
                        </MenuItem>
                      </div>
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
                        <MenuItem value='update' onClick={handleClosePopup}>
                          <LocalOfferOutlinedIcon/>&nbsp;Update Price
                        </MenuItem>
                        <MenuItem value='cancel' onClick={handleClosePopup}>
                          <CancelOutlinedIcon/>&nbsp;Cancel Sale
                        </MenuItem>
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
            orderType===auctionOrderType && endTime &&
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
                to={`/marketplace/detail/${tokenId}`}
                alt=""
                underline="none"
                onClick={(e)=>{if(isDragging) e.preventDefault()}}
              >
                <CardImgBox
                  src={props.thumbnail}
                  {...props}
                />
              </Link>
            ):(
              <CardImgBox
                src={props.thumbnail}
                {...props}
              />
            )
          }
          </Box>
          <Box sx={{p:2}}>
            <Stack direction="row">
              <Typography variant="h5" noWrap sx={{flexGrow: 1}}>{name}</Typography>
              {
                orderType===auctionOrderType?
                <Tooltip title={currentBidPrice?"Top Bid":"Starting Price"} arrow enterTouchDelay={0}>
                  <Typography variant="subtitle2" sx={{pt: '3px', display: 'inline-table', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em'}} noWrap>
                    {math.round((currentBidPrice)/1e18, 3) || price} {coinTypes[coinType].name}
                  </Typography>
                </Tooltip>:
                <Typography variant="subtitle2" sx={{pt: '3px', display: 'inline-table', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em'}} noWrap>
                  1/{quantity}
                </Typography>
              }
            </Stack>
            {/* <Typography variant="body2" display="block" sx={{lineHeight: 1.3}} noWrap>{description}</Typography> */}
            {/* <Typography variant="body2" display="block" sx={{lineHeight: 1.3, color: 'text.secondary'}}>Quantity: 1/{quantity}</Typography> */}
            {
              (type===0||type===1||type===2&&(isListedOwnedByMe)||type===2&&isListedByOthers)&&
              <Typography variant="h5" sx={{color: "origin.main"}} noWrap>
                <Box component="img" src={`/static/${coinTypes[coinType].icon}`} sx={{ width: 18, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&coinType===0?'invert(1)':'none' }} />
                &nbsp;{price} {coinTypes[coinType].name}&nbsp;
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'inline-flex', alignItems: 'end'}}>≈ USD {math.round(coinUSD * price, 2)}</Typography>
              </Typography>
            }
            {
              (type===2&&isUnlistedByOthers)&&
              <Typography variant="h4" sx={{color: "origin.main"}} align='center'>
                Not on Sale
              </Typography>
            }
            {
              (type===2&&isUnlistedOwnedByMe)&&
              <StyledButton variant="contained" size="small" fullWidth sx={{mt: 1, mb: .5}} onClick={handleSell}>Sell</StyledButton>
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
                  <Tooltip title="KYC-ed user" arrow enterTouchDelay={0}>
                    <Box><Badge name="user"/></Box>
                  </Tooltip>
                }
              </Stack>
            } */}
          </Box>
        </PaperRecord>
        <SellDlg isOpen={sellOpen} setOpen={setOpenSell} {...dlgProps}/>
        <UpdateDlg isOpen={updateOpen} setOpen={setOpenUpdate} {...dlgProps} orderType={orderType}/>
        <CancelDlg isOpen={cancelOpen} setOpen={setOpenCancel} {...dlgProps}/>
        <DeleteDlg isOpen={deleteOpen} setOpen={setOpenDelete} {...dlgProps}/>
        <TransferDlg isOpen={transferOpen} setOpen={setOpenTransfer} {...dlgProps}/>
        <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance}/>
        <AuctionDlg isOpen={auctionOpen} setOpen={setOpenAuction} {...dlgProps}/>
      </Box>
  );
};