import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import MethodLabel from '../../MethodLabel';
import { reduceHexAddress, getAssetImage } from '../../../utils/common';

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
    return (
        <RootStyle>
            <Link to={`/explorer/collectible/detail/${item.tokenId}`} component={RouterLink} sx={{borderRadius: 1}} >
                <Box
                    draggable = {false}
                    component="img"
                    alt={item.name}
                    src={getAssetImage(item, true)}
                    onError={(e) => e.target.src = '/static/broken-image.svg'}
                    sx={{ width: 48, height: 48, borderRadius: 1, mr: 2 }}
                />
            </Link>
            <Grid container spacing={2}>
                <Grid item xs={5} sm={3}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <Link to={`/explorer/collectible/detail/${item.tokenId}`} component={RouterLink}>
                            {item.name}
                        </Link>
                    </Typography>
                </Grid>
                <Grid item xs={7} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Method
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        <MethodLabel methodName={item.event}/>
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="left">
                        Tx Hash
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="left">
                        <Link href={`https://esc.elastos.io/tx/${item.tHash}`} sx={{borderRadius: 1}} target="_blank">
                            {reduceHexAddress(item.tHash)}
                            <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                                <Icon icon={externalLinkFill} width="17px"/>
                            </IconButton>
                        </Link>
                    </TypographyStyle>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                        Date
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                        {formatDistance(item.timestamp*1000, new Date(), { addSuffix: true }).replace("about","").trim()}
                    </TypographyStyle>
                </Grid>
            </Grid>
        </RootStyle>
    );
}