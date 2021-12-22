import { useState } from 'react';
import { merge } from 'lodash';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, Button, ToggleButton, ToggleButtonGroup, Select, MenuItem } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
//
import BaseOptionChart from './BaseOptionChart';

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

export default function ChartArea() {
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
      <StackStyle sx={{ mb: 2 }}>
          <CardHeader title="964 ELA" subheader="Nov 12th, 2021" sx={{p: 0, pl: 2}}
            action={
              <Select
                defaultValue={1}
                value={1}
                onChange={()=>{}}
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
                sx={{mx: 1}}
              >
                <MenuItem value={1}>Transaction Volume</MenuItem>
              </Select>
            }
          />
          <div style={{flex:1, textAlign: 'right'}}>
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
