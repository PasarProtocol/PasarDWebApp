// material
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography, Grid, Card, Stack } from '@mui/material';
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme, index }) => ({
  textAlign: 'center',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  borderRight: index===4?0:'1px solid',
  borderColor: `${theme.palette.grey[500_32]} !important`,
  [theme.breakpoints.down('sm')]: index%2===0?{
    borderRight: 0
  }:{}
}));
export default function StatisticItem({title, value, index}) {
  return (
    <RootStyle index={index}>
        <Stack spacing={2}>
            <h2>{value}</h2>
            <Typography variant="body" sx={{ color: 'text.secondary' }}>
                {title}
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