import React, { useState } from "react";
import { Select, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { chainTypes } from '../utils/common'

const MenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left"
  },
  variant: "menu"
}
const menuItems = [
  {name: 'All Blockchains', icon: 'blockchain.svg', color: 'black'}, 
  {...chainTypes[0], name: 'Elastos Smart Chain'}, 
  {...chainTypes[1]}
]

export default function ChainSelect({ selected, onChange, sx={} }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  }
  return (
    <Select
      // defaultValue={0}
      value={selected}
      onChange={handleChange}
      size="small"
      inputProps={{
        'aria-label': 'Without label',
        sx: {
          display: 'flex',
          alignItems: 'center'
        }
      }}
      sx={{ mr: 1, ...sx }}
      MenuProps={MenuProps}
    >
      {
        menuItems.map((type, i)=>(
          <MenuItem key={i} value={i} autoFocus={selected===i}>
            <Box sx={{borderRadius: '100%', overflow: 'hidden', mr: 1}}>
              <Box
                component="img" 
                src={`/static/${type.icon}`} 
                draggable = {false}
                sx={{
                  width: 25,
                  height: 25,
                  background: type.color, 
                  p: '6px',
                }}
              />
            </Box>
            {type.name}
          </MenuItem>
        ))
      }
    </Select>
  )
}

ChainSelect.propTypes = {
  onChange: PropTypes.func,
}