import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Link, Typography, Divider } from '@mui/material';
import CollectionView from './Template';
import LoadingScreen from '../../LoadingScreen';
import CopyButton from '../../CopyButton';
import { reduceHexAddress, getAssetImage, getDateDistance } from '../../../utils/common';
// ----------------------------------------------------------------------

CollectibleItem.propTypes = {
  collectible: PropTypes.object.isRequired
};

function CollectibleItem({ collectible }) {
  const { name, tokenId, baseToken, tokenIdHex, createTime, royaltyOwner: creator } = collectible;
  const imageUrl = getAssetImage(collectible, true);

  const handleErrorImage = (e) => {
    if (e.target.src.indexOf('pasarprotocol.io') >= 0) {
      e.target.src = getAssetImage(collectible, true, 1);
    } else if (e.target.src.indexOf('ipfs.ela') >= 0) {
      e.target.src = getAssetImage(collectible, true, 2);
    } else {
      e.target.src = '/static/broken-image.svg';
    }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Link
        to={`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`}
        component={RouterLink}
        sx={{ borderRadius: 1 }}
      >
        <Box
          draggable={false}
          component="img"
          alt={name}
          src={imageUrl}
          onError={handleErrorImage}
          sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer' }}
        />
      </Link>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Link
          to={`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`}
          component={RouterLink}
          color="text.primary"
        >
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <Typography variant="body2" noWrap>
          <Link to={`/explorer/transaction/detail/${creator}`} component={RouterLink} color="text.secondary">
            Minted By : {reduceHexAddress(creator)}
          </Link>
          <CopyButton text={creator} />
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
