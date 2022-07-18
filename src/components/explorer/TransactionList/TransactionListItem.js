import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import MethodLabel from '../../MethodLabel';
import { reduceHexAddress, getAssetImage, MethodList, getExplorerSrvByNetwork } from '../../../utils/common';

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
    const handleErrorImage = (e) => {
        if(e.target.src.indexOf("pasarprotocol.io") >= 0) {
          e.target.src = getAssetImage(item, true, 1)
        } else if(e.target.src.indexOf("ipfs.ela") >= 0) {
          e.target.src = getAssetImage(item, true, 2)
        } else {
          e.target.src = '/static/broken-image.svg'
        }
    }

    const methodItem = MethodList.find((el)=>el.method===item.event)
    const explorerSrvUrl = getExplorerSrvByNetwork(item.marketPlace)
    return (
        <RootStyle>
            {
                item.event==="SetApprovalForAll"?
                <Box
                    component="img"
                    alt=""
                    src={`/static/${methodItem.icon}.svg`}
                    sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: methodItem.color, p: 2 }}
                />:
                <Link to={`/explorer/collectible/detail/${[item.tokenId, item.baseToken].join('&')}`} component={RouterLink} sx={{borderRadius: 1}} >
                    <Box
                        draggable = {false}
                        component="img"
                        alt={item.name}
                        src={getAssetImage(item, true)}
                        onError={handleErrorImage}
                        sx={{ width: 48, height: 48, borderRadius: 1, mr: 2 }}
                    />
                </Link>
            }
            <Grid container spacing={2}>
                <Grid item xs={5} sm={3}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Name
                    </Typography>
                    <Link to={`/explorer/collectible/detail/${[item.tokenId, item.baseToken].join('&')}`} component={RouterLink} color='text.secondary'>
                        <Typography variant="body2">
                            {item.name}
                        </Typography>
                    </Link>
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
                        <Link href={`${explorerSrvUrl}/tx/${item.tHash}`} color='text.secondary' target="_blank">
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