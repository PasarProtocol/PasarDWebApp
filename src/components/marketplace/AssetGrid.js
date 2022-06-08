import React from 'react';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
// material
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import { getAssetImage, getCoinUSD, getDiaTokenPrice, getERC20TokenPrice, getCollectionTypeFromImageUrl, getCoinTypeFromToken, coinTypes } from '../../utils/common';
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
  const [coinPrice, setCoinPrice] = React.useState(Array(coinTypes.length).fill(0));
  React.useEffect(()=>{
    getCoinUSD().then((res) => {
      setCoinPriceByType(0, res)
    });
    getDiaTokenPrice().then((res) => {
      setCoinPriceByType(1, res.token.derivedELA * res.bundle.elaPrice)
    })
    coinTypes.forEach((token, _i)=>{
      if(_i<2)
        return
      getERC20TokenPrice(token.address).then((res) => {
        setCoinPriceByType(_i, res.token.derivedELA * res.bundle.elaPrice)
      })
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
        const coinType = getCoinTypeFromToken(item)

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
              price={round(item.price/1e18, 3)}
              saleType={item.SaleType?item.SaleType:item.saleType}
              isLink={Boolean(true)}
              coinUSD={coinPrice[coinType]}
              coinType={coinType}
              // defaultCollectionType={getCollectionTypeFromImageUrl(item)}
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