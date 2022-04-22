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
  maxWidth: 900,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

export default function StatisticPanel({address}) {
  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="Trading Volume" index={1} address={address} field="total">
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline', verticalAlign: 'middle', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
          </StatisticItem>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🖼 ️Items" index={2} address={address} field="total"/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🔻 Floor Price" index={3} address={address} field="price"/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="💪 Owners" index={4} address={address} field="total"/>
        </Grid>
      </Grid>
    </RootStyle>
  );
}