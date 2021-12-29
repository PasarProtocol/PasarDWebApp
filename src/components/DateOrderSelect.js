import React, { useState } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

export default function DateOrderSelect({ onChange }) {
  const [selected, setSelected] = useState(-1);
  const handleChange = (event) => {
    setSelected(event.target.value);
    onChange(event.target.value);
  };
  return (
    <Select
      defaultValue={1}
      value={selected}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'Without label' }}
      size="small"
      sx={{mx: 1}}
    >
      <MenuItem value={-1}>Latest</MenuItem>
      <MenuItem value={1}>Oldest</MenuItem>
    </Select>
  );
}

DateOrderSelect.propTypes = {
  order: PropTypes.number,
  onChange: PropTypes.func,
};
