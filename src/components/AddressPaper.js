import { Paper, Box, Typography } from '@mui/material';

import CopyButton from './CopyButton';
import { reduceHexAddress } from '../utils/common';
// ----------------------------------------------------------------------

export default function AddressPaper(props) {
  const {address, type=''} = props
  let iconName = type
  if(type==='diamond')
    iconName = 'diamond2'
  return <Paper
    sx={{
        border: '1px solid',
        borderColor: 'action.disabledBackground',
        px: 1,
        py: '5px',
        display: 'inline-block'
    }}
  >
    <Typography variant="body2" component='div' sx={{display: 'flex', alignItems: 'center'}}>
      {
        iconName.length>0&&
        <Box component='img' src={`/static/${iconName}.svg`} sx={{width: 18, height: 18, mr: .5}}/>
      }
      {reduceHexAddress(address)}<CopyButton text={address}/>
    </Typography>
  </Paper>
}