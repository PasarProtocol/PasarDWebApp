// material
import { styled } from '@mui/material/styles';
import { Grid, Card, Box } from '@mui/material';
import StatisticItem from './StatisticItem'
// ----------------------------------------------------------------------
const RootStyle = styled(Card)(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4),
  maxWidth: 900,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

export default function StatisticPanel(props) {
  const { floorPrice=0, totalCount=0, totalOwner=0, totalPrice=0, marketPlace=1 } = props
  const volumeIconTypes = [
    {icon: 'elastos.svg', style: { filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }},
    {icon: 'ethereum.svg', style: { filter: (theme)=>theme.palette.mode==='light'?'invert(0.8)':'invert(0.2)', width: 16 }}
  ]
  let volumeIcon = {}
  if(marketPlace>0)
    volumeIcon = volumeIconTypes[marketPlace-1]
  else
    [volumeIcon] = volumeIconTypes
  return (
    <RootStyle>
      <Grid container>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="Trading Volume" index={1} value={totalPrice}>
            <Box component="img" src={`/static/${volumeIcon.icon}`} sx={{ width: 18, display: 'inline', verticalAlign: 'middle', ...volumeIcon.style }} />
          </StatisticItem>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🖼 Items" index={2} value={totalCount}/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="🔻 Floor Price" index={3} value={floorPrice}/>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <StatisticItem title="💪 Owners" index={4} value={totalOwner}/>
        </Grid>
      </Grid>
    </RootStyle>
  );
}