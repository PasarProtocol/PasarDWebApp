import React from 'react';
import PropTypes from 'prop-types';
import * as math from 'mathjs';
import AnimatedNumber from 'react-animated-number';
// material
import { Typography, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme, index }) => {
  let sm = {};
  if (index % 2 === 0) sm.borderRight = 0;
  else if (index === 1 || index === 2) sm.marginBottom = 24;
  else sm = {};
  return {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    borderRight: index === 4 ? 0 : '1px solid',
    borderColor: `${theme.palette.grey[500_32]} !important`,
    [theme.breakpoints.down('sm')]: sm
  };
});
const TokenValueStyle = styled('h2')({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline'
});

StatisticItem.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  value: PropTypes.number,
  children: PropTypes.node
};

export default function StatisticItem({ index, title, value, children }) {
  return (
    <RootStyle index={index}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} justifyContent="center">
          {index === 4 && (
            <Box
              component="img"
              src="/static/logo-icon.svg"
              sx={{ width: 18, display: 'inline', verticalAlign: 'middle' }}
            />
          )}
          <AnimatedNumber
            component={index !== 4 ? 'h2' : TokenValueStyle}
            value={value}
            duration={1000}
            formatValue={(n) => `${math.round(n, 2).toLocaleString('en')}${index === 2 ? '%' : ''}`}
            stepPrecision={0}
          />
        </Stack>
        <Typography variant="body" sx={{ color: 'text.secondary' }}>
          {children} {title}
        </Typography>
      </Stack>
    </RootStyle>
  );
}
