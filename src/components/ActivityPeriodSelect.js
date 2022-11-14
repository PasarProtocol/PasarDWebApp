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
  { index: 0, name: 'Last 7 days', value: 7 },
  { index: 1, name: 'Last 14 days', value: 14 },
  { index: 2, name: 'Last 30 days', value: 30 },
  { index: 3, name: 'Last 60 days', value: 60 },
  { index: 4, name: 'Last 90 days', value: 90 },
  { index: 5, name: 'Last year', value: 365 },
  { index: 6, name: 'All time', value: 0 }
];

export default function ActivityPeriodSelect({ selected, onChange, sx = {} }) {
  const handleChange = (event) => {
    const index = event.target.value;
    onChange({ index, value: menuItems[index].value });
  };
  return (
    <Select
      value={selected.index}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{ mr: 1, ...sx }}
      MenuProps={MenuProps}
    >
      {menuItems.map((item, i) => (
        <MenuItem key={i} value={i} autoFocus={selected.index === i}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
}

ActivityPeriodSelect.propTypes = {
  selected: PropTypes.object,
  onChange: PropTypes.func,
  sx: PropTypes.any
};
