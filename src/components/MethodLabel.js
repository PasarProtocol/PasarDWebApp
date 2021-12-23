import { Typography } from '@mui/material';

export default function MethodLabel({description}){
    return (
    <Typography variant="body2" component="span" color='text.secondary' noWrap
        sx={{
            px: 1,
            background: '#25CD7C',
            color: '#E3F8EF',
            borderRadius: 10,
            display: 'inline-block',
            verticalAlign: 'top'
        }}
    >
        {description}
    </Typography>)
}