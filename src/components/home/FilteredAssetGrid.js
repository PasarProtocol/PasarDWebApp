import React from 'react';
import Slider from 'react-slick';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
import Carousel from 'react-grid-carousel'
// material
import { Box, Button } from '@mui/material';
import { CarouselControlsPaging2 } from '../carousel/controls';
import AssetCard from '../marketplace/AssetCard';
import AssetCardSkeleton from '../marketplace/AssetCardSkeleton';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl } from '../../utils/common';
// ----------------------------------------------------------------------

export default function FilteredAssetGrid(props){
  const {type} = props
  const [filteredCollectibles, setFilteredCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  const [coinUSD, setCoinUSD] = React.useState(0);
  const count = type==='all'?10:5
  const settings = {
    dots: false,
    arrows: true,
    nextArrow: <Button>next</Button>,
    autoplay: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    rows: type==='all'&&!isMobile?2:1,
    responsive: [
      {breakpoint: 1200, settings: {slidesToShow: 5}},
      {breakpoint: 900, settings: {slidesToShow: 4}},
      {breakpoint: 750, settings: {slidesToShow: 3}},
      {breakpoint: 600, settings: {slidesToShow: 2}},
      {breakpoint: 450, settings: {slidesToShow: 1}}
    ]
  }

  React.useEffect(async () => {
    setLoadingCollectibles(true);
    getCoinUSD().then((res) => {
      setCoinUSD(res);
    });
    fetchFrom(`api/v2/sticker/getDetailedCollectibles?collectionType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&keyword=&pageNum=1&pageSize=${count}`)
      .then((response) => {
        response.json().then((jsonAssets) => {
          if(jsonAssets.data){
            setFilteredCollectibles(jsonAssets.data.result);
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
  const loadingSkeletons = Array(count).fill(null)
  return (
    <Box sx={{ mx: 0 }}>
      <Slider {...settings}>
        {
          isLoadingCollectibles?
          loadingSkeletons.map((item, index)=>(
            <Box key={index} sx={{p: 1}}>
              <AssetCardSkeleton key={index}/>
            </Box>
          )):
          filteredCollectibles.map((item, index)=>(
            <Box key={index} sx={{
              p: 1,
              '& h5 img': {
                display: 'inline'
              }
            }}>
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
            </Box>
          ))
        }
      </Slider>
    </Box>
    
  )
}