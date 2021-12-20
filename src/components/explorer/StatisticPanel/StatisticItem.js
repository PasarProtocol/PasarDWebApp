// material
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Card, Stack } from '@mui/material';
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme, index }) => {
  let sm = {};
  if(index%2===0)
    sm.borderRight = 0
  else if(index===1||index===2)
    sm.marginBottom = 24
  else sm = {}
  return {
    textAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    borderRight: index===4?0:'1px solid',
    borderColor: `${theme.palette.grey[500_32]} !important`,
    [theme.breakpoints.down('sm')]: sm
  }
});
export default function StatisticItem(props) {
  return (
    <RootStyle index={props.index}>
        <Stack spacing={2}>
            <h2>{props.value}</h2>
            <Typography variant="body" sx={{ color: 'text.secondary' }}>
                {props.children} {props.title}
            </Typography>
        </Stack>
    </RootStyle>
  );
}

StatisticItem.propTypes = {
    borderRight: PropTypes.number,
};
StatisticItem.defaultProps = {
    borderRight: 1
};