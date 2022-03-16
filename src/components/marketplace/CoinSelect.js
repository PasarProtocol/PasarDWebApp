import React, { useState } from "react";
import {Select, Button, Menu, MenuItem, Box} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import PropTypes from 'prop-types';
import {coinTypes} from '../../utils/common'

export default function CoinSelect({ selected, onChange }) {
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };
  const handleSelect = (index) => {
    onChange(index)
    handleClosePopup();
  }
  return (
    <>
      <Button color="inherit" size="small" sx={{px: 1, py: .5}} onClick={openPopupMenu}>
        <Box component="img" src={`/static/${coinTypes[selected].icon}`} sx={{ width: 18, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&selected===0?'invert(1)':'none' }} />
        &nbsp;{coinTypes[selected].name}&nbsp;
        <Icon icon={arrowIosDownwardFill} width={20} height={20}/>
      </Button>
      <Menu 
        keepMounted
        id="simple-menu"
        anchorEl={isOpenPopup}
        onClose={handleClosePopup}
        open={Boolean(isOpenPopup)} 
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {coinTypes.map((coin, index)=>(
          <MenuItem key={index} onClick={()=>{handleSelect(index)}} selected={index===selected}>
            <Box component="img" src={`/static/${coin.icon}`} sx={{ width: 18, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&index===0?'invert(1)':'none' }} />&nbsp;{coin.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

CoinSelect.propTypes = {
  onChange: PropTypes.func,
};
