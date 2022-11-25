import React from 'react';
import PropTypes from 'prop-types';
import * as math from 'mathjs';
import { Container, Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import checkCircleFillIcon from '@iconify-icons/akar-icons/circle-check-fill';
import checkCircleOutlineIcon from '@iconify-icons/akar-icons/circle-check';
import crossCircleFillIcon from '@iconify-icons/akar-icons/circle-x-fill';
import crossCircleOutlineIcon from '@iconify-icons/akar-icons/circle-x';

// components
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import DIABadge from '../../components/badge/DIABadge';
import StyledButton from '../../components/signin-dlg/StyledButton';
import CarouselFeatures from '../../components/carousel/CarouselFeatures';
import {getDiaBalanceDegree, getERC20TokenPrice} from '../../utils/common';
import useSingin from '../../hooks/useSignin';
import {mainDiaContract as DIA_CONTRACT_MAIN_ADDRESS} from "../../config";
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(13)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));
const SelectedTitleStyle = styled(Typography)(({ theme }) => ({
  backgroundImage: 'linear-gradient(90deg, #FF5082, #a951f4)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  display: 'inline',
  [theme.breakpoints.up('xs')]: {
    fontSize: '1.85rem'
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '2rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.2rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '2.4rem'
  }
}));
const CheckIcon = ({ isSupported, selected = false }) => {
  if (typeof isSupported === 'string') {
    return (
      <Typography variant="body2" align="center" sx={{ px: 2 }} color={selected ? 'origin.main' : 'text.primary'}>
        {isSupported}
      </Typography>
    );
  }
  if (isSupported)
    return (
      <Box sx={{ color: 'origin.main' }}>
        <Icon icon={selected ? checkCircleFillIcon : checkCircleOutlineIcon} width={24} />
      </Box>
    );
  return (
    <Box sx={{ color: 'text.secondary' }}>
      <Icon icon={selected ? crossCircleFillIcon : crossCircleOutlineIcon} width={24} />
    </Box>
  );
};
CheckIcon.propTypes = {
  isSupported: PropTypes.any,
  selected: PropTypes.bool
};
const CellBoxStyle = styled(Box)((props) => {
  const {
    theme,
    isHeaderCell = true,
    isFirstColumn = false,
    isLastRow = false,
    isLastColumn = false,
    selected = false
  } = props;
  const styleProp = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    flex: 1
  };
  if (selected) {
    styleProp.flex = 1.2;
    styleProp.backgroundColor = theme.palette.grey[theme.palette.mode === 'light' ? 300 : 700];
  }
  if (isHeaderCell) {
    styleProp.alignItems = 'start';
    styleProp.border = `1px solid ${theme.palette.divider}`;
    if (!isLastColumn && !selected) styleProp.borderRight = 0;
    else styleProp.borderTopRightRadius = 16;
    if (isFirstColumn) styleProp.borderTopLeftRadius = 16;
    if (selected) {
      styleProp.marginTop = -16;
      styleProp.border = `3px solid ${theme.palette.origin.main}`;
      styleProp.borderTopLeftRadius = 16;
    }
    return styleProp;
  }
  styleProp.borderLeft = `1px solid ${theme.palette.divider}`;
  if (isLastRow) {
    styleProp.alignItems = 'start';
    styleProp.borderBottom = `1px solid ${theme.palette.divider}`;
  }
  if (isLastColumn) styleProp.borderRight = `1px solid ${theme.palette.divider}`;
  if (isLastRow && isLastColumn) styleProp.borderBottomRightRadius = 16;
  if (selected) {
    styleProp.borderLeft = `3px solid ${theme.palette.origin.main}`;
    styleProp.borderRight = `3px solid ${theme.palette.origin.main}`;
    if (isLastRow) {
      styleProp.marginBottom = -16;
      styleProp.borderBottomLeftRadius = 16;
      styleProp.borderBottomRightRadius = 16;
      styleProp.borderBottom = `3px solid ${theme.palette.origin.main}`;
    }
  }
  return styleProp;
});

export default function Features() {
  const [diaUSD, setDiaUSD] = React.useState(0);
  const { diaBalance, pasarLinkChain } = useSingin();
  const degree = getDiaBalanceDegree(diaBalance, pasarLinkChain);

  React.useEffect(() => {
    getERC20TokenPrice(DIA_CONTRACT_MAIN_ADDRESS).then((res) => {setDiaUSD(math.round(res, 2))});
  }, []);

  const featureArray = [
    { title: 'Create item from Feeds default collection (FSTK)', allow: [true, true, true, true] },
    { title: 'Create item from Pasar default collection (PSRC)', allow: [true, true, true, true] },
    { title: 'Allowable number of collections to create', allow: ['1', 'Up to 2', 'Up to 5', 'Up to 10'] },
    { title: 'Create item from own custom collection', allow: [true, true, true, true] },
    { title: 'Create items in batches (batch minting)', allow: [false, 'Up to 5', 'Up to 10', 'Up to 10'] },
    { title: 'Sell items in batches (batch selling)', allow: [false, 'Up to 5', 'Up to 10', 'Up to 10'] },
    { title: 'Sell item using DIA/PASAR token', allow: [true, true, true, true] },
    { title: 'Sell item using ERC-20 tokens (ESC)', allow: [false, true, true, true] },
    { title: 'Transfer item out from Pasar', allow: [false, true, true, true] },
    { title: 'Sell item with a fixed price', allow: [true, true, true, true] },
    {
      title: 'Sell item with auction',
      allow: [
        'Yes, but Reserve Price and Buy Now are not supported',
        'Both Reserve Price and Buy Now are supported',
        'Both Reserve Price and Buy Now are supported',
        'Both Reserve Price and Buy Now are supported'
      ]
    }
  ];
  const DiaBadgeTypes = [
    { name: 'BASIC', range: 'Hold 0 DIA (no badge) or less than 0.01 DIA' },
    { name: 'BRONZE', range: 'Hold more than 0.01 DIA but less than 0.1 DIA' },
    { name: 'SILVER', range: 'Hold more than 0.1 DIA but less than 1 DIA' },
    { name: 'GOLD', range: 'Hold more than 1 DIA' }
  ];
  return (
    <RootStyle title="Features | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{ mb: 3 }}>
          Features
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', color: 'text.secondary', mb: 2 }}>
          There are 4 types of Diamond (DIA) holders, namely Basic, Bronze, Silver and Gold. Just buy some DIA and hold
          a certain of amount to unlock exclusive features. See the table below for more information.
        </Typography>
        <Box sx={{ width: 200 }}>
          <StyledButton
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            href="https://glidefinance.io/info/token/0x2c8010ae4121212f836032973919e8aec9aeaee5"
            target="_blank"
          >
            Get DIA
          </StyledButton>
          <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', mb: 1 }} align="center">
            1 DIA ≈ USD {diaUSD}
          </Typography>
        </Box>
        <MHidden width="mdUp">
          <CarouselFeatures featureArray={featureArray} degree={degree} />
        </MHidden>
        <MHidden width="mdDown">
          <Stack sx={{ mt: 3 }}>
            <Stack direction="row">
              <Box sx={{ display: 'flex', flex: 1, p: 2 }} />
              {DiaBadgeTypes.map((item, _i) => (
                <CellBoxStyle
                  key={_i}
                  isFirstColumn={_i === 0}
                  isLastColumn={_i === DiaBadgeTypes.length - 1}
                  selected={degree === _i}
                >
                  <Stack sx={{ alignItems: 'center', mt: 1 }} spacing={2}>
                    <DIABadge degree={_i} disableTooltip={Boolean(true)} zoomRate={degree === _i ? 1.6 : 1.4} />
                    {degree === _i ? (
                      <SelectedTitleStyle variant="h3" align="center">
                        {item.name}
                      </SelectedTitleStyle>
                    ) : (
                      <Typography variant="h3" align="center">
                        {item.name}
                      </Typography>
                    )}
                    <Typography variant={degree === _i ? 'subtitle1' : 'body2'} align="center">
                      {item.range}
                    </Typography>
                  </Stack>
                </CellBoxStyle>
              ))}
            </Stack>
            {featureArray.map((feature, _i) => {
              const isLastItem = _i === featureArray.length - 1;
              return (
                <Stack direction="row" key={_i}>
                  <Box
                    sx={{
                      display: 'flex',
                      flex: 1,
                      backgroundColor: 'origin.main',
                      color: 'white',
                      p: 2,
                      borderTopLeftRadius: _i === 0 ? 16 : 0,
                      borderBottomLeftRadius: isLastItem ? 16 : 0
                    }}
                  >
                    {feature.title}
                  </Box>
                  {Array(4)
                    .fill(0)
                    .map((_, _j) => (
                      <CellBoxStyle
                        key={_j}
                        isHeaderCell={false}
                        isLastRow={isLastItem}
                        isLastColumn={_j === 3}
                        selected={degree === _j}
                      >
                        <CheckIcon isSupported={feature.allow[_j]} selected={degree === _j} />
                      </CellBoxStyle>
                    ))}
                </Stack>
              );
            })}
          </Stack>
        </MHidden>
      </Container>
    </RootStyle>
  );
}
