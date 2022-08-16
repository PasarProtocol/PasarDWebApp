import React from 'react';
import * as math from 'mathjs';
import 'react-loading-skeleton/dist/skeleton.css'
import { Box, Stack, Typography, TableRow, Link, TableCell } from '@mui/material';

import TabletImgBox from './TabletImgBox'
import KYCBadge from '../badge/KYCBadge';
import { getCoinTypeFromToken, getDateDistance, reduceHexAddress, MethodList } from '../../utils/common';
// ----------------------------------------------------------------------

const EventByType = {
  "Minted": "Mint",
  "Listed": "CreateOrderForSale",
  "Sale": "BuyOrder"
}

const ActivityTableRow = (props) => {
  const {trans, coinPrice, infoByAddress, COLUMNS} = props
  return (
    <TableRow hover tabIndex={-1}>
      {COLUMNS.map((column) => {
        let cellcontent = ''
        switch(column.id) {
          case "type": {
            const originEvent = EventByType[trans.type]
            let methodItem = MethodList.find((item)=>item.method===originEvent)
            if(!methodItem)
                methodItem = {color: 'grey', icon: 'tag', detail: []}
            // const explorerSrvUrl = getExplorerSrvByNetwork(trans.marketPlace)
            cellcontent = 
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  component="img"
                  alt=""
                  src={`/static/${methodItem.icon}.svg`}
                  sx={{ width: 50, height: 50, borderRadius: 1, cursor: 'pointer', background: methodItem.color, p: 2 }}
                />
                <Typography variant="subtitle2">{ trans.type }</Typography>
              </Stack>
          }
            break;
          case "image":
            cellcontent = 
              <Stack direction="row" spacing={2}>
                <Box sx={{width: 50, height: 50}}>
                  <TabletImgBox {...trans}/>
                </Box>
                <Stack flexGrow={1} textAlign="left">
                  <Typography variant="body2" color="text.secondary">{trans.collectionName}</Typography>
                  <Typography variant="subtitle2">{trans.name}</Typography>
                </Stack>
              </Stack>
            break;
          case "price": {
            const priceVal = trans.price ? math.round(trans.price/1e18, 3) : 0
            const coinType = getCoinTypeFromToken(trans)
            const coinUSD = coinPrice[coinType.index]
            cellcontent = 
              <Stack display="inline-flex" textAlign="left">
                <Stack direction='row' spacing={1}>
                  <Box component="img" src={`/static/${coinType.icon}`} sx={{ width: 20, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&coinType.index===0?'invert(1)':'none' }} />
                  <Typography variant="subtitle1" color="origin.main" flexGrow={1} textAlign="left" display='inline-flex'>{priceVal}</Typography>
                </Stack>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'inline'}}>≈ USD {math.round(coinUSD * priceVal, 2)}</Typography>
              </Stack>
          }
            break;
          case "buyerAddr":
          case "sellerAddr": {
            const addrstr = trans[column.id]
            const dispAddress = infoByAddress[addrstr] ? infoByAddress[addrstr].name : reduceHexAddress(addrstr)
            cellcontent = 
              <Stack direction="row" spacing={1} alignItems="center" display="inline-flex">
                <Typography variant="body2" color="origin.main" display="inline-flex">
                  {dispAddress}
                </Typography>
                {
                  infoByAddress[addrstr] && infoByAddress[addrstr].kyc && <KYCBadge/>
                }
              </Stack>
          }
            break;
          case "marketTime":
            cellcontent = <Typography variant="body2" color="text.secondary">{getDateDistance(trans.marketTime)}</Typography>
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
  )
}
export default React.memo(ActivityTableRow)