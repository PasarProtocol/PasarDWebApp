import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
// ----------------------------------------------------------------------

const StackedGrid = ({ children }) => (
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={1.5}>
    {children}
  </Box>
);

StackedGrid.propTypes = {
  children: PropTypes.node
};

const GridItems = (props) => (
  <AnimatePresence>
    {props.assets.map((src, index) => (
      <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <AssetCard
          {...props}
          thumbnail={src}
          name={props.multiNames[index]}
          isLink={false}
          type={0}
          defaultCollectionType={0}
        />
      </motion.div>
    ))}
  </AnimatePresence>
);

GridItems.propTypes = {
  assets: PropTypes.any,
  multiNames: PropTypes.any
};

export default function MultiMintGrid(props) {
  return (
    <StackedGrid>
      <GridItems {...props} />
    </StackedGrid>
  );
}
