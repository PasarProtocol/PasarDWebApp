import { Box } from '@mui/material';

export default function VolumeIcon(props) {
  const { marketPlace } = props
  const volumeIconTypes = [
    {icon: 'elastos.svg', style: { filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }},
    {icon: 'ethereum.svg', style: { filter: (theme)=>theme.palette.mode==='light'?'invert(0.8)':'invert(0.2)', width: 16 }},
    {icon: 'erc20/FSN.svg', style: { width: 16 }}
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