import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography } from '@mui/material';
import palette from '../../../theme/palette'

// material
import CollectionView from './Template'
import LoadingScreen from '../../LoadingScreen';
import { reduceHexAddress, getThumbnail } from '../../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired
};
function TransItem({ trans, isLast }) {
  const { image, title, description, postedAt, gasFee } = trans;
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: palette.light.grey['300'], pb: 2};
  return (
      <Stack direction="row" alignItems="center" spacing={2} sx={sx}>
          <Box
              component="img"
              alt={title}
              src={image}
              sx={{ width: 48, height: 48, borderRadius: 1.5 }}
          />
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" color='text.secondary' noWrap>
                  {title}
              </Typography>
              <Typography variant="body2" color='text.secondary' noWrap>
                  Method: <MethodLabel description={description}/>
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  {formatDistance(postedAt, new Date(), { addSuffix: true }).replace("about","").trim()}
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  Gas Fee : {gasFee} ELA
              </Typography>
          </Box>
      </Stack>
  );
}
function MethodLabel({description}){
  return(
    <Typography variant="body2" component="span" color='text.secondary' noWrap sx={{
      px: 1,
      background: '#25CD7C',
      color: '#E3F8EF',
      borderRadius: 10,
      display: 'inline-block',
      verticalAlign: 'top'
    }}>
        {description}
    </Typography>
  )
}
export default function LatestTransactions(props) {
  return (
    <CollectionView title={props.title}>
      {props.isLoading && <LoadingScreen />}
      {props.dataList.map((collectible, index) => (
          <TransItem 
            key={index}
            trans={{
              image: getThumbnail(collectible.thumbnail),
              title: "Tx Hash : ".concat(reduceHexAddress(collectible.tokenIdHex)),
              gasFee: collectible.royalties / 10 ** 8,
              postedAt: collectible.createTime*1000,
              description: 'Transfer'
            }}
            isLast={index===props.dataList.length-1}
          />
      ))}
    </CollectionView>
  );
}