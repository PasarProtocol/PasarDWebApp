import React from 'react';
import * as math from 'mathjs'
import AnimatedNumber from 'react-animated-number';
// material
import PropTypes from 'prop-types';
import { Typography, Tooltip, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import { fetchFrom } from '../../../utils/common';
// ----------------------------------------------------------------------
const apikey = ['gettv', 'nftnumber', 'relatednftnum', 'owneraddressnum']
const tooltipText = ['Total trading volume', 'Total amount of minted items', 'Total number of transactions', 'Total unique number of owners']

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
  const { index, forAddress } = props
  const [realData, setRealData] = React.useState(0);
  const api = apikey[index-1];
  
  React.useEffect(async () => {
    if(forAddress)
      return
    const resRealData = await fetchFrom(`api/v2/sticker/${api}`)
    const jsonData = await resRealData.json()
    setTimeout(()=>{setRealData(jsonData.data || 0)}, 100)
  }, []);

  let tooltipTitle = ""
  if(!forAddress)
    tooltipTitle = `${tooltipText[index-1]} from all collections`
  return (
    <RootStyle index={index}>
        <Tooltip title={tooltipTitle} arrow disableInteractive enterTouchDelay={0}>
            <Stack spacing={2}>
                <Stack direction='row' spacing={1} justifyContent='center'>
                  {
                    !forAddress && index===1 &&
                    <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline', verticalAlign: 'middle', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
                  }
                  <AnimatedNumber
                      component="h2"
                      value={forAddress ? props.value: realData}
                      duration={1000}
                      formatValue={(n) => math.round(n, 2).toLocaleString('en')}
                      stepPrecision={0}
                  />
                </Stack>
                <Typography variant="body" sx={{ color: 'text.secondary' }}>
                    {props.children} {props.title}
                </Typography>
            </Stack>
        </Tooltip>
    </RootStyle>
  );
}

StatisticItem.propTypes = {
    forAddress: PropTypes.bool,
};
StatisticItem.defaultProps = {
    forAddress: false
};