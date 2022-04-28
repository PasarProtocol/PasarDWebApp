import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Typography, Menu, Popover, Popper, Tooltip, Link, Fade, SvgIcon } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BoltIcon from '@mui/icons-material/Bolt';
import { Icon } from '@iconify/react';

import Badge from '../Badge';
import Jazzicon from '../Jazzicon';
import { reduceHexAddress, getDidInfoFromAddress, collectionTypes } from '../../utils/common';
import { stickerContract as STICKER_ADDRESS } from '../../config';
// ----------------------------------------------------------------------

const AvatarBoxStyle = {
  width: 70,
  height: 70,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '100%',
  background: (theme)=>
    `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box`,    
  border: '2px solid transparent'
}

const DescriptionStyle = {
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  display: '-webkit-box !important',
  fontWeight: 'normal',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word'
}
export default function BadgeProfile(props) {
  const {type, walletAddress, badge, collection={}, reservePriceFlag=false, hasBuynow=false} = props
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [didInfo, setDidInfo] = useState({name: '', description: ''});

  useEffect(()=>{
    let isMounted = true;
    if(walletAddress)
      getDidInfoFromAddress(walletAddress)
        .then((info) => {
          if(isMounted)
            setDidInfo({'name': info.name || '', 'description': info.description || ''})
        })
    return () => { isMounted = false };
  }, [walletAddress])
  const handlePopoverOpen = (event) => {
    if (isMobile && event.type === 'mouseenter') return;
    setAnchorEl(event.currentTarget)
    setOpen(true);
  };
  const handlePopoverClose = () => {
    setOpen(false);
  };

  const {avatar, token} = collection
  let {name, description} = collection
  let dispAddress = reduceHexAddress(token)
  if(type===2){
    name = didInfo.name || reduceHexAddress(walletAddress)
    dispAddress = didInfo.name?reduceHexAddress(walletAddress):''
    description = didInfo.description
  }

  const badgeAction = type>=3?{}:{
    onClick: handlePopoverOpen,
    onMouseEnter: handlePopoverOpen,
    onMouseLeave: handlePopoverClose
  }
  
  return (
    <>
      <Box {...badgeAction}>
        {
          type===1&&
          <>
            {
              avatar&&avatar.startsWith('/static')?
              <Box sx={{ width: 26, height: 26, borderRadius: 2, p: .5, backgroundColor: 'black', display: 'flex' }}>
                <Box draggable = {false} component="img" src={avatar} sx={{ width: 24 }} />
              </Box>:

              <Box sx={{ width: 26, height: 26, borderRadius: 2, backgroundColor: 'black', display: 'flex', overflow: 'hidden' }}>
                <Box draggable = {false} component="img" src={avatar} sx={{ width: 26 }} />
              </Box>
            }
          </>
        }
        {
          type===2&&
          <Jazzicon address={walletAddress} size={26} sx={{mr: 0}}/>
        }
        {
          type===3&&
          <Tooltip title={`Reserve Price ${reservePriceFlag?'Met':'Not Met'}`} arrow enterTouchDelay={0}>
            <Box sx={{ width: 26, height: 26, borderRadius: 2, p: '5px', backgroundColor: reservePriceFlag?'#7CB342':'#D60000', display: 'flex' }}>
              <SvgIcon sx={{fontSize: 18, color:'success.contrastText'}}>
                <ShoppingCartIcon/>
              </SvgIcon>
            </Box>
          </Tooltip>
        }
        {
          type===4&&
          <Tooltip title="Has Buy Now" arrow enterTouchDelay={0}>
            <Box sx={{ width: 26, height: 26, borderRadius: 2, p: '2px', backgroundColor: '#F6D31B', display: 'flex' }}>
              <SvgIcon sx={{fontSize: 22, color:'success.contrastText'}}>
                <BoltIcon/>
              </SvgIcon>
            </Box>
          </Tooltip>
        }
      </Box>
      <Popper
        open={open}
        anchorEl={anchorEl}
        onMouseEnter={()=>{setOpen(true)}}
        onMouseLeave={()=>{setOpen(false)}}
        placement="bottom-start"
        transition
      >
        {
          ({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Stack sx={{minWidth: 180, p: 2, alignItems: 'center', borderRadius: 1, boxShadow: (theme) => theme.customShadows.z12, background: (theme) => theme.palette.background.paper}}>
                <Box sx={{...AvatarBoxStyle}}>
                  {
                    type===1&&
                    <Link to={`/collection/detail/${token}`} component={RouterLink} color='text.primary'>
                      <Box sx={{ backgroundColor: 'black', borderRadius: '100%', width: 60, height: 60, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                        <Box draggable = {false} component="img" src={avatar} sx={{ width: avatar&&avatar.startsWith('/static')?35:60 }} />
                      </Box>
                    </Link>
                  }
                  {
                    type===2&&
                    <Link to={`/profile/others/${walletAddress}`} component={RouterLink} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Jazzicon
                        address={walletAddress}
                        size={60}
                        sx={{mr: 0}}
                      />
                    </Link>
                  }
                </Box>
                {
                  type===1?
                  <Link to={`/collection/detail/${token}`} component={RouterLink} color='text.primary'>
                    <Typography variant='h5' sx={{ pt: 2 }}>{name}</Typography>
                  </Link>:

                  <Link to={`/profile/others/${walletAddress}`} component={RouterLink} color='text.primary'>
                    <Typography variant='h5' sx={{ pt: 2 }}>{name}</Typography>
                  </Link>
                }
                {
                  dispAddress&&(
                    type===1?
                    <Typography variant='subtitle2' sx={{fontWeight: 'normal', display: 'flex', alignItems: 'center'}}>
                      <Icon icon="teenyicons:contract-outline" width="14px" style={{marginRight: 4}}/>{dispAddress}
                    </Typography>:

                    <Link to={`/profile/others/${walletAddress}`} component={RouterLink} color='text.primary'>
                      <Typography variant='subtitle2' sx={{fontWeight: 'normal', fontSize: '0.925em'}}>{dispAddress}</Typography>
                    </Link>
                  )
                }
                {
                  description&&
                  <Typography variant='subtitle2' sx={{fontWeight: 'normal', color: 'text.secondary', pt: 2, lineHeight: 1, fontSize: '0.925em', maxWidth: 270, ...DescriptionStyle}}>{description}</Typography>
                }
                {
                  type===2&&
                  <Stack spacing={.5} direction="row" sx={{justifyContent: 'center', pt: (badge.dia||badge.kyc)?2:0}}>
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
                }
              </Stack>
            </Fade>
          )
        }
      </Popper>
      {/* <Menu
        // keepMounted
        id="simple-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        MenuListProps={{ onMouseLeave: handlePopoverClose }}
        hideBackdrop={Boolean(true)}
      >123
      </Menu> */}
      {/* <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
          textAlign: 'center'
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        // disableRestoreFocus
      >
        123
      </Popover> */}
    </>
  )
}