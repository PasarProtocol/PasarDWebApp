import React, { useState } from "react";
import * as math from 'mathjs';
import {Dialog, DialogTitle, DialogContent, IconButton, Typography, Input, FormControl, InputLabel, Divider, Accordion, AccordionSummary, AccordionDetails, 
    Grid, Tooltip, Button, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';

import CoinSelect from '../marketplace/CoinSelect';
import {removeLeadingZero} from '../../utils/common';

const InputStyle = styled(Input)(({ theme }) => ({
    '&:before': {
        borderWidth: 0
    }
}));

export default function Transfer(props) {
    const {isOpen, setOpen, title} = props
    const [address, setAddress] = React.useState('');
    const [isOpenAdvanced, setOpenAdvanced] = React.useState(false);
    const [memo, setMemo] = React.useState('');
    const handleClose = () => {
        setOpen(false);
    }

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
                    Transfer Item
                </Typography>
                <Typography variant="body1" sx={{color: 'text.secondary', display: 'inline', pr: 1, py: 2}}>
                    Item: 
                </Typography>
                <Typography variant="subtitle1" sx={{display: 'inline'}}>{title}</Typography>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{fontWeight: 'normal'}}>Wallet Address</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" sx={{width: '100%'}}>
                      <InputLabel htmlFor="input-with-price">
                        Enter recipient wallet address
                      </InputLabel>
                      <InputStyle
                        id="input-with-price"
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                        startAdornment={' '}
                        endAdornment={
                          <QrCodeScannerIcon/>
                        }
                      />
                    </FormControl>
                    <Divider/>
                  </Grid>
                </Grid>
                <Accordion expanded={isOpenAdvanced} sx={{my:0}}>
                  <AccordionSummary onClick={()=>setOpenAdvanced(!isOpenAdvanced)} sx={{p:0, '& .MuiAccordionSummary-content': {justifyContent: 'center'}}}>
                    <Typography variant="body2" sx={{display: 'inline-flex', alignItems: 'center'}}>Advanced Settings <Icon icon={isOpenAdvanced?arrowIosUpwardFill:arrowIosDownwardFill} width={20} height={20}/></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="h4" sx={{fontWeight: 'normal'}}>Memo</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl variant="standard" sx={{width: '100%'}}>
                          <InputLabel htmlFor="input-with-price">
                            Enter memo Transferred via Pasar
                          </InputLabel>
                          <InputStyle
                            id="input-with-price"
                            value={memo}
                            onChange={(e)=>{setMemo(e.target.value)}}
                            startAdornment={' '}
                          />
                        </FormControl>
                        <Divider/>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
                    <Button variant="contained" fullWidth>
                        Transfer
                    </Button>
                </Box>
                <Typography variant="caption" display="block" sx={{color: 'text.secondary'}} gutterBottom align="center">
                    We do not own your private keys and cannot access your funds<br/>without your confirmation.
                </Typography>
            </DialogContent>
        </Dialog>
    )
}