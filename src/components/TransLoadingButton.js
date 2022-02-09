import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

const LoadingButtonStyled = styled(LoadingButton)(({ theme }) => ({
  minWidth: 200,
  '&.Mui-disabled': {
    paddingLeft: 40,
    color: theme.palette.origin.main,
    borderColor: theme.palette.origin.main
  }
}));

export default function TransLoadingButton(props) {
  return <LoadingButtonStyled
    loadingPosition="start"
    loading={props.loading}
    startIcon={<div/>}
    variant={props.loading?"outlined":"contained"}
    fullWidth
    onClick={props.onClick}>
    {props.loading?"Please Sign Transaction From Wallet":props.children}
  </LoadingButtonStyled>;
}