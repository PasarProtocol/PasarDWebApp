import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Link, Typography, Divider } from '@mui/material';
import CollectionView from './Template'
import LoadingScreen from '../../LoadingScreen';
import { reduceHexAddress, getAssetImage } from '../../../utils/common';
import CopyButton from '../../CopyButton';
// ----------------------------------------------------------------------


CollectibleItem.propTypes = {
  news: PropTypes.object.isRequired
};

function CollectibleItem({ news }) {
  const { image, title, tokenId, baseToken, tokenIdHex, postedAt, creator } = news;
  return (
      <Stack direction="row" alignItems="center" spacing={2}>
          <Link to={`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`} component={RouterLink} sx={{borderRadius: 1}} >
            <Box
                draggable = {false}
                component="img"
                alt={title}
                src={image}
                onError={(e) => e.target.src = '/static/broken-image.svg'}
                sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer' }}
            />
          </Link>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Link to={`/explorer/collectible/detail/${[tokenId, baseToken].join('&')}`} component={RouterLink} color="text.primary">
                <Typography variant="subtitle2" noWrap>
                  {title}
                </Typography>
              </Link>
              <Typography variant="body2" noWrap>
                <Link to={`/explorer/transaction/detail/${creator}`} component={RouterLink} color="text.secondary">
                  Creator : {reduceHexAddress(creator)}
                </Link>
                <CopyButton text={creator}/>
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  {formatDistance(postedAt, new Date(), { addSuffix: true }).replace("about","").trim()}
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
          <CollectibleItem 
            news={{
              image: getAssetImage(collectible, true),
              title: collectible.name,
              creator: collectible.royaltyOwner,
              postedAt: collectible.createTime*1000,
              tokenId: collectible.tokenId,
              baseToken: collectible.baseToken,
              tokenIdHex: collectible.tokenIdHex
            }}
          />
          {
            index<props.dataList.length-1&&
            <Divider sx={{pb: 2}}/>
          }
        </Box>
      ))}
      {
        !props.isLoading && !props.dataList.length &&
        <Typography variant="h5" align='center' sx={{mt: 2}}>No collectible found!</Typography>
      }
    </CollectionView>
  );
}