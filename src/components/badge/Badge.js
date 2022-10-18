import PropTypes from 'prop-types';
// material
import { Stack, Box, Typography } from '@mui/material';
import { customShadows } from '../../theme/shadows';
// ----------------------------------------------------------------------

const backColor = {
  pasar: '#FF5082',
  diamond: '#E5E5E5',
  user: '#E8EC21',
  kyc: 'transparent',
  thumbup: '#25CD7C',
  thumbdown: '#D60000',
  custom: '#2B86DA'
};

Badge.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  sx: PropTypes.any
};

export default function Badge({ name, value = '', sx }) {
  const src = `/static/badges/${name}.svg`;
  const color = backColor[name];
  const containerSx =
    name === 'kyc'
      ? { height: '100%', maxHeight: '2rem', maxWidth: '2rem' }
      : {
          p: value.length ? '5px 10px' : '3px',
          boxShadow: (theme) =>
            theme.palette.mode === 'light' ? customShadows.dark.origin : customShadows.light.origin
        };
  const imgSx = name === 'kyc' ? { height: '100%' } : { width: value.length ? 16 : 20, height: value.length ? 16 : 20 };
  return (
    <Stack
      direction="row"
      sx={{
        height: 26,
        backgroundColor: color,
        borderRadius: '100%',
        alignItems: 'center',
        ...containerSx,
        ...sx
      }}
    >
      <Box draggable={false} component="img" alt="" src={src} sx={imgSx} />
      {value.length > 0 && (
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'white', pl: 0.5 }}>
          {value}
        </Typography>
      )}
    </Stack>
  );
}
