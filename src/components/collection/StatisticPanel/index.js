import { memo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Grid, Card } from '@mui/material';
import StatisticItem from './StatisticItem';
import { getChainIndexFromChain } from '../../../utils/common';
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
  const { tradeVolume, items, lowestPrice, owners, chain } = props;
  const chainIndex = getChainIndexFromChain(chain);

  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem
            title="📈 Trading Volume"
            index={1}
            value={(tradeVolume ?? 0) / 1e18}
            chainIndex={chainIndex}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🖼 Items" index={2} value={items ?? 0} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🔻 Floor Price" index={3} value={(lowestPrice ?? 0) / 1e18} chainIndex={chainIndex} />
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="💪 Owners" index={4} value={owners ?? 0} />
        </Grid>
      </Grid>
    </RootStyle>
  );
};

StatisticPanel.propTypes = {
  tradeVolume: PropTypes.number,
  items: PropTypes.number,
  lowestPrice: PropTypes.number,
  owners: PropTypes.number,
  chain: PropTypes.string
};

export default memo(StatisticPanel);
