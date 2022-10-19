import React from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { getCoinTypesInCurrentNetwork } from '../../utils/common';
import useSignin from '../../hooks/useSignin';

CoinSelect.propTypes = {
  selected: PropTypes.number,
  onChange: PropTypes.func
};

export default function CoinSelect({ selected, onChange }) {
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const { pasarLinkChain } = useSignin();
  const coinTypes = getCoinTypesInCurrentNetwork(pasarLinkChain);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };
  const handleSelect = (index) => {
    onChange(index);
    handleClosePopup();
  };
  const filterProp = (coinType) => {
    if (coinType.name === 'ELA') return (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none');
    return 'unset';
  };
  return (
    <>
      <Button
        color="inherit"
        size="small"
        sx={{
          px: 1,
          py: 0.5,
          textTransform: 'none',
          fontWeight: 'normal',
          fontSize: '1rem'
        }}
        onClick={openPopupMenu}
        endIcon={<Icon icon={arrowIosDownwardFill} />}
      >
        <Box
          component="img"
          src={`/static/${coinTypes[selected].icon}`}
          sx={{ width: 18, display: 'inline', filter: filterProp(coinTypes[selected]) }}
        />
        <span style={{ paddingLeft: 4 }}>{coinTypes[selected].name}</span>
      </Button>
      <Menu
        keepMounted
        id="simple-menu"
        anchorEl={isOpenPopup}
        onClose={handleClosePopup}
        open={Boolean(isOpenPopup)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {coinTypes.map((coin, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleSelect(index);
            }}
            selected={index === selected}
          >
            <Box
              component="img"
              src={`/static/${coin.icon}`}
              sx={{ width: 18, display: 'inline', filter: filterProp(coin) }}
            />
            &nbsp;{coin.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
