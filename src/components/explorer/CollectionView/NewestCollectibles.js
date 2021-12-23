// material
import CollectionView from './Template'
import NewsItem from './NewsItem'
import LoadingScreen from '../../LoadingScreen';
import { reduceHexAddress, getElapsedTime, getThumbnail } from '../../../utils/common';
// ----------------------------------------------------------------------
export default function NewestCollectibles(props) {
  return (
    <CollectionView title={props.title} to="collectible">
      {props.isLoading && <LoadingScreen />}
      {props.dataList.map((collectible, index) => (
          <NewsItem 
            key={index}
            news={{
              image: getThumbnail(collectible.thumbnail),
              title: collectible.name,
              creator: "Creator : ".concat(reduceHexAddress(collectible.holder)),
              postedAt: collectible.createTime*1000,
              description: "Token ID : ".concat(reduceHexAddress(collectible.tokenIdHex))
            }}
            isLast={index===props.dataList.length-1}
          />
      ))}
    </CollectionView>
  );
}