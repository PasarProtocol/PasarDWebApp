import React from 'react';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
// material
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import { getAssetImage } from '../../utils/common';
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
const GridItems = (props) => (
    <AnimatePresence>
      {props.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {
            item?
            <AssetCard
              thumbnail={getAssetImage(item, true)}
              title={item.name && item.name}
              description={item.description}
              price={round(item.price/1e18, 3)}
              quantity={item.quantity}
              tokenId={item.tokenId}
              saleType={item.SaleType?item.SaleType:item.saleType}
              type={props.type}
              isLink={1&&true}
              orderId={item.orderId}
              royaltyOwner={item.royaltyOwner}
              holder={item.holder}
              {...props}
            />:
            <AssetCardSkeleton/>
          }
        </motion.div>
      ))}
    </AnimatePresence>
);
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