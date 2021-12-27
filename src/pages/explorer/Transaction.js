// material
import React from 'react';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, FormControlLabel } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import TransactionListItem from '../../components/explorer/TransactionList/TransactionListItem'
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail'
import TransactionCollectibleDetail from '../../components/explorer/TransactionList/TransactionCollectibleDetail'
import ShowSelect from '../../components/pagination/ShowSelect';
import Pagination from '../../components/pagination';
import LoadingWrapper from '../../components/LoadingWrapper';
import CustomSwitch from '../../components/custom-switch';
import DateOrderSelect from '../../components/DateOrderSelect';
import MethodSelect from '../../components/MethodSelect';
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

export default function Transaction() {
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
        <StackStyle sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{flex:1}}>
                All Transactions
                <MethodSelect/>
                <DateOrderSelect/>
                <FormControlLabel
                  control={<CustomSwitch onChange={handleChange}/>}
                  label="Show Details"
                  labelPlacement="start"
                />
            </Typography>
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
                              tokenIdHex: reduceHexAddress(item.tokenIdHex),
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
            <StackStyle  sx={{ mt: 2, display: 'block' }}>
                <Pagination page={page} pages={pages} onChange={setPage}/>
                <ShowSelect count={showCount} onChange={changeShowCount}/>
            </StackStyle>
        }
      </Container>
    </RootStyle>
  );
}
