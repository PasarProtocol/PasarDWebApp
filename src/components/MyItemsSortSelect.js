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
export default function MyItemsSortSelect({ onChange, sx={} }) {
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
      sx={{mr: 1, ...sx}}
      MenuProps={MenuProps}
    >
      <MenuItem value={0}>Latest</MenuItem>
      <MenuItem value={1}>Oldest</MenuItem>
      <MenuItem value={2}>Price: Low to High</MenuItem>
      <MenuItem value={3}>Price: High to Low</MenuItem>
    </Select>
  );
}

MyItemsSortSelect.propTypes = {
  onChange: PropTypes.func,
};
