import React from 'react';
// material
import AnimatedNumber from 'react-animated-number';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Card, Stack } from '@mui/material';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme, index }) => {
  let sm = {};
  if(index%2===0)
    sm.borderRight = 0
  else if(index===1||index===2)
    sm.marginBottom = 24
  else sm = {}
  return {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    borderRight: index===4?0:'1px solid',
    borderColor: `${theme.palette.grey[500_32]} !important`,
    [theme.breakpoints.down('sm')]: sm
  }
});
export default function StatisticItem(props) {
  const { index, value } = props
  const [realData, setRealData] = React.useState(0)
  React.useEffect(()=>{
    if(value)
      setTimeout(()=>{setRealData(value)}, 500)
  }, [value])

  return (
    <RootStyle index={index}>
        <Stack spacing={2}>
            <AnimatedNumber
                component="h2"
                value={realData}
                duration={1000}
                formatValue={(n) => n.toLocaleString('en')}
                stepPrecision={0}
            />
            <Typography variant="body" sx={{ color: 'text.secondary' }}>
                {props.children} {props.title}
            </Typography>
        </Stack>
    </RootStyle>
  );
}