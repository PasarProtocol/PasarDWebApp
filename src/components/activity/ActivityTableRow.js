import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import * as math from 'mathjs';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Stack, Typography, TableRow, Link, TableCell } from '@mui/material';

import TabletImgBox from './TabletImgBox';
import KYCBadge from '../badge/KYCBadge';
import { getDateDistance, reduceHexAddress, MethodList, getCoinTypeFromToken } from '../../utils/common';
import { blankAddress } from '../../config';
// ----------------------------------------------------------------------

const EventByType = {
  Minted: 'Mint',
  Listed: 'CreateOrderForSale',
  Sold: 'BuyOrder'
};

const ActivityTableRow = (props) => {
  const { trans, coinPrice, infoByAddress, COLUMNS } = props;
  return (
    <TableRow hover tabIndex={-1}>
      {COLUMNS.map((column) => {
        let cellcontent = '';
        switch (column.id) {
          case 'type':
            {
              let eventName = '';
              if (!trans.order) eventName = 'Minted';
              else if (trans?.order?.orderType === 1 && trans?.order?.orderState === 1) eventName = 'Listed';
              else if (trans?.order?.orderType === 1 && trans?.order?.orderState === 2) eventName = 'Sold';
              let methodItem = MethodList.find((item) => item.method === EventByType[eventName]);
              if (!methodItem) methodItem = { color: 'grey', icon: 'tag', detail: [] };
              cellcontent = (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Link
                    to={`/explorer/collectible/detail/${[trans.chain, trans.contract, trans.tokenId].join('&')}`}
                    component={RouterLink}
                  >
                    <Box
                      component="img"
                      alt=""
                      src={`/static/${methodItem.icon}.svg`}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 1,
                        cursor: 'pointer',
                        background: methodItem.color,
                        p: 2
                      }}
                    />
                  </Link>
                  <Link
                    to={`/explorer/collectible/detail/${[trans.chain, trans.contract, trans.tokenId].join('&')}`}
                    component={RouterLink}
                  >
                    <Typography variant="subtitle2">{eventName}</Typography>
                  </Link>
                </Stack>
              );
            }
            break;
          case 'image':
            cellcontent = (
              <Stack direction="row" spacing={2}>
                <Link
                  to={`/marketplace/detail/${[trans.chain, trans.contract, trans.tokenId].join('&')}`}
                  component={RouterLink}
                  sx={{ color: 'inherit' }}
                >
                  <Box sx={{ width: 50, height: 50 }}>
                    <TabletImgBox {...trans} />
                  </Box>
                </Link>
                <Stack textAlign="left">
                  <Link
                    to={`/collections/detail/${[trans.chain, trans.contract].join('&')}`}
                    component={RouterLink}
                    sx={{ color: 'inherit' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {trans.collectionName}
                    </Typography>
                  </Link>
                  <Link
                    to={`/marketplace/detail/${[trans.chain, trans.contract, trans.tokenId].join('&')}`}
                    component={RouterLink}
                    sx={{ color: 'inherit' }}
                  >
                    <Typography variant="subtitle2">{trans.name}</Typography>
                  </Link>
                </Stack>
              </Stack>
            );
            break;
          case 'price':
            {
              const priceVal = math.round((trans?.order?.price ?? 0) / 1e18, 3);
              const coinType = getCoinTypeFromToken(trans);
              const coinUSD = coinPrice[coinType.index];
              cellcontent = (
                <Stack display="inline-flex" textAlign="left">
                  <Stack direction="row" spacing={1}>
                    <Box
                      component="img"
                      src={`/static/${coinType.icon}`}
                      sx={{
                        width: 20,
                        display: 'inline',
                        filter: (theme) =>
                          theme.palette.mode === 'dark' && coinType.index === 0 ? 'invert(1)' : 'none'
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      color="origin.main"
                      flexGrow={1}
                      textAlign="left"
                      display="inline-flex"
                    >
                      {priceVal}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'inline' }}>
                    ≈ USD {math.round(coinUSD * priceVal, 2)}
                  </Typography>
                </Stack>
              );
            }
            break;
          case 'buyerAddr':
          case 'sellerAddr':
            {
              // const addrstr = trans[column.id];
              // const dispAddress = infoByAddress[addrstr] ? infoByAddress[addrstr].name : reduceHexAddress(addrstr);
              const order = trans?.order || { buyerAddr: trans.royaltyOwner, sellerAddr: '' };
              const addrstr = order[column.id];
              const dispAddress =
                (column.id === 'sellerAddr' ? order?.sellerInfo?.name : '') || reduceHexAddress(addrstr);
              cellcontent = (
                <Stack direction="row" spacing={1} alignItems="center" display="inline-flex">
                  {dispAddress.length > 0 && addrstr !== blankAddress ? (
                    <Link to={`/profile/others/${addrstr}`} component={RouterLink} color="inherit">
                      <Typography variant="body2" color="origin.main" display="inline-flex">
                        {dispAddress}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography variant="body2" color="origin.main" display="inline-flex">
                      ---
                    </Typography>
                  )}
                  {infoByAddress[addrstr] && infoByAddress[addrstr].kyc && <KYCBadge />}
                </Stack>
              );
            }
            break;
          case 'marketTime':
            cellcontent = (
              <Typography variant="body2" color="text.secondary">
                {getDateDistance(!trans?.order ? trans.createTime : trans.order.updateTime)}
              </Typography>
            );
            break;
          default:
            break;
        }
        return (
          <TableCell key={column.id} align={column.align}>
            {cellcontent}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

ActivityTableRow.propTypes = {
  trans: PropTypes.any,
  coinPrice: PropTypes.any,
  infoByAddress: PropTypes.any,
  COLUMNS: PropTypes.any
};

export default React.memo(ActivityTableRow);
