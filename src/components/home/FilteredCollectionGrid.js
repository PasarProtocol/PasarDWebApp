import React from 'react';
import {isMobile} from 'react-device-detect';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/dist/css/splide.min.css';
import { Box, Button } from '@mui/material';

import CollectionCard from '../collection/CollectionCard';
import CollectionCardSkeleton from '../collection/CollectionCardSkeleton';
import { fetchFrom, collectionTypes } from '../../utils/common';
// ----------------------------------------------------------------------

export default function FilteredCollectionGrid(props){
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);
  const [isDragging, setDragging] = React.useState(false);
  const ref = React.useRef()

  const settings = { 
    rewind: true,
    // type: 'loop',
    // autoplay: true,
    pauseOnHover: false,
    resetProgress: true,
    updateOnMove: true,
    live: true,
    perPage: 4,
    perMove: 1,
    speed: 2500,
    lazyLoad: 'nearby',
    preloadPages: 4,
    breakpoints: {
      3000: {
        perPage: 3,
      },
      1200: {
        perPage: 2,
      },
      750: {
        perPage: 1,
      },
    }
  }
  
  React.useEffect(async () => {
    setInterval(() => {
      if(ref.current)
        ref.current.splide.go('>');
    }, 2500);

    setLoadingCollections(true);
    fetchFrom('api/v2/sticker/getCollection')
      .then((response) => {
        response.json().then((jsonAssets) => {
          if(Array.isArray(jsonAssets.data))
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
      <Splide ref={ref} options={settings}>
        {
          isLoadingCollections?
          loadingSkeletons.map((item, index)=>(
            <SplideSlide key={index}>
              <Box sx={{p: 2}}>
                <CollectionCardSkeleton/>
              </Box>
            </SplideSlide>
          )):
          collections.map((item, index)=>(
            <SplideSlide key={index}>
              <Box sx={{ p: 2, height: '100%' }}>
                <CollectionCard info={item} isOnSlider={Boolean(true)} isDragging={isDragging}/>
              </Box>
            </SplideSlide>
          ))
        }
      </Splide>
    </Box>
  )
}