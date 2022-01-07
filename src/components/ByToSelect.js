import React, { useState } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

export default function ByToSelect({ onChange }) {
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
      sx={{ml: 1}}
    >
      <MenuItem value={0}>By</MenuItem>
      <MenuItem value={1}>To</MenuItem>
    </Select>
  );
}

ByToSelect.propTypes = {
  onChange: PropTypes.func,
};
