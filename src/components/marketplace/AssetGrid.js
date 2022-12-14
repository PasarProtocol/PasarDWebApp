import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'mathjs';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import {

  getTotalCountOfCoinTypes,
  getCoinTypeFromToken,
  getImageFromIPFSUrl, setAllTokenPrice2, getHiveHubImageFromIPFSUrl
} from '../../utils/common';
// ----------------------------------------------------------------------
const StackedGrid = ({ children, itemWidth }) => (
  <Box display="grid" gridTemplateColumns={`repeat(auto-fill, minmax(${itemWidth}px, 1fr))`} gap={1.5}>
    {children}
  </Box>
);

StackedGrid.propTypes = {
  children: PropTypes.node,
  itemWidth: PropTypes.number
};

const GridItems = (props) => {
  const { assets = [], type, myaddress, updateCount, handleUpdate } = props;
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const curState = [...prevState];
      curState[type] = value;
      return curState;
    });
  };

  React.useEffect(() => {
    setAllTokenPrice2(setCoinPriceByType);
  }, []);

  return (
    <>
      {assets.map((item, index) => {
        const coinType = getCoinTypeFromToken(item);
        const isOnMarket = Object.keys(item?.token || {}).length > 0;
        return item ? (
          <AssetCard
            key={index}
            {...item}
            chain={isOnMarket ? item?.token?.chain : item?.chain}
            contract={isOnMarket ? item?.token?.contract : item?.contract}
            tokenId={isOnMarket ? item?.token?.tokenId : item?.tokenId}
            uniqueKey={(isOnMarket ? item?.token?.uniqueKey : item?.uniqueKey) || ''}
            name={isOnMarket ? item?.token?.name : item?.name}
            orderId={(isOnMarket ? item?.orderId : item?.order?.orderId) ?? 0}
            orderType={(isOnMarket ? item?.orderType : item?.order?.orderType) ?? 0}
            orderState={(isOnMarket ? item?.orderState : item?.order?.orderState) ?? 0}
            amount={(isOnMarket ? item?.amount : item?.order?.amount) ?? 0}
            price={round(((isOnMarket ? item?.price : item?.order?.price) ?? 0) / 1e18, 3)}
            baseToken={(item.baseToken ? item.baseToken : item.contract) || ''}
            endTime={(isOnMarket ? item?.endTime : item?.order?.endTime) ?? 0}
            tokenOwner={(isOnMarket ? item?.token?.tokenOwner : item?.tokenOwner) || ''}
            royaltyOwner={(isOnMarket ? item?.token?.royaltyOwner : item?.royaltyOwner) || ''}
            royaltyFee={(isOnMarket ? item?.token?.royaltyFee : item?.royaltyFee) / 1 ?? 0}
            bids={(isOnMarket ? item?.bids : item?.order?.bids) / 1 ?? 0}
            lastBid={(item?.lastBid ? item?.lastBid : item?.order?.lastBid) / 1 ?? 0}
            lastBidder={(item?.lastBidder ? item?.lastBidder : item?.order?.lastBidder) || ''}
            reservePrice={round(((isOnMarket ? item?.reservePrice : item?.order?.reservePrice) ?? 0) / 1e18, 3)}
            buyoutPrice={round(((isOnMarket ? item?.buyoutPrice : item?.order?.buyoutPrice) ?? 0) / 1e18, 3)}
            thumbnail={ (item.type === 'FeedsChannel' || item.type === 'HiveNode') ? getHiveHubImageFromIPFSUrl(item.data.avatar): getImageFromIPFSUrl(
              isOnMarket ? item?.token?.data?.thumbnail || item?.token?.image : item?.data?.thumbnail || item?.image
            )}
            type={type}
            coinUSD={coinPrice[coinType.index]}
            coinType={coinType}
            isLink={Boolean(true)}
            showPrice={Boolean(true)}
            myaddress={myaddress}
            updateCount={updateCount}
            handleUpdate={handleUpdate}
            orderChain={item.chain}
          />
        ) : (
          <AssetCardSkeleton key={index} />
        );
      })}
    </>
  );
};

GridItems.propTypes = {
  assets: PropTypes.any,
  type: PropTypes.number,
  myaddress: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

AssetGrid.propTypes = {
  dispMode: PropTypes.number,
  assets: PropTypes.any,
  type: PropTypes.number,
  myaddress: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

export default function AssetGrid(props) {
  const { dispMode, assets, type = 0, myaddress, updateCount, handleUpdate } = props;
  let itemWidth = 200;
  if (dispMode === 0) itemWidth = isMobile ? 230 : 270;
  else itemWidth = isMobile ? 150 : 200;

  return (
    <StackedGrid itemWidth={itemWidth}>
      <GridItems {...{ assets, type, myaddress, updateCount, handleUpdate }} />
    </StackedGrid>
  );
}
