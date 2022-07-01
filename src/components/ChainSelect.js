import React, { useState } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

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
const menuItems = ['All blockchains', 'Elastos Smart Chain', 'Ethereum']

export default function ChainSelect({ selected, onChange, sx={} }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  }
  return (
    <Select
      // defaultValue={0}
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{mr: 1, ...sx}}
      MenuProps={MenuProps}
    >
      {
        menuItems.map((type, i)=><MenuItem key={i} value={i} autoFocus={selected===i}>{type}</MenuItem>)
      }
    </Select>
  )
}

ChainSelect.propTypes = {
  onChange: PropTypes.func,
}