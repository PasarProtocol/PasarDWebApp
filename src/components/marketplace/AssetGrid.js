import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
// material
import { Box } from '@mui/material';

import AssetCard from './AssetCard';
import { getThumbnail } from '../../utils/common';
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
          <AssetCard
            thumbnail={getThumbnail(item.asset)}
            title={item.name && item.name}
            description={item.description}
            price={item.price}
            quantity={item.quantity}
            tokenId={item.tokenId}
            isLink={1&&true}
            {...props}
          />
        </motion.div>
      ))}
    </AnimatePresence>
);
export default function AssetGrid(props){
  const itemWidth = props.dispmode===0?270:200
  return(
    <StackedGrid itemWidth={itemWidth}>
      <GridItems items={props.assets} />
    </StackedGrid>
  )
}