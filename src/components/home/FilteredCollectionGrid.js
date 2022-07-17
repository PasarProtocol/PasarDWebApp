import React from 'react';
import {isMobile} from 'react-device-detect';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Box, Button } from '@mui/material';

import CollectionCard from '../collection/CollectionCard';
import CollectionCardSkeleton from '../collection/CollectionCardSkeleton';
import { fetchFrom, collectionTypes } from '../../utils/common';
// ----------------------------------------------------------------------

export default function FilteredCollectionGrid(props){
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);

  const settings = {
    rewind: true,
    // gap : '1rem',
    arrows: false,
    autoplay: true,
    cloneStatus: true,
    // type: "loop",
    // focus: 'center',
    pagination: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    resetProgress: false,
    perPage: 4,
    perMove: 1,
    interval: 2500,
    lazyLoad: true,
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
  
  React.useEffect(() => {
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
        if (e.code !== e.ABORT_ERR)
          setLoadingCollections(false);
      });
  }, []);
  const loadingSkeletons = Array(3).fill(0)
  
  return (
    <Box sx={{ mx: 0 }}>
      {
        isLoadingCollections?
        <Box>
          <Splide options={settings}>
            {
              loadingSkeletons.map((_, index)=>(
                <SplideSlide key={index}>
                  <Box sx={{p: 2}}>
                    <CollectionCardSkeleton/>
                  </Box>
                </SplideSlide>
              ))
            }
          </Splide>
        </Box>:

        <Splide options={settings}>
          {
            collections.map((item, index)=>(
              <SplideSlide key={index}>
                <Box sx={{ p: 2, height: '100%' }}>
                  <CollectionCard info={item} isOnSlider={Boolean(true)}/>
                </Box>
              </SplideSlide>
            ))
          }
        </Splide>
      }
    </Box>
  )
}