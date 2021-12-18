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

export default function TextButtons() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Block title="Base" sx={style}>
          <Button color="inherit">Default</Button>
          <Button color="secondary">Secondary</Button>
          <Button>Primary</Button>
          <Button disabled>Disabled</Button>
          <Button>Link</Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Adding Colors" sx={style}>
          <Button color="inherit">Default</Button>
          <Button>Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="info">Info</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button color="error">Error</Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="With Icon & Loading" sx={style}>
          <Button color="error" startIcon={<AlarmIcon />}>
            Icon Left
          </Button>
          <Button color="error" endIcon={<AlarmIcon />}>
            Icon Right
          </Button>
          <LoadingButton loading>Submit</LoadingButton>
          <LoadingButton loading loadingIndicator="Loading...">
            Fetch data
          </LoadingButton>
          <LoadingButton loading loadingPosition="start" startIcon={<AlarmIcon />}>
            Save
          </LoadingButton>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Size" sx={style}>
          <Button color="info" size="small">
            Small
          </Button>
          <Button color="info">Medium</Button>
          <Button color="info" size="large">
            Large
          </Button>
        </Block>
      </Grid>
    </Grid>
  );
}
