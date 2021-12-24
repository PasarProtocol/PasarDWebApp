// material
import { styled } from '@mui/material/styles';
import { Grid, Card, Box } from '@mui/material';
import AnimatedNumber from 'react-animated-number';
import StatisticItem from './StatisticItem';

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
  // borderWidth: 1,
  // borderStyle: 'solid',
  // borderColor: `${theme.palette.grey[500_32]} !important`,
  // boxShadow: 'none',
}));

export default function StatisticPanel() {
  function plusSign(x) {
    return x;
  }

  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem
            title="Trading Volume"
            value={
              <AnimatedNumber
                component="text"
                value={25000}
                style={{
                  transition: '0.8s ease-out'
                }}
                duration={1000}
                formatValue={(n) => n.toFixed(0).toLocaleString('en') + plusSign('+')}
              />
            }
            index={1}
          >
            <Box
              component="img"
              src="/static/elastos.svg"
              sx={{ width: 18, display: 'inline', verticalAlign: 'middle' }}
            />
          </StatisticItem>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem
            title="🖼 ️Collective Assets"
            value={
              <AnimatedNumber
                component="text"
                value={1000}
                style={{
                  transition: '0.8s ease-out'
                }}
                duration={1000}
                formatValue={(n) => n.toFixed(0).toLocaleString('en') + plusSign('+')}
              />
            }
            index={2}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem
            title="✉️ Transactions"
            value={
              <AnimatedNumber
                component="text"
                value={2000}
                style={{
                  transition: '0.8s ease-out'
                }}
                duration={1000}
                formatValue={(n) => n.toFixed(0).toLocaleString('en') + plusSign('+')}
              />
            }
            index={3}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem
            title="👛 Wallet Addresses"
            value={
              <AnimatedNumber
                component="text"
                value={50}
                style={{
                  transition: '0.8s ease-out'
                }}
                duration={1000}
                formatValue={(n) => n.toLocaleString('en') + plusSign('+')}
              />
            }
            index={4}
          />
        </Grid>
      </Grid>
    </RootStyle>
  );
}
