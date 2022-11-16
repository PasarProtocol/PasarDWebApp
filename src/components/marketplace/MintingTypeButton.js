import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Paper, Typography, ButtonBase, Box } from '@mui/material';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import AddIcon from '@mui/icons-material/Add';
import { chainTypes } from '../../utils/common';
import useSettings from '../../hooks/useSettings';

const SvgStyle = styled('svg')(({ theme }) => ({
  width: 40,
  height: 50,
  [theme.breakpoints.down('sm')]: {
    width: 20,
    height: 25
  }
}));

const MintingTypeButton = (props) => {
  const { type, description, current, disabled = false, selectedCollection } = props;
  const { themeMode } = useSettings();
  const commonSx = {
    width: { xs: 35, sm: 50 },
    height: { xs: 35, sm: 50 },
    borderRadius: 2,
    p: { xs: 1, sm: 1.5 },
    m: 'auto',
    backgroundColor: current === type ? 'text.primary' : 'text.disabled'
  };
  const psrcIndex = { PSRC: 0, PSREC: 1 };
  return (
    <Paper
      component={ButtonBase}
      align="center"
      disabled={1 && disabled}
      sx={{
        color: current === type ? 'text.primary' : 'text.disabled',
        width: { xs: 100, sm: 180 },
        height: { xs: 100, sm: 180 },
        display: 'inline-block',
        p: { xs: 1, sm: 3 },
        cursor: 'pointer',
        borderWidth: current === type ? '2px' : '1px',
        borderStyle: 'solid',
        borderColor: current === type ? 'action.active' : 'action.disabledBackground',
        boxShadow: (theme) => theme.customShadows.z1,
        ...props.sx,
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
      onClick={props.onClick}
    >
      {(type === 'Single' || type === 'Multiple') && (
        <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: { xs: 25, sm: 50 } }} />
      )}
      {type === 'Multiple' && <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: { xs: 25, sm: 50 } }} />}
      {type === 'Batch' && (
        <SvgStyle viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M45.9 5.1V35.7H15.3V5.1H45.9ZM45.9 0H15.3C12.495 0 10.2 2.295 10.2 5.1V35.7C10.2 38.505 12.495 40.8 15.3 40.8H45.9C48.705 40.8 51 38.505 51 35.7V5.1C51 2.295 48.705 0 45.9 0ZM24.225 24.6585L28.5345 30.4215L34.8585 22.5165L43.35 33.15H17.85L24.225 24.6585ZM0 10.2V45.9C0 48.705 2.295 51 5.1 51H40.8V45.9H5.1V10.2H0Z"
            fill="currentColor"
          />
        </SvgStyle>
      )}
      {type === 'ESC' && (
        <Box sx={{ ...commonSx, backgroundColor: current === type ? chainTypes[0].color : 'text.disabled' }}>
          <Box
            draggable={false}
            component="img"
            src={`/static/${chainTypes[0].icon}`}
            sx={{
              width: { xs: 18, sm: 26 },
              height: { xs: 18, sm: 26 },
              filter: current === type ? 'none' : 'brightness(5)'
            }}
          />
        </Box>
      )}
      {type === 'ETH' && (
        <Box sx={{ ...commonSx, backgroundColor: current === type ? chainTypes[1].color : 'text.disabled' }}>
          <Box
            draggable={false}
            component="img"
            src={`/static/${chainTypes[1].icon}`}
            sx={{
              width: { xs: 18, sm: 26 },
              height: { xs: 18, sm: 26 },
              filter: current === type ? 'none' : 'brightness(5)'
            }}
          />
        </Box>
      )}
      {(type === 'PSRC' || type === 'PSREC') && (
        <Box
          sx={{ ...commonSx, backgroundColor: current === type ? chainTypes[psrcIndex[type]].color : 'text.disabled' }}
        >
          <Box
            draggable={false}
            component="img"
            src="/static/logo-icon-white.svg"
            sx={{
              width: { xs: 18, sm: 26 },
              height: { xs: 18, sm: 26 },
              filter: current === type ? 'none' : 'brightness(5)'
            }}
          />
        </Box>
      )}
      {type === 'FSTK' && (
        <Box
          sx={{ ...commonSx, backgroundColor: current === type ? (theme) => theme.palette.grey[900] : 'text.disabled' }}
        >
          <Box
            draggable={false}
            component="img"
            src="/static/feeds-collection.svg"
            sx={{
              width: { xs: 18, sm: 26 },
              height: { xs: 18, sm: 26 },
              filter: current === type ? 'none' : 'brightness(5)'
            }}
          />
        </Box>
      )}
      {type === 'Choose' && (
        <>
          {selectedCollection.avatar.length ? (
            <Box sx={{ ...commonSx, p: 0, overflow: 'hidden' }}>
              <Box
                draggable={false}
                component="img"
                src={selectedCollection.avatar}
                sx={{ width: { xs: 35, sm: 50 }, height: { xs: 35, sm: 50 } }}
              />
              :
            </Box>
          ) : (
            <Box sx={commonSx}>
              <Box
                draggable={false}
                component="img"
                src="/static/collection.svg"
                sx={{
                  width: { xs: 18, sm: 26 },
                  height: { xs: 18, sm: 26 },
                  filter: current === type && themeMode === 'dark' ? 'invert(.7)' : 'none'
                }}
              />
            </Box>
          )}
        </>
      )}
      {type === 'ERC-1155' && (
        <Box sx={{ ...commonSx, p: { xs: 0.7, sm: 1 } }}>
          <AddIcon sx={{ fontSize: { xs: 24.5, sm: 34 }, color: 'white' }} />
        </Box>
      )}
      <Typography variant="body2" sx={{ fontSize: { xs: 12, sm: '' }, lineHeight: { xs: 1.6, sm: 3 } }} noWrap>
        {
          type === 'Choose' && selectedCollection.avatar.length ? selectedCollection.symbol : type
          // type==="Choose"&&selectedCollection.avatar.length?selectedCollection.symbol:type
        }
      </Typography>
      <Typography variant="body2" sx={{ height: 30, fontSize: { xs: 12, sm: '' }, lineHeight: { xs: 1, sm: 1.2 } }}>
        {type === 'Choose' && selectedCollection.avatar.length ? selectedCollection.name : description}
      </Typography>
    </Paper>
  );
};

MintingTypeButton.propTypes = {
  type: PropTypes.string,
  description: PropTypes.string,
  current: PropTypes.string,
  disabled: PropTypes.bool,
  selectedCollection: PropTypes.any,
  sx: PropTypes.any,
  onClick: PropTypes.func
};

export default MintingTypeButton;
