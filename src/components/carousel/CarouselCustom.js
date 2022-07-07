import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
//
import { CarouselControlsPaging2 } from './controls';
import CopyButton from '../CopyButton';
import { getTime, reduceHexAddress } from '../../utils/common';
import {ESC_CONTRACT, ETH_CONTRACT, blockchain} from '../../config'

// ----------------------------------------------------------------------

const CAROUSEL_ICONS = ['marketplace', 'description', 'hammer', 'diamond', 'hash', 'cash-hand', 'basket', 'collection', 'contract-address', 'calendar-hammer', 'ethereum', 'blockchain']
const CAROUSEL_TITLE = ['Status', 'Description', 'Creator', 'Owner', 'Token ID', 'Royalties', 'Quantity', 'Collection', 'Contract Address', 'Created Date', 'Token Standard', 'Blockchain']
const CAROUSEL_KEYS = ['status', 'description', 'royaltyOwner', 'holder', 'tokenIdHex', 'royalties', 'quantity', 'collection', 'baseToken', 'createTime', 'tokenStandard', 'blockchain']
const CAROUSEL_COPYABLE = [false, false, true, true, true, false, false, false, true, false, false, false, false]

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
  }
}));

// ----------------------------------------------------------------------
const DetailItem = (props)=>{
  const params = useParams(); // params.collection
  const { item, isLast, value, detail } = props
  const { icon, title, copyable } = item;
  let displayValue = value
  if(item.key==='tokenIdHex')
    displayValue = reduceHexAddress(value)
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
              <Stack sx={{flexDirection: 'row'}}>
                <Typography variant="body2" color='text.secondary' noWrap>
                  {
                    title==="Status"&&(
                      value===0?
                      "Not on sale":(
                        <Link
                          to={`/marketplace/detail/${[detail.tokenId, detail.baseToken].join('&')}`}
                          // state={{tokenId: detail.tokenId, baseToken: detail.baseToken}}
                          component={RouterLink}
                          color='text.secondary'
                          sx={{display: 'flex', alignItems: 'center'}}
                        >
                          Listed on Pasar&nbsp;<Icon icon={externalLinkFill} width="17px"/>
                        </Link>
                      )
                    )
                  }
                  {
                    title!=="Status"&&(
                      (title==="Creator" || title==="Owner")?
                      <Link to={`/explorer/transaction/detail/${value}`} component={RouterLink} color='text.secondary'>
                        {displayValue}
                      </Link>:
                      displayValue
                    )
                  }
                </Typography>
                {
                  value!=null&&value!==''&&copyable&&<CopyButton text={value}/>
                }
              </Stack>
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
        return <DetailItem 
          key={index}
          item={item}
          value={value}
          detail={detail}
          isLast={index===page.length-1}
        />
      })}
    </Stack>
  )
}

export default function CarouselCustom({pgsize, detail}) {
  const pgcount = Math.ceil(CAROUSEL_ICONS.length/pgsize)
  const DETAIL_CAROUSELS = [...Array(pgcount)].map((_, index1) => {
    const pageSize = index1===(pgcount-1)?(CAROUSEL_ICONS.length-(pgcount-1)*pgsize):pgsize;
    return [...Array(pageSize)].map((_, index2) => ({
      icon: CAROUSEL_ICONS[index1*pgsize+index2],
      title: CAROUSEL_TITLE[index1*pgsize+index2],
      key: CAROUSEL_KEYS[index1*pgsize+index2],
      copyable: CAROUSEL_COPYABLE[index1*pgsize+index2]
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
  const detailInfo = {
    ...detail,
    royalties: `${detail.royalties*100/10**6} %`,
    createTime: `${creatimestamp.date} ${creatimestamp.time}`,
    holder: (detail.holder===ESC_CONTRACT.market || detail.holder===ETH_CONTRACT.market)?detail.royaltyOwner:detail.holder,
    // collection: 'Feeds NFT Sticker - FSTK',
    tokenStandard: detail.is721?'ERC-721':'ERC-1155',
    'blockchain': blockchain,
    // status: detail.DateOnMarket&&detail.DateOnMarket.startsWith('Not')?'Not on sale':'Listed on Pasar'
    status: detail.DateOnMarket&&detail.DateOnMarket.startsWith('Not')?0:1
  }
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