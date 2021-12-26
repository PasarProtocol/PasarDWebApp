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
  }
}));

// ----------------------------------------------------------------------

export default function AddressDetail() {
  const params = useParams(); // params.collection
  const [transactions, setTransactions] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [isExpanded, setExpandFlag] = React.useState(false);
  const [expanded, setExpandedList] = React.useState([]);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [isLoadingTransactions, setLoadingTransactions] = React.useState(false);
  React.useEffect(async () => {
    setLoadingTransactions(true);
    const resTransactions = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=${page}&pageSize=${showCount}`
    );
    const jsonTransactions = await resTransactions.json();
    setPages(Math.ceil(jsonTransactions.data.total/showCount));
    setTransactions(jsonTransactions.data.result);
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
              {params.transaction}
          </Typography>
          <CopyButton/>
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
                <ChartArea />
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{py: 2}}>
              Collectible Record
              <Select
                defaultValue={1}
                value={1}
                onChange={()=>{}}
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
                sx={{mx: 1}}
              >
                <MenuItem value={1}>All</MenuItem>
                <MenuItem value={2}>Create</MenuItem>
                <MenuItem value={3}>Transfer</MenuItem>
                <MenuItem value={4}>Delete</MenuItem>
              </Select>
              <DateOrderSelect/>
              <FormControlLabel
                control={<CustomSwitch onChange={handleChange}/>}
                label="Show Details"
                labelPlacement="start"
              />
            </Typography>
            <StackStyle sx={{ mb: 2 }}>
              <div style={{flex:1}}>
              <SearchBox sx={{width: 400}} outersx={{textAlign: 'left', flex: 1}} rootsx={{px: '0 !important'}} placeholder="Search record"/>
              </div>
              <Pagination page={page} pages={pages} onChange={setPage} />
            </StackStyle>
            {isLoadingTransactions && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
            <Scrollbar>
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
                                  image: getThumbnail(item.thumbnail),
                                  postedAt: item.createTime*1000,
                                  name: item.name,
                                  tokenIdHex: item.tokenIdHex,
                                  method: 'transfer',
                              }}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          {
                            key%2===0?(
                            <TransactionOrderDetail
                                isAlone={false}
                                item={{
                                    from: item.tokenIdHex,
                                    to: item.tokenIdHex,
                                    tokenIdHex: item.tokenIdHex,
                                    value: item.value!==undefined?item.value:0,
                                    gasfee: (item.royalties / 10 ** 8).toFixed(7),
                                    method: 'transfer',
                                    timestamp: getTime(item.createTime)
                                }}
                            />
                            ):(
                              <TransactionCollectibleDetail
                                item={{
                                    timestamp: getTime(item.createTime),
                                    tokenIdHex: reduceHexAddress(item.tokenIdHex),
                                    gasfee: (item.royalties / 10 ** 8).toFixed(7),
                                    value: item.value!==undefined?item.value:0
                                }}
                            />
                            )
                          }
                          
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                ))}
                </Grid>
            </Scrollbar>
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
