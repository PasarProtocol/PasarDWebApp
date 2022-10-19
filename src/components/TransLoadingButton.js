import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

const LoadingButtonStyled = styled(LoadingButton)(({ theme }) => ({
  minWidth: 200,
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.grey[700],
  '&:hover':
    theme.palette.mode === 'dark'
      ? {
          backgroundColor: theme.palette.grey[600]
        }
      : {},
  '&.Mui-disabled': {
    paddingLeft: 40,
    color: theme.palette.origin.main,
    borderColor: theme.palette.origin.main,
    backgroundColor: 'unset'
  }
}));

export default function TransLoadingButton(props) {
  return (
    <LoadingButtonStyled
      loadingPosition="start"
      loading={props.loading}
      startIcon={<div />}
      variant={props.loading ? 'outlined' : 'contained'}
      fullWidth
      onClick={props.onClick}
    >
      {props.loading ? props.loadingText : props.children}
    </LoadingButtonStyled>
  );
}

TransLoadingButton.propTypes = {
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  loadingText: PropTypes.string,
  children: PropTypes.node
};

TransLoadingButton.defaultProps = {
  loadingText: 'Please Sign Transaction From Wallet'
};
