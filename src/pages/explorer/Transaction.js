// material
import React from 'react';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, FormControlLabel } from '@mui/material';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import TransactionListItem from '../../components/explorer/TransactionList/TransactionListItem'
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail'
import TransactionCollectibleDetail from '../../components/explorer/TransactionList/TransactionCollectibleDetail'
import ShowSelect from '../../components/pagination/ShowSelect';
import Pagination from '../../components/pagination';
import LoadingWrapper from '../../components/LoadingWrapper';
import CustomSwitch from '../../components/custom-switch';
import DateOrderSelect from '../../components/DateOrderSelect';
import MethodSelect from '../../components/MethodSelect';
import InlineBox from '../../components/InlineBox';
import { fetchFrom } from '../../utils/common';
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

export default function Transaction() {
  const [transactions, setTransactions] = React.useState([]);
  const [isExpanded, setExpandFlag] = React.useState(false);
  const [expanded, setExpandedList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [methods, setMethods] = React.useState("");
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingTransactions, setLoadingTransactions] = React.useState(false);
  React.useEffect(() => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingTransactions(true);
    fetchFrom(`sticker/api/v1/listTrans?pageNum=${page}&pageSize=${showCount}&method=${methods}&timeOrder=${timeOrder}`, { signal }).then(response => {
      response.json().then(jsonTransactions => {
        setTotalCount(jsonTransactions.data.total)
        setPages(Math.ceil(jsonTransactions.data.total/showCount));
        setTransactions(jsonTransactions.data.results);
        setLoadingTransactions(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingTransactions(false);
    });
  }, [page, showCount, methods, timeOrder]);

  React.useEffect(() => {
    expandAllIf(isExpanded);
  }, [transactions]);

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
  const handleMethod = (selected)=>{
    setPage(1)
    setMethods(selected)
  }
  const handleDateOrder = (selected)=>{
    setPage(1)
    setTimeOrder(selected)
  }
  return (
    <RootStyle title="Transaction | PASAR">
      <Container maxWidth="lg">
        <StackStyle sx={{ mb: 2 }}>
            <Typography component="div" sx={{flex:1}}>
                <Typography variant="h4" sx={{pb: 1, pr:1, display: 'inline-block'}}>
                  All Transactions
                </Typography>
                <InlineBox>
                  <MethodSelect onChange={handleMethod}/>
                  <DateOrderSelect onChange={handleDateOrder}/>
                </InlineBox>
                <FormControlLabel
                  control={<CustomSwitch onChange={handleChange}/>}
                  label="Show Details"
                  labelPlacement="start"
                  sx={{ml:0, pr:2}}
                />
                <Typography variant="body2" sx={{ display: 'inline-block' }}>{totalCount.toLocaleString('en')} transactions</Typography>
            </Typography>
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
                        item={item}
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
            <StackStyle  sx={{ mt: 2, display: 'block' }}>
                <Pagination page={page} pages={pages} onChange={setPage}/>
                <ShowSelect count={showCount} onChange={changeShowCount}/>
            </StackStyle>
        }
      </Container>
    </RootStyle>
  );
}
