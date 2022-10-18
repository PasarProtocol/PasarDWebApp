import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import useSettings from '../../hooks/useSettings';

const useStyles = makeStyles({
  iconAbsolute1: {
    paddingLeft: 40,
    paddingRight: 80,
    position: 'relative',
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 16
    },
    '& .MuiButton-endIcon': {
      position: 'absolute',
      right: 16
    }
  },
  iconAbsolute2: {
    paddingLeft: 40,
    paddingRight: 40,
    position: 'relative',
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 16
    }
  }
});

export default function StyledButton(props) {
  const { themeMode } = useSettings();
  const isLight = themeMode === 'light';
  const classes = useStyles();

  const ButtonStyle = styled(Button)(
    ({ theme }) =>
      !isLight && {
        backgroundColor: theme.palette.grey[700],
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.grey[600]
        }
      }
  );

  const ButtonOutlinedStyle = styled(Button)(
    ({ theme }) =>
      !isLight && {
        borderColor: 'white',
        color: 'white',
        '&:hover': {
          color: theme.palette.background.default,
          backgroundColor: theme.palette.action.active
        }
      }
  );
  const additionProps = {};
  if (props.startIcon && props.endIcon) additionProps.className = classes.iconAbsolute1;
  else if (props.startIcon) additionProps.className = classes.iconAbsolute2;
  if (props.variant === 'contained')
    return (
      <ButtonStyle {...props} {...additionProps}>
        {props.children}
      </ButtonStyle>
    );
  return (
    <ButtonOutlinedStyle {...props} {...additionProps}>
      {props.children}
    </ButtonOutlinedStyle>
  );
}

StyledButton.propTypes = {
  startIcon: PropTypes.any,
  endIcon: PropTypes.any,
  variant: PropTypes.string,
  children: PropTypes.node
};
