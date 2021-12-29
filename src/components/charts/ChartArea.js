import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, Grid, ToggleButton, ToggleButtonGroup, Select, MenuItem } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
//
import BaseOptionChart from './BaseOptionChart';
import LoadingScreen from '../LoadingScreen';
import StatisticItem from '../explorer/StatisticPanel/StatisticItem'
import { dateRangeBeforeDays } from '../../utils/common';

// ----------------------------------------------------------------------

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
export default function ChartArea({by, involveLivePanel}) {
  const params = useParams();
  const [period, setPeriod] = useState('a');
  const [volumeType, setType] = useState(0);
  const [volumeList, setVolumeList] = useState([]);
  const [chartValueArray, setChartValueArray] = useState([]);
  const [statisData, setStatisData] = useState([0,0,0,0]);
  const [isLoadingStatisData, setLoadingStatisData] = useState(false);
  const [isLoadingVolumeChart, setLoadingVolumeChart] = useState(true);
  const [controller, setAbortController] = useState(new AbortController());
  const baseOptionChart = BaseOptionChart()
  const mergeChartOption = (dates)=>
    merge(baseOptionChart, {
      xaxis: {
        type: 'datetime',
        categories: dates
      },
      tooltip: { x: { format: 'dd/MM/yy HH:mm' } }
    });
  const [chartOptions, setChartOptions] = useState(mergeChartOption([]));
  
  useEffect(async () => {
    if(by!=="address")
      return
    setLoadingStatisData(true)

    const resRealData = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getStastisDataByWalletAddr?walletAddr=${params.address}`
    )
    const jsonData = await resRealData.json()
    const statisData = [jsonData.data.assets, jsonData.data.sold, jsonData.data.purchased, jsonData.data.transactions]
    setStatisData(statisData)
    setLoadingStatisData(false)
  }, []);

  useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingVolumeChart(true);
    let suburl = '';
    if(by==="collectible")
      suburl = `getTranVolumeByTokenId?tokenId=${params.collection}&type=${volumeType}`
    else if(by==="address")
      suburl = `getTranvolumeTotalRoyaltySaleVolumeByWalletAddr?walletAddr=${params.address}&type=${volumeType}`
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/${suburl}`, { signal }).then(response => {
      response.json().then(jsonVolume => {
        setVolumeList(jsonVolume.data);
        setLoadingVolumeChart(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingVolumeChart(false);
    });
  }, [volumeType]);
  
  useEffect(() => {
    updateChart(period, volumeList);
  }, [volumeList]);
  
  const updateChart = (period, volumeList) => {
    let days = 0;
    switch(period){
      case 'a':
      case 'y':
        days = 365;
        break;
      case 'm':
        days = 30;
        break;
      case 'w':
        days = 7;
        break;
      case 'd':
        days = 1;
        break;
      default:
        days = 1;
        break;
    }
    const dates = dateRangeBeforeDays(days)
    const tempValueArray = Array(days).fill(0)
    volumeList.forEach(item=>{
      const indexOfDate = dates.indexOf(item.onlyDate);
      if(indexOfDate>=0)
        tempValueArray[indexOfDate] = parseFloat((item.price/10**18).toFixed(7));
    })
    setChartOptions(mergeChartOption(dates))
    setChartValueArray(tempValueArray)
  };

  const handlePeriod = (event, newPeriod) => {
    setPeriod(newPeriod);
    updateChart(newPeriod, volumeList);
  };
  const handleType = (event) => {
    setType(event.target.value);
  };
  return (
    <div>
      {
        involveLivePanel&&(
          <Stack direction="row" sx={{mb:4}}>
            {
              isLoadingStatisData?
              <Grid container>
                <Grid item xs={12}>
                  <LoadingScreen sx={{background: 'transparent'}}/>
                </Grid>
              </Grid>:
              <Grid container>
                <Grid item xs={6} sm={3} md={3}>
                  <StatisticItem forAddress={1&&true} title="🖼 ️Collective Assets" index={1} value={statisData[0]}/>
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <StatisticItem forAddress={1&&true} title="📈 Sold" index={2} value={statisData[1]}/>
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <StatisticItem forAddress={1&&true} title="🛒 Purchased" index={3} value={statisData[2]}/>
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <StatisticItem forAddress={1&&true} title="✉️ Transactions" index={4} value={statisData[3]}/>
                </Grid>
              </Grid>
            }
          </Stack>
        )
      }
      <StackStyle>
        <CardHeader title="964 ELA" subheader="Nov 12th, 2021" sx={{p: 0, px: 2}}
          action={
            <Select
              defaultValue={0}
              value={volumeType}
              onChange={handleType}
              inputProps={{ 'aria-label': 'Without label' }}
              size="small"
              sx={{mx: 1}}
            >
              <MenuItem value={0}>Transaction Volume</MenuItem>
              <MenuItem value={1}>Royalties Volume</MenuItem>
              {
                by==="address"&&
                <MenuItem value={2}>Sales Volume</MenuItem>
              }
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
      {
        !isLoadingStatisData&&isLoadingVolumeChart?
        (<Grid container>
          <Grid item xs={12}>
            <LoadingScreen sx={{background: 'transparent'}}/>
          </Grid>
        </Grid>):
        <ReactApexChart type="area" series={[{ name: 'volume', data: chartValueArray }]} options={chartOptions} height={320} />
      }
    </div>
  )
}
