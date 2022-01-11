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
};
export default function AssetSortSelect({ onChange }) {
  const [selected, setSelected] = useState(0);
  const handleChange = (event) => {
    setSelected(event.target.value);
    onChange(event.target.value);
  };
  return (
    <Select
      defaultValue={0}
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{mr: 1}}
      MenuProps={MenuProps}
    >
      <MenuItem value={0}>Latest: Listed</MenuItem>
      <MenuItem value={1}>Latest: Created</MenuItem>
      <MenuItem value={2}>Oldest: Listed</MenuItem>
      <MenuItem value={3}>Oldest: Created</MenuItem>
      <MenuItem value={4}>Price: Low to High</MenuItem>
      <MenuItem value={5}>Price: High to Low</MenuItem>
      <MenuItem value={6}>Auction Ending Soon</MenuItem>
    </Select>
  );
}

AssetSortSelect.propTypes = {
  onChange: PropTypes.func,
};
