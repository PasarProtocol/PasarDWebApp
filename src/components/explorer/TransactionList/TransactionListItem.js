import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import MethodLabel from '../../MethodLabel';
import { reduceHexAddress } from '../../../utils/common';

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
    const { image, name, method, postedAt, txHash } = item;
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
                <Grid item xs={5} sm={3}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {name}
                    </Typography>
                </Grid>
                <Grid item xs={7} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Method
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        <MethodLabel methodName={method}/>
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="left">
                        Tx Hash
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="left">
                        {reduceHexAddress(txHash)}
                        <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                            <Icon icon={externalLinkFill} width="17px"/>
                        </IconButton>
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={3}>
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