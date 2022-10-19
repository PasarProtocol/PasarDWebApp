import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  variant: 'menu'
};
const menuItems = [
  'Latest: Listed',
  'Latest: Created',
  'Oldest: Listed',
  'Oldest: Created',
  'Price: Low to High',
  'Price: High to Low',
  'Auction Ending Soon'
];

export default function AssetSortSelect({ selected, onChange, sx = {} }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <Select
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{ mr: 1, ...sx }}
      MenuProps={MenuProps}
    >
      {menuItems.map((type, i) => (
        <MenuItem key={i} value={i} autoFocus={selected === i}>
          {type}
        </MenuItem>
      ))}
    </Select>
  );
}

AssetSortSelect.propTypes = {
  selected: PropTypes.number,
  onChange: PropTypes.func,
  sx: PropTypes.any
};
