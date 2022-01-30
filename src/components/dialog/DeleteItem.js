import React, { useState } from "react";
import * as math from 'mathjs';
import {Dialog, DialogTitle, DialogContent, IconButton, Typography, Link, Button, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { reduceHexAddress } from '../../utils/common'
import { blankAddress } from '../../config'

export default function DeleteItem(props) {
    const {isOpen, setOpen, title} = props
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
                  Delete Item
                </Typography>
                <Typography variant="h5" sx={{color: 'text.secondary'}}>
                  You are about to send <Typography variant="h5" sx={{display: 'inline', color: 'text.primary'}}>{title}</Typography> to the burn address below
                </Typography>
                <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2, textAlign: "center" }}>
                    <Link href="#" color='red'>
                        {reduceHexAddress(blankAddress)}
                    </Link>
                </Box>
                <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2 }}>
                    <Button variant="contained" fullWidth>
                      Delete Item
                    </Button>
                </Box>
                <Typography variant="caption" display="block" sx={{color: 'text.secondary'}} gutterBottom align="center">
                    We do not own your private keys and cannot access your funds<br/>without your confirmation.
                </Typography>
            </DialogContent>
        </Dialog>
    )
}