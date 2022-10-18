import React from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
const categories = ['General', 'Art', 'Collectibles', 'Photography', 'Trading Cards', 'Utility', 'Domains'];

CategorySelect.propTypes = {
  selected: PropTypes.any,
  onChange: PropTypes.func,
  is4filter: PropTypes.bool,
  sx: PropTypes.any
};

export default function CategorySelect(props) {
  const { selected, onChange, is4filter = false, sx = {} } = props;
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  const menuItems = is4filter ? ['All Categories', ...categories] : categories;
  return (
    <Select
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{ mr: 1, ...sx }}
      MenuProps={MenuProps}
      fullWidth={!is4filter}
    >
      {menuItems.map((type, _i) => {
        const value = is4filter ? _i : type;
        return (
          <MenuItem key={_i} value={value} autoFocus={selected === value}>
            {type}
          </MenuItem>
        );
      })}
    </Select>
  );
}

CategorySelect.propTypes = {
  onChange: PropTypes.func
};
