import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Link, Typography, Divider } from '@mui/material';
import CollectionView from './Template';
import LoadingScreen from '../../LoadingScreen';
import CopyButton from '../../CopyButton';
import { reduceHexAddress, getDateDistance, getImageFromIPFSUrl } from '../../../utils/common';
// ----------------------------------------------------------------------

CollectibleItem.propTypes = {
  collectible: PropTypes.object.isRequired
};

function CollectibleItem({ collectible }) {
  const { tokenId, contract, chain, name, tokenIdHex, createTime, royaltyOwner, image, data } = collectible;
  const imgSrc = getImageFromIPFSUrl(data?.thumbnail || image);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Link
        to={`/explorer/collectible/detail/${[chain, contract, tokenId].join('&')}`}
        component={RouterLink}
        sx={{ borderRadius: 1 }}
      >
        <Box
          draggable={false}
          component="img"
          alt={name}
          src={imgSrc}
          sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer' }}
        />
      </Link>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Link
          to={`/explorer/collectible/detail/${[chain, contract, tokenId].join('&')}`}
          component={RouterLink}
          color="text.primary"
        >
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <Typography variant="body2" noWrap>
          <Link to={`/explorer/transaction/detail/${royaltyOwner}`} component={RouterLink} color="text.secondary">
            Minted By : {reduceHexAddress(royaltyOwner)}
          </Link>
          <CopyButton text={royaltyOwner} />
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
          {getDateDistance(createTime)}
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary', pb: '5px' }} align="right" noWrap>
          Token ID : {reduceHexAddress(tokenIdHex)}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function NewestCollectibles(props) {
  return (
    <CollectionView title={props.title} to="collectible">
      {props.isLoading && <LoadingScreen />}
      {props.dataList.map((collectible, index) => (
        <Box key={index}>
          <CollectibleItem collectible={collectible} />
          {index < props.dataList.length - 1 && <Divider sx={{ pb: 2 }} />}
        </Box>
      ))}
      {!props.isLoading && !props.dataList.length && (
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          No collectible found!
        </Typography>
      )}
    </CollectionView>
  );
}

NewestCollectibles.propTypes = {
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  dataList: PropTypes.array
};
