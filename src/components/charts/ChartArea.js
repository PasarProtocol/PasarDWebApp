import { useState } from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, Grid, ToggleButton, ToggleButtonGroup, Select, MenuItem } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
//
import BaseOptionChart from './BaseOptionChart';
import StatisticItem from '../explorer/StatisticPanel/StatisticItem'

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: 'series1', data: [31, 40, 28, 51, 42, 109, 100] },
];

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

ChartArea.propTypes = {
  involveLivePanel: PropTypes.bool
};
ChartArea.defaultProps = {
  involveLivePanel: false
};
export default function ChartArea({involveLivePanel}) {
  const [period, setPeriod] = useState('a');
  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z'
      ]
    },
    tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
  });

  const handlePeriod = (event, newPeriod) => {
    setPeriod(newPeriod);
  };
  return (
    <div>
      {
        involveLivePanel&&(
          <Stack direction="row" sx={{mb:4}}>
            <Grid container>
              <Grid item xs={6} sm={3} md={3}>
                <StatisticItem havePlusSymbol={false} title="🖼 ️Collective Assets" index={1}/>
              </Grid>
              <Grid item xs={6} sm={3} md={3}>
                <StatisticItem havePlusSymbol={false} title="📈 Sold" index={2}/>
              </Grid>
              <Grid item xs={6} sm={3} md={3}>
                <StatisticItem havePlusSymbol={false} title="🛒 Purchased" index={3}/>
              </Grid>
              <Grid item xs={6} sm={3} md={3}>
                <StatisticItem havePlusSymbol={false} title="✉️ Transactions" index={4}/>
              </Grid>
            </Grid>
          </Stack>
        )
      }
      <StackStyle>
        <CardHeader title="964 ELA" subheader="Nov 12th, 2021" sx={{p: 0, px: 2}}
          action={
            <Select
              defaultValue={1}
              value={1}
              onChange={()=>{}}
              inputProps={{ 'aria-label': 'Without label' }}
              size="small"
              sx={{mx: 1}}
            >
              <MenuItem value={1}>Royalties Volume</MenuItem>
              <MenuItem value={2}>Sales Volume</MenuItem>
              <MenuItem value={3}>Transaction Volume</MenuItem>
            </Select>
          }
        />
        <div style={{flex:1, textAlign: 'right', paddingRight: 16}}>
          <ToggleButtonGroup value={period} exclusive onChange={handlePeriod}>
            <ToggleButton value="d">1D</ToggleButton>
            <ToggleButton value="w">1W</ToggleButton>
            <ToggleButton value="m">1M</ToggleButton>
            <ToggleButton value="y">1Y</ToggleButton>
            <ToggleButton value="a">All</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </StackStyle>
      <ReactApexChart type="area" series={CHART_DATA} options={chartOptions} height={320} />
    </div>
  )
}
