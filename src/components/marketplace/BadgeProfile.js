import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Menu, Popover, Tooltip } from '@mui/material';

import Badge from '../Badge';
import Jazzicon from '../Jazzicon';
import { reduceHexAddress, getDidInfoFromAddress } from '../../utils/common';
import { stickerContract as STICKER_ADDRESS } from '../../config';
// ----------------------------------------------------------------------

const style = {
  width: 70,
  height: 70,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '100%',
  background:
    'linear-gradient(#fff, #fff) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box',
  border: '2px solid transparent'
}
export default function BadgeProfile(props) {
  const {type, walletAddress, badge} = props
  const [anchorEl, setAnchorEl] = useState(null);
  const [didInfo, setDidInfo] = useState({name: '', description: ''});

  useEffect(()=>{
    if(walletAddress)
      getDidInfoFromAddress(walletAddress)
        .then((info) => {
          setDidInfo({'name': info.name || '', 'description': info.description || ''})
        })
  }, [walletAddress])
  const handlePopoverOpen = (event) => {
    if (isMobile && event.type === 'mouseenter') return;
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  let title = "Feeds NFT Sticker"
  let dispAddress = reduceHexAddress(STICKER_ADDRESS)
  let description = 'Feeds default collection.'
  if(type===2){
    title = didInfo.name || reduceHexAddress(walletAddress)
    dispAddress = didInfo.name?reduceHexAddress(walletAddress):''
    description = didInfo.description
  }
  return (
    <>
      <Box
        onClick={handlePopoverOpen}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {
          type===1&&
          <Box sx={{ width: 26, height: 26, borderRadius: 2, p: .5, backgroundColor: 'black', display: 'flex' }}>
            <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24 }} />
          </Box>
        }
        {
          type===2&&
          <Jazzicon address={walletAddress} size={26} sx={{mr: 0}}/>
        }
      </Box>
      <Popover
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
        disableRestoreFocus
      >
        <Stack sx={{minWidth: 180, p: 2, alignItems: 'center'}}>
          <Box sx={{...style}}>
            {
              type===1&&
              <Box sx={{ backgroundColor: 'black', borderRadius: '100%', width: 60, height: 60, display: 'flex', justifyContent: 'center' }}>
                <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 35 }} />
              </Box>
            }
            {
              type===2&&
              <Jazzicon
                address={walletAddress}
                size={60}
                sx={{mr: 0}}
              />
            }
          </Box>
          <Typography variant='h5' sx={{ pt: 2 }}>{title}</Typography>
          {
            dispAddress&&
            <Typography variant='subtitle2' sx={{fontWeight: 'normal', fontSize: '0.925em'}}>{dispAddress}</Typography>
          }
          {
            description&&
            <Typography variant='subtitle2' sx={{fontWeight: 'normal', color: 'text.secondary', pt: 2, lineHeight: 1, fontSize: '0.925em'}}>{description}</Typography>
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
      </Popover>
      {/* <Menu
        keepMounted
        id="simple-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        MenuListProps={{ onMouseLeave: handlePopoverClose }}
      >
        <Box sx={{ px: 2, py: '6px' }}>
          aa
        </Box>
      </Menu> */}
    </>
  )
}