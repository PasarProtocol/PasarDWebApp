import AlarmIcon from '@mui/icons-material/Alarm';
// material
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import { Block } from '../../Block';

// ----------------------------------------------------------------------

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' }
};

export default function OutlinedButtons() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Block title="Base" sx={style}>
          <Button variant="outlined" color="inherit">
            Default
          </Button>
          <Button variant="outlined">Primary</Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined" disabled>
            Disabled
          </Button>
          <Button variant="outlined">Link</Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Adding Colors" sx={style}>
          <Button variant="outlined" color="inherit">
            Default
          </Button>
          <Button variant="outlined">Primary</Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined" color="info">
            Info
          </Button>
          <Button variant="outlined" color="success">
            Success
          </Button>
          <Button variant="outlined" color="warning">
            Warning
          </Button>
          <Button variant="outlined" color="error">
            Error
          </Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="With Icon & Loading" sx={style}>
          <Button variant="outlined" color="error" startIcon={<AlarmIcon />}>
            Icon Left
          </Button>
          <Button variant="outlined" color="error" endIcon={<AlarmIcon />}>
            Icon Right
          </Button>
          <LoadingButton loading variant="outlined">
            Submit
          </LoadingButton>
          <LoadingButton loading loadingIndicator="Loading..." variant="outlined">
            Fetch data
          </LoadingButton>
          <LoadingButton loading loadingPosition="start" startIcon={<AlarmIcon />} variant="outlined">
            Save
          </LoadingButton>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Size" sx={style}>
          <Button variant="outlined" color="info" size="small">
            Small
          </Button>
          <Button variant="outlined" color="info">
            Medium
          </Button>
          <Button variant="outlined" color="info" size="large">
            Large
          </Button>
        </Block>
      </Grid>
    </Grid>
  );
}
