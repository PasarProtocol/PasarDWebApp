import React from 'react';
import {round} from 'mathjs'
import {isMobile} from 'react-device-detect';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
// material
import { Box, Button } from '@mui/material';
import { MHidden } from '../@material-extend';
import { CarouselControlsPaging2 } from '../carousel/controls';
import AssetCard from '../marketplace/AssetCard';
import AssetCardSkeleton from '../marketplace/AssetCardSkeleton';
import { fetchFrom, getAssetImage, setAllTokenPrice, getCoinTypeFromToken, coinTypes, coinTypesForEthereum } from '../../utils/common';
// ----------------------------------------------------------------------

const AssetGroupSlider = (props)=>{
  const {isLoading, assets, type} = props
  const [coinPrice, setCoinPrice] = React.useState(Array(coinTypes.length+coinTypesForEthereum.length).fill(0));
  const [isDragging, setDragging] = React.useState(false);
  const ref = React.useRef()

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
        perPage: 5,
      },
      1300: {
        perPage: 4,
      },
      1000: {
        perPage: 3,
      },
      800: {
        perPage: 2,
        // perMove: 2
      },
      600: {
        perPage: 1,
      }
    }
  }

  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  }

  React.useEffect(()=>{
    setAllTokenPrice(setCoinPriceByType)
  }, [])

  const loadingSkeletons = Array(10).fill(0)
  return (
    <Box sx={{ mx: 0 }}>
      {
        isLoading?
        <Box>
          <Splide options={ settings }>
            {
              loadingSkeletons.map((item, index)=>(
                <SplideSlide key={index}>
                  <Box sx={{p: 2}}>
                    <AssetCardSkeleton key={index}/>
                  </Box>
                </SplideSlide>
              ))
            }
          </Splide>
        </Box>:

        <Splide options={ settings }>
          {
            assets.map((item, index)=>{
              const coinType = getCoinTypeFromToken(item)
              return <SplideSlide key={index}>
                  <Box sx={{
                    p: 2,
                    '& h5 img': {
                      display: 'inline'
                    }
                  }}>
                    <AssetCard
                      {...item}
                      thumbnail={getAssetImage(item, true)}
                      name={item.name && item.name}
                      price={round(item.price/1e18, 3)}
                      saleType={item.SaleType || item.saleType}
                      type={0}
                      isLink={Boolean(true)}
                      coinUSD={coinPrice[coinType.index]}
                      coinType={coinType}
                      isDragging={isDragging}
                      showPrice={type==='recent_sold'}
                      // defaultCollectionType={getCollectionTypeFromImageUrl(item)}
                    />
                  </Box>
                </SplideSlide>
            })
          }
        </Splide>
      }
    </Box>
  )
}

export default function FilteredAssetGrid(props){
  const {type} = props
  const [filteredCollectibles, setFilteredCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);
  const count = type==='all'?20:10
  let filterApi = `api/v2/sticker/getDetailedCollectibles?collectionType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&keyword=&pageNum=1&pageSize=${count}`
  if(type === 'recent_sold')
    filterApi = "api/v2/sticker/getRecentlySold"
  else if(type === 'live_auction')
    filterApi = `api/v2/sticker/getDetailedCollectibles?collectionType=&tokenType=&status=On Auction,Has Ended&itemType=All&adult=false&minPrice=&maxPrice=&order=0&keyword=&pageNum=1&pageSize=${count}`

  React.useEffect(() => {
    setLoadingCollectibles(true);
    fetchFrom(filterApi)
      .then((response) => {
        response.json().then((jsonAssets) => {
          if(jsonAssets.data){
            setFilteredCollectibles(type==='recent_sold'?jsonAssets.data:jsonAssets.data.result);
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
    <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(0, 10)} type={type}/>
  )
}