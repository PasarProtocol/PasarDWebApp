import React from 'react';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
// material
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import { getAssetImage, getCoinUSD, getDiaTokenPrice, getCollectionTypeFromImageUrl, coinTypes } from '../../utils/common';
import { blankAddress } from '../../config';
// ----------------------------------------------------------------------
const StackedGrid = ({
  // gridItemWidth = "250px",
  children,
  ...props
}) => (
  <Box display="grid" gridTemplateColumns={`repeat(auto-fill, minmax(${props.itemWidth}px, 1fr))`} gap={1.5}>
    {children}
  </Box>
);
const GridItems = (props) => {
  const [coinPrice, setCoinPrice] = React.useState([0,0]);
  React.useEffect(()=>{
    getCoinUSD().then((res) => {
      setCoinPriceByType(0, res)
    });
    getDiaTokenPrice().then((res) => {
      setCoinPriceByType(1, res.token.derivedELA * res.bundle.elaPrice)
    })
  }, [])
  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  }
  return <AnimatePresence>
      {props.items.map((item, index) => {
        let coinType = 0
        if(item) {
          const { quoteToken=blankAddress } = item
          coinType = coinTypes.findIndex(el=>el.address===quoteToken)
          coinType = coinType<0?0:coinType
        }

        return <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {
            item?
            <AssetCard
              {...item}
              thumbnail={getAssetImage(item, true)}
              price={round(item.price/1e18, 3)}
              saleType={item.SaleType?item.SaleType:item.saleType}
              isLink={Boolean(true)}
              coinUSD={coinPrice[coinType]}
              coinType={coinType}
              collection={getCollectionTypeFromImageUrl(item)}
              {...props}
            />:
            <AssetCardSkeleton/>
          }
        </motion.div>
      })}
    </AnimatePresence>
}
export default function AssetGrid(props){
  let itemWidth = 200
  if(props.dispmode===0)
    itemWidth = isMobile?230:270
  else itemWidth = isMobile?150:200
  return(
    <StackedGrid itemWidth={itemWidth}>
      <GridItems 
        items={props.assets}
        type={props.type?props.type:0}
        myaddress={props.myaddress}
        updateCount={props.updateCount}
        handleUpdate={props.handleUpdate}
      />
    </StackedGrid>
  )
}