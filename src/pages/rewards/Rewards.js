import React from 'react';
import { Container, Box, Stack, Grid, Typography, Paper, Divider, Link, Tooltip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';

// components
import Page from '../../components/Page';
import StyledButton from '../../components/signin-dlg/StyledButton';
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
        0
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
const ClaimTitles = [{title: "BUYERS", action: "Buy"}, {title: "SELLERS", action: "Sell"}, {title: "CREATORS", action: "Create"}, {title: "PASAR", action: "Sell"}]
export default function Rewards() {  
  React.useEffect(() => {
  }, []);

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
      </Container>
    </RootStyle>
  );
}