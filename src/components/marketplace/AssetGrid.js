import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'mathjs';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import { setAllTokenPrice, getCoinTypeFromToken, getTotalCountOfCoinTypes } from '../../utils/common';
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
        const coinType = getCoinTypeFromToken(item);

        return item ? (
          <AssetCard
            key={index}
            {...item}
            price={round(item.price / 1e18, 3)}
            saleType={item.SaleType ? item.SaleType : item.saleType}
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
  dispmode: PropTypes.number,
  assets: PropTypes.any,
  type: PropTypes.number,
  myaddress: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func
};

export default function AssetGrid(props) {
  const { dispmode, assets, type = 0, myaddress, updateCount, handleUpdate } = props;
  let itemWidth = 200;
  if (dispmode === 0) itemWidth = isMobile ? 230 : 270;
  else itemWidth = isMobile ? 150 : 200;

  return (
    <StackedGrid itemWidth={itemWidth}>
      <GridItems {...{ assets, type, myaddress, updateCount, handleUpdate }} />
    </StackedGrid>
  );
}
