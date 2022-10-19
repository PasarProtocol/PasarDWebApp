import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" alt="" src="/static/logo-icon.svg" sx={{ width: 40, height: 40, ...sx }} />;
}
