import PropTypes from 'prop-types';
// material
import { Grid, Paper, CircularProgress } from '@mui/material';
//
import { Label } from '../../Block';

// ----------------------------------------------------------------------

const style = {
  minHeight: 160,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { m: 1 }
};

// ----------------------------------------------------------------------

ProgressCircular.propTypes = {
  progress: PropTypes.number
};

export default function ProgressCircular({ progress }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Label title="Circular Indeterminate" />
        <Paper variant="outlined" sx={style}>
          <CircularProgress color="inherit" />
          <CircularProgress />
          <CircularProgress color="secondary" />
          <CircularProgress color="info" />
          <CircularProgress color="success" />
          <CircularProgress color="warning" />
          <CircularProgress color="error" />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Label title="Circular determinate" />
        <Paper variant="outlined" sx={style}>
          <CircularProgress color="info" />
          <CircularProgress color="info" variant="determinate" value={25} />
          <CircularProgress color="info" variant="determinate" value={50} />
          <CircularProgress color="info" variant="determinate" value={75} />
          <CircularProgress color="info" variant="determinate" value={100} />
          <CircularProgress color="info" variant="determinate" value={progress} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Label title="Circular Size" />
        <Paper variant="outlined" sx={style}>
          <CircularProgress size={48} color="info" />
          <CircularProgress color="info" />
          <CircularProgress size={32} color="info" />
          <CircularProgress size={24} color="info" />
        </Paper>
      </Grid>
    </Grid>
  );
}
