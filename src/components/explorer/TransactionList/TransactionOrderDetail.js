import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Link, Typography, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MethodLabel from '../../MethodLabel';
import CopyButton from '../../CopyButton';
import { reduceHexAddress } from '../../../utils/common';

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
        paddingTop: '0 !important',
        paddingRight: theme.spacing(2),
        marginTop: theme.spacing(2),
        borderRight: '1px solid #ddd'
    },
    [theme.breakpoints.down('md')]: {
        paddingLeft: '0 !important',
        marginLeft: theme.spacing(2),
        borderBottom: '1px solid #ddd'
    }
}));
const SummaryGridStyle = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: '-webkit-right'
    },
    [theme.breakpoints.down('md')]: {
        textAlign: '-webkit-left'
    }
}));
const StackRowStyle = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    // [theme.breakpoints.down('md')]: {
    //   flexDirection: 'column',
    // }
}));
const StackColStyle = styled(Stack)(({ theme }) => ({
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
    }
}));
export default function TransactionOrderDetail({ isAlone, item }) {
    const { from, to, value, method, timestamp, gasFee, tokenIdHex } = item;
    return (
        <RootStyle>
            <Box
                component="img"
                alt=""
                src='/static/exchange.svg'
                sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: '#da3283', filter: 'invert(1)', p: 2 }}
            />
            <Grid container spacing={2}>
                <FirstGridStyle item xs={12} sm={12} md={8}>
                    <Grid container>
                        <Grid item xs={12} sm={isAlone?8:12}>
                            <StackRowStyle>
                                <Typography color="inherit" variant="subtitle2" noWrap>
                                    Collectible transferred to&nbsp;
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                    {reduceHexAddress(to)}
                                    <CopyButton/>
                                </Typography>
                            </StackRowStyle>
                            <StackRowStyle>
                                <Typography color="inherit" variant="subtitle2" noWrap>
                                    By&nbsp;
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                    {reduceHexAddress(from)}
                                    <CopyButton/>
                                </Typography>
                            </StackRowStyle>
                            <StackRowStyle>
                                <Typography color="inherit" variant="subtitle2" noWrap>
                                    For a value of &nbsp;
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                    {value}&nbsp;ELA
                                </Typography>
                            </StackRowStyle>
                            <StackRowStyle>
                                <Typography color="inherit" variant="subtitle2" noWrap>
                                    And tx fee of &nbsp;
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                    {gasFee}&nbsp;ELA
                                </Typography>
                            </StackRowStyle>
                            <StackRowStyle>
                                <Typography color="inherit" variant="subtitle2" noWrap>
                                    On &nbsp;
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                    {timestamp.date} {timestamp.time}
                                </Typography>
                            </StackRowStyle>
                        </Grid>
                        {
                            isAlone&&(
                                <Grid item xs={12} sm={4}>
                                    <StackColStyle sx={{pb:1}}>
                                        <TypographyStyle color="inherit" variant="subtitle2" noWrap align="right" alignsm="left" sx={{pr:.6}}>
                                            Method
                                        </TypographyStyle>
                                        <TypographyStyle variant="body2" sx={{ color: 'text.secondary', flex: 1 }} noWrap align="right" alignsm="left">
                                            <MethodLabel description={method}/>
                                        </TypographyStyle>
                                    </StackColStyle>
                                    <StackColStyle>
                                        <TypographyStyle color="inherit" variant="subtitle2" noWrap align="right" alignsm="left">
                                            Tx Hash&nbsp;
                                        </TypographyStyle>
                                        <TypographyStyle variant="body2" sx={{ color: 'text.secondary', flex: 1 }} noWrap align="right" alignsm="left">
                                            {reduceHexAddress(tokenIdHex)}
                                            <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                                                <Icon icon={externalLinkFill} width="17px"/>
                                            </IconButton>
                                        </TypographyStyle>
                                    </StackColStyle>
                                </Grid>
                            )
                        }
                    </Grid>
                </FirstGridStyle>
                <SummaryGridStyle item xs={12} sm={12} md={4}>
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
                                        ▸ Platform fee
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
                        to={'/explorer/transaction/'.concat(to)}
                        size="small"
                        color="inherit"
                        component={RouterLink}
                        endIcon={<Icon icon={arrowIosForwardFill} />}
                    >
                        See more
                    </Button>
                </SummaryGridStyle>
            </Grid>
        </RootStyle>
    );
}