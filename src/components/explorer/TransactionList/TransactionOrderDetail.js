import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

TransactionOrderDetail.propTypes = {
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
const FirstGridStyle = styled(Grid)(({ theme, alignsm }) => ({
    [theme.breakpoints.up('md')]: {
        borderRight: '1px solid #ddd'
    },
    [theme.breakpoints.down('md')]: {
        borderBottom: '1px solid #ddd'
    }
}));
export default function TransactionOrderDetail({ item }) {
    const { value, timestamp, gasFee, tokenIdHex } = item;
    return (
        <RootStyle>
            <Box
                component="img"
                alt=""
                src='/static/exchange.svg'
                sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: '#da3283', filter: 'invert(1)', p: 2 }}
            />
            <Grid container spacing={2}>
                <FirstGridStyle item xs={12} sm={12} md={8} sx={{}}>
                    <Grid container>
                        <Grid item xs={4} sm={3}>
                            <Typography color="inherit" variant="subtitle2" noWrap>
                                Value
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {value}&nbsp;ELA
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3}>
                            <Typography color="inherit" variant="subtitle2" noWrap align="center">
                                From
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center">
                                {tokenIdHex}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3}>
                            <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
                                To
                            </TypographyStyle>
                            <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
                                {tokenIdHex}
                            </TypographyStyle>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="left">
                                Timestamp
                            </TypographyStyle>
                            <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="left">
                                {timestamp.date}<br/>{timestamp.time}
                            </TypographyStyle>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <TypographyStyle color="inherit" variant="subtitle2" noWrap alignsm="right">
                                Tx Hash
                            </TypographyStyle>
                            <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap alignsm="right">
                                {tokenIdHex}
                                <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                                    <Icon icon={externalLinkFill} width="17px"/>
                                </IconButton>
                            </TypographyStyle>
                        </Grid>
                    </Grid>
                </FirstGridStyle>
                <Grid item xs={12} sm={12} md={4} align="right">
                    <Typography variant="h4" sx={{lineHeight: 1}}>
                        Transaction Summary
                    </Typography>
                    <table style={{marginTop: 5}}>
                        <tbody>
                            <tr>
                                <td>
                                    <Typography color="inherit" variant="subtitle2" noWrap>
                                        ▸ Seller
                                    </Typography>
                                </td>
                                <td align="right">
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        98 ELA + 0.001 ELA
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography color="inherit" variant="subtitle2" noWrap>
                                        ▸ Platform free
                                    </Typography>
                                </td>
                                <td align="right">
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        2 ELA + 0.001 ELA
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography color="inherit" variant="subtitle2" noWrap>
                                        ▸ Royalties
                                    </Typography>
                                </td>
                                <td align="right">
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        0 ELA
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} align="right">
                                    <Typography color="inherit" variant="subtitle2" noWrap sx={{borderTop: "1px solid", borderBottom: "1px solid", borderColor: 'text.secondary'}}>
                                        100.006 ELA
                                    </Typography>
                                    <Typography color="inherit" variant="subtitle2" noWrap sx={{borderTop: "1px solid", borderColor: 'text.secondary', marginTop: '1px'}}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Button
                        to='#'
                        size="small"
                        color="inherit"
                        component={RouterLink}
                        endIcon={<Icon icon={arrowIosForwardFill} />}
                    >
                        See more
                    </Button>
                </Grid>
            </Grid>
        </RootStyle>
    );
}