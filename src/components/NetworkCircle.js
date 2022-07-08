import React from 'react'
import { Paper, Typography, Tooltip, Box } from '@mui/material';
import { chainTypes, getChainTypeFromId } from '../utils/common'
import useSignin from '../hooks/useSignin';

const NetworkCircle = (props)=>{
    const [chainType, setChainType] = React.useState('ESC')
    const [chainIndex, setChainIndex] = React.useState(0)
    const { pasarLinkChain } = useSignin()

    React.useEffect(()=>{
        const currentChain = getChainTypeFromId(pasarLinkChain)
        setChainType(currentChain)
        if(currentChain==='ESC' || currentChain==='ETH')
            setChainIndex(currentChain==='ESC'?0:1)
    }, [pasarLinkChain])
    
    let networkName = ''
    if(chainType === 'ESC')
        networkName = chainTypes[0].name
    else if(chainType === 'ETH')
        networkName = chainTypes[1].name
    else networkName = 'Unsupported network'

    const iconFilter = (theme)=>{
        if(!chainType)
            return 'invert(0.5)'
        return theme.palette.mode==='dark' ? 'unset' : 'invert(0.9)'
    }
    return(
        <Tooltip title={`Current Network: ${networkName}`} arrow disableInteractive enterTouchDelay={0}>
            <Paper
                align="center"
                sx={{
                    minWidth: 40, 
                    height: 40,
                    p: 1,
                    ml: 1,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'action.disabledBackground',
                    borderRadius: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    background: 'transparent'
                }}
            >
                <Box draggable = {false} component="img" src={`/static/${chainTypes[chainIndex].icon}`} sx={{ filter: iconFilter }} />
            </Paper>
        </Tooltip>
    )
}
export default NetworkCircle;