import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link } from '@mui/material';
// components
import Page from '../../components/Page';
import MintingTypeButton from '../../components/marketplace/MintingTypeButton';
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

export default function Collectible() {
  const [type, setType] = React.useState("Single");
  React.useEffect(async () => {
    
  }, []);
  
  return (
    <RootStyle title="CreateItem | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{mb: 3}}>
            Create Item
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Minting Type</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row">
              <MintingTypeButton type="Single" description="Single item" onClick={()=>{setType("Single")}} current={type}/>
              <MintingTypeButton type="Multiple" description="Multiple identical items" onClick={()=>{setType("Multiple")}} current={type}/>
              <MintingTypeButton type="Batch" description="Multiple non-identical items" onClick={()=>{setType("Batch")}} current={type}/>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
