import PropTypes from 'prop-types';
import { Box, Stack, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

CollectibleListItem.propTypes = {
    item: PropTypes.object.isRequired
};
const RootStyle = styled('div')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2)
}));
const TypographyStyle = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        textAlign: "right"
    }
}));
export default function CollectibleListItem({ item }) {
    const { image, name, value, timestamp, gasFee, tokenIdHex } = item;
    return (
        <RootStyle>
            <Box
                component="img"
                alt={name}
                src={image}
                onError={(e) => e.target.src = '/static/broken-image.svg'}
                sx={{ width: 48, height: 48, borderRadius: 1, mr: 2 }}
            />
            <Grid container spacing={2}>
                <Grid item xs={7} sm={3}>
                    <Typography color="inherit" variant="subtitle2" align="left" noWrap>
                        Collectible
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} align="left">
                        {name}
                    </Typography>
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap>
                        Token ID
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {tokenIdHex}
                    </TypographyStyle>
                </Grid>
                <Grid item xs={4} sm={3}>
                    <Typography color="inherit" variant="subtitle2" noWrap align="left">
                        Value
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap align="left">
                        {value}&nbsp;ELA
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <Typography color="inherit" variant="subtitle2" noWrap align="left">
                        Gas Fee
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap align="left">
                        {gasFee}&nbsp;ELA
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap>
                        Timestamp
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {timestamp.date}<br/>{timestamp.time}
                    </TypographyStyle>
                </Grid>
            </Grid>
        </RootStyle>
    );
}