import React from 'react';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
import Carousel from 'react-grid-carousel'
// material
import { Box } from '@mui/material';
import AssetCard from './AssetCard';
import AssetCardSkeleton from './AssetCardSkeleton';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl } from '../../utils/common';
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
const CarouselItems = (props) => {
  
}
export default function RecentSoldGrid(props){
  const [recentSoldCollectibles, setRecentSoldCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  const [coinUSD, setCoinUSD] = React.useState(0);
  React.useEffect(async () => {
    setLoadingCollectibles(true);
    getCoinUSD().then((res) => {
      setCoinUSD(res);
    });
    fetchFrom(`api/v2/sticker/getDetailedCollectibles?collectionType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&keyword=&pageNum=1&pageSize=5`)
      .then((response) => {
        response.json().then((jsonAssets) => {
          if(jsonAssets.data){
            setRecentSoldCollectibles(jsonAssets.data.result);
          }
          setLoadingCollectibles(false);
        }).catch((e) => {
          setLoadingCollectibles(false);
        });
      })
      .catch((e) => {
        if (e.code !== e.ABORT_ERR)
          setLoadingCollectibles(false);
      });
  }, []);
  const loadingSkeletons = Array(5).fill(null)
  return (
    <Carousel 
      gap={10}
      rows={1}
      responsiveLayout={[
        { breakpoint: 2000, cols: 5 },
        { breakpoint: 1200, cols: 4 },
        { breakpoint: 1000, cols: 3 },
        { breakpoint: 750, cols: 2 },
        { breakpoint: 499, autoplay: 2000, loop: true }
      ]}
    >
      {
        isLoadingCollectibles?
        loadingSkeletons.map((item, index)=>(
          <Carousel.Item key={index}>
            <AssetCardSkeleton key={index}/>
          </Carousel.Item>
        )):
        recentSoldCollectibles.map((item, index)=>(
          <Carousel.Item key={index}>
            <AssetCard
              {...item}
              thumbnail={getAssetImage(item, true)}
              title={item.name && item.name}
              price={round(item.price/1e18, 3)}
              saleType={item.SaleType || item.saleType}
              type={0}
              isLink={1&&true}
              coinUSD={coinUSD}
              collection={getCollectionTypeFromImageUrl(item)}
            />
          </Carousel.Item>
        ))
      }
    </Carousel>
  )
}