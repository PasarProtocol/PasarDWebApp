import { useState, useRef } from "react";
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, alpha, Container, OutlinedInput, InputAdornment, IconButton, List, ListItem, Divider, ListItemButton, 
  ListItemIcon, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
//
import { customShadows } from '../../theme/shadows';

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
  boxShadow: theme.palette.mode==='light'?customShadows.dark.z8:customShadows.light.z8,
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
    // color: theme.palette.common.black,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.common.white, 0.04),
        ...bgColor,
        boxShadow: theme.palette.mode==='dark'?'rgb(62 76 92) 0px 3px 6px 0px':'rgb(190 190 190 / 50%) 0px 4px 8px 0px'
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.mode==='dark'?'#818e9c !important':'#e0e0e0 !important',
      borderWidth: `2px !important`
    },
    '&.MuiOutlinedInput-root:hover fieldset': {
      borderColor: theme.palette.mode==='dark'?'#818e9c !important':'#e0e0e0 !important',
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
export default function SearchBox(props) {
  const { sx, onChange, needbgcolor=false, needAutocomplete=false } = props
  let { placeholder } = props
  const params = useParams(); // params.key
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [needClose, setShowClose] = useState(false)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [isOutOfSearchField, setLeaveSearchField] = useState(false)
  const [searchStr, setSearchStr] = useState("")
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
      setSearchStr('')
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
    if(e.target.value.length){
      setShowAutocomplete(true)
    }
    setSearchStr(e.target.value)
    setShowClose(e.target.value.length>0)
  }
  const handleBlurAction = (e)=>{
    if(isOutOfSearchField)
      setShowAutocomplete(false)
    else
      ref.current.focus()
  }
  return (
    needAutocomplete?
    <Box 
      sx={{width: '100%', px: 3, position: 'relative'}} 
      onBlur={handleBlurAction}
      onMouseDown={(e)=>{setShowAutocomplete(true)}}
      onMouseEnter={(e)=>{setLeaveSearchField(false)}}
      onMouseLeave={(e)=>{setLeaveSearchField(true)}}
    >
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
      {
        searchStr.length>0 && showAutocomplete &&  
        <Box sx={{position: 'absolute', width: '100%', left: 0, px: 3}}>
          <ListWrapperStyle>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListItem>
                <ListItemText
                  primary="Collections"
                  sx={{color: 'text.secondary'}}
                />
              </ListItem>
              <Divider />
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/icons/ic_chrome.svg" sx={{width: 30, height: 30}} />
                </ListItemAvatar>
                <ListItemText primary="Test Collection" secondary="by 0x123...6789" />
              </ListItemButton>
              <ListItem>
                <ListItemText
                  primary="Items"
                  sx={{color: 'text.secondary'}}
                />
              </ListItem>
              <Divider />
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/icons/ic_drive.svg" sx={{width: 30, height: 30}} />
                </ListItemAvatar>
                <ListItemText primary="Test NFT" secondary="Not for sale" />
              </ListItemButton>
              <ListItem>
                <ListItemText
                  primary="Accounts"
                  sx={{color: 'text.secondary'}}
                />
              </ListItem>
              <Divider />
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/icons/ic_evernote.svg" sx={{width: 30, height: 30}} />
                </ListItemAvatar>
                <ListItemText primary="Test Account"/>
              </ListItemButton>
            </List>
          </ListWrapperStyle>
        </Box>
      }
    </Box>:

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