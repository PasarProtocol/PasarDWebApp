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
export default function CollectionSortSelect({ onChange, sx={} }) {
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
      <MenuItem value={2}>Trading Volume: Low to High</MenuItem>
      <MenuItem value={3}>Trading Volume: High to Low</MenuItem>
      <MenuItem value={4}>Number of Item: Low to High</MenuItem>
      <MenuItem value={5}>Number of Item: High to Low</MenuItem>
      <MenuItem value={6}>Floor Price: Low to High</MenuItem>
      <MenuItem value={7}>Floor Price: High to Low</MenuItem>
      <MenuItem value={8}>Number of Owner: Low to High</MenuItem>
      <MenuItem value={9}>Number of Owner: High to Low</MenuItem>
      <MenuItem value={10}>Diamond (DIA) Holdings: High to Low</MenuItem>
    </Select>
  );
}

CollectionSortSelect.propTypes = {
  onChange: PropTypes.func,
};
