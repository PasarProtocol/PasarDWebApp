import { Paper, Typography, ButtonBase, Box, } from '@mui/material';
import { Icon } from '@iconify/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ItemTypeButton = (props)=>{
    const {type, current} = props
    return(
        <Paper
            component={ButtonBase}
            align="center"
            sx={{
                color: current===type?'text.primary':'text.disabled',
                width: 130,
                height: 130,
                display: 'inline-block',
                p: 3,
                cursor: 'pointer',
                borderWidth: current===type?'3px':'1px',
                borderStyle: 'solid',
                borderColor: current===type?'action.active':'action.disabledBackground',
                boxShadow: (theme) => theme.customShadows.z1,
                ...props.sx,
                '&:hover': {
                    backgroundColor: 'action.hover',
                    // boxShadow: 'rgb(0 0 0 / 14%) 0px 2px 3px 0px'
                }
            }}
            onClick={props.onClick}
        >
            {
                type==="General"&&
                <font style={{ fontSize: 50, lineHeight: 0 }}><Icon icon="eva:image-outline"/></font>
            }
            {
                type==="Avatar"&&
                <AccountCircleIcon sx={{ fontSize: 50 }}/>
            }
            <Typography variant="body2">{type}</Typography>
        </Paper>
    )
}
export default ItemTypeButton;