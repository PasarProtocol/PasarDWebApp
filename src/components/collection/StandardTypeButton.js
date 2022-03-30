import { styled } from '@mui/material/styles';
import { Paper, Typography, ButtonBase, Box } from '@mui/material';

const SvgStyle = styled('svg')(({ theme }) => ({
    width: 40,
    height: 50,
    [theme.breakpoints.down('sm')]: {
        width: 20,
        height: 25,
    }
}));

const StandardTypeButton = (props)=>{
    const {type, description, current, disabled=false} = props

    return(
        <Paper
            component={ButtonBase}
            align="center"
            disabled={1&&disabled}
            sx={{
                color: current===type?'text.primary':'text.disabled',
                width: {xs: 140, sm: 180},
                height: {xs: 140, sm: 180},
                display: 'inline-block',
                p: {xs: 2, sm: 3},
                cursor: 'pointer',
                borderWidth: current===type?'2px':'1px',
                borderStyle: 'solid',
                borderColor: current===type?'action.active':'action.disabledBackground',
                boxShadow: (theme) => theme.customShadows.z1,
                ...props.sx,
                '&:hover': {
                    backgroundColor: 'action.hover',
                }
            }}
            onClick={props.onClick}
        >
            <Box sx={{ width: {xs: 42, sm: 50}, height: {xs: 42, sm: 50}, borderRadius: 2, p: {xs: 1.2, sm: 1.5}, m: 'auto', backgroundColor: current===type?'text.primary':'text.disabled' }}>
                <Box draggable = {false} component="img" src="/static/collection.svg" sx={{ width: {xs: 22, sm: 26}, height: {xs: 22, sm: 26} }} />
            </Box>
            <Typography variant="body2" sx={{ fontSize: {xs: 14, sm: ''}, lineHeight: {xs: 2.5, sm: 3} }}>{type}</Typography>
            <Typography variant="body2" sx={{ height: 30, fontSize: {xs: 14, sm: ''}, lineHeight: {xs: 1.2, sm: ''} }}>{description}</Typography>
        </Paper>
    )
}
export default StandardTypeButton;