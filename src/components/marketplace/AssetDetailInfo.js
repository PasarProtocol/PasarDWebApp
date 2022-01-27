import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Link } from '@mui/material';
//
import CopyButton from '../CopyButton';
import { getTime } from '../../utils/common';
import { marketContract } from '../../config'

// ----------------------------------------------------------------------

const DETAILINFO_ICONS = ['hash', 'cash-hand', 'basket', 'tag', 'calendar-hammer', 'calendar-market', 'qricon']
const DETAILINFO_TITLE = ['Token ID', 'Royalties', 'Quantity', 'Sale Type', 'Created Date', 'Date on Market', 'Item Type']
const DETAILINFO_KEYS = ['tokenIdHex', 'royalties', 'quantity', 'SaleType', 'createTime', 'dateOnMarket', 'type']

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
  }
}));

// ----------------------------------------------------------------------
const DetailItem = ({ item, isLast, value })=>{
  const { icon, title } = item;
  if(item.key==='type'&&value)
    value = value.charAt(0).toUpperCase().concat(value.substring(1))
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: (theme) => `${theme.palette.grey[500_32]}`, pb: 1};
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
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {
                    (title==="Creator" || title==="Owner")?
                    <Link to={`/explorer/transaction/detail/${value}`} component={RouterLink}>
                      {value}
                    </Link>:
                    value
                  }
                </Typography>
                {
                  title==="Token ID"&&value&&<CopyButton text={value}/>
                }
              </Stack>
          </Box>
      </Stack>
  );
}

export default function AssetDetailInfo({ detail }) {
  const infoItems = DETAILINFO_TITLE.map((title, index) => ({
    'title': title,
    'icon': DETAILINFO_ICONS[index],
    'key': DETAILINFO_KEYS[index],
  }))
  const creatimestamp = getTime(detail.createTime)
  let dateOnMarket = detail.DateOnMarket
  if(dateOnMarket!=='Not on sale'){
    const timestamp = getTime(dateOnMarket)
    dateOnMarket = `${timestamp.date} ${timestamp.time}`
  }
  
  const detailInfo = {
    ...detail,
    'royalties': `${detail.royalties*100/10**6} %`,
    'createTime': `${creatimestamp.date} ${creatimestamp.time}`,
    'dateOnMarket': dateOnMarket,
    'holder': detail.holder===marketContract?detail.royaltyOwner:detail.holder
  }

  return (
    <Stack spacing={1} sx={{ pt: 1, pb: '35px' }}>
    {
      infoItems.map((item, index) => (
        <DetailItem 
          key={index}
          item={item}
          value={detailInfo[item.key]}
          isLast={index===infoItems.length-1}
        />
      ))
    }
    </Stack>
  )
}