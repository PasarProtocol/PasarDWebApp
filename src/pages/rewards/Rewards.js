import React from 'react';
import { Container, Box, Stack, Grid, Typography, Paper, Divider, Link } from '@mui/material';
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
      <StyledButton variant="contained" sx={{mt: 3, width: '100%'}}>Claim</StyledButton>
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
        <PaperStyle sx={{position: 'relative', px: {sm: 4, md: 10}}}>
          <Box>
            <Typography variant="h2" sx={{verticalAlign: 'middle', display: 'inline-flex'}}>
              Total Mining Rewards&nbsp;
            </Typography>
            <Box
              component="img"
              src='/static/logo-icon-white.svg'
              sx={{
                width: {xs: 40, sm: 50, md: 55, lg: 62},
                display: 'inline-flex',
                backgroundColor: 'origin.main',
                p: {xs: 1, sm: 1.25, md: 1.3, lg: 1.5},
                verticalAlign: 'middle',
                borderRadius: '100%'
              }}/>
          </Box>
          <Typography variant="body2" component='div' sx={{lineHeight: 1.1, py: 2}}>
            Once a buy transaction is completed, the{' '}
            <Typography variant="body2" color='origin.main' sx={{display: 'inline'}}>PASAR</Typography>{' '}mining rewards will be distributed accordingly.
            Mining rewards to earn{' '}
            <Typography variant="body2" color='origin.main' sx={{display: 'inline'}}>PASAR</Typography>{' '}will last 4 years and will be supported by 30% of platform fees.<br/>
            <br/>
            Users can claim rewards every day, or accumulate a one-time claim. Rewards never disappear nor expire.
          </Typography>
          <StackStyle sx={{py: 2}}>
            <Box sx={{flex: 1}}>
              <Typography variant="h3" component="div"><Typography variant="h3" color='origin.main' sx={{display: 'inline'}}>PASAR</Typography>{' '}earned</Typography>
              <EarnedValueStyle variant="h2" sx={{display: 'inline-flex'}}>
                0
              </EarnedValueStyle>
              <Typography variant="body2" color='text.secondary'>≈ USD 0</Typography>
            </Box>
            <Box sx={{textAlign: 'center', m: 'auto'}}>
              <Typography variant="body2" align='center' sx={{pb: 2}}>to collect from 4 mining rewards</Typography>
              <StyledButton variant="contained" sx={{minWidth: 150}}>Claim All</StyledButton>
            </Box>
          </StackStyle>
        </PaperStyle>
        <Typography variant="h2" align="center" sx={{my: 3}}>
          Mining Rewards
        </Typography>
        <Grid container spacing={3}>
          {
            ClaimTitles.map((item, _i)=>(
              <Grid item xs={12} sm={6} key={_i}>
                <ClaimCard item={item}/>
              </Grid>
            ))
          }
        </Grid>
        <Typography variant="h2" align="center" sx={{my: 3}}>
          Staking Rewards
        </Typography>
        <PaperStyle sx={{position: 'relative', px: {sm: 4, md: 10}}}>
          <Typography variant="h2" component="div" sx={{verticalAlign: 'middle', display: 'inline-flex', lineHeight: 0.8, pt: 2, pb: 1}}>
            Create LP tokens&nbsp;
            <Typography variant="h5" sx={{display: 'inline-flex', alignItems: 'end', mb: '2px'}}>
              <Icon icon="eva:info-outline"/>
            </Typography>
          </Typography>
          <Typography variant="body2" component='div' sx={{lineHeight: 1.1, py: 2}}>
            In partnership with{' '}<ExternalLink linkURL="https://glidefinance.io" title="Glide Finance"/>, the staking of{' '}<PinkLabel text="PASAR"/>{' '}tokens will take place on Glide.<br/>
            <br/>
            In order to stake{' '}<PinkLabel text="PASAR"/>{' '}tokens, you first need to create a LP (Liquidity Pool) token{' '}<PinkLabel text="(PASAR-GLIDE)"/>{' '}on Glide DEX.
          </Typography>
          <Box sx={{justifyContent: 'center', display: 'grid'}}>
            <Box sx={{display: 'inline-flex', py: 2}}>
              <Box
                component="img"
                src='/static/logo-icon-white.svg'
                sx={{
                  width: {xs: 45, sm: 50, md: 60},
                  height: {xs: 45, sm: 50, md: 60},
                  display: 'inline-flex',
                  backgroundColor: 'origin.main',
                  p: {xs: 1.1, sm: 1.2, md: 1.4},
                  verticalAlign: 'middle',
                  borderRadius: '100%'
                }}/>
              <Typography variant="h1" sx={{display: 'inline-flex', px: 4}}>X</Typography>
              <Box
                component="img"
                src='/static/glide.png'
                sx={{
                  width: {xs: 45, sm: 50, md: 60},
                  height: {xs: 45, sm: 50, md: 60},
                  p: {xs: '3px', sm: '5px', md: 1},
                  display: 'inline-flex',
                  backgroundColor: 'text.primary',
                  verticalAlign: 'middle',
                  borderRadius: '100%'
                }}/>
            </Box>
            <StyledButton variant="contained" sx={{minWidth: 150}}>Create LP Token</StyledButton>
          </Box>
        </PaperStyle>
      </Container>
    </RootStyle>
  );
}