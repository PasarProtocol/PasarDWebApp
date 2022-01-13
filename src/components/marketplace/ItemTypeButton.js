import { Paper, Typography, ButtonBase, Box, } from '@mui/material';
import { Icon } from '@iconify/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

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
            {
                type==="FixedPrice"&&
                <LocalOfferOutlinedIcon sx={{ fontSize: 50 }}/>
            }
            {
                type==="Auction"&&
                <svg width="50" height="50" viewBox="0 0 66 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.2671 56.552V62.4055H65.1201V56.552H28.2671ZM26.4674 0.0253906L2.58053 22.7894L6.92305 26.9336L10.1784 25.8976L17.7855 33.1383L0.412346 49.6947L4.75486 53.8331L22.1249 37.2767L29.5078 44.3125L28.6387 47.6255L32.9843 51.7639L56.8712 28.9999L52.5256 24.8615L49.0553 25.6869L29.7259 7.26902L30.81 4.1667L26.4674 0.0253906ZM24.2962 10.3743L46.0118 31.0662L35.1555 41.415L13.4399 20.7231L24.2962 10.3743Z" fill="currentColor"/>
                </svg>
            }
            <Typography variant="body2">{type}</Typography>
        </Paper>
    )
}
export default ItemTypeButton;