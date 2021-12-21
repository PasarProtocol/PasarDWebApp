import React from 'react';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

const DivStyle = styled('div')(({ theme }) => ({
  flex: 1,
  marginTop: theme.spacing(1)
}));
export default function ShowSelect({ showCount, onChange }) {
  return (
    <DivStyle>
      <span>Show</span>
      <Select
        defaultValue={10}
        value={showCount}
        onChange={onChange}
        inputProps={{ 'aria-label': 'Without label' }}
        size="small"
        sx={{mx: 1}}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
      <span>Records</span>
    </DivStyle>
  );
}

ShowSelect.propTypes = {
  showCount: PropTypes.number,
  onChange: PropTypes.func,
};
