// material
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Typography, Tooltip } from '@mui/material';

import { customShadows } from '../theme/shadows';
import {getDiaBalanceDegree} from '../utils/common'
// ----------------------------------------------------------------------

const ColorSet = [
  {background: 'linear-gradient(0deg, #363636 3%, #a6a6a6 100%)', afterBackground: '#9d9d9d', afterShadowColor: '#3a3a3a', name: 'None'},
  {background: 'linear-gradient(0deg, #B37E59 3%, #FFD2B3 100%)', afterBackground: '#F2C7AA', afterShadowColor: '#b5815c', name: 'Bronze'},
  {background: 'linear-gradient(0deg, #B6B6BF 3%, #EDF4FA 100%)', afterBackground: '#DADCE6', afterShadowColor: '#b6b6bf', name: 'Silver'},
  {background: 'linear-gradient(0deg, #FFBB33 3%, #FFEDA6 100%)', afterBackground: '#FFDF80', afterShadowColor: '#f2ba49', name: 'Gold'}
]
export default function DIABadge({ balance, sx }) {
  const src = '/static/badges/diamond.svg'
  const degree = getDiaBalanceDegree(balance)
  const {background, afterBackground, afterShadowColor, name} = ColorSet[degree]
  return (
    <Tooltip title={`${name} Diamond (DIA) token holder`} arrow enterTouchDelay={0}>
      <Box sx={{display: 'inline-flex'}}>
        <Stack
          direction='row'
          sx={{
            width: 26,
            height: 26,
            borderRadius: '100%',
            p: '3px',
            boxShadow: (theme)=>theme.palette.mode==='light'?customShadows.dark.origin:customShadows.light.origin,
            background,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            '&:after': {
              content: "''",
              background: afterBackground,
              boxShadow: `inset 0 1px 1px 0 ${afterShadowColor}`,
              left: 3,
              right: 3,
              top: 3,
              bottom: 3,
              borderRadius: '50%',
              position: 'absolute'
            },
            ...sx
          }}
        >
          <Box 
            draggable = {false}
            component="img"
            alt=""
            src={src}
            sx={{ width: 18, height: 18, zIndex: 1, pt: '3px' }}
          />
        </Stack>
      </Box>
    </Tooltip>
  );
}
