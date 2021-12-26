import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

export default function DateOrderSelect({ order, onChange }) {
  return (
    <Select
      defaultValue={1}
      value={order}
      onChange={onChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{mx: 1}}
    >
      <MenuItem value={1}>Latest</MenuItem>
      <MenuItem value={2}>Oldest</MenuItem>
    </Select>
  );
}

DateOrderSelect.propTypes = {
  order: PropTypes.number,
  onChange: PropTypes.func,
};
