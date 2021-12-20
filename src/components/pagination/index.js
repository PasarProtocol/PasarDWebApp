import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';

const ArrowButton = styled(Button)(({ theme }) => ({
  minWidth: 20,
  padding: '6px 8px',
  margin: theme.spacing(.7)
}));

export default function Pagination({ pages, page, onChange }) {
  return (
    <div>
      <Button
        variant="contained"
        style={{textTransform: 'none'}}
        onClick={() => {
          onChange(1);
        }}
        disabled={page === 1}
      >
        First
      </Button>
      <ArrowButton
        variant="contained"
        onClick={() => {
          onChange(page - 1);
        }}
        disabled={page === 1}
      >
        <ArrowBackIosNewIcon/>
      </ArrowButton>
      <Button
        variant="contained"
        style={{textTransform: 'none'}}
        disabled
      >
        Page {page} of {pages}
      </Button>
      <ArrowButton
        variant="contained"
        onClick={() => {
          onChange(page + 1);
        }}
        disabled={page === pages}
      >
        <ArrowForwardIosIcon/>
      </ArrowButton>
      <Button
        variant="contained"
        style={{textTransform: 'none'}}
        onClick={() => {
          onChange(pages);
        }}
        disabled={page === pages}
      >
        Last
      </Button>
    </div>
  );
}

Pagination.propTypes = {
  pages: PropTypes.number,
  page: PropTypes.number,
  onChange: PropTypes.func,
};
