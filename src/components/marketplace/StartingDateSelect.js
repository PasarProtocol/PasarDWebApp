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
const menuItems = ['Right after listing'];

export default function StartingDateSelect({ selected, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <Select
      variant="standard"
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{
        mr: 1,
        fontSize: 14,
        width: '100%',
        '& .MuiSelect-select': {
          py: 2
        }
      }}
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

StartingDateSelect.propTypes = {
  onChange: PropTypes.func,
  selected: PropTypes.number
};
