import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, IconButton, Divider } from '@mui/material';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';

// material
import CollectionView from './Template'
import LoadingScreen from '../../LoadingScreen';
import { MethodList, reduceHexAddress, getExplorerSrvByNetwork } from '../../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
};
export function TransItem({ trans }) {
  let methodItem = MethodList.find((item)=>item.method===trans.event)
  if(!methodItem)
      methodItem = {color: 'grey', icon: 'tag', detail: []}
  const explorerSrvUrl = getExplorerSrvByNetwork(trans.marketPlace)
  return (
      <Stack direction="row" spacing={2}>
          <Link href={`/explorer/collectible/detail/${[trans.tokenId, trans.baseToken].join('&')}`} underline="none" sx={{borderRadius: 1}} >
            <Box
                component="img"
                alt=""
                src={`/static/${methodItem.icon}.svg`}
                sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer', background: methodItem.color, p: 2 }}
            />
          </Link>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" noWrap>
                <Link href={`${explorerSrvUrl}/tx/${trans.tHash}`} target="_blank" color='text.secondary'>
                  Tx Hash : {reduceHexAddress(trans.tHash)}
                  <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                      <Icon icon={externalLinkFill} width="17px"/>
                  </IconButton>
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
                  Tx Fee : {trans.gasFee?trans.gasFee:0} ELA
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  {trans.timestamp ? formatDistance(trans.timestamp*1000, new Date(), { addSuffix: true }).replace("about","").trim() : ''}
              </Typography>
          </Box>
      </Stack>
  );
}
export default function LatestTransactions(props) {
  return (
    <CollectionView title={props.title} to="transaction">
      {props.isLoading && <LoadingScreen />}
      {props.dataList.map((trans, index) => (
        <Box key={index}>
          <TransItem trans={trans}/>
          {
            index<props.dataList.length-1&&
            <Divider sx={{pb: 2}}/>
          }
        </Box>
      ))}
      {
        !props.isLoading && !props.dataList.length &&
        <Typography variant="h5" align='center' sx={{mt: 2}}>No transaction found!</Typography>
      }
    </CollectionView>
  );
}