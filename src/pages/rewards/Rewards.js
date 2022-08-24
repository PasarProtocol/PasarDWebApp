import React from 'react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { Container, Box, Stack, Grid, Typography, Paper, Divider, Link, Tooltip, Button, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';

// components
import Page from '../../components/Page';
import TabPanel from '../../components/TabPanel';
import StyledButton from '../../components/signin-dlg/StyledButton';
import StatisticPanel from '../../components/rewards/StatisticPanel'
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
const PinkLabel = ({text})=>(<Typography variant="body2" color='origin.main' sx={{display: 'inline'}}>{text}</Typography>)
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
const ClaimCard = ({item})=>(
  <PaperStyle>
    <Typography variant="h3" align="center">{item.title}</Typography>
    <Typography variant="h5" component="div" align="center" sx={{pb: 2}}>
      {item.action} item, earn{' '}
      <Typography variant="h5" color='origin.main' sx={{display: 'inline'}}>
        PASAR
      </Typography>{' '}
      <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
    </Typography>
    <Divider sx={{mx: '-20px'}}/>
    <Box sx={{maxWidth: 300, py: 4, m: 'auto'}}>
      <Typography variant="h3" component="div">
        <Typography variant="h3" color='origin.main' sx={{display: 'inline'}}>PASAR</Typography>{' '}earned
      </Typography>
      <EarnedValueStyle variant="h2" sx={{display: 'inline-flex'}}>
        0.234223
      </EarnedValueStyle>
      <Typography variant="body2" color='text.secondary'>≈ USD 0</Typography>
      <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
        <div><StyledButton variant="contained" sx={{mt: 3, width: '100%'}}>Claim</StyledButton></div>
      </Tooltip>
    </Box>
  </PaperStyle>
)
const ExternalLink = (props) => {
  const {linkURL, title} = props
  return <Link
    underline="always"
    href={linkURL}
    target="_blank"
    color="text.secondary"
  >
    {title}
  </Link>
}
const ClaimTitles = [{title: "BUYERS", action: "Buy"}, {title: "SELLERS", action: "Sell"}, {title: "CREATORS", action: "Create"}]
export default function Rewards() {  
  const [tabValue, setTabValue] = React.useState(0);

  React.useEffect(() => {
  }, []);

  const handleSwitchTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <RootStyle title="Rewards | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{mb: 3}}>
          Rewards
        </Typography>
        <Typography variant="h5" sx={{fontWeight: 'normal', color: 'text.secondary', mb: 2}}>
          Earn rewards by just trading, staking and listing. Mining and staking rewards will constitute 40% (40,000,000) and 10% (10,000,000) respectively of the total PASAR token supply.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Box sx={{width: 200}}>
            <StyledButton variant='contained' fullWidth sx={{mb: 1}}>Get PASAR</StyledButton>
            <Typography variant="body2" sx={{fontWeight: 'normal', color: 'text.secondary', mb: 1}} align="center">
              1 PASAR ≈ USD 0.01
            </Typography>
          </Box>
          <Button
              // to={props.to}
              // component={RouterLink}
              // size="small"
              color="inherit"
              startIcon={<Icon icon="akar-icons:circle-plus" />}
              sx={{color: 'origin.main', height: 'max-content'}}
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
          <PaperStyle sx={{position: 'relative', px: {sm: 5, md: 12}, py: {sm: 2, md: 5}, mx: {sm: 2, md: 6}}}>
            <Box>
              <Typography variant="h2" sx={{verticalAlign: 'middle', display: 'inline-flex'}}>
                Total Mining Rewards&nbsp;
              </Typography>
              <Box
                component="img"
                src='/static/logo-icon-white.svg'
                sx={{
                  width: {xs: 32, sm: 40, lg: 45},
                  display: 'inline-flex',
                  backgroundColor: 'origin.main',
                  p: {xs: 0.6, sm: 0.9, lg: 1},
                  verticalAlign: 'middle',
                  borderRadius: '100%'
                }}/>
            </Box>
            <Typography variant="body2" component='div' sx={{lineHeight: 1.1, py: 2}}>
              Once a buy transaction is completed, the{' '}<PinkLabel text="PASAR"/>{' '}mining rewards will be distributed accordingly.
              Mining rewards to earn{' '}<PinkLabel text="PASAR"/>{' '}will last 4 years.<br/>
              <br/>
              Users can claim rewards every day, or accumulate a one-time claim. Rewards never disappear nor expire.
            </Typography>
            <StackStyle sx={{py: 2}}>
              <Box sx={{flex: 1}}>
                <Typography variant="h3" component="div"><Typography variant="h3" color='origin.main' sx={{display: 'inline'}}>PASAR</Typography>{' '}earned</Typography>
                <EarnedValueStyle variant="h2" sx={{display: 'inline-flex'}}>
                  52.7593424
                </EarnedValueStyle>
                <Typography variant="body2" color='text.secondary'>≈ USD 5.23</Typography>
              </Box>
              <Box sx={{textAlign: 'center', m: 'auto'}}>
                <Typography variant="body2" align='center' color='text.secondary' sx={{pb: 2}}>to collect from 4 mining rewards</Typography>
                <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
                  <div><StyledButton variant="contained" sx={{minWidth: 150}}>Claim All</StyledButton></div>
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
              <Box component="img" src="/static/elastos.svg" sx={{ width: 20, display: 'inline', verticalAlign: 'middle', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
            </Stack>
            <StatisticPanel/>

            <Stack direction="row" spacing={1}>
              <Typography variant="h3">PASAR</Typography>
              <Box component="img" src="/static/logo-icon.svg" sx={{ width: 20, display: 'inline', verticalAlign: 'middle', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
            </Stack>
            <StatisticPanel/>

            <Stack direction="row" spacing={1}>
              <Typography variant="h3">Ecosystem</Typography>
              <Box component="img" src="/static/badges/diamond.svg" sx={{ width: 20, display: 'inline', verticalAlign: 'middle', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
            </Stack>
            <StatisticPanel/>

            <Typography variant="h3">Others</Typography>
            <StatisticPanel/>
          </Stack>
          <Typography variant="h2" textAlign="center" my={3}>
            Mining Rewards
          </Typography>
          <Grid container spacing={3}>
            {
              ClaimTitles.map((item, _i)=>(
                <Grid item xs={12} sm={6} md={4} key={_i}>
                  <ClaimCard item={item}/>
                </Grid>
              ))
            }
          </Grid>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AccordionStyle>
            <AccordionDetails>
              <Stack direction="row" alignItems="center" py={2}>
                <Stack flexGrow={1}>
                  <Typography variant="h3">Standard Staking</Typography>
                  <Typography variant="h5" component="div" sx={{fontWeight: 'normal'}}>
                    Stake{' '}
                    <Typography variant="h5" color='origin.main' sx={{display: 'inline', fontWeight: 'normal'}}>
                      PASAR
                    </Typography>,
                    earn{' '}
                    <Typography variant="h5" color='origin.main' sx={{display: 'inline', fontWeight: 'normal'}}>
                      PASAR
                    </Typography>
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h5">48.48%</Typography>
                  <Typography variant="h5" sx={{fontWeight: 'normal'}} color="text.secondary">
                    APY{' '}<Icon icon="eva:info-outline" style={{marginBottom: -3}}/>
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
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
              <Typography variant="h4">Your Stake</Typography>
            </AccordionSummary>
            <AccordionDetails>
              content
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
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}>
              <Typography variant="h4">Rewards</Typography>
            </AccordionSummary>
            <AccordionDetails>
              content
            </AccordionDetails>
          </AccordionStyle>
        </TabPanel>
      </Container>
    </RootStyle>
  );
}