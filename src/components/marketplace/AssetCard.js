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

import Badge from '../Badge';
import PaperRecord from '../PaperRecord';
import SellDlg from '../dialog/Sell';
import UpdateDlg from '../dialog/UpdatePrice';
import CancelDlg from '../dialog/CancelSale';
import DeleteDlg from '../dialog/DeleteItem';
import TransferDlg from '../dialog/Transfer';
import NeedBuyDIADlg from '../dialog/NeedBuyDIA';
import CardImgBox from '../CardImgBox';
import useSingin from '../../hooks/useSignin';
import BadgeProfile from './BadgeProfile'
import { getDiaTokenInfo, getCredentialInfo, coinTypes } from '../../utils/common';

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
  background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box',
  border: '2px solid transparent'
}));

export default function AssetCard(props) {
  const { title="???", description, quantity=1, price=0, coinType=0, isLink, tokenId, type, orderId,
   saleType, myaddress, royaltyOwner, holder, updateCount, handleUpdate, coinUSD } = props
  const { diaBalance, setOpenDownloadEssentialDlg } = useSingin()
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [sellOpen, setOpenSell] = React.useState(false);
  const [updateOpen, setOpenUpdate] = React.useState(false);
  const [cancelOpen, setOpenCancel] = React.useState(false);
  const [deleteOpen, setOpenDelete] = React.useState(false);
  const [transferOpen, setOpenTransfer] = React.useState(false);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [diaBadge, setDiaBadge] = React.useState(false);
  const [badge, setBadge] = React.useState({dia: false, kyc: false});
  
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
  }, []);

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
  const dlgProps = {title, tokenId, updateCount, handleUpdate}
  return (
      <motion.div
        animate={{ scale: 1 }}
      >
        <PaperRecord sx={{mb: '2px', position: 'relative'}}>
          <Stack sx={{p:2, pb: 1}} direction="row">
            <Stack sx={{flexGrow:1}} direction="row" spacing={.5}>
              <BadgeProfile type={1}/>
              {
                holder&&<BadgeProfile type={2} walletAddress={holder} badge={badge}/>
              }
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
            saleType==="auction"&&
            <TimeCountBoxStyle>
              <Typography variant='subtitle2' sx={{fontWeight: 'normal'}}>
                <Countdown date={Date.now() + 25*3600*1000} /> <Typography variant='caption' sx={{color:'text.secondary'}}>left</Typography> ⏰
              </Typography>
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
              <Typography variant="h5" noWrap sx={{flexGrow: 1}}>{title}</Typography>
              <Typography variant="subtitle2" sx={{display: 'flex', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em'}}>
                {
                  saleType==="auction"?
                  "Current Bid":
                  `1/${quantity}`
                }
              </Typography>
            </Stack>
            {/* <Typography variant="body2" display="block" sx={{lineHeight: 1.3}} noWrap>{description}</Typography> */}
            {/* <Typography variant="body2" display="block" sx={{lineHeight: 1.3, color: 'text.secondary'}}>Quantity: 1/{quantity}</Typography> */}
            {
              (type===0||type===1||type===2&&(isListedOwnedByMe)||type===2&&isListedByOthers)&&
              <Typography variant="h5" sx={{color: "origin.main"}} noWrap>
                <Box component="img" src={`/static/${coinTypes[coinType].icon}`} sx={{ width: 18, display: 'inline' }} />
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
              <Button variant="contained" size="small" fullWidth sx={{mt: 1, mb: .5}} onClick={handleSell}>Sell</Button>
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
        <UpdateDlg isOpen={updateOpen} setOpen={setOpenUpdate} {...dlgProps}/>
        <CancelDlg isOpen={cancelOpen} setOpen={setOpenCancel} {...dlgProps}/>
        <DeleteDlg isOpen={deleteOpen} setOpen={setOpenDelete} {...dlgProps}/>
        <TransferDlg isOpen={transferOpen} setOpen={setOpenTransfer} {...dlgProps}/>
        <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance}/>
      </motion.div>
  );
};