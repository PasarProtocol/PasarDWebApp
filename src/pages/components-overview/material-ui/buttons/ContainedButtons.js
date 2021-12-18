// material
import AlarmIcon from '@mui/icons-material/Alarm';
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

export default function ContainedButtons() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Block title="Base" sx={style}>
          <Button variant="contained" color="inherit">
            Default
          </Button>
          <Button variant="contained">Primary</Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="contained" disabled>
            Disabled
          </Button>
          <Button variant="contained">Link</Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Adding Colors" sx={style}>
          <Button variant="contained" color="inherit">
            Default
          </Button>
          <Button variant="contained">Primary</Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="contained" color="info">
            Info
          </Button>
          <Button variant="contained" color="success">
            Success
          </Button>
          <Button variant="contained" color="warning">
            Warning
          </Button>
          <Button variant="contained" color="error">
            Error
          </Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="With Icon & Loading" sx={style}>
          <Button variant="contained" color="error" startIcon={<AlarmIcon />}>
            Icon Left
          </Button>
          <Button variant="contained" color="error" endIcon={<AlarmIcon />}>
            Icon Right
          </Button>
          <LoadingButton loading variant="contained">
            Submit
          </LoadingButton>
          <LoadingButton loading loadingIndicator="Loading..." variant="contained">
            Fetch data
          </LoadingButton>
          <LoadingButton loading loadingPosition="start" startIcon={<AlarmIcon />} variant="contained">
            Save
          </LoadingButton>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Size" sx={style}>
          <Button variant="contained" color="info" size="small">
            Small
          </Button>
          <Button variant="contained" color="info">
            Medium
          </Button>
          <Button variant="contained" color="info" size="large">
            Large
          </Button>
        </Block>
      </Grid>
    </Grid>
  );
}
