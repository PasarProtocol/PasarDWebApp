import { Paper } from '@mui/material';

const PaperRecord = (props)=>(
    <Paper
        sx={{
            border: '1px solid',
            borderColor: 'action.disabledBackground',
            boxShadow: (theme) => theme.customShadows.z1,
            ...props.sx
        }}
        onClick={props.onClick}
    >
        {props.children}
    </Paper>
)
export default PaperRecord;