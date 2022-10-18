import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Grid, Card } from '@mui/material';
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
}));

StatisticPanel.propTypes = {
  itemCount: PropTypes.number,
  poolRatio: PropTypes.number,
  userCount: PropTypes.number,
  nextDistribution: PropTypes.number
};

export default function StatisticPanel({ itemCount, poolRatio, userCount, nextDistribution }) {
  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🛒 Items Listed" index={1} value={itemCount} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🏊 Pool Ratio" index={2} value={poolRatio} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="💰 Users Rewarded" index={3} value={userCount} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🧱 Next Distribution" index={4} value={nextDistribution} />
        </Grid>
      </Grid>
    </RootStyle>
  );
}
