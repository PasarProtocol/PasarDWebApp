import { useState, useRef } from "react";
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, alpha, Container, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
//

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

const SearchStyle = styled(OutlinedInput)(({ theme, sx, needbgcolor }) => {
  const bgColor = needbgcolor?{backgroundColor: theme.palette.background.default}:{}
  return({
    ...bgColor,
    [theme.breakpoints.up('md')]: {
        width: sx.width,
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    borderRadius: theme.shape.borderRadiusMd,
    color: theme.palette.common.black,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.common.white, 0.04),
        ...bgColor,
        boxShadow: 'rgb(190 190 190 / 50%) 0px 4px 8px 0px'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e0e0e0 !important',
      borderWidth: `2px !important`
    },
    '&.MuiOutlinedInput-root:hover fieldset': {
      borderColor: '#e0e0e0 !important',
      borderWidth: `2px !important`
    },
    '& fieldset': {
        borderWidth: `1px !important`
    },
    input: {
        padding: 8,
        paddingLeft: 3
    }
  })
});
const defaultPlaceHolder = "Search name, description, address and token ID"
// ----------------------------------------------------------------------
export default function SearchBox({placeholder, sx, onChange, needbgcolor=false}) {
  const params = useParams(); // params.key
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [needClose, setShowClose] = useState(false)
  const ref = useRef()
  if(placeholder === defaultPlaceHolder && !pathname.startsWith('/explorer'))
    placeholder = 'Search items, creators and token ID'
  const handleChange = (e)=>{
    if(e.which===13) { // press enter
      changeAction(e.target.value)
    }
  }
  const clearSearch = (e)=>{
    if(ref.current){
      ref.current.value = ''
      ref.current.focus()
      setShowClose(false)
    }
  }
  const changeAction = (value)=>{
    if(onChange)
      onChange(value)
    else
      if(pathname.startsWith('/explorer'))
        navigate(`/explorer/search/${value}`);
      else
        navigate(`/marketplace/search/${value}`);
  }
  const determineClose = (e)=>{
    setShowClose(e.target.value.length>0)
  }
  return (
    <SearchStyle
      inputRef={ref}
      defaultValue={params.key}
      placeholder={placeholder}
      onKeyPress={handleChange}
      onChange={determineClose}
      startAdornment={
        <InputAdornment position="start">
          <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      }
      endAdornment={
        needClose &&
        <InputAdornment position="end">
          <IconButton size='small' onClick={clearSearch}>
            <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled' }}/>
          </IconButton>
        </InputAdornment>
      }
      sx = {{width: 550, ...sx}}
      needbgcolor = {needbgcolor?1:0}
    />
  );
}

SearchBox.propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    sx: PropTypes.object
};
SearchBox.defaultProps = {
    placeholder: defaultPlaceHolder,
};