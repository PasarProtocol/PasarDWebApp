import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import * as math from 'mathjs';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack, Grid, ToggleButton, ToggleButtonGroup, Select, MenuItem } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
//
import BaseOptionChart from './BaseOptionChart';
import LoadingScreen from '../LoadingScreen';
import StatisticItem from '../explorer/StatisticPanel/StatisticItem'
import useSettings from '../../hooks/useSettings';
import { dateRangeBeforeDays, fetchFrom } from '../../utils/common';

// ----------------------------------------------------------------------

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

ChartArea.propTypes = {
  is4Address: PropTypes.bool
};
ChartArea.defaultProps = {
  is4Address: false
};
const getUTCdate = (date)=>{
  const piecesDate = new Date(date).toUTCString().split(" ");
  const [wd, d, m, y] = piecesDate;
  return [m, d, y].join("-");
}
export default function ChartArea({by, is4Address}) {
  const params = useParams(); // params.address
  const location = useLocation();
  const { tokenId, baseToken } = location.state || {}
  const { themeMode } = useSettings();
  const [period, setPeriod] = useState('a');
  const [volumeType, setType] = useState(by==="address"?1:0);
  const [volumeList, setVolumeList] = useState([]);
  const [chartValueArray, setChartValueArray] = useState([]);
  const [statisData, setStatisData] = useState([0,0,0,0]);
  const [clickedDataPoint, setDataPoint] = useState([0,'']);
  const [isLoadingStatisData, setLoadingStatisData] = useState(false);
  const [isLoadingVolumeChart, setLoadingVolumeChart] = useState(true);
  const [controller, setAbortController] = useState(new AbortController());
  const baseOptionChart = BaseOptionChart()
  const mergeChartOption = (dates)=>
    merge(baseOptionChart, {
      xaxis: {
        type: 'datetime',
        categories: dates,
        labels: {
          datetimeUTC: false
        },
      },
      chart: {
        events: {
          click: (event, chartContext, config) => {
            const pointIndex = config.dataPointIndex;
            const pointDate = config.config.xaxis.categories[pointIndex];
            setDataPoint([config.config.series[0].data[pointIndex], getUTCdate(pointDate)]);
          }
        }
      },
      tooltip: { x: { format: (period!=='d'&&period!==null)?'dd/MM/yy':'dd/MM/yy HH:mm' }, theme: themeMode }
    })
  const [optionDates, setOptionDates] = useState([]);
  const [chartOptions, setChartOptions] = useState(mergeChartOption([]));
  
  useEffect(() => {
    setChartOptions(mergeChartOption(optionDates))
  }, [optionDates, period, themeMode]);

  
  useEffect(async () => {
    if(by!=="address")
      return
    setLoadingStatisData(true)

    const resRealData = await fetchFrom(`api/v2/sticker/getStastisDataByWalletAddr/${params.address}`)
    const jsonData = await resRealData.json()
    const statisData = [jsonData.data.assets, jsonData.data.sold, jsonData.data.purchased, jsonData.data.transactions]
    setStatisData(statisData)
    setLoadingStatisData(false)
  }, [params.address]);

  useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingVolumeChart(true);
    let suburl = '';
    if(by==="collectible")
      suburl = `getNftPriceByTokenId/${tokenId}/${baseToken}`
    else if(by==="address")
      suburl = `getTotalRoyaltyandTotalSaleByWalletAddr/${params.address}?type=${volumeType}`
    fetchFrom(`api/v2/sticker/${suburl}`, { signal }).then(response => {
      response.json().then(jsonVolume => {
        if(jsonVolume.data)
          setVolumeList(jsonVolume.data);
        setLoadingVolumeChart(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingVolumeChart(false);
    });
  }, [volumeType, params.address]);
  
  useEffect(() => {
    if(!isLoadingVolumeChart)
      updateChart(period, volumeList);
  }, [isLoadingVolumeChart, volumeList]);
  
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
        days = 2;
        break;
      default:
        days = 2;
        break;
    }
    const dates = dateRangeBeforeDays(days)
    const tempValueArray = Array(dates.length).fill(0)
    volumeList.forEach(item=>{
      const splitDate = item.onlyDate.split(" ")
      let seekDate = splitDate[0]
      if(period==='d' || period===null)
        seekDate = splitDate.length>1?`${splitDate[0]} ${splitDate[1]}:00`:`${splitDate[0]} 00:00`
      const indexOfDate = dates.indexOf(seekDate);
      const value = item.price!==undefined?item.price:item.value;
      if(indexOfDate>=0)
        tempValueArray[indexOfDate] = math.round(tempValueArray[indexOfDate]+math.round(value/10**18, 4), 4);
    })
    setOptionDates(dates)
    // setChartOptions(mergeChartOption(dates))
    setChartValueArray(tempValueArray)
    setDataPoint([tempValueArray[0], getUTCdate(dates[0])]);
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
        is4Address&&(
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
                  <StatisticItem forAddress={1&&true} title="🔨 Created" index={1} value={statisData[0]}/>
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
        <CardHeader title={`${clickedDataPoint[0]} ELA`} subheader={clickedDataPoint[1]}
          sx={{
            p: 0,
            px: 2,
            '& .css-sgoict-MuiCardHeader-action': {
              mt: 0
            }
          }}
          action={
            <Select
              defaultValue={0}
              value={volumeType}
              onChange={handleType}
              inputProps={{ 'aria-label': 'Without label' }}
              size="small"
              sx={{mx: 1, '&.Mui-focused fieldset': (theme)=>theme.palette.mode==='dark'?{borderColor: '#919eab52 !important'}:{}}}
            >
              {
                by==="collectible"?
                <MenuItem value={0}>Price</MenuItem>:
                <MenuItem value={0}>Total Royalties</MenuItem>
              }
              {
                by==="address"&&
                <MenuItem value={1}>Total Sales</MenuItem>
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
