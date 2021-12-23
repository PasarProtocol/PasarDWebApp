import sharpContentCopy from '@iconify/icons-ic/sharp-content-copy';
import { Icon } from '@iconify/react';
import IconButton from '@mui/material/IconButton';

export default function CopyButton(){
    return (
        <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
            <Icon icon={sharpContentCopy} width="17px"/>
        </IconButton>
    )
}