import React from 'react';
import PropTypes from 'prop-types';
import * as math from 'mathjs';
import AnimatedNumber from 'react-animated-number';
// material
import { styled } from '@mui/material/styles';
import { Typography, Tooltip, Stack } from '@mui/material';

import VolumeIcon from '../VolumeIcon';
// ----------------------------------------------------------------------
const tooltipText = [
  'Total trading volume',
  'Amount of minted items',
  'Cheapest item on sale',
  'Unique number of owners'
];

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

StatisticItem.propTypes = {
  index: PropTypes.number,
  value: PropTypes.number,
  chainIndex: PropTypes.number,
  title: PropTypes.string,
  children: PropTypes.node
};

export default function StatisticItem(props) {
  const { index, value, chainIndex, title, children } = props;
  const [realData, setRealData] = React.useState(0);
  React.useEffect(() => {
    if (value)
      setTimeout(() => {
        setRealData(value);
      }, 100);
  }, [value]);

  const tooltipTitle = `${tooltipText[index - 1]} from this collection`;
  return (
    <RootStyle index={index}>
      <Tooltip title={tooltipTitle} arrow disableInteractive enterTouchDelay={0}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <VolumeIcon chainIndex={chainIndex} />
            <AnimatedNumber
              component="h2"
              value={realData}
              duration={1000}
              formatValue={(n) => math.round(n, 2).toLocaleString('en')}
              stepPrecision={0}
            />
          </Stack>
          <Typography
            variant="body"
            sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'center', gap: '6px' }}
          >
            {children} {title}
          </Typography>
        </Stack>
      </Tooltip>
    </RootStyle>
  );
}
