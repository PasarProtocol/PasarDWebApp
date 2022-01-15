import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
// material
import { Box } from '@mui/material';

import AssetCard from './AssetCard';
import { getThumbnail } from '../../utils/common';
// ----------------------------------------------------------------------
const StackedGrid = ({
  gridItemWidth = "280px",
  children,
  ...props
}) => (
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={1.5}>
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
  return(
    <StackedGrid>
      <GridItems items={props.assets} ratio="3:2" />
    </StackedGrid>
  )
}