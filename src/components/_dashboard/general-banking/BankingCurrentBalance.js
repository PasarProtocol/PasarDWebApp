import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import Slider from 'react-slick';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
// material
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Stack, MenuItem } from '@mui/material';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import { MIconButton } from '../../@material-extend';
import { CarouselControlsPaging1 } from '../../carousel';
import MenuPopover from '../../MenuPopover';

// ----------------------------------------------------------------------

const HEIGHT = 276;

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: HEIGHT,
  '& .slick-list': {
    borderRadius: theme.shape.borderRadiusMd
  }
}));

const CardItemStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: HEIGHT - 16,
  backgroundSize: 'cover',
  padding: theme.spacing(3),
  backgroundRepeat: 'no-repeat',
  color: theme.palette.common.white,
  backgroundImage: 'url("/static/bg_card.png")',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

const shadowStyle = {
  mx: 'auto',
  width: 'calc(100% - 16px)',
  borderRadius: 2,
  position: 'absolute',
  height: 200,
  zIndex: 8,
  bottom: 8,
  left: 0,
  right: 0,
  bgcolor: 'grey.500',
  opacity: 0.32
};

// ----------------------------------------------------------------------

const CARDS = [
  {
    id: '8baa359f-7e98-4c13-8d5b-fa210b643d82',
    balance: 23432.03,
    cardType: 'mastercard',
    cardHolder: 'Julianne Zemlak',
    cardNumber: '**** **** **** 3640',
    cardValid: '11/22'
  },
  {
    id: '32a7ed73-894f-4c79-a1d7-8a968ff69cc4',
    balance: 18000.23,
    cardType: 'visa',
    cardHolder: 'Pascale Schaefer',
    cardNumber: '**** **** **** 8864',
    cardValid: '11/25'
  },
  {
    id: 'ef0bca7b-4460-44bc-a606-1354ce3c0a3c',
    balance: 2000.89,
    cardType: 'mastercard',
    cardHolder: 'Tamara Hilll',
    cardNumber: '**** **** **** 7755',
    cardValid: '11/22'
  }
];

// ----------------------------------------------------------------------

function MoreMenuButton() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MIconButton ref={anchorRef} size="large" color="inherit" sx={{ opacity: 0.48 }} onClick={handleOpen}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ p: 1, mt: -1, width: 'auto' }}>
        <MenuItem onClick={handleClose} sx={{ py: 0.75, px: 1.5, borderRadius: 0.75 }}>
          <Box component={Icon} icon={editFill} sx={{ width: 20, height: 20, flexShrink: 0, mr: 1 }} />
          <Typography variant="body2">Edit card</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ py: 0.75, px: 1.5, borderRadius: 0.75, color: 'error.main' }}>
          <Box component={Icon} icon={trash2Outline} sx={{ width: 20, height: 20, flexShrink: 0, mr: 1 }} />
          <Typography variant="body2">Delete card</Typography>
        </MenuItem>
      </MenuPopover>
    </>
  );
}

CardItem.propTypes = {
  card: PropTypes.shape({
    balance: PropTypes.number,
    cardHolder: PropTypes.string,
    cardNumber: PropTypes.string,
    cardType: PropTypes.string,
    cardValid: PropTypes.string
  })
};

function CardItem({ card }) {
  const { cardType, balance, cardHolder, cardNumber, cardValid } = card;
  const [showCurrency, setShowCurrency] = useState(true);

  const onToggleShowCurrency = () => {
    setShowCurrency((prev) => !prev);
  };

  return (
    <>
      <CardItemStyle>
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}>
          <MoreMenuButton />
        </Box>

        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2', opacity: 0.72 }}>Current Balance</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ typography: 'h3' }}>{showCurrency ? '********' : fCurrency(balance)}</Typography>
            <MIconButton color="inherit" onClick={onToggleShowCurrency} sx={{ opacity: 0.48 }}>
              <Icon icon={showCurrency ? eyeFill : eyeOffFill} />
            </MIconButton>
          </Stack>
        </div>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
          <Box
            component="img"
            src={`/static/icons/ic_${cardType === 'mastercard' ? 'mastercard' : 'visa'}.svg`}
            sx={{ height: 24 }}
          />
          <Typography sx={{ typography: 'subtitle1', textAlign: 'right' }}>{cardNumber}</Typography>
        </Stack>

        <Stack direction="row" spacing={5}>
          <div>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Card Holder</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{cardHolder}</Typography>
          </div>
          <div>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Valid Dates</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{cardValid}</Typography>
          </div>
        </Stack>
      </CardItemStyle>
    </>
  );
}

export default function BankingCurrentBalance() {
  const theme = useTheme();

  const settings = {
    dots: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging1({
      color: 'primary.main',
      bottom: '16px !important',
      right: '16px !important'
    })
  };

  return (
    <RootStyle>
      <Box sx={{ position: 'relative', zIndex: 9 }}>
        <Slider {...settings}>
          {CARDS.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </Slider>
      </Box>

      <Box sx={{ ...shadowStyle }} />
      <Box
        sx={{
          ...shadowStyle,
          opacity: 0.16,
          bottom: 0,
          zIndex: 7,
          width: 'calc(100% - 40px)'
        }}
      />
    </RootStyle>
  );
}
