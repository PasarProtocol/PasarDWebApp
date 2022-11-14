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
  chainTypes,
  getDateDistance,
  getChainIndexFromChain,
  convertMethodName,
  getExplorerSrvByNetwork
} from '../../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired
  // event: Mint, SafeTransferFromWithMemo, SafeTransferFrom, SetApprovalForAll, Burn, CreateOrderForSale, BuyOrder, CancelOrder, ChangeOrderPrice, OrderBid, OrderForAuction
};
export function TransItem({ trans }) {
  // avatar
  let methodItem = MethodList.find((item) => convertMethodName(item.method) === trans.eventTypeName);
  if (!methodItem) methodItem = { color: 'grey', icon: 'tag', detail: [] };
  // scan url
  const chainIndex = getChainIndexFromChain(trans.chain);
  const explorerSrvUrl = getExplorerSrvByNetwork(chainIndex);
  // quote token
  let quoteTokenName = 'ELA';
  if (chainIndex) quoteTokenName = chainTypes[chainIndex - 1].token;

  return (
    <Stack direction="row" spacing={2}>
      <Link
        href={`/explorer/collectible/detail/${[trans.chain, trans.contract, trans.tokenId].join('&')}`}
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
          Tx Fee : {trans.gasFee / 1e9 || 0} {quoteTokenName}
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
