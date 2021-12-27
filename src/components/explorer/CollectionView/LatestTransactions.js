import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, IconButton } from '@mui/material';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import palette from '../../../theme/palette'

// material
import CollectionView from './Template'
import LoadingScreen from '../../LoadingScreen';
import MethodLabel from '../../MethodLabel';
import { reduceHexAddress, getThumbnail } from '../../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired
};
function TransItem({ trans, isLast }) {
  const { image, tokenId, txhash, description, postedAt, gasFee } = trans;
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: palette.light.grey['300'], pb: 2};
  return (
      <Stack direction="row" alignItems="center" spacing={2} sx={sx}>
          <Link href={`/explorer/transaction/${tokenId}`} underline="none" sx={{borderRadius: 1}} >
            <Box
                component="img"
                alt=""
                src={image}
                onError={(e) => e.target.src = '/static/broken-image.svg'}
                sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer' }}
            />
          </Link>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" color='text.secondary' noWrap>
                <Link href={`https://esc.elastos.io/tx/${txhash}`} sx={{borderRadius: 1}} target="_blank">
                  Tx Hash : {reduceHexAddress(txhash)}
                  <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                      <Icon icon={externalLinkFill} width="17px"/>
                  </IconButton>
                </Link>
              </Typography>
              <Typography variant="body2" color='text.secondary' noWrap>
                  Method: <MethodLabel description={description}/>
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary', pb: '5px' }} align="right" noWrap>
                  {formatDistance(postedAt, new Date(), { addSuffix: true }).replace("about","").trim()}
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  Tx Fee : {gasFee} ELA
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
          <TransItem 
            key={index}
            trans={{
              image: getThumbnail(trans.thumbnail),
              tokenId: trans.tokenIdHex,
              txhash: trans.tokenIdHex,
              gasFee: trans.royalties / 10 ** 8,
              postedAt: trans.createTime*1000,
              description: 'Transfer'
            }}
            isLast={index===props.dataList.length-1}
          />
      ))}
    </CollectionView>
  );
}