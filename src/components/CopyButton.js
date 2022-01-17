import { CopyToClipboard } from 'react-copy-to-clipboard';
import sharpContentCopy from '@iconify/icons-ic/sharp-content-copy';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';

export default function CopyButton({text, sx}){
    const { enqueueSnackbar } = useSnackbar();
    const onCopy = () => {
        enqueueSnackbar('Copied to clipboard', { variant: 'success' });
    };
    return (
        <CopyToClipboard text={text} onCopy={onCopy}>
            <IconButton type="button" sx={{ p: '5px', ...sx }} aria-label="link" onClick={(e)=>{e.preventDefault(); e.stopPropagation()}}>
                <Icon icon={sharpContentCopy} width="17px"/>
            </IconButton>
        </CopyToClipboard>
    )
}