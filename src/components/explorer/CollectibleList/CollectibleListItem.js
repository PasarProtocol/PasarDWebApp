import PropTypes from 'prop-types';
import { Box, Stack, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

CollectibleListItem.propTypes = {
    item: PropTypes.object.isRequired
};
const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2)
}));
export default function CollectibleListItem({ item }) {
    const { image, name, value, timestamp, gasFee, tokenIdHex } = item;
    
    return (
        <RootStyle>
            <Box
                component="img"
                alt={name}
                src={image}
                sx={{ width: 48, height: 48, borderRadius: 1, mr: 2 }}
            />
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Typography color="inherit" variant="subtitle2" align="left" noWrap>
                        Collectible
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} align="left">
                        {name}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Token ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {tokenIdHex}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography color="inherit" variant="subtitle2" noWrap align="left">
                        Value
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap align="left">
                        {value}&nbsp;ELA
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="inherit" variant="subtitle2" noWrap align="left">
                        Gas Fee
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap align="left">
                        {gasFee}&nbsp;ELA
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Timestamp
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {timestamp.date}<br/>{timestamp.time}
                    </Typography>
                </Grid>
            </Grid>
        </RootStyle>
    );
}