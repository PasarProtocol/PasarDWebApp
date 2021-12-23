import { Paper } from '@mui/material';

const LoadingWrapper = (props)=>(
    <Paper
        sx={{
            border: '1px solid',
            borderColor: 'action.disabledBackground',
            boxShadow: (theme) => theme.customShadows.z1,
            ...props.sx
        }}
        >
        {props.children}
    </Paper>
)
export default LoadingWrapper;