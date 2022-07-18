import React from 'react';
import * as math from 'mathjs'
import AnimatedNumber from 'react-animated-number';
// material
import { styled } from '@mui/material/styles';
import { Typography, Tooltip, Box, Stack } from '@mui/material';

// ----------------------------------------------------------------------
const tooltipText = ['Total trading volume', 'Amount of minted items', 'Cheapest item on sale', 'Unique number of owners']

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
const VolumeIcon = (props)=>{
  const { marketPlace } = props
  const volumeIconTypes = [
    {icon: 'elastos.svg', style: { filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }},
    {icon: 'ethereum.svg', style: { filter: (theme)=>theme.palette.mode==='light'?'invert(0.8)':'invert(0.2)', width: 16 }}
  ]
  let volumeIcon = null
  if(marketPlace>0)
    volumeIcon = volumeIconTypes[marketPlace-1]
  else if(marketPlace===undefined)
    volumeIcon = null
  else
    [volumeIcon] = volumeIconTypes

  return volumeIcon?
        <Box component="img" src={`/static/${volumeIcon.icon}`} sx={{ width: 18, display: 'inline', verticalAlign: 'middle', ...volumeIcon.style }} />:
        null
}

export default function StatisticItem(props) {
  const { index, value, marketPlace } = props
  const [realData, setRealData] = React.useState(0)
  React.useEffect(()=>{
    if(value)
      setTimeout(()=>{setRealData(value)}, 100)
  }, [value])

  const tooltipTitle = `${tooltipText[index-1]} from this collection`
  return (
    <RootStyle index={index}>
      <Tooltip title={tooltipTitle} arrow disableInteractive enterTouchDelay={0}>
        <Stack spacing={2}>
          <Stack direction='row' spacing={1} justifyContent='center'>
            <VolumeIcon marketPlace={marketPlace}/>
            <AnimatedNumber
                component="h2"
                value={realData}
                duration={1000}
                formatValue={(n) => math.round(n, 2).toLocaleString('en')}
                stepPrecision={0}
            />
          </Stack>
          <Typography variant="body" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {props.children} {props.title}
          </Typography>
        </Stack>
      </Tooltip>
    </RootStyle>
  );
}