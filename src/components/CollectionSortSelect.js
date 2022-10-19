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
export default function CollectionSortSelect({ onChange, orderType, sortOptions, sx = {} }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <Select
      defaultValue={0}
      value={orderType}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{ ...sx }}
      MenuProps={MenuProps}
    >
      {sortOptions.map((option, _i) => (
        <MenuItem key={_i} value={_i}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}

CollectionSortSelect.propTypes = {
  onChange: PropTypes.func,
  orderType: PropTypes.any,
  sortOptions: PropTypes.any,
  sx: PropTypes.any
};
