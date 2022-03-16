import { InputLabel, Input } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const InputStyle = styled(Input)(({ theme }) => ({
  '&:before': {
    borderWidth: 0
  },
  '&:after': {
    borderColor: theme.palette.text.primary
  }
}));
export const InputLabelStyle = styled(InputLabel)(({ theme }) => ({
  '&.Mui-focused': {
    color: theme.palette.text.primary
  }
}));