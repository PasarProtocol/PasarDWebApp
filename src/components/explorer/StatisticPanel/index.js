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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

export default function StatisticPanel() {
  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="Trading Volume" index={1}>
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline', verticalAlign: 'middle' }} />
          </StatisticItem>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🖼 Collectibles" index={2}/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="✉️ Transactions" index={3}/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="💪 Owners" index={4}/>
        </Grid>
      </Grid>
    </RootStyle>
  );
}