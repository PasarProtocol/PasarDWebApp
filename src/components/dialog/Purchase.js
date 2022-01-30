import React, { useState } from "react";
import * as math from 'mathjs';
import { useWeb3React } from "@web3-react/core";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Box, Grid, Stack, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { reduceHexAddress, getBalance } from "../../utils/common";

export default function Purchase(props) {
    const [balance, setBalance] = useState(0);
    
    const context = useWeb3React()
    const { library, chainId, account } = context;

    const {isOpen, setOpen, info} = props
    const handleClose = () => {
        setOpen(false);
    }

    React.useEffect(async() => {
        const sessionLinkFlag = sessionStorage.getItem('PASAR_LINK_ADDRESS')
        if(sessionLinkFlag){
          if(sessionLinkFlag==='1' && library)
            getBalance(library.provider).then((res)=>{setBalance(math.round(res/1e18, 4))})
          if(sessionLinkFlag==='2' && essentialsConnector.getWalletConnectProvider())
            getBalance(essentialsConnector.getWalletConnectProvider()).then((res)=>{setBalance(math.round(res/1e18, 4))})
        }
    }, [account, chainId]);

    const price = info.Price/1e18
    const platformFee = math.round(price*2/100, 4)
    const royalties = info.SaleType==="Primary Sale"?0:math.round(price*info.royalties/10**6, 4)
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h3" component="div" sx={{color: 'text.primary'}} align="center">
                    Checkout
                </Typography>
                <Typography variant="h5" component="div" sx={{color: 'text.secondary'}}>
                    You are about to purchase <Typography variant="h5" sx={{display: 'inline', color: 'text.primary'}}>{info.name}</Typography><br/>
                    from <Typography variant="h5" sx={{display: 'inline', color: 'text.primary'}}>{reduceHexAddress(info.holder)}</Typography><br/>
                    for <Typography variant="h5" sx={{display: 'inline', color: 'text.primary'}}>{math.round(info.Price/1e18, 3)} ELA</Typography>
                </Typography>
                <Grid container sx={{mt: 2, display: 'block'}}>
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Typography variant="body2" display="block" sx={{flex: 1, mb: .5}}>
                                Wallet Balance
                            </Typography>
                            <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary', mb: .5}}>
                                {balance} ELA
                            </Typography>
                        </Stack>
                        <Divider sx={{mb: .5}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Typography variant="body2" display="block" gutterBottom sx={{flex: 1}}>
                                Platform fee 2%
                            </Typography>
                            <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary'}}>
                                {platformFee} ELA
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Typography variant="body2" display="block" gutterBottom sx={{flex: 1}}>
                                Creator will get (royalties)
                            </Typography>
                            <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary'}}>
                                {royalties} ELA
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Typography variant="body2" display="block" gutterBottom sx={{flex: 1}}>
                                Seller will get
                            </Typography>
                            <Typography variant="body2" display="block" gutterBottom align="right" sx={{ color: 'text.secondary'}}>
                                {price - platformFee - royalties} ELA
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Typography variant="body2" display="block" gutterBottom sx={{flex: 1}} color='red'>
                                You will pay
                            </Typography>
                            <Typography variant="body2" display="block" gutterBottom align="right">
                                {price} ELA
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                {
                    price<=balance?
                    <>
                        <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
                            <Button variant="contained" fullWidth>
                                Buy
                            </Button>
                        </Box>
                        <Typography variant="body2" display="block" color='red' gutterBottom align="center">
                            Please check all item details before making a purchase
                        </Typography>
                    </>:
                    <>
                        <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
                            <Button variant="outlined" href="https://glidefinance.io/swap" target="_blank" fullWidth>
                                Add funds
                            </Button>
                        </Box>
                        <Typography variant="body2" display="block" color='red' gutterBottom align="center">
                            Insufficient funds in ELA
                        </Typography>
                    </>
                }
                <Typography variant="caption" display="block" sx={{color: 'text.secondary'}} gutterBottom align="center">
                    We do not own your private keys and cannot access your funds<br/>without your confirmation.
                </Typography>
            </DialogContent>
        </Dialog>
    )
}