import PropTypes from 'prop-types';
// material
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

Badge.propTypes = {
  name: PropTypes.string
};
const backColor = {"pasar": "#FF5082", "diamond": "#E5E5E5", "user": "#E8EC21", "thumbup": "#25CD7C", "thumbdown": "#D60000", "custom": "#2B86DA"}
export default function Badge({ name, value="", sx }) {
  const src = `/static/badges/${name}.svg`
  const color = backColor[name]
  return (
    <Stack
      direction='row'
      sx={{
        height: 26,
        backgroundColor: color,
        borderRadius: '100%',
        p: value.length?'5px 10px':'3px',
        boxShadow: (theme)=>theme.customShadows.origin,
        ...sx
      }}
    >
      <Box 
        draggable = {false}
        component="img"
        alt=""
        src={src}
        sx={{ width: value.length?16:20, height: value.length?16:20 }}
      />
      {
        value.length>0 && <Typography variant="body2" sx={{display: 'flex', alignItems: 'center', color: 'white', pl: .5}}>{value}</Typography>
      }
    </Stack>
  );
}
