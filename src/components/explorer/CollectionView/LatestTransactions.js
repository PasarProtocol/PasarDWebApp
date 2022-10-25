import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, IconButton, Divider } from '@mui/material';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';

// material
import CollectionView from './Template';
import LoadingScreen from '../../LoadingScreen';
import {
  MethodList,
  reduceHexAddress,
  getExplorerSrvByNetwork,
  chainTypes,
  getDateDistance
} from '../../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired
  // event: Mint, SafeTransferFromWithMemo, SafeTransferFrom, SetApprovalForAll, Burn, CreateOrderForSale, BuyOrder, CancelOrder, ChangeOrderPrice, OrderBid, OrderForAuction
  // marketPlace:
  // tokenId:
  // baseToken,
  // transactionHash,
  // gasFee,
  // timestamp
};
export function TransItem({ trans }) {
  // console.log('=======++++++Tx', trans);
  let methodItem = MethodList.find((item) => item.method === trans.event);
  if (!methodItem) methodItem = { color: 'grey', icon: 'tag', detail: [] };
  const explorerSrvUrl = getExplorerSrvByNetwork(trans.marketPlace);

  const tempChainType = chainTypes[trans.marketPlace - 1];
  let feeTokenName = 'ELA';
  if (tempChainType) feeTokenName = tempChainType.token;

  return (
    <Stack direction="row" spacing={2}>
      <Link
        href={`/explorer/collectible/detail/${[trans.tokenId, trans.baseToken].join('&')}`}
        underline="none"
        sx={{ borderRadius: 1 }}
      >
        <Box
          component="img"
          alt=""
          src={`/static/${methodItem.icon}.svg`}
          sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer', background: methodItem.color, p: 2 }}
        />
      </Link>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="body2" noWrap>
          <Link href={`${explorerSrvUrl}/tx/${trans.transactionHash}`} target="_blank" color="text.secondary">
            Tx Hash : {reduceHexAddress(trans.transactionHash)}
            <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
              <Icon icon={externalLinkFill} width="17px" />
            </IconButton>
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
          Tx Fee : {trans.gasFee / 1e9 || 0} {feeTokenName}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
          {getDateDistance(trans.timestamp)}
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
          <TransItem trans={trans} />
          {index < props.dataList.length - 1 && <Divider sx={{ pb: 2 }} />}
        </Box>
      ))}
      {!props.isLoading && !props.dataList.length && (
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          No transaction found!
        </Typography>
      )}
    </CollectionView>
  );
}

LatestTransactions.propTypes = {
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  dataList: PropTypes.array
};
