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
const categories = ['General', 'Art', 'Collectibles', 'Photography', 'Trading Cards', 'Utility', 'Domains']

export default function CategorySelect(props) {
  const { selected, onChange, is4filter = false, sx = {} } = props
  const handleChange = (event) => {
    onChange(event.target.value);
  }
  const menuItems = is4filter ? ['All Categories', ...categories] : categories
  return (
    <Select
      // defaultValue={0}
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{mr: 1, ...sx}}
      MenuProps={MenuProps}
      fullWidth={!is4filter}
    >
      {
        menuItems.map((type, _i)=>{
          const value = is4filter?_i:type
          return <MenuItem key={_i} value={value} autoFocus={selected===value}>{type}</MenuItem>
        })
      }
    </Select>
  )
}

CategorySelect.propTypes = {
  onChange: PropTypes.func,
}