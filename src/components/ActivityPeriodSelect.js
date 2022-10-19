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
  'Last 7 days',
  'Last 14 days',
  'Last 30 days',
  'Last 60 days',
  'Last 90 days',
  'Last year',
  'All time'
];

export default function ActivityPeriodSelect({ selected, onChange, sx = {} }) {
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

ActivityPeriodSelect.propTypes = {
  selected: PropTypes.number,
  onChange: PropTypes.func,
  sx: PropTypes.any
};
