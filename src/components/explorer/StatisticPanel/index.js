// material
import { styled } from '@mui/material/styles';
import { Grid, Card, Box } from '@mui/material';
import StatisticItem from './StatisticItem'
// ----------------------------------------------------------------------
const RootStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4),
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: `${theme.palette.grey[500_32]} !important`,
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  }
}));

export default function StatisticPanel() {
  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="Trading Volume" value="25,000 +" index={1}>
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline', verticalAlign: 'middle' }} />
          </StatisticItem>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🖼 ️Collective Assets" value="1,000 +" index={2}/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="✉️ Transactions" value="2,000 +" index={3}/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="👛 Wallet Address" value="50 +" index={4}/>
        </Grid>
      </Grid>
    </RootStyle>
  );
}