import { motion } from 'framer-motion';
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

const SearchStyle = styled(OutlinedInput)(({ theme, sx }) => ({
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
        padding: 10
    }
}));

// ----------------------------------------------------------------------

export default function SearchBox({placeholder, sx, outersx, rootsx}) {
  return (
      <Container maxWidth="lg" sx={{ height: '100%', width: 'auto', ...rootsx}}>
        <ContentStyle sx={{...outersx}}>
            <SearchStyle
              placeholder={placeholder}
              startAdornment={
                <InputAdornment position="start">
                  <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx = {sx}
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
    placeholder: "Search by name/creator/owner/token ID",
    sx: {width: 550}
};