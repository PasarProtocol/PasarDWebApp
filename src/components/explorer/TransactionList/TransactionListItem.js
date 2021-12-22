import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

TransactionListItem.propTypes = {
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
export default function TransactionListItem({ item }) {
    const { image, name, value, postedAt, tokenIdHex } = item;
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
                <Grid item xs={6} sm={3}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {name}
                    </Typography>
                </Grid>
                <Grid item xs={6} sm={5}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Description
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        {tokenIdHex}
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="left">
                        Owner
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="left">
                        {tokenIdHex}
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Date
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        {formatDistance(postedAt, new Date(), { addSuffix: true }).replace("about","").trim()}
                    </TypographyStyle>
                </Grid>
            </Grid>
        </RootStyle>
    );
}