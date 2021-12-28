import { Typography } from '@mui/material';
import { MethodList } from '../utils/common'

export default function MethodLabel({methodName}){
    const methodItem = MethodList.find((item)=>item.method===methodName)
    const methodColor = methodItem?methodItem.color:'grey'

    return (
    <Typography variant="body2" component="span" color='text.secondary' noWrap
        sx={{
            px: 1,
            background: methodColor,
            color: '#E3F8EF',
            borderRadius: 10,
            display: 'inline-block',
            verticalAlign: 'top'
        }}
    >
        {methodName}
    </Typography>)
}