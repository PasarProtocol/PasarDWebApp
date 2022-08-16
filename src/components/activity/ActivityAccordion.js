import React from 'react';
import * as math from 'mathjs';
import 'react-loading-skeleton/dist/skeleton.css'
import { Box, Stack, Accordion, AccordionSummary, AccordionDetails, Typography, Link, Divider } from '@mui/material';

import TabletImgBox from './TabletImgBox'
import KYCBadge from '../badge/KYCBadge';
import { getCoinTypeFromToken, getDateDistance, reduceHexAddress } from '../../utils/common';
// ----------------------------------------------------------------------

const ActivityAccordion = (props) => {
  const {trans, coinPrice, infoByAddress} = props
  const [isMoreOpen, setMoreOpen] = React.useState(false)
  const priceVal = trans.price ? math.round(trans.price/1e18, 3) : 0
  const coinType = getCoinTypeFromToken(trans)
  const coinUSD = coinPrice[coinType.index]

  const AddressCell = ({field}) => {
    const addrstr = trans[field]
    const dispAddress = infoByAddress[addrstr] ? infoByAddress[addrstr].name : reduceHexAddress(addrstr)
    return (
      <Stack direction="row" spacing={1} alignItems="center" display="inline-flex">
        <Typography variant="body2" color="origin.main" display="inline-flex">
          {dispAddress}
        </Typography>
        {
          infoByAddress[addrstr] && infoByAddress[addrstr].kyc && <KYCBadge/>
        }
      </Stack>
    )
  }

  return (
    <Accordion 
      expanded={isMoreOpen}
      // onClick={(e) => handleAccordClick(key)}
      sx={{
        border: '1px solid',
        borderColor: 'action.disabledBackground',
        boxShadow: (theme) => theme.customShadows.z1
      }}
    >
      <AccordionSummary sx={{ '& .MuiAccordionSummary-content': {width: "100%"} }}>
        <Stack direction="row" spacing={1} width="100%" alignItems="center">
          <Box sx={{width: 50, height: 50}}>
            <TabletImgBox {...trans}/>
          </Box>
          <Stack flex={1} minWidth={0}>
            <Stack direction="row">
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" noWrap>{trans.collectionName}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" display="inline">{ trans.type }</Typography>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap>{trans.name}</Typography>
              </Box>
              <Box component="img" src={`/static/${coinType.icon}`} sx={{ width: 16, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'&&coinType.index===0?'invert(1)':'none' }} />
              <Typography variant="subtitle2" color="origin.main" textAlign="left" display='inline-flex' ml={1}>{priceVal}</Typography>
            </Stack>
            <Stack direction="row">
              <Box flexGrow={1}>
                <Link color="text.secondary" onClick={()=>{setMoreOpen(!isMoreOpen)}}>
                  <Typography variant="body2" noWrap display="inline-flex">{isMoreOpen?'-':'+'} more</Typography>
                </Link>
              </Box>
              <Typography variant="body2" color="text.secondary">{getDateDistance(trans.marketTime)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{pt: 0}}>
        <Divider/>
        <Stack direction="row" textAlign="center" pt={1}>
          <Box flexGrow={1}>
            <Typography variant="body2" color="text.secondary" noWrap>USD Price</Typography>
            <Typography variant="body2" noWrap>${math.round(coinUSD * priceVal, 2)}</Typography>
          </Box>
          <Box flexGrow={1}>
            <Typography variant="body2" color="text.secondary" noWrap>From</Typography>
            <AddressCell field="buyerAddr"/>
          </Box>
          <Box flexGrow={1}>
            <Typography variant="body2" color="text.secondary" noWrap>To</Typography>
            <AddressCell field="sellerAddr"/>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
export default React.memo(ActivityAccordion)