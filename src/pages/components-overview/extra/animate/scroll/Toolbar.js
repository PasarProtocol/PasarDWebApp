import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import refreshFill from '@iconify/icons-eva/refresh-fill';
// material
import { Paper } from '@mui/material';
// components
import { MIconButton } from '../../../../../components/@material-extend';

// ----------------------------------------------------------------------

Toolbar.propTypes = {
  onRefresh: PropTypes.func,
  sx: PropTypes.string
};

export default function Toolbar({ onRefresh, sx, ...other }) {
  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        ...sx
      }}
      {...other}
    >
      <MIconButton onClick={onRefresh}>
        <Icon icon={refreshFill} width={20} height={20} />
      </MIconButton>
    </Paper>
  );
}
