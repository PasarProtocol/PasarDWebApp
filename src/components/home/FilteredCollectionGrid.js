import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Box } from '@mui/material';

import CollectionCard from '../collection/CollectionCard';
import CollectionCardSkeleton from '../collection/CollectionCardSkeleton';
import { collectionTypes, fetchAPIFrom } from '../../utils/common';
// ----------------------------------------------------------------------

export default function FilteredCollectionGrid() {
  const [collections, setCollections] = React.useState(collectionTypes);
  const [isLoadingCollections, setLoadingCollections] = React.useState(false);

  const settings = {
    rewind: true,
    arrows: false,
    autoplay: true,
    cloneStatus: true,
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
        perPage: 3
      },
      1200: {
        perPage: 2
      },
      750: {
        perPage: 1
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingCollections(true);
      try {
        const res = await fetchAPIFrom(
          `api/v1/listCollections?pageNum=1&pageSize=10&chain=all&category=all&sort=10`,
          {}
        );
        const json = await res.json();
        setCollections(json?.data?.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoadingCollections(false);
    };
    fetchData();
  }, []);
  const loadingSkeletons = Array(3).fill(0);

  return (
    <Box sx={{ mx: 0 }}>
      {isLoadingCollections ? (
        <Box>
          <Splide options={settings}>
            {loadingSkeletons.map((_, index) => (
              <SplideSlide key={index}>
                <Box sx={{ p: 2 }}>
                  <CollectionCardSkeleton />
                </Box>
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      ) : (
        <Splide options={settings}>
          {collections.map((item, index) => (
            <SplideSlide key={index}>
              <Box sx={{ p: 2, height: '100%' }}>
                <CollectionCard info={item} isOnSlider={Boolean(true)} />
              </Box>
            </SplideSlide>
          ))}
        </Splide>
      )}
    </Box>
  );
}
