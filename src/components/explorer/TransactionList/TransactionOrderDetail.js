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
import { MethodList, reduceHexAddress, getTime } from '../../../utils/common';
import {marketContract} from '../../../config'

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
    '& .MuiButton-root': {
        [theme.breakpoints.up('md')]: {
            float: 'right'
        },
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
export default function TransactionOrderDetail({ isAlone, item, noSummary }) {
    const { event, tHash } = item
    const method = event!==undefined?event:item.method
    const timestamp = getTime(item.timestamp)
    const price = parseFloat((item.price/ 10 ** 18).toFixed(2))
    const gasFee = item.gasFee?item.gasFee:0
    const platformFee = item.platformfee!==undefined?parseFloat((item.platformfee/ 10 ** 18).toFixed(7)):0
    const royalties = item.royalties!==undefined?parseFloat((item.royalties/ 10 ** 18).toFixed(7)):0
    const royaltyFee = item.royaltyFee?parseFloat((item.royaltyFee/ 10 ** 18).toFixed(7)):0
    let methodItem = MethodList.find((item)=>item.method===method)
    if(!methodItem)
        methodItem = {color: 'grey', icon: 'tag', detail: []}
    return (
        <RootStyle>
            <Box
                component="img"
                alt=""
                src={`/static/${methodItem.icon}.svg`}
                sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: methodItem.color, p: 2 }}
            />
            <Grid container spacing={2}>
                <FirstGridStyle item xs={12} sm={12} md={8}>
                    <Grid container>
                        <Grid item xs={12} sm={isAlone?8:12}>
                        {
                            methodItem.detail.map((el, index)=>{
                                let value = item[el.field]
                                if(el.field&&el.field.startsWith("data.")&&item.data)
                                    value = item.data[el.field.substring(5)]
                                if(el.field&&!el.copyable)
                                    value = parseFloat((value / 10 ** 18).toFixed(7))
                                if(el.field==="marketplace")
                                    value = marketContract
                                const displayValue = el.ellipsis?reduceHexAddress(value):value
                                return (
                                    <StackRowStyle key={index}>
                                        <Typography color="inherit" variant="subtitle2">
                                            {el.description}&nbsp;
                                            {
                                                el.field&&(
                                                    <Typography variant="span" sx={{ color: 'text.secondary', fontWeight: 'normal', display: 'inline-block' }}>
                                                        {
                                                            el.copyable?
                                                            <Link to={`/explorer/transaction/detail/${value}`} component={RouterLink}>
                                                                {displayValue}
                                                            </Link>:
                                                            displayValue
                                                        }
                                                        {el.copyable?<CopyButton text={value}/>:' ELA'}
                                                    </Typography>
                                                )
                                            }
                                        </Typography>
                                    </StackRowStyle>
                                )
                            })
                        }
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
                                            <MethodLabel methodName={method}/>
                                        </TypographyStyle>
                                    </StackColStyle>
                                    <StackColStyle>
                                        <TypographyStyle color="inherit" variant="subtitle2" noWrap align="right" alignsm="left">
                                            Tx Hash&nbsp;
                                        </TypographyStyle>
                                        <TypographyStyle variant="body2" sx={{ color: 'text.secondary', flex: 1 }} noWrap align="right" alignsm="left">
                                            <Link href={`https://esc.elastos.io/tx/${tHash}`} sx={{borderRadius: 1}} target="_blank">
                                                {reduceHexAddress(tHash)}
                                                <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                                                    <Icon icon={externalLinkFill} width="17px"/>
                                                </IconButton>
                                            </Link>
                                        </TypographyStyle>
                                    </StackColStyle>
                                </Grid>
                            )
                        }
                    </Grid>
                </FirstGridStyle>
                {!noSummary&&
                    <SummaryGridStyle item xs={12} sm={12} md={4}>
                        <Typography variant="h4" sx={{lineHeight: 1}}>
                            Transaction Summary
                        </Typography>
                        <table style={{marginTop: 10, width: '100%'}}>
                            <tbody>
                                {
                                    method==="BuyOrder"?(
                                        <>
                                            <tr>
                                                <td>
                                                    <Typography color="inherit" variant="subtitle2" noWrap>
                                                        ▸ Seller
                                                    </Typography>
                                                </td>
                                                <td align="right">
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                        {parseFloat((price - platformFee - royaltyFee).toFixed(7))} ELA
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
                                                        {platformFee} ELA
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
                                                        {royaltyFee} ELA
                                                    </Typography>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography color="inherit" variant="subtitle2" noWrap>
                                                        ▸ Tx fee
                                                    </Typography>
                                                </td>
                                                <td align="right">
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                        {gasFee} ELA
                                                    </Typography>
                                                </td>
                                            </tr>
                                        </>
                                    ):(
                                        <tr>
                                            <td>
                                                <Typography color="inherit" variant="subtitle2" noWrap>
                                                    ▸ Tx fee
                                                </Typography>
                                            </td>
                                            <td align="right">
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                    {gasFee} ELA
                                                </Typography>
                                            </td>
                                        </tr>
                                    )
                                }
                                
                                <tr>
                                    <td colSpan={2} align="right">
                                        <Typography color="inherit" variant="subtitle2" noWrap sx={{borderTop: "1px solid", borderBottom: "1px solid", borderColor: 'text.secondary'}}>
                                            {method==="BuyOrder"?(price + gasFee):gasFee} ELA
                                        </Typography>
                                        <Typography color="inherit" variant="subtitle2" noWrap sx={{borderTop: "1px solid", borderColor: 'text.secondary', marginTop: '1px'}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <Button
                            to={'/explorer/transaction/detail/'.concat(to)}
                            size="small"
                            color="inherit"
                            component={RouterLink}
                            endIcon={<Icon icon={arrowIosForwardFill} />}
                        >
                            See more
                        </Button> */}
                    </SummaryGridStyle>
                }
            </Grid>
        </RootStyle>
    );
}