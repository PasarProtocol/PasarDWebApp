import PropTypes from 'prop-types';
import { Box } from '@mui/material';
// ----------------------------------------------------------------------

const CoinTypeLabel = ({ type }) => (
  <Box sx={{ display: 'contents' }}>
    <Box
      draggable={false}
      component="img"
      src={`/static/${type.icon}`}
      sx={{
        width: 18,
        display: 'inline',
        filter: (theme) => (theme.palette.mode === 'dark' && type.name === 'ELA' ? 'invert(1)' : 'none')
      }}
    />
    &nbsp;{type.name}
  </Box>
);
export default CoinTypeLabel;

CoinTypeLabel.propTypes = {
  type: PropTypes.any
};
