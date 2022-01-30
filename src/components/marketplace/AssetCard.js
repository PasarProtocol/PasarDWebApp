import React from 'react';
import Imgix from "react-imgix";
import { SizeMe } from "react-sizeme";
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";
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
import CardImgBox from '../CardImgBox';

// ----------------------------------------------------------------------

export default function AssetCard(props) {
  const {title="???", description, quantity=1, price=0, isLink, tokenId, type, isOwner, orderId} = props
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [sellOpen, setOpenSell] = React.useState(false);
  const [updateOpen, setOpenUpdate] = React.useState(false);
  const [cancelOpen, setOpenCancel] = React.useState(false);
  const [deleteOpen, setOpenDelete] = React.useState(false);
  const [transferOpen, setOpenTransfer] = React.useState(false);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = (e) => {
    const type = e.target.getAttribute("value")
    switch(type){
      case 'sell':
        setOpenSell(true)
        break;        
      case 'update':
        setOpenUpdate(true)
        break;
      case 'cancel':
        setOpenCancel(true)
        break;
      case 'delete':
        setOpenDelete(true)
        break;
      case 'transfer':
        setOpenTransfer(true)
        break;
      default:
        break;
    }
    setOpenPopup(null);
  };

  return (
      <motion.div
        animate={{ scale: 1 }}
      >
        <PaperRecord sx={{p:2}}>
          <Grid container>
            <Grid item xs={6}>
              <Tooltip title="Collection: Feeds NFT Sticker" arrow disableInteractive placement="top">
                <Box sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black', display: 'flex' }}>
                  <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24 }} />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs={6} align="right">
              {
                type!==0&&
                <IconButton color="inherit" size="small" sx={{p: 0}} onClick={isLink ? openPopupMenu : ()=>{}}>
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
                  type===1&&
                  <div>
                    {
                      isOwner&&
                      <div>
                        <MenuItem value='update' onClick={handleClosePopup}>
                          <LocalOfferOutlinedIcon/>&nbsp;Update Price
                        </MenuItem>
                        <MenuItem value='cancel' onClick={handleClosePopup}>
                          <CancelOutlinedIcon/>&nbsp;Cancel Sale
                        </MenuItem>
                      </div>
                    }
                    <MenuItem onClick={handleClosePopup}>
                      <ShareOutlinedIcon/>&nbsp;Share
                    </MenuItem>
                  </div>
                }
                {
                  type===2&&
                  <div>
                    {
                      isOwner&&
                      <MenuItem value='sell' onClick={handleClosePopup}>
                        <StorefrontIcon/>&nbsp;Sell
                      </MenuItem>
                    }
                    <MenuItem value='transfer' onClick={handleClosePopup}>
                      <SyncAltSharpIcon/>&nbsp;Transfer
                    </MenuItem>
                    {
                      isOwner&&
                      <MenuItem value='delete' onClick={handleClosePopup}>
                        <DeleteOutlineIcon/>&nbsp;Delete
                      </MenuItem>
                    }
                  </div>
                }
                {
                  type===3&&
                  <div>
                    <MenuItem onClick={handleClosePopup}>
                      <ShareOutlinedIcon/>&nbsp;Share
                    </MenuItem>
                  </div>
                }
              </Menu>
            </Grid>
          </Grid>
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
          <Typography variant="h4" noWrap>{title}</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1.3}} noWrap>{description}</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1.3, color: 'text.secondary'}}>Quantity: 1/{quantity}</Typography>
          {
            (type===0||type===1)&&
            <Typography variant="h4" sx={{color: "origin.main"}}>
              <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
              &nbsp;{price} ELA
            </Typography>
          }
          {
            (type===2&&isOwner)&&
            <Button variant="contained" size="small" fullWidth sx={{mt: 1}} onClick={(e)=>{setOpenSell(true)}}>Sell</Button>
          }
          {/* <Stack direction="row">
            <Badge name="diamond"/>
            <Badge name="user"/>
          </Stack> */}
        </PaperRecord>
        <SellDlg isOpen={sellOpen} setOpen={setOpenSell} title={title} tokenId={tokenId}/>
        <UpdateDlg isOpen={updateOpen} setOpen={setOpenUpdate} title={title} orderId={orderId}/>
        <CancelDlg isOpen={cancelOpen} setOpen={setOpenCancel} title={title}/>
        <DeleteDlg isOpen={deleteOpen} setOpen={setOpenDelete} title={title}/>
        <TransferDlg isOpen={transferOpen} setOpen={setOpenTransfer} title={title}/>
      </motion.div>
    // </Link>
  );
};
