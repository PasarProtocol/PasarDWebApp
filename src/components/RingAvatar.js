import {Box} from '@mui/material'
import Jazzicon from './Jazzicon';

export default function RingAvatar(props) {
  const {size, outersx} = props
  return <Box sx={{
    borderRadius: '50%',
    width: size+18,
    height: size+18,
    borderColor: (theme) => theme.palette.origin.main,
    backgroundColor: (theme) => theme.palette.background.paper,
    p: '5px',
    background: (theme)=>
      `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box`,
    border: '4px solid transparent',
    ...outersx
  }}>
    <Jazzicon {...props}/>
  </Box>
}