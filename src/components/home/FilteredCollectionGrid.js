import React from 'react';
import Slider from 'react-slick';
import {isMobile} from 'react-device-detect';
import Carousel from 'react-grid-carousel'
import { Box, Button } from '@mui/material';

import CollectionCard from '../collection/CollectionCard';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl, collectionTypes } from '../../utils/common';
// ----------------------------------------------------------------------

const settings = {
  dots: false,
  arrows: true,
  nextArrow: <Button>next</Button>,
  autoplay: false,
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {breakpoint: 1200, settings: {slidesToShow: 3}},
    {breakpoint: 750, settings: {slidesToShow: 2}},
    {breakpoint: 450, settings: {slidesToShow: 1}}
  ]
};
export default function FilteredCollectionGrid(props){
  const {type} = props
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [coinUSD, setCoinUSD] = React.useState(0);
  React.useEffect(async () => {
    setLoadingCollections(true);
    // fetchFrom(`api/v2/sticker/getDetailedCollectibles?collectionType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&keyword=&pageNum=1&pageSize=5`)
    //   .then((response) => {
    //     response.json().then((jsonAssets) => {
    //       if(jsonAssets.data){
    //         setRecentSoldCollectibles(jsonAssets.data.result);
    //       }
    //       setLoadingCollections(false);
    //     }).catch((e) => {
    //       setLoadingCollections(false);
    //     });
    //   })
    //   .catch((e) => {
    //     if (e.code !== e.ABORT_ERR)
    //       setLoadingCollections(false);
    //   });
  }, []);
  const loadingSkeletons = Array(3).fill(null)
  return (
    <Box sx={{ mx: 0 }}>
      <Slider {...settings}>
        {
          // isLoadingCollections?
          // loadingSkeletons.map((item, index)=>(
          //   <Box sx={{p: 1}}>
          //     <AssetCardSkeleton key={index}/>
          //   </Box>
          // )):
          collections.map((item, index)=>(
            <Box key={index} sx={{ p: 1 }}>
              <CollectionCard info={item}/>
            </Box>
          ))
        }
      </Slider>
    </Box>
  )
}