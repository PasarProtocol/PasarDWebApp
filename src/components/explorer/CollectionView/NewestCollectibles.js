// material
import { styled } from '@mui/material/styles';
import { Grid, Card } from '@mui/material';
import CollectionView from './Template'
import NewsItem from './NewsItem'
import { reduceHexAddress, getElapsedTime, getThumbnail } from '../../../utils/common';
// ----------------------------------------------------------------------
export default function NewestCollectibles(props) {
  return (
    <CollectionView title={props.title}>
      {props.dataList.map((collectible, index) => (
          <NewsItem 
            key={index}
            news={{
              image: getThumbnail(collectible.thumbnail),
              postedAt: collectible.createTime,
              title: collectible.name,
              description: reduceHexAddress(collectible.tokenIdHex).concat("Token ID : ")
            }}
          />
      ))}
    </CollectionView>
  );
}