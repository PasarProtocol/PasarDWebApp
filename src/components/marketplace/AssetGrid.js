import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'mathjs';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import {
  setAllTokenPrice,
  getTotalCountOfCoinTypes,
  getCoinTypeFromTokenEx,
  getImageFromIPFSUrl
} from '../../utils/common';
// ----------------------------------------------------------------------
const StackedGrid = ({ children, ...props }) => (
  <Box display="grid" gridTemplateColumns={`repeat(auto-fill, minmax(${props.itemWidth}px, 1fr))`} gap={1.5}>
    {children}
  </Box>
);

StackedGrid.propTypes = {
  children: PropTypes.node,
  itemWidth: PropTypes.number
};

const GridItems = (props) => {
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  };

  React.useEffect(() => {
    setAllTokenPrice(setCoinPriceByType);
  }, []);

  return (
    <>
      {props.assets.map((item, index) => {
        const coinType = getCoinTypeFromTokenEx(item);
        const isAuction = item?.orderType === 2;

        return item ? (
          <AssetCard
            key={index}
            {...item}
            uniqueKey={(isAuction ? item?.token?.uniqueKey : item?.uniqueKey) || ''}
            name={item?.name || ''}
            thumbnail={getImageFromIPFSUrl(
              isAuction ? item?.token?.data?.thumbnail || item?.token?.image : item?.data?.thumbnail || item?.image
            )}
            orderId={(isAuction ? item?.orderId : item?.order?.orderId) / 1 ?? 0}
            orderType={(isAuction ? item?.orderType : item?.order?.orderType) / 1 ?? 0}
            orderState={(isAuction ? item?.orderState : item?.order?.orderState) / 1 ?? 0}
            price={round(((isAuction ? item?.price : item?.order?.price) ?? 0) / 1e18, 3)}
            amount={(isAuction ? item?.amount : item?.order?.amount) / 1 ?? 0}
            baseToken={(isAuction ? item?.baseToken : item?.order?.baseToken) || ''}
            endTime={(isAuction ? item?.endTime : item?.order?.endTime) / 1 ?? 0}
            tokenOwner={(isAuction ? item?.token?.tokenOwner : item?.tokenOwner) || ''}
            royaltyOwner={(isAuction ? item?.token?.royaltyOwner : item?.royaltyOwner) || ''}
            royaltyFee={(isAuction ? item?.token?.royaltyFee : item?.royaltyFee) / 1 ?? 0}
            bids={(isAuction ? item?.bids : item?.order?.bids) / 1 ?? 0}
            lastBid={(isAuction ? item?.lastBid : item?.order?.lastBid) / 1 ?? 0}
            lastBidder={(isAuction ? item?.lastBidder : item?.order?.lastBidder) || ''}
            buyoutPrice={round(((isAuction ? item?.buyoutPrice : item?.order?.buyoutPrice) ?? 0) / 1e18, 3)}
            reservePrice={round(((isAuction ? item?.reservePrice : item?.order?.reservePrice) ?? 0) / 1e18, 3)}
            isLink={Boolean(true)}
            coinUSD={coinPrice[coinType.index]}
            coinType={coinType}
            {...props}
          />
        ) : (
          <AssetCardSkeleton key={index} />
        );
      })}
    </>
  );
};

GridItems.propTypes = {
  assets: PropTypes.any
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
