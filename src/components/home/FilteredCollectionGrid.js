import React from 'react';
import Slider from 'react-slick';
import {isMobile} from 'react-device-detect';
import Carousel from 'react-multi-carousel';
import { Box, Button } from '@mui/material';

import CollectionCard from '../collection/CollectionCard';
import CollectionCardSkeleton from '../collection/CollectionCardSkeleton';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl, collectionTypes } from '../../utils/common';
// ----------------------------------------------------------------------

export default function FilteredCollectionGrid(props){
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [isDragging, setDragging] = React.useState(false);

  const settings = {
    beforeChange: () => {setDragging(true)},
    afterChange: () => {setDragging(false)},
    additionalTransfrom: 0,
    arrows: false,
    pauseOnHover: false,
    autoPlay: true,
    autoPlaySpeed: 2500,
    centerMode: false,
    containerClass: "container-with-dots",
    draggable: true,
    focusOnSelect: false,
    infinite: true,
    keyBoardControl: true,
    minimumTouchDrag: 80,
    renderButtonGroupOutside: false,
    renderDotsOutside: false,
    responsive: {
      desktop: {
        breakpoint: {
          max: 3000,
          min: 1200
        },
        items: 3,
        partialVisibilityGutter: 50
      },
      desktop_sm: {
        breakpoint: {
          max: 1200,
          min: 750
        },
        items: 2,
        partialVisibilityGutter: 40
      },
      mobile: {
        breakpoint: {
          max: 750,
          min: 0
        },
        items: 1,
        partialVisibilityGutter: 30
      }
    },
    showDots: false,
    slidesToSlide: 1,
    swipeable: true
  }
  
  React.useEffect(async () => {
    setLoadingCollections(true);
    fetchFrom('api/v2/sticker/getCollection')
      .then((response) => {
        response.json().then((jsonAssets) => {
          setCollections(jsonAssets.data);
          setLoadingCollections(false);
        }).catch((e) => {
          setLoadingCollections(false);
        });
      })
      .catch((e) => {
        if (e.code !== e.ABORT_ERR) setLoadingCollections(false);
      });
  }, []);
  const loadingSkeletons = Array(3).fill(0)
  
  return (
    <Box sx={{ mx: 0 }}>
      <Carousel {...settings}>
        {
          isLoadingCollections?
          loadingSkeletons.map((item, index)=>(
            <Box sx={{p: 2}}>
              <CollectionCardSkeleton key={index}/>
            </Box>
          )):
          collections.map((item, index)=>(
            <Box key={index} sx={{ p: 2, height: 330 }}>
              <CollectionCard info={item} isOnSlider={Boolean(true)} isDragging={isDragging}/>
            </Box>
          ))
        }
      </Carousel>
    </Box>
  )
}