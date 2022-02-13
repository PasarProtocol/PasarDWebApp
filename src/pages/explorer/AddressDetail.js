// material
import React from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { styled } from '@mui/material/styles';
import { Box, Container, Accordion, AccordionSummary, AccordionDetails, Stack, Grid, Paper, Typography, FormControlLabel, Select, MenuItem } from '@mui/material';
// components
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import LoadingWrapper from '../../components/LoadingWrapper';
import { ChartArea } from '../../components/charts';

import PaperRecord from '../../components/PaperRecord';
import SearchBox from '../../components/SearchBox';
import CustomSwitch from '../../components/custom-switch';
import Pagination from '../../components/pagination';
import ShowSelect from '../../components/pagination/ShowSelect';
import TransactionListItem from '../../components/explorer/TransactionList/TransactionListItem'
import TransactionOrderDetail from '../../components/explorer/TransactionList/TransactionOrderDetail'
import CopyButton from '../../components/CopyButton';
import ByToSelect from '../../components/ByToSelect';
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
      marginTop: theme.spacing(2),
      // [theme.breakpoints.down('md')]: {
      //   display: 'flex'
      // }
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
  const [totalCount, setTotalCount] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [methods, setMethods] = React.useState("");
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [byto, setByTo] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingTransactions, setLoadingTransactions] = React.useState(false);
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingTransactions(true);
    const bytoKey = byto===0?"By":"To"
    fetchFrom(`sticker/api/v1/getTranDetailsByWalletAddr?walletAddr=${params.address}&pageNum=${page}&pageSize=${showCount}&method=${methods}&timeOrder=${timeOrder}&performer=${bytoKey}&keyword=${keyword}`, { signal }).then(response => {
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
  }, [page, showCount, methods, byto, timeOrder, keyword, params.address]);

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
  const handleByTo = (selected)=>{
    setPage(1)
    setByTo(selected)
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
                <ChartArea by="address" is4Address={1&&true}/>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Typography component="div" sx={{py: 2}}>
              <Typography variant="h4" sx={{py: 1, pr:1, display: 'inline-block'}}>
                Collectible Record
              </Typography>
              <InlineBox>
                <MethodSelect onChange={handleMethod}/>
                <ByToSelect onChange={handleByTo}/>
                <DateOrderSelect onChange={handleDateOrder}/>
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
                <SearchBox sx={{width: 400}} placeholder="Search record" onChange={setKeyword}/>
                <MHidden width="mdDown">
                  <Typography variant="body2" sx={{ display: 'inline-block', pl: 1 }}>{totalCount.toLocaleString('en')} items</Typography>
                </MHidden>
              </div>
              <div className="top-pagination">
                <Pagination page={page} pages={pages} onChange={setPage} sx={{flex:1, display: 'inline-block'}}/>
                <MHidden width="mdUp">
                  <Typography variant="body2" sx={{ display: 'inline-block', pt: 1, pl: 1 }}>{totalCount.toLocaleString('en')} items</Typography>
                </MHidden>
              </div>
            </StackStyle>
            <Grid container spacing={2}>
                {isLoadingTransactions?(
                  <Grid item xs={12}><LoadingScreen sx={{background: 'transparent'}}/></Grid>
                ):(
                  transactions.map((item, key) => (
                    <Grid key={key} item xs={12}>
                    {
                      item.method&&item.method==="SetApprovalForAll"?
                      <PaperRecord sx={{p:2}}>
                        <TransactionOrderDetail
                            isAlone={1&&true}
                            item={item}
                        />
                      </PaperRecord>:
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
                    }
                    </Grid>
                  ))
                )}
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
