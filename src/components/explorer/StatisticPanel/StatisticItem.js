import React from 'react';
// material
import AnimatedNumber from 'react-animated-number';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Card, Stack } from '@mui/material';

import { fetchFrom } from '../../../utils/common';
// ----------------------------------------------------------------------
const apikey = ['gettv', 'nftnumber', 'relatednftnum', 'owneraddressnum']
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
  const [realData, setRealData] = React.useState(0);
  const api = apikey[props.index-1];
  
  React.useEffect(async () => {
    if(props.forAddress)
      return
    const resRealData = await fetchFrom(`sticker/api/v1/${api}`)
    const jsonData = await resRealData.json()
    setTimeout(()=>{setRealData(jsonData.data)}, 100)
  }, []);

  return (
    <RootStyle index={props.index}>
        <Stack spacing={2}>
            <AnimatedNumber
                component="h2"
                value={props.forAddress ? props.value: realData}
                duration={1000}
                formatValue={(n) => props.forAddress ? n.toLocaleString('en') : n.toLocaleString('en').concat(' +')}
                stepPrecision={0}
            />
            <Typography variant="body" sx={{ color: 'text.secondary' }}>
                {props.children} {props.title}
            </Typography>
        </Stack>
    </RootStyle>
  );
}

StatisticItem.propTypes = {
    forAddress: PropTypes.bool,
};
StatisticItem.defaultProps = {
    forAddress: false
};