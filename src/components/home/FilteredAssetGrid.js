import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'mathjs';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Box } from '@mui/material';
import { MHidden } from '../@material-extend';
import AssetCard from '../marketplace/AssetCard';
import AssetCardSkeleton from '../marketplace/AssetCardSkeleton';
import {
  
  getTotalCountOfCoinTypes,
  fetchAPIFrom,
  getCoinTypeFromToken,
  getImageFromIPFSUrl, setAllTokenPrice2
} from '../../utils/common';
// ----------------------------------------------------------------------

const AssetGroupSlider = (props) => {
  const { isLoading, assets, type } = props;
  const [coinPrice, setCoinPrice] = React.useState(Array(getTotalCountOfCoinTypes()).fill(0));
  const [isDragging] = React.useState(false);

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
        perPage: 5
      },
      1300: {
        perPage: 4
      },
      1000: {
        perPage: 3
      },
      800: {
        perPage: 2
      },
      600: {
        perPage: 1
      }
    }
  };

  const setCoinPriceByType = (type, value) => {
    setCoinPrice((prevState) => {
      const tempPrice = [...prevState];
      tempPrice[type] = value;
      return tempPrice;
    });
  };

  React.useEffect(() => {
    setAllTokenPrice2(setCoinPriceByType);
  }, []);

  const loadingSkeletons = Array(10).fill(0);

  return (
    <Box sx={{ mx: 0 }}>
      {isLoading ? (
        <Box>
          <Splide options={settings}>
            {loadingSkeletons.map((_, index) => (
              <SplideSlide key={index}>
                <Box sx={{ p: 2 }}>
                  <AssetCardSkeleton />
                </Box>
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      ) : (
        <Splide options={settings}>
          {assets.map((item, index) => {
            const coinType = getCoinTypeFromToken(item);
            const isOnMarket = type !== 'recent_sold';
            return (
              <SplideSlide key={index}>
                <Box
                  sx={{
                    p: 2,
                    '& h5 img': {
                      display: 'inline'
                    }
                  }}
                >
                  <AssetCard
                    {...item}
                    chain={isOnMarket ? item?.token?.chain : item?.chain}
                    contract={isOnMarket ? item?.token?.contract : item?.contract}
                    tokenId={isOnMarket ? item?.token?.tokenId : item?.tokenId}
                    uniqueKey={(isOnMarket ? item?.token?.uniqueKey : item?.uniqueKey) || ''}
                    name={isOnMarket ? item?.token?.name : item?.name}
                    orderId={(isOnMarket ? item?.orderId : item?.order?.orderId) ?? 0}
                    orderType={(isOnMarket ? item?.orderType : item?.order?.orderType) ?? 0}
                    orderState={(isOnMarket ? item?.orderState : item?.order?.orderState) ?? 0}
                    amount={(isOnMarket ? item?.amount : item?.order?.amount) ?? 0}
                    price={round(((isOnMarket ? item?.price : item?.order?.price) ?? 0) / 1e18, 3)}
                    baseToken={(isOnMarket ? item?.baseToken : item?.order?.baseToken) || ''}
                    endTime={(isOnMarket ? item?.endTime : item?.order?.endTime) ?? 0}
                    tokenOwner={(isOnMarket ? item?.token?.tokenOwner : item?.tokenOwner) || ''}
                    royaltyOwner={(isOnMarket ? item?.token?.royaltyOwner : item?.royaltyOwner) || ''}
                    royaltyFee={(isOnMarket ? item?.token?.royaltyFee : item?.royaltyFee) / 1 ?? 0}
                    bids={(isOnMarket ? item?.bids : item?.order?.bids) / 1 ?? 0}
                    lastBid={(isOnMarket ? item?.lastBid : item?.order?.lastBid) / 1 ?? 0}
                    lastBidder={(isOnMarket ? item?.lastBidder : item?.order?.lastBidder) || ''}
                    reservePrice={round(((isOnMarket ? item?.reservePrice : item?.order?.reservePrice) ?? 0) / 1e18, 3)}
                    buyoutPrice={round(((isOnMarket ? item?.buyoutPrice : item?.order?.buyoutPrice) ?? 0) / 1e18, 3)}
                    thumbnail={getImageFromIPFSUrl(
                      isOnMarket
                        ? item?.token?.data?.thumbnail || item?.token?.image
                        : item?.data?.thumbnail || item?.image
                    )}
                    type={0}
                    coinUSD={coinPrice[coinType.index]}
                    coinType={coinType}
                    isLink={Boolean(true)}
                    isDragging={isDragging}
                    showPrice={type !== 'recent_sold'}
                  />
                </Box>
              </SplideSlide>
            );
          })}
        </Splide>
      )}
    </Box>
  );
};

AssetGroupSlider.propTypes = {
  isLoading: PropTypes.bool,
  assets: PropTypes.array,
  type: PropTypes.string
};

FilteredAssetGrid.propTypes = {
  type: PropTypes.string
};

export default function FilteredAssetGrid(props) {
  const { type } = props;
  const [filteredCollectibles, setFilteredCollectibles] = React.useState([]);
  const [isLoadingCollectibles, setLoadingCollectibles] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const count = type === 'all' ? 20 : 10;
      let status = [];
      if (type === 'live_auction') status = [1, 4];

      setLoadingCollectibles(true);
      let res;
      try {
        if (type === 'recent_sold') {
          res = await fetchAPIFrom(`api/v1/listCollectibles?type=sold&after=0&pageNum=1&pageSize=${count}`, {});
        } else {
          const reqBody = {
            pageNum: 1,
            pageSize: count,
            chain: 'all',
            status,
            sort: 0,
            type: ''
          };
          res = await fetchAPIFrom('api/v1/marketplace', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
          });
        }
        const json = await res.json();
        setFilteredCollectibles(json?.data?.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoadingCollectibles(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return type === 'all' ? (
    <>
      <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(0, 10)} />
      {filteredCollectibles.slice(10).length > 0 && (
        <MHidden width="mdDown">
          <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(10)} />
        </MHidden>
      )}
    </>
  ) : (
    <AssetGroupSlider isLoading={isLoadingCollectibles} assets={filteredCollectibles.slice(0, 10)} type={type} />
  );
}
