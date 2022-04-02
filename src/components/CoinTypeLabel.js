// material
import { Box } from '@mui/material';

import { coinTypes } from '../utils/common';
// ----------------------------------------------------------------------

const CoinTypeLabel = ({type})=>(
  <Box sx={{display: 'contents'}}>
    <Box draggable={false} component="img" src={`/static/${coinTypes[type].icon}`} sx={{ width: 18, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&type===0?'invert(1)':'none' }} />&nbsp;{coinTypes[type].name}
  </Box>
)
export default CoinTypeLabel