import React from 'react';
import PropTypes from 'prop-types';
import * as math from 'mathjs';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import {
  Container,
  Box,
  Stack,
  Grid,
  Typography,
  Paper,
  Divider,
  Tooltip,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
  TextField,
  Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';

// components
import Page from '../../components/Page';
import TabPanel from '../../components/TabPanel';
import StyledButton from '../../components/signin-dlg/StyledButton';
import StatisticPanel from '../../components/rewards/StatisticPanel';
import { MHidden } from '../../components/@material-extend';
import {
  addTokenToMM,
  callTokenContractMethod,
  fetchAPIFrom,
  getERC20TokenPrice,
  getWalletAccounts,
  removeLeadingZero
} from '../../utils/common';
import useSignin from '../../hooks/useSignin';
import {
  blankAddress,
  pasarERC20Contract as PASAR_TOKEN_ADDRESS,
  pasarStakingContract as STAKING_CONTRACT_ADDRESS
} from '../../config';
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
  boxShadow: (theme) => theme.customShadows.z1
};
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
    paddingRight: theme.spacing(2)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}));
const EarnedValueStyle = styled(Typography)({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline'
});
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius / 2
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius / 2
    }
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
  }
}));
const StyledSlider = styled(Slider)({
  marginTop: 8,
  '& .MuiSlider-thumb': {
    backgroundColor: '#5159ff'
  },
  '& .MuiSlider-track': {
    background: `linear-gradient(90deg, #DB59A0 0%, #6A70FA 100%);`,
    height: 10,
    border: 0
  },
  '& .MuiSlider-rail': {
    color: 'grey',
    height: 10
  }
});
const PinkLabel = ({ text }) => (
  <Typography variant="body2" color="origin.main" sx={{ display: 'inline' }}>
    {text}
  </Typography>
);
PinkLabel.propTypes = {
  text: PropTypes.string
};
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
);
PaperStyle.propTypes = {
  sx: PropTypes.any,
  children: PropTypes.node
};

const ClaimCard = ({ item, onClick }) => (
  <PaperStyle>
    <Typography variant="h3" align="center">
      {item.title}
    </Typography>
    <Typography variant="h5" component="div" align="center" sx={{ pb: 2 }}>
      {item.action} item, earn{' '}
      <Typography variant="h5" color="origin.main" sx={{ display: 'inline' }}>
        PASAR
      </Typography>{' '}
      <Icon icon="eva:info-outline" style={{ marginBottom: -4 }} />
    </Typography>
    <Divider sx={{ mx: '-20px' }} />
    <Box sx={{ maxWidth: 300, py: 4, m: 'auto' }}>
      <Typography variant="h3" component="div">
        <Typography variant="h3" color="origin.main" sx={{ display: 'inline' }}>
          PASAR
        </Typography>{' '}
        earned
      </Typography>
      <EarnedValueStyle variant="h2" sx={{ display: 'inline-flex' }}>
        {item.amount}
      </EarnedValueStyle>
      <Typography variant="body2" color="text.secondary">{`≈ USD ${item.price}`}</Typography>
      <StyledButton variant="contained" sx={{ mt: 3, width: '100%' }} onClick={onClick}>
        Claim
      </StyledButton>
    </Box>
  </PaperStyle>
);

ClaimCard.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func
};

const AmountProgressType = ['25%', '50%', '75%', 'Max'];

export default function Rewards() {
  const { enqueueSnackbar } = useSnackbar();
  const { setOpenSigninEssentialDlg } = useSignin();
  const [tabValue, setTabValue] = React.useState(0);
  const [stakingType, setStakingType] = React.useState('Stake');
  const [operAmount, setOperAmount] = React.useState(0);
  const [amountProgress, setAmountProgress] = React.useState(0);
  const [stakingTotalAmount, setStakingTotalAmount] = React.useState(0);
  const [stakingSettleAmount, setStakingSettleAmount] = React.useState(0);
  const cachedPool = JSON.parse(sessionStorage.getItem('REWARD_POOL'));
  const cachedUser = JSON.parse(sessionStorage.getItem('REWARD_USER'));
  const [PASARToUSD, setPASARToUSD] = React.useState(0.01);
  const [miningReward, setMiningReward] = React.useState(
    cachedUser?.mining
      ? cachedUser.mining
      : {
          all: { total: 0, withdrawable: 0, withdrawn: 0 },
          buyer: { total: 0, withdrawable: 0, withdrawn: 0 },
          seller: { total: 0, withdrawable: 0, withdrawn: 0 },
          creator: { total: 0, withdrawable: 0, withdrawn: 0 }
        }
  );
  const [claimItems, setClaimItems] = React.useState(
    cachedUser?.claim
      ? cachedUser.claim
      : [
          { title: 'BUYERS', action: 'Buy', name: 'buyer', amount: 0, price: 0 },
          { title: 'SELLERS', action: 'Sell', name: 'seller', amount: 0, price: 0 },
          { title: 'CREATORS', action: 'Create', name: 'creator', amount: 0, price: 0 }
        ]
  );
  const [listedItemCnt, setListedItemCnt] = React.useState(
    cachedPool?.item ? cachedPool.item : { native: 0, pasar: 0, eco: 0, other: 0 }
  );
  const [miningPoolRatio, setMiningPoolRatio] = React.useState(
    cachedPool?.pool ? cachedPool.pool : { native: 0, pasar: 0, eco: 0, other: 0 }
  );
  const [userRewarded, setUserRewarded] = React.useState(
    cachedPool?.user ? cachedPool.user : { elaCount: 0, pasarCount: 0, ecoCount: 0, otherCount: 0 }
  );
  const [nextDistribution, setNextDistribution] = React.useState(
    cachedPool?.next ? cachedPool.next : { native: 0, pasar: 0, eco: 0, other: 0 }
  );
  const [pasarBalance, setPasarBalance] = React.useState(0);
  const [stakingAPR, setStakingAPR] = React.useState(cachedUser?.apr ? cachedUser.apr : 0.0);
  const [stakingState, setStakingState] = React.useState(
    cachedUser?.staking
      ? cachedUser.staking
      : {
          currentStaked: 0,
          rewardWithdrawable: 0,
          rewardWithdrawn: 0,
          rewardFeePaid: 0,
          feeEndTime: 0
        }
  );
  const [reloadPage, setReloadPage] = React.useState(false);

  const handleStakingType = (_, type) => {
    if (type) setStakingType(type);
    setAmountProgress(0);
    setOperAmount(0);
  };

  const handleProgressBtn = (event) => {
    const progressType = event.target.value;
    setAmountProgress(progressType * 25);
    const offsetAmount = math.round((stakingTotalAmount * progressType) / 4, 4);
    setOperAmount(offsetAmount);
    if (progressType === 4) {
      if (stakingType === 'Stake') setStakingSettleAmount(pasarBalance);
      else if (stakingType === 'Unstake') setStakingSettleAmount(0);
    } else {
      let totalStaked = BigInt(stakingState?.currentStaked ?? 0);
      if (stakingType === 'Stake') totalStaked = BigInt(totalStaked) + BigInt(offsetAmount);
      else if (stakingType === 'Unstake') totalStaked = BigInt(totalStaked) - BigInt(offsetAmount);
      setStakingSettleAmount(totalStaked);
    }
  };

  const handleChangeAmount = (event) => {
    let amountValue = event.target.value;
    amountValue = removeLeadingZero(amountValue);
    if (amountValue < 0) return;
    if (amountValue * 1 > stakingTotalAmount) return;
    const offsetAmount = math.round(amountValue * 1, 4).toString();
    setOperAmount(offsetAmount);
    let totalStaked = BigInt(stakingState?.currentStaked ?? 0);
    if (stakingType === 'Stake') totalStaked = BigInt(totalStaked) + BigInt(offsetAmount);
    else if (stakingType === 'Unstake') totalStaked = BigInt(totalStaked) - BigInt(offsetAmount);
    setStakingSettleAmount(totalStaked);
  };

  const handleChangeSlider = (event, newValue) => {
    setAmountProgress(newValue);
    const offsetAmount = math.round((stakingTotalAmount * newValue) / 100, 4);
    setOperAmount(offsetAmount);
    if (newValue === 100) {
      if (stakingType === 'Stake') setStakingSettleAmount(pasarBalance);
      else if (stakingType === 'Unstake') setStakingSettleAmount(0);
    } else {
      let totalStaked = BigInt(stakingState?.currentStaked ?? 0);
      if (stakingType === 'Stake') totalStaked = BigInt(totalStaked) + BigInt(offsetAmount);
      else if (stakingType === 'Unstake') totalStaked = BigInt(totalStaked) - BigInt(offsetAmount);
      setStakingSettleAmount(totalStaked);
    }
  };

  React.useEffect(() => {
    const tempProgress = math.round(
      stakingTotalAmount.toString() === '0' ? 0 : (operAmount * 100) / stakingTotalAmount,
      1
    );
    setAmountProgress(tempProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operAmount, stakingType]);

  React.useEffect(() => {
    setStakingTotalAmount(stakingType === 'Stake' ? pasarBalance : stakingState?.currentStaked ?? 0);
  }, [pasarBalance, stakingType, stakingState]);

  const fetchListedItemCount = async () => {
    try {
      const res = await fetchAPIFrom('api/v1/getTokensCount');
      const json = await res.json();
      return json?.data || { nativeTokenCount: 0, pasarTokenCount: 0, ecoTokenCount: 0, otherTokenCount: 0 };
    } catch (err) {
      console.error(err);
      return { nativeTokenCount: 0, pasarTokenCount: 0, ecoTokenCount: 0, otherTokenCount: 0 };
    }
  };

  const fetchRewardedUserCount = async () => {
    try {
      const res = await fetchAPIFrom(`api/v1/getPoolRewards`);
      const json = await res.json();
      return json?.data || { ecoCount: 0, elaCount: 0, otherCount: 0, pasarCount: 0 };
    } catch (err) {
      console.error(err);
      return { ecoCount: 0, elaCount: 0, otherCount: 0, pasarCount: 0 };
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const resPasarPrice = await getERC20TokenPrice(PASAR_TOKEN_ADDRESS);
      setPASARToUSD(resPasarPrice);
      const accounts = await getWalletAccounts();
      if (accounts.length) {
        const balance = await callTokenContractMethod({
          contractType: 'token',
          callType: 'call',
          methodName: 'balanceOf',
          account: accounts[0]
        });
        setPasarBalance(balance);
      }
      // rewards page
      const rewardedUsers = await fetchRewardedUserCount();
      const listedItems = await fetchListedItemCount(blankAddress);
      const currentRatios = await callTokenContractMethod({
        contractType: 'mining',
        callType: 'call',
        methodName: 'getCurrentRatios'
      });
      const nextMiningReward = await callTokenContractMethod({
        contractType: 'mining',
        callType: 'call',
        methodName: 'pendingRewards'
      });
      setListedItemCnt({
        native: listedItems.elaCount,
        pasar: listedItems.pasarCount,
        eco: listedItems.ecoCount,
        other: listedItems.otherCount
      });
      setMiningPoolRatio({
        native: parseInt(currentRatios.native, 10) / 1e4,
        pasar: parseInt(currentRatios.pasar, 10) / 1e4,
        eco: parseInt(currentRatios.eco, 10) / 1e4,
        other: parseInt(currentRatios.other, 10) / 1e4
      });
      setUserRewarded(rewardedUsers);
      setNextDistribution({
        native: parseInt(nextMiningReward.native, 10) / 1e18,
        pasar: parseInt(nextMiningReward.pasar, 10) / 1e18,
        eco: parseInt(nextMiningReward.eco, 10) / 1e18,
        other: parseInt(nextMiningReward.other, 10) / 1e18
      });
      sessionStorage.setItem(
        'REWARD_POOL',
        JSON.stringify({
          item: {
            native: listedItems.elaCount,
            pasar: listedItems.pasarCount,
            eco: listedItems.ecoCount,
            other: listedItems.otherCount
          },
          pool: {
            native: parseInt(currentRatios.native, 10) / 1e4,
            pasar: parseInt(currentRatios.pasar, 10) / 1e4,
            eco: parseInt(currentRatios.eco, 10) / 1e4,
            other: parseInt(currentRatios.other, 10) / 1e4
          },
          user: rewardedUsers,
          next: {
            native: parseInt(nextMiningReward.native, 10) / 1e18,
            pasar: parseInt(nextMiningReward.pasar, 10) / 1e18,
            eco: parseInt(nextMiningReward.eco, 10) / 1e18,
            other: parseInt(nextMiningReward.other, 10) / 1e18
          }
        })
      );
      if (accounts.length) {
        const accountRewards = await callTokenContractMethod({
          contractType: 'mining',
          callType: 'call',
          methodName: 'accountRewards',
          account: accounts[0]
        });
        setMiningReward({
          all: {
            total: accountRewards.all.total / 1e18,
            withdrawable: accountRewards.all.withdrawable / 1e18,
            withdrawn: accountRewards.all.withdrawn / 1e18
          },
          buyer: {
            total: accountRewards.buyer.total / 1e18,
            withdrawable: accountRewards.buyer.withdrawable / 1e18,
            withdrawn: accountRewards.buyer.withdrawn / 1e18
          },
          seller: {
            total: accountRewards.seller.total / 1e18,
            withdrawable: accountRewards.seller.withdrawable / 1e18,
            withdrawn: accountRewards.seller.withdrawn / 1e18
          },
          creator: {
            total: accountRewards.creator.total / 1e18,
            withdrawable: accountRewards.creator.withdrawable / 1e18,
            withdrawn: accountRewards.creator.withdrawn / 1e18
          }
        });
        setClaimItems([
          {
            title: 'BUYERS',
            action: 'Buy',
            name: 'buyer',
            amount: (accountRewards.buyer.withdrawable / 1e18).toFixed(4),
            price: ((accountRewards.buyer.withdrawable / 1e18) * PASARToUSD).toFixed(4)
          },
          {
            title: 'SELLERS',
            action: 'Sell',
            name: 'seller',
            amount: (accountRewards.seller.withdrawable / 1e18).toFixed(4),
            price: ((accountRewards.seller.withdrawable / 1e18) * PASARToUSD).toFixed(4)
          },
          {
            title: 'CREATORS',
            action: 'Create',
            name: 'creator',
            amount: (accountRewards.creator.withdrawable / 1e18).toFixed(4),
            price: ((accountRewards.creator.withdrawable / 1e18) * PASARToUSD).toFixed(4)
          }
        ]);
        // staking page
        const stakingInfo = await callTokenContractMethod({
          contractType: 'staking',
          callType: 'call',
          methodName: 'getUserInfo',
          account: accounts[0]
        });
        setStakingState({
          currentStaked: stakingInfo.currentStaked,
          rewardWithdrawable: stakingInfo.rewardWithdrawable,
          rewardWithdrawn: stakingInfo.rewardWithdrawn,
          rewardFeePaid: stakingInfo.rewardFeePaid,
          feeEndTime: stakingInfo.feeEndTime
        });
        // get APR
        const days = 360;
        const currentTime = parseInt(
          await callTokenContractMethod({
            contractType: 'staking',
            callType: 'call',
            methodName: 'getCurrentTime'
          }),
          10
        );
        const rewardTime = parseInt(currentTime + days * 3600 * 24, 10);
        const rewardTotal =
          parseInt(
            await callTokenContractMethod({
              contractType: 'staking',
              callType: 'call',
              methodName: 'totalRewardAtTime',
              timestamp: rewardTime
            }),
            10
          ) -
          parseInt(
            await callTokenContractMethod({
              contractType: 'staking',
              callType: 'call',
              methodName: 'totalRewardAtTime',
              timestamp: currentTime
            }),
            10
          );
        const annualReward = (rewardTotal * 365) / days;
        let rate = 0;
        if (stakingInfo.currentStaked > 0) {
          rate = (annualReward * 1000000) / stakingInfo.currentStaked;
        }
        const APR = parseInt(rate, 10) / 1000000;
        setStakingAPR((APR * 100).toFixed(4));

        sessionStorage.setItem(
          'REWARD_USER',
          JSON.stringify({
            mining: {
              all: {
                total: accountRewards.all.total / 1e18,
                withdrawable: accountRewards.all.withdrawable / 1e18,
                withdrawn: accountRewards.all.withdrawn / 1e18
              },
              buyer: {
                total: accountRewards.buyer.total / 1e18,
                withdrawable: accountRewards.buyer.withdrawable / 1e18,
                withdrawn: accountRewards.buyer.withdrawn / 1e18
              },
              seller: {
                total: accountRewards.seller.total / 1e18,
                withdrawable: accountRewards.seller.withdrawable / 1e18,
                withdrawn: accountRewards.seller.withdrawn / 1e18
              },
              creator: {
                total: accountRewards.creator.total / 1e18,
                withdrawable: accountRewards.creator.withdrawable / 1e18,
                withdrawn: accountRewards.creator.withdrawn / 1e18
              }
            },
            staking: {
              currentStaked: stakingInfo.currentStaked / 1e18,
              rewardWithdrawable: stakingInfo.rewardWithdrawable / 1e18,
              rewardWithdrawn: stakingInfo.rewardWithdrawn / 1e18,
              rewardFeePaid: stakingInfo.rewardFeePaid / 1e18,
              feeEndTime: stakingInfo.feeEndTime
            },
            claim: [
              {
                title: 'BUYERS',
                action: 'Buy',
                name: 'buyer',
                amount: (accountRewards.buyer.withdrawable / 1e18).toFixed(4),
                price: ((accountRewards.buyer.withdrawable / 1e18) * PASARToUSD).toFixed(4)
              },
              {
                title: 'SELLERS',
                action: 'Sell',
                name: 'seller',
                amount: (accountRewards.seller.withdrawable / 1e18).toFixed(4),
                price: ((accountRewards.seller.withdrawable / 1e18) * PASARToUSD).toFixed(4)
              },
              {
                title: 'CREATORS',
                action: 'Create',
                name: 'creator',
                amount: (accountRewards.creator.withdrawable / 1e18).toFixed(4),
                price: ((accountRewards.creator.withdrawable / 1e18) * PASARToUSD).toFixed(4)
              }
            ],
            apr: (APR * 100).toFixed(4)
          })
        );
      } else {
        setMiningReward({
          all: {
            total: 0,
            withdrawable: 0,
            withdrawn: 0
          },
          buyer: {
            total: 0,
            withdrawable: 0,
            withdrawn: 0
          },
          seller: {
            total: 0,
            withdrawable: 0,
            withdrawn: 0
          },
          creator: {
            total: 0,
            withdrawable: 0,
            withdrawn: 0
          }
        });
        setClaimItems([
          {
            title: 'BUYERS',
            action: 'Buy',
            name: 'buyer',
            amount: 0,
            price: 0
          },
          {
            title: 'SELLERS',
            action: 'Sell',
            name: 'seller',
            amount: 0,
            price: 0
          },
          {
            title: 'CREATORS',
            action: 'Create',
            name: 'creator',
            amount: 0,
            price: 0
          }
        ]);
        setStakingState({
          currentStaked: 0,
          rewardWithdrawable: 0,
          rewardWithdrawn: 0,
          rewardFeePaid: 0,
          feeEndTime: 0
        });
        setStakingAPR(0);
      }
    };
    fetchData();
    setTimeout(() => {
      setReloadPage(!reloadPage);
    }, 10 * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, reloadPage, sessionStorage.getItem('PASAR_LINK_ADDRESS')]);

  const checkIfSignedOrNot = async () => {
    const accounts = await getWalletAccounts();
    return accounts && !!accounts.length;
  };

  const handleStake = async (type, amount) => {
    const accounts = await getWalletAccounts();
    if (!(accounts && accounts.length)) {
      setOpenSigninEssentialDlg(true);
      return;
    }
    const stakingInfo = await callTokenContractMethod({
      contractType: 'staking',
      callType: 'call',
      methodName: 'getUserInfo',
      account: accounts[0]
    });
    if (type === 'Unstake' && stakingInfo.currentStaked.toString() === '0') {
      enqueueSnackbar('You have not participated in the stake', { variant: 'info' });
      return;
    }
    let stakingAmount = stakingSettleAmount < 0 ? 0 : stakingSettleAmount;
    if (type === 'Stake' && BigInt(pasarBalance) + BigInt(stakingInfo.currentStaked) < BigInt(stakingAmount))
      stakingAmount = BigInt(pasarBalance) + BigInt(stakingInfo.currentStaked);
    if (amount === 0) {
      enqueueSnackbar('The amount you selected is 0, please select bigger than 0', { variant: 'info' });
      return;
    }
    if (type === 'Stake' && stakingAmount <= 0) {
      enqueueSnackbar('Staking amount should be greater than 0', { variant: 'error' });
      return;
    }
    try {
      const allowance = await callTokenContractMethod({
        contractType: 'token',
        callType: 'call',
        methodName: 'allowance',
        owner: accounts[0],
        spender: STAKING_CONTRACT_ADDRESS
      });
      if (allowance < stakingAmount) {
        await callTokenContractMethod({
          contractType: 'token',
          callType: 'send',
          methodName: 'approve',
          spender: STAKING_CONTRACT_ADDRESS,
          amount: BigInt(stakingAmount).toString()
        });
      }
      await callTokenContractMethod({
        contractType: 'staking',
        callType: 'send',
        methodName: 'stake',
        amount: BigInt(stakingAmount).toString()
      });
      enqueueSnackbar(`${type} success`, { variant: 'success' });
      window.location.reload();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(`${type} error`, { variant: 'error' });
    }
  };

  const handleWithdrawStakingReward = async () => {
    const isSignedIn = await checkIfSignedOrNot();
    if (!isSignedIn) {
      setOpenSigninEssentialDlg(true);
      return;
    }
    try {
      await callTokenContractMethod({
        contractType: 'staking',
        callType: 'send',
        methodName: 'withdraw'
      });
      enqueueSnackbar('Withdraw success', { variant: 'success' });
      setReloadPage(!reloadPage);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Withdraw error', { variant: 'error' });
    }
  };

  const handleWithdrawMiningReward = async (name) => {
    const isSignedIn = await checkIfSignedOrNot();
    if (!isSignedIn) {
      setOpenSigninEssentialDlg(true);
      return;
    }
    try {
      await callTokenContractMethod({
        contractType: 'mining',
        callType: 'send',
        methodName: 'withdrawRewardByName',
        name
      });
      enqueueSnackbar('Withdraw success', { variant: 'success' });
      setReloadPage(!reloadPage);
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
          Earn rewards by just trading, staking and listing. Mining and staking rewards will constitute 40% (40,000,000)
          and 10% (10,000,000) respectively of the total PASAR token supply.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Box sx={{ width: 200 }}>
            <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
              <div>
                <StyledButton variant="contained" fullWidth sx={{ mb: 1 }} disabled>
                  Get PASAR
                </StyledButton>
              </div>
            </Tooltip>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', mb: 1 }} align="center">
              {`1 PASAR ≈ USD ${PASARToUSD.toFixed(4)}`}
            </Typography>
          </Box>
          <Button
            // to={props.to}
            // component={RouterLink}
            // size="small"
            color="inherit"
            startIcon={<Icon icon="akar-icons:circle-plus" />}
            sx={{ color: 'origin.main', height: 'max-content' }}
            onClick={() =>
              addTokenToMM(
                PASAR_TOKEN_ADDRESS,
                'PASAR',
                18,
                'https://github.com/PasarProtocol/PasarDWebApp/blob/main/public/static/logo-icon.svg?raw=true'
              )
            }
          >
            Add to wallet
          </Button>
        </Stack>
        <Stack alignItems="center">
          <Tabs
            value={tabValue}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(_, value) => setTabValue(value)}
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
                src="/static/logo-icon-white.svg"
                sx={{
                  width: { xs: 32, sm: 40, lg: 45 },
                  display: 'inline-flex',
                  backgroundColor: 'origin.main',
                  p: { xs: 0.6, sm: 0.9, lg: 1 },
                  verticalAlign: 'middle',
                  borderRadius: '100%'
                }}
              />
            </Box>
            <Typography variant="body2" component="div" sx={{ lineHeight: 1.1, py: 2 }}>
              Once a buy transaction is completed, the <PinkLabel text="PASAR" /> mining rewards will be distributed
              accordingly. Mining rewards to earn <PinkLabel text="PASAR" /> will last 4 years.
              <br />
              <br />
              Users can claim rewards every day, or accumulate a one-time claim. Rewards never disappear nor expire.
            </Typography>
            <StackStyle sx={{ py: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" component="div">
                  <Typography variant="h3" color="origin.main" sx={{ display: 'inline' }}>
                    PASAR
                  </Typography>{' '}
                  earned
                </Typography>
                <EarnedValueStyle variant="h2" sx={{ display: 'inline-flex' }}>
                  {miningReward.all.withdrawable.toFixed(4)}
                </EarnedValueStyle>
                <Typography variant="body2" color="text.secondary">{`≈ USD ${(
                  miningReward.all.total * PASARToUSD
                ).toFixed(4)}`}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', m: 'auto' }}>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ pb: 2 }}>
                  to collect from 4 mining rewards
                </Typography>
                <StyledButton
                  variant="contained"
                  sx={{ minWidth: 150 }}
                  onClick={() => handleWithdrawMiningReward('all')}
                >
                  Claim All
                </StyledButton>
              </Box>
            </StackStyle>
          </PaperStyle>
          <Typography variant="h2" textAlign="center" my={3}>
            Mining Pool Stats
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="h3">ELA ESC</Typography>
              <Box
                component="img"
                src="/static/elastos.svg"
                sx={{
                  width: 20,
                  display: 'inline',
                  verticalAlign: 'middle',
                  filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none')
                }}
              />
            </Stack>
            <StatisticPanel
              itemCount={listedItemCnt.native}
              poolRatio={miningPoolRatio.native}
              userCount={userRewarded.elaCount}
              nextDistribution={nextDistribution.native}
            />

            <Stack direction="row" spacing={1}>
              <Typography variant="h3">PASAR</Typography>
              <Box
                component="img"
                src="/static/logo-icon.svg"
                sx={{
                  width: 20,
                  display: 'inline',
                  verticalAlign: 'middle',
                  filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none')
                }}
              />
            </Stack>
            <StatisticPanel
              itemCount={listedItemCnt.pasar}
              poolRatio={miningPoolRatio.pasar}
              userCount={userRewarded.pasarCount}
              nextDistribution={nextDistribution.pasar}
            />

            <Stack direction="row" spacing={1}>
              <Typography variant="h3">Ecosystem</Typography>
              <Box
                component="img"
                src="/static/badges/diamond.svg"
                sx={{
                  width: 20,
                  display: 'inline',
                  verticalAlign: 'middle',
                  filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none')
                }}
              />
            </Stack>
            <StatisticPanel
              itemCount={listedItemCnt.eco}
              poolRatio={miningPoolRatio.eco}
              userCount={userRewarded.ecoCount}
              nextDistribution={nextDistribution.eco}
            />

            <Typography variant="h3">Others</Typography>
            <StatisticPanel
              itemCount={listedItemCnt.other}
              poolRatio={miningPoolRatio.other}
              userCount={userRewarded.otherCount}
              nextDistribution={nextDistribution.other}
            />
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
                    <Typography variant="h5" color="origin.main" sx={{ display: 'inline', fontWeight: 'normal' }}>
                      PASAR
                    </Typography>
                    , earn{' '}
                    <Typography variant="h5" color="origin.main" sx={{ display: 'inline', fontWeight: 'normal' }}>
                      PASAR
                    </Typography>
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h5">{stakingAPR}%</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'normal' }} color="text.secondary">
                    APR <Icon icon="eva:info-outline" style={{ marginBottom: -3 }} />
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
            <AccordionSummary
              expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
              sx={{ '& .Mui-expanded': { marginBottom: '0 !important' } }}
            >
              <Typography variant="h4">Your Stake</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <EarnedValueStyle variant="h2">{(stakingState.currentStaked / 1e18).toFixed(4)}</EarnedValueStyle>
                <Typography variant="body2" color="text.secondary">{`≈ USD ${(
                  (stakingState.currentStaked * PASARToUSD) /
                  1e18
                ).toFixed(4)}`}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={0}
                    sx={{
                      display: 'inline-flex',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 0.5,
                      width: '100%'
                    }}
                  >
                    <StyledToggleButtonGroup size="small" value={stakingType} exclusive onChange={handleStakingType}>
                      <StyledToggleButton value="Stake">Stake</StyledToggleButton>
                      <StyledToggleButton value="Unstake">Unstake</StyledToggleButton>
                    </StyledToggleButtonGroup>
                  </Paper>
                </Grid>
                <MHidden width="mdUp">
                  <Grid item xs={12}>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="body2">PASAR in wallet:</Typography>&nbsp;
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {(pasarBalance / 1e18).toFixed(4)}
                      </EarnedValueStyle>
                      &nbsp;
                      <Typography variant="body2" color="text.secondary">{`≈ USD ${(
                        (pasarBalance * PASARToUSD) /
                        1e18
                      ).toFixed(2)}`}</Typography>
                    </Stack>
                  </Grid>
                </MHidden>
                <Grid item xs={12} md={8}>
                  <FormGroup row sx={{ flexWrap: 'nowrap' }}>
                    <StyledTextField
                      type="number"
                      variant="outlined"
                      placeholder="Amount"
                      value={(operAmount / 1e18).toFixed(4)}
                      onChange={handleChangeAmount}
                      InputProps={{
                        endAdornment: (
                          <Box
                            component="img"
                            src="/static/logo-icon.svg"
                            sx={{
                              width: 24,
                              display: 'inline-flex'
                            }}
                          />
                        ),
                        style: {
                          fontSize: '16pt',
                          fontWeight: 'bold',
                          color: '#FF5082'
                        }
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <StyledButton
                      variant="contained"
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      onClick={() => handleStake(stakingType, operAmount)}
                    >
                      {stakingType}
                    </StyledButton>
                  </FormGroup>
                  <StyledSlider
                    size="medium"
                    value={amountProgress}
                    step={1}
                    valueLabelDisplay="auto"
                    onChange={handleChangeSlider}
                  />
                  <Typography variant="h6" mb={1}>
                    {amountProgress}%
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {AmountProgressType.map((progType, _i) => {
                      const btnSx = { flexGrow: 1 };
                      if (amountProgress === (_i + 1) * 25) {
                        btnSx.background = (theme) => theme.palette.origin.main;
                        btnSx.color = 'white';
                      }
                      return (
                        <Button
                          key={_i}
                          variant="contained"
                          color="inherit"
                          sx={btnSx}
                          value={_i + 1}
                          onClick={handleProgressBtn}
                        >
                          {progType}
                        </Button>
                      );
                    })}
                  </Stack>
                </Grid>
                <MHidden width="mdDown">
                  <Grid item sm={4}>
                    <Box textAlign="right">
                      <Typography variant="body1">PASAR in wallet:</Typography>
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {(pasarBalance / 1e18).toFixed(4)}
                      </EarnedValueStyle>
                      <Typography variant="body1" color="text.secondary">{`≈ USD ${(
                        (pasarBalance * PASARToUSD) /
                        1e18
                      ).toFixed(2)}`}</Typography>
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
            <AccordionSummary
              expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
              sx={{ '& .Mui-expanded': { marginBottom: '0 !important' } }}
            >
              <Typography variant="h4">Rewards</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <EarnedValueStyle variant="h2">{(stakingState.rewardWithdrawable / 1e18).toFixed(4)}</EarnedValueStyle>
                <Typography variant="body2" color="text.secondary">{`≈ USD ${(
                  (stakingState.rewardWithdrawable * PASARToUSD) /
                  1e18
                ).toFixed(4)}`}</Typography>
              </Box>
              <Grid container spacing={2}>
                <MHidden width="smUp">
                  <Grid item xs={12}>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="body2">Received so far:</Typography>&nbsp;
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {(stakingState.rewardWithdrawn / 1e18).toFixed(4)}
                      </EarnedValueStyle>
                      &nbsp;
                      <Typography variant="body2" color="text.secondary">{`≈ USD ${(
                        (stakingState.rewardWithdrawn * PASARToUSD) /
                        1e18
                      ).toFixed(4)}`}</Typography>
                    </Stack>
                  </Grid>
                </MHidden>
                <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'end' }}>
                  <StyledButton variant="contained" sx={{ width: 200 }} onClick={handleWithdrawStakingReward}>
                    Claim
                  </StyledButton>
                </Grid>
                <MHidden width="smDown">
                  <Grid item sm={4}>
                    <Box textAlign="right">
                      <Typography variant="body1">Received so far:</Typography>
                      <EarnedValueStyle variant="h6" sx={{ display: 'inline-flex' }}>
                        {(stakingState.rewardWithdrawn / 1e18).toFixed(4)}
                      </EarnedValueStyle>
                      <Typography variant="body1" color="text.secondary">{`≈ USD ${(
                        (stakingState.rewardWithdrawn * PASARToUSD) /
                        1e18
                      ).toFixed(4)}`}</Typography>
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
