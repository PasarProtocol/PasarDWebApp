import { Paper, Typography, ButtonBase, Box, } from '@mui/material';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';

const PaperRecord = (props)=>{
    const {type, description, current} = props
    return(
        <Paper
            component={ButtonBase}
            align="center"
            sx={{
                color: current===type?'text.primary':'text.disabled',
                width: 180,
                height: 180,
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
                (type==="Single"||type==="Multiple")&&
                <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: 50 }} />
            }
            {
                type==="Multiple"&&
                <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: 50 }} />
            }
            {
                type==="Batch"&&
                <svg width="40" height="50" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.9 5.1V35.7H15.3V5.1H45.9ZM45.9 0H15.3C12.495 0 10.2 2.295 10.2 5.1V35.7C10.2 38.505 12.495 40.8 15.3 40.8H45.9C48.705 40.8 51 38.505 51 35.7V5.1C51 2.295 48.705 0 45.9 0ZM24.225 24.6585L28.5345 30.4215L34.8585 22.5165L43.35 33.15H17.85L24.225 24.6585ZM0 10.2V45.9C0 48.705 2.295 51 5.1 51H40.8V45.9H5.1V10.2H0Z" fill="currentColor"/>
                </svg>
            }
            <Typography variant="body2">{type}</Typography>
            <Typography variant="body2" sx={{height: 30}}>{description}</Typography>
        </Paper>
    )
}
export default PaperRecord;