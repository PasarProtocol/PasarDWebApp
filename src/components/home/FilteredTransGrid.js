import React from 'react';
import Slider from 'react-slick';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { motion, AnimatePresence } from "framer-motion";
import Carousel from 'react-grid-carousel'
// material
import { Box, Button, Divider } from '@mui/material';
import { TransItem } from '../explorer/CollectionView/LatestTransactions'
import TransSkeleton from './TransSkeleton';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl } from '../../utils/common';
// ----------------------------------------------------------------------
export default function FilteredTransGrid(props){
  const [transactions, setFilteredTrans] = React.useState([]);
  const [isLoadingTrans, setLoadingTrans] = React.useState(false);
  const settings = {
    dots: false,
    arrows: true,
    nextArrow: <Button>next</Button>,
    autoplay: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    rows: 3,
    responsive: [
      {breakpoint: 1500, settings: {slidesToShow: 3}},
      {breakpoint: 1000, settings: {slidesToShow: 2}},
      {breakpoint: 700, settings: {slidesToShow: 1}}
    ]
  }

  React.useEffect(async () => {
    setLoadingTrans(true);
    fetchFrom(`api/v2/sticker/listTrans?pageNum=1&pageSize=9`)
      .then((response) => {
        response.json().then((jsonTrans) => {
          if(jsonTrans.data){
            setFilteredTrans(jsonTrans.data.results);
          }
          setLoadingTrans(false);
        }).catch((e) => {
          setLoadingTrans(false);
        });
      })
      .catch((e) => {
        if (e.code !== e.ABORT_ERR)
          setLoadingTrans(false);
      });
  }, []);
  const loadingSkeletons = Array(9).fill(null)
  return (
    <Box sx={{ mx: 0 }}>
      <Slider {...settings}>
        {
          isLoadingTrans?
          loadingSkeletons.map((item, index)=>(
            <Box key={index} sx={{p: 1}}>
              <TransSkeleton key={index}/>
            </Box>
          )):
          transactions.map((trans, index)=>(
            <Box key={index} sx={{p: 1}}>
              <TransItem trans={trans}/>
              <Divider sx={{pt: 1}}/>
            </Box>
          ))
        }
      </Slider>
    </Box>
    
  )
}