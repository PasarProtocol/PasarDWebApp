import React from 'react';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// material
import { Box, Button } from '@mui/material';
import { MHidden } from '../@material-extend';
import AssetCard from '../marketplace/AssetCard';
import AssetCardSkeleton from '../marketplace/AssetCardSkeleton';
import { fetchFrom, getAssetImage, getCoinUSD, getCollectionTypeFromImageUrl } from '../../utils/common';
// ----------------------------------------------------------------------

const AssetGroupSlider = (props)=>{
  const {isLoading, assets} = props
  const [coinUSD, setCoinUSD] = React.useState(0);
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
          min: 1300
        },
        items: 5,
        partialVisibilityGutter: 50
      },
      desktop_sm: {
        breakpoint: {
          max: 1300,
          min: 1000
        },
        items: 4,
        partialVisibilityGutter: 40
      },
      tablet: {
        breakpoint: {
          max: 1000,
          min: 800
        },
        items: 3,
        partialVisibilityGutter: 40
      },
      tablet_sm: {
        breakpoint: {
          max: 800,
          min: 600
        },
        items: 2,
        partialVisibilityGutter: 30
      },
      mobile: {
        breakpoint: {
          max: 600,
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
    getCoinUSD().then((res) => {
      setCoinUSD(res);
    });
  }, []);
  const loadingSkeletons = Array(10).fill(null)
  return (
    <Box sx={{ mx: 0 }}>
      <Carousel {...settings}>
        {
          isLoading?
          loadingSkeletons.map((item, index)=>(
            <Box key={index} sx={{p: 2}}>
              <AssetCardSkeleton key={index}/>
            </Box>
          )):
          assets.map((item, index)=>(
            <Box key={index} sx={{
              p: 2,
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
                isDragging={isDragging}
                collection={getCollectionTypeFromImageUrl(item)}
              />
            </Box>
          ))
        }
      </Carousel>
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