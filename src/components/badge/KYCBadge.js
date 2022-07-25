// material
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function KYCBadge(props) {
  const { size='normal', sx } = props
  const src = `/static/badges/kyc.svg`
  const containerSx = size==='large' ? { height: '100%', maxHeight: '2rem', maxWidth: '2rem' } : {}
  const imgSx = size==='large' ? { height: '100%' } : { width: 20, height: 20 }
  return (
    <Stack
      direction='row'
      sx={{
        height: 26,
        backgroundColor: 'transparent',
        borderRadius: '100%',
        alignItems: 'center',
        ...containerSx,
        ...sx
      }}
    >
      <Box 
        draggable = {false}
        component="img"
        alt=""
        src={src}
        sx={imgSx}
      />
    </Stack>
  );
}
