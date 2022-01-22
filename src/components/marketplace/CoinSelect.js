import React, { useState } from "react";
import {Select, Button, Menu, MenuItem, Box} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import PropTypes from 'prop-types';

export default function CoinSelect({ onChange }) {
  const coins = [{icon: 'elastos.svg', name: 'ELA'}]
  const [selected, setSelected] = useState(0);
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };
  return (
    <>
      <Button color="inherit" size="small" sx={{px: 1, py: .5}} onClick={openPopupMenu}>
        <Box component="img" src={`/static/${coins[selected].icon}`} sx={{ width: 18, display: 'inline' }} />&nbsp;{coins[selected].name}
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
        {coins.map((coin, index)=>(
          <MenuItem key={index} onClick={()=>{handleClosePopup(); setSelected(index)}}>
            <Box component="img" src={`/static/${coin.icon}`} sx={{ width: 18, display: 'inline' }} />&nbsp;{coin.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

CoinSelect.propTypes = {
  onChange: PropTypes.func,
};
