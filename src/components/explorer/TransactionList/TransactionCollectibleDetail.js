import PropTypes from 'prop-types';
import { Box, Button, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

TransactionCollectibleDetail.propTypes = {
    item: PropTypes.object.isRequired
};
const RootStyle = styled('div')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2)
}));
const TypographyStyle = styled(Typography)(({ theme, alignsm }) => ({
    [theme.breakpoints.down('sm')]: {
        textAlign: alignsm
    }
}));
export default function TransactionCollectibleDetail({ item }) {
    const { value, timestamp, gasFee, tokenIdHex } = item;
    return (
        <RootStyle>
            <Box
                component="img"
                alt=""
                src='/static/hammer.svg'
                sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: '#bdbdbd', padding: '14px' }}
            />
            <Grid container spacing={2}>
                <Grid item xs={7} sm={4}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Creator
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {tokenIdHex}
                    </Typography>
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Royalties
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        {value}&nbsp;%
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="left">
                        Tx Fee
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="left">
                        {gasFee}&nbsp;ELA
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Timestamp
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        {timestamp.date}<br/>{timestamp.time}
                    </TypographyStyle>
                </Grid>
            </Grid>
        </RootStyle>
    );
}