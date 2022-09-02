import React from 'react';
import PropTypes from 'prop-types';
import * as math from 'mathjs';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import {
  Container, Box, Stack, Grid, Typography, Paper, Divider, Link, Tooltip, Button, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails,
  ToggleButtonGroup, ToggleButton, FormGroup, TextField, Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';

// components
import Page from '../../components/Page';
import TabPanel from '../../components/TabPanel';
import StyledButton from '../../components/signin-dlg/StyledButton';
import StatisticPanel from '../../components/rewards/StatisticPanel'
import { MHidden } from '../../components/@material-extend';
import { callTokenContractMethod, isInAppBrowser, removeLeadingZero } from '../../utils/common'
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
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
const SectionSx = {
  border: '1px solid',
  borderColor: 'action.disabledBackground',
  boxShadow: (theme) => theme.customShadows.z1,
}
const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));
const AccordionStyle = styled(Accordion)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.action.disabledBackground,
  boxShadow: theme.customShadows.z1,
  [theme.breakpoints.up('xl')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    // paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(2)
  },
}));
const EarnedValueStyle = styled(Typography)(({ theme }) => ({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline'
}))
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius / 2,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius / 2,
    },
  },
  '& .MuiToggleButton-root': {
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius / 2
  },
  width: '100%'
}));
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.origin.main,
    color: theme.palette.origin.contrastText
  },
  flexGrow: 1
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.text.primary,
    borderWidth: 1
  },
  '& fieldset': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
}));
const StyledSlider = styled(Slider)(({ theme }) => ({
  // color: 'blue',
  marginTop: 8,
  "& .MuiSlider-thumb": {
    backgroundColor: '#5159ff',
  },
  "& .MuiSlider-track": {
    background: `linear-gradient(90deg, #DB59A0 0%, #6A70FA 100%);`,
    height: 10,
    border: 0
  },
  "& .MuiSlider-rail": {
    color: 'grey',
    height: 10
  }
}));
const PinkLabel = ({ text }) => (<Typography variant="body2" color='origin.main' sx={{ display: 'inline' }}>{text}</Typography>)
const PaperStyle = (props) => (
  <Paper
    sx={{
      ...SectionSx,
      p: '20px',
      ...props.sx
    }}
  >
    {props.children}
  </Paper>
)

const ClaimCard = ({ item, onClick }) => (
  <PaperStyle>
    <Typography variant="h3" align="center">{item.title}</Typography>
    <Typography variant="h5" component="div" align="center" sx={{ pb: 2 }}>
      {item.action} item, earn{' '}
      <Typography variant="h5" color='origin.main' sx={{ display: 'inline' }}>
        PASAR
      </Typography>{' '}
      <Icon icon="eva:info-outline" style={{ marginBottom: -4 }} />
    </Typography>
    <Divider sx={{ mx: '-20px' }} />
    <Box sx={{ maxWidth: 300, py: 4, m: 'auto' }}>
      <Typography variant="h3" component="div">
        <Typography variant="h3" color='origin.main' sx={{ display: 'inline' }}>PASAR</Typography>{' '}earned
      </Typography>
      <EarnedValueStyle variant="h2" sx={{ display: 'inline-flex' }}>
        {item.amount}
      </EarnedValueStyle>
      <Typography variant="body2" color='text.secondary'>{`≈ USD ${item.price}`}</Typography>
      <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
        <div><StyledButton variant="contained" sx={{ mt: 3, width: '100%' }} onClick={onClick}>Claim</StyledButton></div>
      </Tooltip>
    </Box>
  </PaperStyle>
)

ClaimCard.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func
}

const ExternalLink = (props) => {
  const { linkURL, title } = props
  return <Link
    underline="always"
    href={linkURL}
    target="_blank"
    color="text.secondary"
  >
    {title}
  </Link>
}
const AmountProgressType = ['25%', '50%', '75%', 'Max']

export default function Rewards() {
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = React.useState(0);
  const [operAmount, setOperAmount] = React.useState(0);
  const [stakingType, setStakingType] = React.useState('Stake');
  const [amountProgress, setAmountProgress] = React.useState(0);
  const [PASARToUSD, setPASARToUSD] = React.useState(0.01);
  const [miningReward, setMiningReward] = React.useState({
    all: { total: 0, withdrawable: 0, withdrawn: 0 },
    buyer: { total: 0, withdrawable: 0, withdrawn: 0 },
    seller: { total: 0, withdrawable: 0, withdrawn: 0 },
    creator: { total: 0, withdrawable: 0, withdrawn: 0 }
  });
  const [claimItems, setClaimItems] = React.useState([
    { title: "BUYERS", action: "Buy", name: 'buyer', amount: 0, price: 0 },
    { title: "SELLERS", action: "Sell", name: 'seller', amount: 0, price: 0 },
    { title: "CREATORS", action: "Create", name: 'creator', amount: 0, price: 0 }
  ]);
  const [pasarBalance, setPasarBalance] = React.useState(0);
  const [stakingAPR, setStakingAPR] = React.useState(48.48);
  const [stakingState, setStakingState] = React.useState({ currentStaked: 0, rewardWithdrawable: 0, rewardWithdrawn: 0, rewardFeePaid: 0, feeEndTime: 0 });
  const walletConnectWeb3 = new Web3(isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider());

  const handleSwitchTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStakingType = (event, type) => {
    if (type) setStakingType(type);
  };

  const handleProgressBtn = (event) => {
    const progressType = event.target.value
    setAmountProgress(progressType * 25)
    setOperAmount(math.round(pasarBalance * progressType / 4, 4))
  }

  const handleChangeAmount = (event) => {
    let amountValue = event.target.value
    amountValue = removeLeadingZero(amountValue)
    if (amountValue < 0)
      return
    if (amountValue * 1 > pasarBalance)
      return;
    setOperAmount(math.round(amountValue * 1, 4).toString())
  };

  const handleChangeSlider = (event, newValue) => {
    setAmountProgress(newValue);
    setOperAmount(math.round(pasarBalance * newValue / 100, 4))
  };

  React.useEffect(() => {
    const tempProgress = math.round(pasarBalance === 0 ? 0 : operAmount * 100 / pasarBalance, 1)
    setAmountProgress(tempProgress)
  }, [operAmount]);


  React.useEffect(() => {
    const fetchData = async () => {
      const accounts = await walletConnectWeb3.eth.getAccounts();
      if (!accounts.length) return;
      const balance = await callTokenContractMethod(walletConnectWeb3, { contractType: 'token', callType: 'call', methodName: 'balanceOf', account: accounts[0] });
      setPasarBalance(balance);
      if (tabValue === 0) { // rewards page
        const accountRewards = await callTokenContractMethod(walletConnectWeb3, { contractType: 'mining', callType: 'call', methodName: 'accountRewards', account: accounts[0] });
        setMiningReward(accountRewards);
        setClaimItems([
          { title: "BUYERS", action: "Buy", name: "buyer", amount: accountRewards.buyer.withdrawable, price: accountRewards.buyer.withdrawable * PASARToUSD },
          { title: "SELLERS", action: "Sell", name: "seller", amount: accountRewards.seller.withdrawable, price: accountRewards.seller.withdrawable * PASARToUSD },
          { title: "CREATORS", action: "Create", name: "creator", amount: accountRewards.creator.withdrawable, price: accountRewards.creator.withdrawable * PASARToUSD }
        ]);
      }
      else { // staking page
        const stakingInfo = await await callTokenContractMethod(walletConnectWeb3, { contractType: 'staking', callType: 'call', methodName: 'getUserInfo', account: accounts[0] });
        setStakingState(stakingInfo);
      }
    };
    fetchData();
  }, [tabValue]);

  const handleStake = async (amount) => {
    try {
      await callTokenContractMethod(walletConnectWeb3, { contractType: 'staking', callType: 'send', methodName: 'stake', amount });
      enqueueSnackbar('Stake success', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Stake error', { variant: 'error' });
    }
  };

  const handleWithdrawStakingReward = async () => {
    try {
      await callTokenContractMethod(walletConnectWeb3, { contractType: 'staking', callType: 'send', methodName: 'withdraw' });
      enqueueSnackbar('Withdraw success', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Withdraw error', { variant: 'error' });
    }
  };

  const handleWithdrawMiningReward = async (name) => {
    try {
      await callTokenContractMethod(walletConnectWeb3, { contractType: 'mining', callType: 'send', methodName: 'withdrawRewardByName', name });
      enqueueSnackbar('Withdraw success', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Withdraw error', { variant: 'error' });
    }
  };

  return (
    <RootStyle title="Rewards | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{ mb: 3 }}>
          Rewards
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', color: 'text.secondary', mb: 2 }}>
          Earn rewards by just trading, staking and listing. Mining and staking rewards will constitute 40% (40,000,000) and 10% (10,000,000) respectively of the total PASAR token supply.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Box sx={{ width: 200 }}>
            <StyledButton variant='contained' fullWidth sx={{ mb: 1 }}>Get PASAR</StyledButton>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', mb: 1 }} align="center">
              {`1 PASAR ≈ USD ${PASARToUSD}`}
            </Typography>
          </Box>
          <Button
            // to={props.to}
            // component={RouterLink}
            // size="small"
            color="inherit"
            startIcon={<Icon icon="akar-icons:circle-plus" />}
            sx={{ color: 'origin.main', height: 'max-content' }}
          >
            Add to wallet
          </Button>
        </Stack>
        <Stack alignItems="center">
          <Tabs
            value={tabValue}
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleSwitchTab}
            TabIndicatorProps={{
              style: { background: '#FF5082' }
            }}
            TabScrollButtonProps={{
              sx: {
                '&.MuiTabs-scrollButtons': {
                  display: 'inherit',
                  '&.Mui-disabled': {
                    display: 'none'
                  }
                }
              }
            }}
          >
            <Tab label="Mining/Trading" value={0} />
            <Tab label="Staking" value={1} />
          </Tabs>
        </Stack>
        <TabPanel value={tabValue} index={0}>
          <PaperStyle sx={{ position: 'relative', px: { sm: 5, md: 12 }, py: { sm: 2, md: 5 }, mx: { sm: 2, md: 6 } }}>
            <Box>
              <Typography variant="h2" sx={{ verticalAlign: 'middle', display: 'inline-flex' }}>
                Total Mining Rewards&nbsp;
              </Typography>
              <Box
                component="img"
                src='/static/logo-icon-white.svg'
                sx={{
                  width: { xs: 32, sm: 40, lg: 45 },
                  display: 'inline-flex',
                  backgroundColor: 'origin.main',
                  p: { xs: 0.6, sm: 0.9, lg: 1 },
                  verticalAlign: 'middle',
                  borderRadius: '100%'
                }} />
            </Box>
            <Typography variant="body2" component='div' sx={{ lineHeight: 1.1, py: 2 }}>
              Once a buy transaction is completed, the{' '}<PinkLabel text="PASAR" />{' '}mining rewards will be distributed accordingly.
              Mining rewards to earn{' '}<PinkLabel text="PASAR" />{' '}will last 4 years.<br />
              <br />
              Users can claim rewards every day, or accumulate a one-time claim. Rewards never disappear nor expire.
            </Typography>
            <StackStyle sx={{ py: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" component="div"><Typography variant="h3" color='origin.main' sx={{ display: 'inline' }}>PASAR</Typography>{' '}earned</Typography>
                <EarnedValueStyle variant="h2" sx={{ display: 'inline-flex' }}>
                  {miningReward.all.withdrawable}
                </EarnedValueStyle>
                <Typography variant="body2" color='text.secondary'>{`≈ USD ${miningReward.all.total * PASARToUSD}`}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', m: 'auto' }}>
                <Typography variant="body2" align='center' color='text.secondary' sx={{ pb: 2 }}>to collect from 4 mining rewards</Typography>
                <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
                  <div><StyledButton variant="contained" sx={{ minWidth: 150 }} onClick={() => handleWithdrawMiningReward("all")}>Claim All</StyledButton></div>
                </Tooltip>
              </Box>
            </StackStyle>
          </PaperStyle>
          <Typography variant="h2" textAlign="center" my={3}>
            Mining Pool Stats
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="h3">ELA ESC</Typography>
              <Box component="img" src="/static/elastos.svg" sx={{ width: 20, display: 'inline', verticalAlign: 'middle', filter: (theme) => theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} />
            </Stack>
            <StatisticPanel />

            <Stack direction="row" spacing={1}>
              <Typography variant="h3">PASAR</Typography>
              <Box component="img" src="/static/logo-icon.svg" sx={{ width: 20, display: 'inline', verticalAlign: 'middle', filter: (theme) => theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} />
            </Stack>
            <StatisticPanel />

            <Stack direction="row" spacing={1}>
              <Typography variant="h3">Ecosystem</Typography>
              <Box component="img" src="/static/badges/diamond.svg" sx={{ width: 20, display: 'inline', verticalAlign: 'middle', filter: (theme) => theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} />
            </Stack>
            <StatisticPanel />

            <Typography variant="h3">Others</Typography>
            <StatisticPanel />
          </Stack>
          <Typography variant="h2" textAlign="center" my={3}>
            Mining Rewards
          </Typography>
          <Grid container spacing={3}>
            {claimItems.map((item, _i) => (
              <Grid item xs={12} sm={6} md={4} key={_i}>
                <ClaimCard item={item} onClick={() => handleWithdrawMiningReward(item.name)} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AccordionStyle>
            <AccordionDetails>
              <Stack direction="row" alignItems="center" py={2}>
                <Stack flexGrow={1}>
                  <Typography variant="h3">Standard Staking</Typography>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'normal' }}>
                    Stake{' '}
                    <Typography variant="h5" color='origin.main' sx={{ display: 'inline', fontWeight: 'normal' }}>
                      PASAR
                    </Typography>,
                    earn{' '}
                    <Typography variant="h5" color='origin.main' sx={{ display: 'inline', fontWeight: 'normal' }}>
                      PASAR
                    </Typography>
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h5">{stakingAPR}%</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'normal' }} color="text.secondary">
                    APR{' '}<Icon icon="eva:info-outline" style={{ marginBottom: -3 }} />
                  </Typography>
                </Stack>
              </Stack>
            </AccordionDetails>
          </AccordionStyle>
          <AccordionStyle
            defaultExpanded={Boolean(true)}
            sx={{
              borderTop: 0,
              '&.Mui-expanded': {
                borderRadius: 0,
                margin: 0
              }
            }}
          >
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ '& .Mui-expanded': { marginBottom: '0 !important' } }}>
              <Typography variant="h4">Your Stake</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <EarnedValueStyle variant="h2">
                  {stakingState.currentStaked}
                </EarnedValueStyle>
                <Typography variant="body2" color='text.secondary'>{`≈ USD ${stakingState.currentStaked * PASARToUSD}`}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={0}
                    sx={{
                      display: 'inline-flex',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: .5,
                      width: '100%'
                    }}
                  >
                    <StyledToggleButtonGroup size="small" value={stakingType} exclusive onChange={handleStakingType}>
                      <StyledToggleButton value="Stake" onClick={() => {
                        if (operAmount) handleStake(operAmount);
                      }}>Stake</StyledToggleButton>
                      <StyledToggleButton value="Unstake" onClick={() => handleStake(0)}>Unstake</StyledToggleButton>
                    </StyledToggleButtonGroup>
                  </Paper>
                </Grid>
                <MHidden width="mdUp">
                  <Grid item xs={12}>
                    <Stack direction="row" alignItems='center'>
                      <Typography variant='body2'>PASAR in wallet:</Typography>&nbsp;
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {pasarBalance}
                      </EarnedValueStyle>&nbsp;
                      <Typography variant='body2' color="text.secondary">{`≈ USD ${pasarBalance * PASARToUSD}`}</Typography>
                    </Stack>
                  </Grid>
                </MHidden>
                <Grid item xs={12} md={8}>
                  <FormGroup row sx={{ flexWrap: 'nowrap' }}>
                    <StyledTextField
                      type="number"
                      variant="outlined"
                      placeholder="Amount"
                      value={operAmount}
                      onChange={handleChangeAmount}
                      InputProps={{
                        endAdornment: (
                          <Box
                            component="img"
                            src='/static/logo-icon.svg'
                            sx={{
                              width: 24,
                              display: 'inline-flex',
                            }} />
                        ),
                        style: {
                          fontSize: '16pt',
                          fontWeight: 'bold',
                          color: '#FF5082'
                        }
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <StyledButton variant="contained" sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>{stakingType}</StyledButton>
                  </FormGroup>
                  <StyledSlider size='medium' value={amountProgress} step={1} valueLabelDisplay="auto" onChange={handleChangeSlider} />
                  <Typography variant='h6' mb={1}>{amountProgress}%</Typography>
                  <Stack direction="row" spacing={1}>
                    {
                      AmountProgressType.map((progType, _i) => {
                        const btnSx = { flexGrow: 1 }
                        if (amountProgress === (_i + 1) * 25) {
                          btnSx.background = (theme) => theme.palette.origin.main
                          btnSx.color = 'white'
                        }
                        return <Button key={_i} variant="contained" color="inherit" sx={btnSx} value={_i + 1} onClick={handleProgressBtn}>{progType}</Button>
                      })
                    }
                  </Stack>
                </Grid>
                <MHidden width="mdDown">
                  <Grid item sm={4}>
                    <Box textAlign="right">
                      <Typography variant='body1'>PASAR in wallet:</Typography>
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {pasarBalance}
                      </EarnedValueStyle>
                      <Typography variant='body1' color="text.secondary">{`≈ USD ${pasarBalance * PASARToUSD}`}</Typography>
                    </Box>
                  </Grid>
                </MHidden>
              </Grid>
            </AccordionDetails>
          </AccordionStyle>
          <AccordionStyle
            defaultExpanded={Boolean(true)}
            sx={{
              borderTop: 0,
              '&.Mui-expanded': {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                margin: 0
              }
            }}
          >
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ '& .Mui-expanded': { marginBottom: '0 !important' } }}>
              <Typography variant="h4">Rewards</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <EarnedValueStyle variant="h2">
                  {stakingState.rewardWithdrawable}
                </EarnedValueStyle>
                <Typography variant="body2" color='text.secondary'>{`≈ USD ${stakingState.rewardWithdrawable * PASARToUSD}`}</Typography>
              </Box>
              <Grid container spacing={2}>
                <MHidden width="smUp">
                  <Grid item xs={12}>
                    <Stack direction="row" alignItems='center'>
                      <Typography variant='body2'>Received so far:</Typography>&nbsp;
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {stakingState.rewardWithdrawn}
                      </EarnedValueStyle>&nbsp;
                      <Typography variant='body2' color="text.secondary">{`≈ USD ${stakingState.rewardWithdrawn * PASARToUSD}`}</Typography>
                    </Stack>
                  </Grid>
                </MHidden>
                <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'end' }}>
                  <StyledButton variant="contained" sx={{ width: 200 }} onClick={handleWithdrawStakingReward}>Claim</StyledButton>
                </Grid>
                <MHidden width="smDown">
                  <Grid item sm={4}>
                    <Box textAlign="right">
                      <Typography variant='body1'>Received so far:</Typography>
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {stakingState.rewardWithdrawn}
                      </EarnedValueStyle>
                      <Typography variant='body1' color="text.secondary">{`≈ USD ${stakingState.rewardWithdrawn * PASARToUSD}`}</Typography>
                    </Box>
                  </Grid>
                </MHidden>
              </Grid>
            </AccordionDetails>
          </AccordionStyle>
        </TabPanel>
      </Container>
    </RootStyle>
  );
}