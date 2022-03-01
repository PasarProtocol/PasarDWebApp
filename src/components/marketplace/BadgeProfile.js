import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Menu, Popover } from '@mui/material';
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
  const {type} = props
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    if (isMobile && event.type === 'mouseenter') return;
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box
        onClick={handlePopoverOpen}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{ width: 26, height: 26, borderRadius: 2, p: .5, backgroundColor: 'black', display: 'flex' }}
      >
        {
          type===1&&
          <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24 }} />
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
          {
            type===1&&
            <Box sx={{...style}}>
              <Box sx={{ backgroundColor: 'black', borderRadius: '100%', width: 60, height: 60, display: 'flex', justifyContent: 'center' }}>
                <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 35 }} />
              </Box>
            </Box>
          }
          <Typography variant='h5' sx={{ pt: 2 }}>Feeds NFT Sticker</Typography>
          <Typography variant='subtitle2' sx={{fontWeight: 'normal', fontSize: '0.925em'}}>0x651s...shslf</Typography>
          <Typography variant='subtitle2' sx={{fontWeight: 'normal', color: 'text.secondary', pt: 2, lineHeight: 1, fontSize: '0.925em'}}>Feeds default<br/>collection.</Typography>
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