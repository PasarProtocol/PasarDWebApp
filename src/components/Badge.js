import PropTypes from 'prop-types';
// material
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Badge.propTypes = {
  name: PropTypes.string
};
const backColor = {"pasar": "#FF5082", "diamond": "#E5E5E5", "user": "#E8EC21", "thumbup": "#25CD7C", "thumbdown": "#D60000", "custom": "#2B86DA"}
export default function Badge({ name }) {
  const src = `/static/badges/${name}.svg`
  const color = backColor[name]
  return (
    <Box 
      component="img"
      alt=""
      src={src}
      sx={{ width: 24, height: 24, backgroundColor: color, borderRadius: 2, p: .5, mr: .5, boxShadow: (theme)=>theme.customShadows.origin }}/>
  );
}
