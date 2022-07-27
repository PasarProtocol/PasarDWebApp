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
const menuItems = ['General', 'Art', 'Collectibles', 'Photography', 'Trading Cards', 'Utility', 'Domains']

export default function CategorySelect(props) {
  const { selected, onChange, sx = {} } = props
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
      fullWidth
    >
      {
        menuItems.map((type, i)=><MenuItem key={i} value={type} autoFocus={selected===type}>{type}</MenuItem>)
      }
    </Select>
  )
}

CategorySelect.propTypes = {
  onChange: PropTypes.func,
}