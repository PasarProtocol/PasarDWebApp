import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
// material
import { Box } from '@mui/material';

import AssetCard from './AssetCard';
// ----------------------------------------------------------------------
const StackedGrid = ({
  // gridItemWidth = "280px",
  children,
  ...props
}) => (
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={1.5}>
    {children}
  </Box>
);
const GridItems = (props) => (
    <AnimatePresence>
      {props.assets.map((src, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AssetCard
            thumbnail={src}
            title={props.multiNames[index]}
            description={props.description}
            price={props.price}
            quantity={props.quantity}
            isLink={false}
          />
        </motion.div>
      ))}
    </AnimatePresence>
);
export default function MultiMintGrid(props){
  return(
    <StackedGrid>
      <GridItems {...props} />
    </StackedGrid>
  )
}