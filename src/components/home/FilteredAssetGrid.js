import React from 'react';
import Slider from 'react-slick';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
import Carousel from 'react-grid-carousel'
// material
import { Box, Button } from '@mui/material';
import { MHidden } from '../@material-extend';
import { CarouselControlsPaging2 } from '../carousel/controls';
import AssetCard from '../marketplace/AssetCard';
import AssetCardSkeleton from '../marketplace/AssetCardSkeleton';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl } from '../../utils/common';
// ----------------------------------------------------------------------

const AssetGroupSlider = (props)=>{
  const {isLoading, assets} = props
  const [coinUSD, setCoinUSD] = React.useState(0);
  const [isDragging, setDragging] = React.useState(false);
  const settings = {
    dots: false,
    arrows: true,
    nextArrow: <Button>next</Button>,
    autoplay: true,
    autoplaySpeed: 1000,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    beforeChange: () => {setDragging(true)},
    afterChange: () => {setDragging(false)},
    rows: 1,
    responsive: [
      {breakpoint: 1300, settings: {slidesToShow: 5}},
      {breakpoint: 1000, settings: {slidesToShow: 4}},
      {breakpoint: 850, settings: {slidesToShow: 3}},
      {breakpoint: 700, settings: {slidesToShow: 2}},
      {breakpoint: 450, settings: {slidesToShow: 1}}
    ]
  }

  React.useEffect(async () => {
    getCoinUSD().then((res) => {
      setCoinUSD(res);
    });
  }, []);
  const loadingSkeletons = Array(10).fill(null)
  return (
    <Box sx={{ mx: 0 }}>
      <Slider {...settings}>
        {
          isLoading?
          loadingSkeletons.map((item, index)=>(
            <Box key={index} sx={{p: 1}}>
              <AssetCardSkeleton key={index}/>
            </Box>
          )):
          assets.map((item, index)=>(
            <Box key={index} sx={{
              p: 1,
              '& h5 img': {
                display: 'inline'
              }
            }}>
              <AssetCard
                {...item}
                isDragging={isDragging}
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

export default function FilteredAssetGrid(props){
  const {type} = props
  const [filteredCollectibles, setFilteredCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  const count = type==='all'?20:10

  React.useEffect(async () => {
    setLoadingCollectibles(true);
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

  return (
    type==='all'?(
      <>
        <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(0, 10)}/>
        {
          filteredCollectibles.slice(10).length>0&&
          <MHidden width="mdDown">
            <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(10)}/>
          </MHidden>
        }
      </>
    ):
    <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(0, 10)}/>
  )
}