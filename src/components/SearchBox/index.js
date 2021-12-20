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

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: 550,
    },
    [theme.breakpoints.down('md')]: {
        width: '90%',
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

export default function SearchBox({placeholder}) {
  return (
      <Container maxWidth="lg" sx={{ height: '100%' }}>
        <ContentStyle>
            <SearchStyle
              placeholder={placeholder}
              startAdornment={
                <InputAdornment position="start">
                  <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
            />
        </ContentStyle>
      </Container>
  );
}

SearchBox.propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
};
SearchBox.defaultProps = {
    placeholder: "Search by name/contract/address/token ID"
};