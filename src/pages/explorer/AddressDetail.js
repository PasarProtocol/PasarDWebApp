// material
import React from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Box, Container, Accordion, AccordionSummary, AccordionDetails, Stack, Grid, Paper, Typography, FormControlLabel, Select, MenuItem } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import LoadingWrapper from '../../components/LoadingWrapper';
import { ChartArea } from '../../components/charts';

import SearchBox from '../../components/SearchBox';
import CustomSwitch from '../../components/custom-switch';
import Pagination from '../../components/pagination';
import ShowSelect from '../../components/pagination/ShowSelect';
import TransactionListItem from '../../components/explorer/TransactionList/TransactionListItem'
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail'
import TransactionCollectibleDetail from '../../components/explorer/TransactionList/TransactionCollectibleDetail'
import CopyButton from '../../components/CopyButton';
import DateOrderSelect from '../../components/DateOrderSelect';
import MethodSelect from '../../components/MethodSelect';
import InlineBox from '../../components/InlineBox';
import { reduceHexAddress, getThumbnail, getTime } from '../../utils/common';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(13)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    '& .top-pagination': {
      marginTop: theme.spacing(2)
    }
  }
}));

// ----------------------------------------------------------------------

export default function AddressDetail() {
  const params = useParams(); // params.address
  const [transactions, setTransactions] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [isExpanded, setExpandFlag] = React.useState(false);
  const [expanded, setExpandedList] = React.useState([]);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [isLoadingTransactions, setLoadingTransactions] = React.useState(false);
  React.useEffect(async () => {
    setLoadingTransactions(true);
    // const resTransactions = await fetch(
    //   `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=${page}&pageSize=${showCount}`
    // );
    // const jsonTransactions = await resTransactions.json();
    // setPages(Math.ceil(jsonTransactions.data.total/showCount));
    // setTransactions(jsonTransactions.data.result);
    const tempResultData = [
      {
          "tokenId": "14915194403068196833746829153799665627049561666972622964968910446485405410447",
          "blockNumber": 10177851,
          "timestamp": 1640656811,
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
          "event": "SafeTransferFrom",
          "tHash": "0xb7aefdbeaa410ebfbf6b972ca6ec72d1f9ef3b29b59a04b387453b9a60b59ce8",
          "price": "0",
          "name": "Ph-0317",
          "royalties": "100000"
      },
      {
          "event": "CreateOrderForSale",
          "blockNumber": 10177851,
          "tHash": "0xb7aefdbeaa410ebfbf6b972ca6ec72d1f9ef3b29b59a04b387453b9a60b59ce8",
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x0000000000000000000000000000000000000000",
          "timestamp": "1640656811",
          "price": "44000000000000000000",
          "tokenId": "14915194403068196833746829153799665627049561666972622964968910446485405410447",
          "name": "Ph-0317",
          "royalties": "100000"
      },
      {
          "event": "ChangeOrderPrice",
          "blockNumber": 10177828,
          "tHash": "0x662e2c5832a3e4dd41153b38f510a813c48d135d1ad9bba58b97d2c9052596f5",
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x0000000000000000000000000000000000000000",
          "timestamp": "1640656696",
          "price": "45000000000000000000",
          "tokenId": "62534795764921309540163527794557635251241770123265595950064064877307565893099",
          "name": "Ph-0284",
          "royalties": "100000"
      },
      {
          "event": "ChangeOrderPrice",
          "blockNumber": 10177805,
          "tHash": "0xacd79df3a29ab299b93732ff0e0c4d69a7ef0653990b37cc3d671dc7c16d71ad",
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x0000000000000000000000000000000000000000",
          "timestamp": "1640656581",
          "price": "43000000000000000000",
          "tokenId": "78970562218789131151053820337677590238380683995590093692013476629839727551113",
          "name": "Ph-0315",
          "royalties": "100000"
      },
      {
          "event": "ChangeOrderPrice",
          "blockNumber": 10177790,
          "tHash": "0x0e0201d8fbf194cb2d07723eee7252aad56b4e8760bebf32dad6dc3828b722d3",
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x0000000000000000000000000000000000000000",
          "timestamp": "1640656506",
          "price": "43000000000000000000",
          "tokenId": "53358031920773411236624286508340451595618836494025583935997080035909898546732",
          "name": "Ph-0286",
          "royalties": "100000"
      },
      {
          "event": "BuyOrder",
          "blockNumber": 10177197,
          "tHash": "0xacca821f0d9df6dca0424bdf78c8033e016b10cc11a774d6d16cd8ad7acfeaa0",
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x3eC00aFc29A5b6cd43b822E896b088A6708887cD",
          "timestamp": "1640653541",
          "price": "38000000000000000000",
          "tokenId": "732531932011304851676614555973246397225339121001777097039407768386512682326",
          "name": "Ph-0290",
          "royalties": "100000"
      },
      {
          "tokenId": "732531932011304851676614555973246397225339121001777097039407768386512682326",
          "blockNumber": 10177197,
          "timestamp": 1640653541,
          "from": "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
          "to": "0x3eC00aFc29A5b6cd43b822E896b088A6708887cD",
          "event": "SafeTransferFrom",
          "tHash": "0xacca821f0d9df6dca0424bdf78c8033e016b10cc11a774d6d16cd8ad7acfeaa0",
          "price": "0",
          "name": "Ph-0290",
          "royalties": "100000"
      },
      {
          "tokenId": "732531932011304851676614555973246397225339121001777097039407768386512682326",
          "blockNumber": 10176445,
          "timestamp": 1640649781,
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
          "event": "SafeTransferFrom",
          "tHash": "0xf757cf34ef6ea284455eacddaab5118e766c732f5fdd15c9fad3ba9fb9126f1e",
          "price": "0",
          "name": "Ph-0290",
          "royalties": "100000"
      },
      {
          "event": "CreateOrderForSale",
          "blockNumber": 10176445,
          "tHash": "0xf757cf34ef6ea284455eacddaab5118e766c732f5fdd15c9fad3ba9fb9126f1e",
          "from": "0xe86b91cf9DDA37d0a114e2Dd5C9B0235Da72a469",
          "to": "0x3eC00aFc29A5b6cd43b822E896b088A6708887cD",
          "timestamp": "1640653541",
          "price": "38000000000000000000",
          "tokenId": "732531932011304851676614555973246397225339121001777097039407768386512682326",
          "name": "Ph-0290",
          "royalties": "100000"
      },
      {
          "tokenId": "41505205825358395893198813529176152765172980422762955968434036825281337909148",
          "blockNumber": 10175848,
          "timestamp": 1640646796,
          "from": "0x2964Cb4766B317B9aBc35520C41A2EbE1339a409",
          "to": "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
          "event": "SafeTransferFrom",
          "tHash": "0xc71832ecb5cee3d706d09fb83d00adba13fce1ab643724f9ef653a1eb7f3b39a",
          "price": "0",
          "name": "Elastos Ape #37",
          "royalties": "100000"
      }
    ]
    setTransactions(tempResultData);
    expandAllIf(isExpanded);
    setLoadingTransactions(false);
  }, [page, showCount]);

  const changeShowCount = (event) => {setShowCount(event.target.value)};

  const handleChange = (event) => {
    setExpandFlag(event.target.checked);
    expandAllIf(event.target.checked);
  };
  const expandAllIf = (flag) => {
    if(flag)
      setExpandedList([...Array(transactions.length).keys()]);
    else
      setExpandedList([]);
  }
  const handleAccordClick = (key) => {
    const temp = [...expanded]
    if(temp.includes(key))
      temp.splice(temp.indexOf(key),1)
    else
      temp.push(key)
    setExpandedList(temp)
  }

  return (
    <RootStyle title="Transaction | PASAR">
      <Container maxWidth="lg">
        <Stack sx={{mb: 2, flexDirection: 'row'}}>
          <Typography variant="h4" sx={{ width: "auto" }} noWrap>
              {params.address}
          </Typography>
          <CopyButton text={params.address}/>
        </Stack>
        {isLoadingTransactions && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Accordion
              defaultExpanded={1&&true}
              sx={{
                border: '1px solid',
                borderColor: 'action.disabledBackground',
                boxShadow: (theme) => theme.customShadows.z1
              }}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                <Typography variant="h5">Analytics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChartArea by="address" involveLivePanel={1&&true}/>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Typography component="div" sx={{py: 2}}>
              <Typography variant="h4" sx={{py: 1, pr:1, display: 'inline-block'}}>
                Collectible Record
              </Typography>
              <InlineBox>
                <MethodSelect/>
                <DateOrderSelect/>
              </InlineBox>
              <FormControlLabel
                control={<CustomSwitch onChange={handleChange}/>}
                label="Show Details"
                labelPlacement="start"
                sx={{ml:0}}
              />
            </Typography>
            <StackStyle sx={{ mb: 2 }}>
              <div style={{flex:1}}>
                <SearchBox sx={{width: 400}} outersx={{textAlign: 'left', flex: 1}} rootsx={{px: '0 !important'}} placeholder="Search record"/>
              </div>
              <div className="top-pagination">
                <Pagination page={page} pages={pages} onChange={setPage} />
              </div>
            </StackStyle>
            {isLoadingTransactions && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
            <Grid container spacing={2}>
                {transactions.map((item, key) => (
                    <Grid key={key} item xs={12}>
                      <Accordion 
                        expanded={expanded.includes(key)}
                        onClick={(e) => handleAccordClick(key)}
                        sx={{
                          border: '1px solid',
                          borderColor: 'action.disabledBackground',
                          boxShadow: (theme) => theme.customShadows.z1
                        }}
                      >
                        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
                          <TransactionListItem
                              item={{
                                  image: getThumbnail(item.asset),
                                  postedAt: item.timestamp*1000,
                                  name: item.name,
                                  txHash: item.tHash,
                                  method: item.event,
                              }}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <TransactionOrderDetail
                              isAlone={false}
                              item={item}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                ))}
            </Grid>
            {
              transactions.length>0&&
              <StackStyle sx={{ mt: 2, display: 'block' }}>
                  <Pagination page={page} pages={pages} onChange={setPage}/>
                  <ShowSelect count={showCount} onChange={changeShowCount}/>
              </StackStyle>
            }
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
