import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import { CarouselControlsPaging2 } from './controls';
import CopyButton from '../CopyButton';
import { getTime, reduceHexAddress, chainTypes, getChainIndexFromChain } from '../../utils/common';

// ----------------------------------------------------------------------

const CAROUSEL_ICONS = [
  'marketplace',
  'description',
  'hammer',
  'diamond',
  'hash',
  'cash-hand',
  'basket',
  'collection',
  'contract-address',
  'calendar-hammer',
  'ethereum',
  'blockchain'
];
const CAROUSEL_TITLE = [
  'Status',
  'Description',
  'Minted By',
  'Owner',
  'Token ID',
  'Royalties',
  'Quantity',
  'Collection',
  'Contract Address',
  'Created Date',
  'Token Standard',
  'Blockchain'
];
const CAROUSEL_KEYS = [
  'status',
  'description',
  'royaltyOwner',
  'holder',
  'tokenIdHex',
  'royalties',
  'quantity',
  'collection',
  'contract',
  'createTime',
  'tokenStandard',
  'blockchain'
];
const CAROUSEL_COPYABLE = [false, false, true, true, true, false, false, false, true, false, false, false, false];

const RootStyle = styled('div')({
  position: 'relative',
  '& .slick-list': {}
});

// ----------------------------------------------------------------------
const DetailItem = (props) => {
  const { item, isLast, value, detail } = props;
  const { icon, title, copyable } = item;
  let displayValue = value;
  if (item.key === 'tokenIdHex') displayValue = reduceHexAddress(value);
  const sx = isLast
    ? {}
    : { borderBottom: '1px solid', borderColor: (theme) => `${theme.palette.grey[500_32]}`, pb: 2 };
  const iconSrc = `/static/${icon}.svg`;
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={sx}>
      <Box
        component="img"
        alt={title}
        src={iconSrc}
        sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: '#bdbdbd', padding: '14px' }}
      />
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography color="inherit" variant="subtitle2" noWrap>
          {title}
        </Typography>
        <Stack sx={{ flexDirection: 'row' }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {title === 'Status' &&
              (value === 0 ? (
                'Not on sale'
              ) : (
                <Link
                  to={`/marketplace/detail/${[detail.chain, detail.contract, detail.tokenId].join('&')}`}
                  component={RouterLink}
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  Listed on Pasar&nbsp;
                  <Icon icon={externalLinkFill} width="17px" />
                </Link>
              ))}
            {title !== 'Status' &&
              (title === 'Minted By' || title === 'Owner' ? (
                <Link to={`/explorer/transaction/detail/${value}`} component={RouterLink} color="text.secondary">
                  {displayValue}
                </Link>
              ) : (
                displayValue
              ))}
          </Typography>
          {value != null && value !== '' && copyable && <CopyButton text={value} />}
        </Stack>
      </Box>
    </Stack>
  );
};

DetailItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
  value: PropTypes.any,
  detail: PropTypes.any
};

function CarouselItem({ page, detail }) {
  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      {page.map((item, index) => {
        const value = item.key.length ? detail[item.key] : '';
        return <DetailItem key={index} item={item} value={value} detail={detail} isLast={index === page.length - 1} />;
      })}
    </Stack>
  );
}

CarouselItem.propTypes = {
  page: PropTypes.array,
  detail: PropTypes.any
};

export default function CarouselCustom({ pgsize, detail }) {
  const pgcount = Math.ceil(CAROUSEL_ICONS.length / pgsize);
  const DETAIL_CAROUSELS = [...Array(pgcount)].map((_, index1) => {
    const pageSize = index1 === pgcount - 1 ? CAROUSEL_ICONS.length - (pgcount - 1) * pgsize : pgsize;
    return [...Array(pageSize)].map((_, index2) => ({
      icon: CAROUSEL_ICONS[index1 * pgsize + index2],
      title: CAROUSEL_TITLE[index1 * pgsize + index2],
      key: CAROUSEL_KEYS[index1 * pgsize + index2],
      copyable: CAROUSEL_COPYABLE[index1 * pgsize + index2]
    }));
  });

  const theme = useTheme();
  const carouselRef = useRef();

  const settings = {
    dots: true,
    arrows: false,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging2({
      sx: { mt: 3 }
    })
  };

  const showChainTypes = [...chainTypes];
  showChainTypes[0].name = 'Elastos Smart Chain (ESC)';
  const chainIndex = getChainIndexFromChain(detail.chain);
  const network =
    chainIndex <= showChainTypes.length && chainIndex ? showChainTypes[chainIndex - 1].name : showChainTypes[0].name;

  const creatimestamp = getTime(detail.createTime);
  const detailInfo = {
    ...detail,
    royalties: `${(detail.royaltyFee * 100) / 10 ** 6} %`,
    createTime: `${creatimestamp.date} ${creatimestamp.time}`,
    holder: detail.tokenOwner,
    tokenStandard: detail?.is721 ? 'ERC-721' : 'ERC-1155',
    blockchain: network,
    status: detail?.listed ? 1 : 0,
    quantity: detail?.tokenSupply ?? 0
  };
  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {DETAIL_CAROUSELS.map((page, index) => (
          <CarouselItem key={index} page={page} detail={detailInfo} />
        ))}
      </Slider>
    </RootStyle>
  );
}

CarouselCustom.propTypes = {
  pgsize: PropTypes.number,
  detail: PropTypes.any
};
