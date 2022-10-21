import { memo } from 'react';
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
  maxWidth: 900,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

const StatisticPanel = (props) => {
  const { floorPrice = 0, totalCount = 0, totalOwner = 0, totalPrice = 0, marketPlace } = props;
  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="📈 Trading Volume" index={1} value={totalPrice} marketPlace={marketPlace} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🖼 Items" index={2} value={totalCount} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🔻 Floor Price" index={3} value={floorPrice} marketPlace={marketPlace} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="💪 Owners" index={4} value={totalOwner} />
        </Grid>
      </Grid>
    </RootStyle>
  );
};

StatisticPanel.propTypes = {
  floorPrice: PropTypes.number,
  totalCount: PropTypes.number,
  totalOwner: PropTypes.number,
  totalPrice: PropTypes.number,
  marketPlace: PropTypes.number
};

export default memo(StatisticPanel);
