import React from 'react';
import { Container, Box, Stack, Grid, Typography, Paper, Divider, Link, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import checkCircleFillIcon from '@iconify-icons/akar-icons/circle-check-fill';
import checkCircleOutlineIcon from '@iconify-icons/akar-icons/circle-check';
import crossCircleFillIcon from '@iconify-icons/akar-icons/circle-x-fill';
import crossCircleOutlineIcon from '@iconify-icons/akar-icons/circle-x';

// components
import Page from '../../components/Page';
import DIABadge from '../../components/DIABadge';
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
const SelectedTitleStyle = styled(Typography)(({ theme }) => ({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline',
  fontSize: {xs: '1.85rem', sm: '2rem', md: '2.25rem', lg: '2.5rem'}
}))
const CheckIcon = ({isSupported, selected=false})=>{
  if (typeof isSupported === 'string') {
    return <Typography variant='body2' align="center" sx={{px: 2}} color={selected?'origin.main':'text.primary'}>{isSupported}</Typography>
  }
  if(isSupported)
   return <Box sx={{color: 'origin.main'}}><Icon icon={selected?checkCircleFillIcon:checkCircleOutlineIcon} width={24}/></Box>
  return <Box sx={{color: 'text.secondary'}}><Icon icon={selected?crossCircleFillIcon:crossCircleOutlineIcon} width={24}/></Box>
}
const CellBoxStyle = styled(Box)((props) => {
  const { theme, isHeaderCell=true, isFirstColumn=false, isLastRow=false, isLastColumn=false, selected=false } = props
  const styleProp = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    flex: 1
  }
  if(selected) {
    styleProp.flex = 1.2
    styleProp.backgroundColor = theme.palette.grey[theme.palette.mode==='light'?300:700]
  }
  if(isHeaderCell) {
    styleProp.alignItems = 'start'
    styleProp.border = `1px solid ${theme.palette.divider}`
    if(!isLastColumn && !selected)
      styleProp.borderRight = 0
    else
      styleProp.borderTopRightRadius = 16
    if(isFirstColumn)
      styleProp.borderTopLeftRadius = 16
    if(selected) {
      styleProp.marginTop = -16
      styleProp.border = `3px solid ${theme.palette.origin.main}`
      styleProp.borderTopLeftRadius = 16
    }
    return styleProp
  }
  styleProp.borderLeft = `1px solid ${theme.palette.divider}`
  if(isLastRow){
    styleProp.alignItems = 'start'
    styleProp.borderBottom = `1px solid ${theme.palette.divider}`
  }
  if(isLastColumn)
    styleProp.borderRight = `1px solid ${theme.palette.divider}`
  if(isLastRow&&isLastColumn)
    styleProp.borderBottomRightRadius = 16
  if(selected) {
    styleProp.borderLeft = `3px solid ${theme.palette.origin.main}`
    styleProp.borderRight = `3px solid ${theme.palette.origin.main}`
    if(isLastRow) {
      styleProp.marginBottom = -16
      styleProp.borderBottomLeftRadius = 16
      styleProp.borderBottomRightRadius = 16
      styleProp.borderBottom = `3px solid ${theme.palette.origin.main}`
    }
  }
  return styleProp
});

export default function Features() {  
  React.useEffect(() => {
  }, []);

  const featureArray = [
    {title: 'Create item from Feeds default collection (FSTK)', allow: [true, true, true, true]},
    {title: 'Create item from Pasar default collection (PSRC)', allow: [true, true, true, true]},
    {title: 'Allowable number of collections to create', allow: [false, '1', 'Up to 5', 'Up to 10']},
    {title: 'Create item from own custom collection', allow: [true, true, true, true]},
    {title: 'Create items in batches (batch minting)', allow: [false, 'Up to 5', 'Up to 10', 'Up to 20']},
    {title: 'Sell items in batches (batch selling)', allow: [false, 'Up to 5', 'Up to 10', 'Up to 20']},
    {title: 'Sell item using DIA/PASAR token', allow: [true, true, true, true]},
    {title: 'Sell item using ERC-20 tokens (ESC)', allow: [false, true, true, true]},
    {title: 'Transfer item out from Pasar', allow: [false, true, true, true]},
    {title: 'Sell item with a fixed price', allow: [true, true, true, true]},
    {
      title: 'Sell item with auction',
      allow: [
        'Yes, but Reserve Price and Buy Now are not supported',
        'Both Reserve Price and Buy Now are supported',
        'Both Reserve Price and Buy Now are supported',
        'Both Reserve Price and Buy Now are supported'
      ]
    },
  ]
  return (
    <RootStyle title="Features | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{mb: 3}}>
          Features
        </Typography>
        <Typography variant="h5" sx={{fontWeight: 'normal', color: 'text.secondary', mb: 2}}>
          There are 4 types of Diamond (DIA) holders, namely Basic, Bronze, Silver and Gold.
          Just buy some DIA and hold a certain of amount to unlock exclusive features. See the table below for more information.
        </Typography>
        <Box sx={{width: 200}}>
          <StyledButton variant='contained' fullWidth sx={{mb: 1}}>Get DIA</StyledButton>
          <Typography variant="body2" sx={{fontWeight: 'normal', color: 'text.secondary', mb: 1}} align="center">
            1 DIA ≈ USD 40
          </Typography>
        </Box>
        <Stack sx={{mt: 3}}>
          <Stack direction="row">
            <Box sx={{display: 'flex', flex: 1, p: 2}}/>
            <CellBoxStyle isFirstColumn={Boolean(true)}>
              <Stack sx={{alignItems: 'center', mt: 1}} spacing={2}>
                <DIABadge degree={0} disableTooltip={Boolean(true)} zoomRate={1.4}/>
                <Typography variant="h3" align="center">BASIC</Typography>
                <Typography variant="body2" align="center">
                  Hold 0 DIA (no badge) or less than 0.01 DIA
                </Typography>
              </Stack>
            </CellBoxStyle>
            <CellBoxStyle selected={Boolean(true)}>
              <Stack sx={{alignItems: 'center', mt: 1}} spacing={2}>
                <DIABadge degree={1} disableTooltip={Boolean(true)} zoomRate={1.6}/>
                <SelectedTitleStyle variant="h3" align="center">BRONZE</SelectedTitleStyle>
                <Typography variant="subtitle1" align="center" color='origin.main'>
                  Hold more than 0.01 DIA but less than 0.1 DIA
                </Typography>
              </Stack>
            </CellBoxStyle>
            <CellBoxStyle>
              <Stack sx={{alignItems: 'center', mt: 1}} spacing={2}>
                <DIABadge degree={2} disableTooltip={Boolean(true)} zoomRate={1.4}/>
                <Typography variant="h3" align="center">SILVER</Typography>
                <Typography variant="body2" align="center">
                  Hold more than 0.1 DIA but less than 1 DIA
                </Typography>
              </Stack>
            </CellBoxStyle>
            <CellBoxStyle isLastColumn={Boolean(true)}>
              <Stack sx={{alignItems: 'center', mt: 1}} spacing={2}>
                <DIABadge degree={3} disableTooltip={Boolean(true)} zoomRate={1.4}/>
                <Typography variant="h3" align="center">GOLD</Typography>
                <Typography variant="body2" align="center">
                  Hold more than 1 DIA
                </Typography>
              </Stack>
            </CellBoxStyle>
          </Stack>
          {
            featureArray.map((feature, _i)=>{
              const isLastItem = _i===(featureArray.length-1)
              return <Stack direction="row" key={_i}>
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    backgroundColor: 'origin.main',
                    color: 'white',
                    // border: '1px solid black',
                    p: 2,
                    borderTopLeftRadius: _i===0?16:0,
                    borderBottomLeftRadius: isLastItem?16:0
                  }}
                >
                  {feature.title}
                </Box>
                <CellBoxStyle isHeaderCell={false} isLastRow={isLastItem}>
                  <CheckIcon isSupported={feature.allow[0]}/>
                </CellBoxStyle>
                <CellBoxStyle isHeaderCell={false} isLastRow={isLastItem} selected={Boolean(true)}>
                  <CheckIcon isSupported={feature.allow[1]} selected={Boolean(true)}/>
                </CellBoxStyle>
                <CellBoxStyle isHeaderCell={false} isLastRow={isLastItem}>
                  <CheckIcon isSupported={feature.allow[2]}/>
                </CellBoxStyle>
                <CellBoxStyle isHeaderCell={false} isLastRow={isLastItem} isLastColumn={Boolean(true)}>
                  <CheckIcon isSupported={feature.allow[3]}/>
                </CellBoxStyle>
              </Stack>
            })
          }
        </Stack>
      </Container>
    </RootStyle>
  );
}