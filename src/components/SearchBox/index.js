import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, alpha, Container, OutlinedInput, InputAdornment } from '@mui/material';
//

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

const SearchStyle = styled(OutlinedInput)(({ theme, sx, needBgColor }) => {
  const bgColor = needBgColor?{backgroundColor: theme.palette.background.default}:{}
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

// ----------------------------------------------------------------------
export default function SearchBox({placeholder, sx, outersx, rootsx, onChange, needBgColor=false}) {
  const params = useParams(); // params.key
  const navigate = useNavigate();
  const handleChange = (e)=>{
    if(e.which===13) { // press enter
      if(onChange)
        onChange(e.target.value)
      else
        navigate(`/explorer/search/${e.target.value}`);
    }
  }
  return (
      <Container maxWidth="lg" sx={{ height: '100%', width: 'auto', ...rootsx}}>
          <ContentStyle sx={{...outersx}}>
              <SearchStyle
                placeholder={placeholder}
                onKeyPress={handleChange}
                defaultValue={params.key}
                startAdornment={
                  <InputAdornment position="start">
                    <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                }
                sx = {sx}
                needBgColor = {needBgColor}
              />
          </ContentStyle>
      </Container>
  );
}

SearchBox.propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    sx: PropTypes.object
};
SearchBox.defaultProps = {
    placeholder: "Search name, description, address and token ID",
    sx: {width: 550}
};