import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useRef } from 'react';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
// utils
import mockData from '../../utils/mock-data';
//
import { CarouselControlsPaging2 } from './controls';
import { getTime } from '../../utils/common';
import {defaultContract} from '../../config'

// ----------------------------------------------------------------------

const CAROUSEL_ICONS = ['user', 'description', 'hammer', 'diamond', 'hash', 'cash-hand', 'basket', 'tag', 'calendar-hammer', 'calendar-market', 'contract-address', 'blockchain', 'marketplace']
const CAROUSEL_TITLE = ['Name', 'Description', 'Creator', 'Owner', 'Token ID', 'Royalties', 'Quantity', 'Sale Type', 'Created Date', 'Date on Market', 'Contract Address', 'Blockchain', 'Marketplace']
const CAROUSEL_KEYS = ['name', 'description', 'holder', 'royaltyOwner', 'tokenIdHex', 'royalties', 'quantity', 'type', 'createTime', 'updateTime', 'contractAddr', 'blockchain', '']

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
  }
}));

// ----------------------------------------------------------------------palette.light.grey['300']
const DetailItem = ({ item, isLast, value })=>{
  const { icon, title, key } = item;
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: (theme) => `${theme.palette.grey[500_32]}`, pb: 2};
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
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {value}
              </Typography>
          </Box>
      </Stack>
  );
}

CarouselItem.propTypes = {
  page: PropTypes.array
};

function CarouselItem({ page, detail }) {
  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      {page.map((item, index) => {
        const value = item.key.length?detail[item.key]:"";
        // const value=1;
        return <DetailItem 
          key={index}
          item={item}
          value={value}
          isLast={index===page.length-1}
        />
      })}
    </Stack>
  )
}

export default function CarouselCustom({pgsize, detail}) {
  const pgcount = Math.floor(CAROUSEL_ICONS.length/pgsize)+1
  const DETAIL_CAROUSELS = [...Array(pgcount)].map((_, index1) => {
    const pageSize = index1===(pgcount-1)?CAROUSEL_ICONS.length%pgsize:pgsize;
    return [...Array(pageSize)].map((_, index2) => ({
      icon: CAROUSEL_ICONS[index1*pgsize+index2],
      title: CAROUSEL_TITLE[index1*pgsize+index2],
      key: CAROUSEL_KEYS[index1*pgsize+index2]
    }))
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
  const creatimestamp = getTime(detail.createTime)
  const updatimestamp = getTime(detail.updateTime)
  const detailInfo = {
    ...detail,
    createTime: `${creatimestamp.date} ${creatimestamp.time}`,
    updateTime: `${updatimestamp.date} ${updatimestamp.time}`,
    contractAddr: defaultContract,
    blockchain: 'Elastos Smart Chain (ESC)'}
  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {DETAIL_CAROUSELS.map((page, index) => (
          <CarouselItem key={index} page={page} detail={detailInfo}/>
        ))}
      </Slider>
    </RootStyle>
  );
}