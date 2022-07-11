import React, { Component } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Fade } from "react-slideshow-image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-slideshow-image/dist/styles.css";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import LoadingScreen from '../LoadingScreen';
import { fetchFrom, getAssetImage } from '../../utils/common'

const BoxStyle = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    maxWidth: 500,
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    position: 'relative',
    '& .carousel img': {
        display: 'block'
    }
}));

const CardStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    maxWidth: 500,
    overflow: 'hidden',
    position: 'relative',
    '& .indicators': {
        position: 'absolute',
        width: '100%',
        bottom: 20,
        zIndex: 1,
        padding: '0 20px'
    },
    '& .carousel-box': {
        marginTop: 0
    }
}));

function CarouselInCollection({collection}) {
    const { name, collectibles, token, marketPlace=1 } = collection
    const getConfigurableProps = () => ({
        showArrows: false,
        showStatus: false,
        showIndicators: false,
        infiniteLoop: true,
        showThumbs: false,
        useKeyboardArrows: false,
        autoPlay: true,
        stopOnHover: false,
        swipeable: false,
        dynamicHeight: true,
        emulateTouch: false,
        autoFocus: false,
        interval: 500,
        transitionTime: 0,
    });
    return (
        <Link to={`/collections/detail/${marketPlace}${token}`} component={RouterLink}>
            <BoxStyle className="carousel-box">
                <Carousel {...getConfigurableProps()} animationHandler="fade" swipeable={false}>
                    {
                        collectibles.slice(0,5).map((each, index) => {
                            const imageSrc = getAssetImage(each, false)
                            return <Box key={index} sx={{
                                // position: 'relative',
                                pb: '100%',
                                height: 0,                        
                            }}>
                                <Typography variant="h5" sx={{position: 'absolute', top: 16, left: 16, color: 'white', zIndex: 1}}>{name}</Typography>
                                {/* <Box component='img' src={imageSrc} sx={{position: 'absolute', width: '100%', height: '100%'}}/> */}
                                <LazyLoadImage 
                                    src={imageSrc}
                                    effect="blur" 
                                    wrapperProps={{
                                        style:{
                                            position: 'absolute', 
                                            width: '100%', 
                                            height: '100%',
                                            left: 0
                                        }
                                    }} 
                                    style={{
                                        width: '100%', height: '100%'
                                    }} 
                                />
                            </Box>
                        })
                    }
                </Carousel>
            </BoxStyle>
        </Link>
    );
}

export default function HomeAssetCarousel() {
    const [collections, setCollections] = React.useState([]);
    const [isLoadingCollections, setLoadingCollections] = React.useState(false);
    
    React.useEffect(() => {
        setLoadingCollections(true);
        fetchFrom(`api/v2/sticker/getCollection?sort=0&onMarket=${true}`, {})
          .then((response) => {
            response.json().then((jsonAssets) => {
                if(Array.isArray(jsonAssets.data)){
                    const tempCollectionData = jsonAssets.data.filter(collection=>collection.collectibles.length>1)
                    setCollections(tempCollectionData.slice(0, 3));
                }
                setLoadingCollections(false);
            }).catch((e) => {
                setLoadingCollections(false);
            });
          })
          .catch((e) => {
                setLoadingCollections(false);
          });
    }, []);

    const properties = {
        duration: 2500,
        autoplay: true,
        transitionDuration: 500,
        arrows: false,
        infinite: true,
        easing: "ease",
        indicators: (i) => 
            <Box className="indicator"
                sx={{
                    width: 'calc(33.33% - 10px)',
                    color: 'blue',
                    position: 'relative',
                    m: '5px',
                    py: 1,
                    cursor: 'pointer',
                    '&:before, &:after': {
                        height: 2,
                        transition: 'all 0.12s ease-in-out 0s',
                        transformOrigin: 'center center',
                    },
                    '&:hover:before, &:hover:after': {
                        transform: 'scale(1, 2.5)'
                    },
                    '&:before': {
                        content: '""',
                        background: 'rgba(255, 255, 255, 0.5)',
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        borderRadius: 5
                    },
                    '&:after': {
                        content: '""',
                        background: 'rgba(255, 255, 255, 0.95)',
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: 0,
                        borderRadius: 5,
                    },
                    '&.active:after': {
                        width: '100%',
                        transition: 'width 2.5s ease-in-out 0s',
                    }
                }}
            />
            //     {i + 1}
            // </Box>
    };
    return (
        <CardStyle className="carousel-box" sx={{ display: !isLoadingCollections&&!collections.length?'none':'block'}}>
            {
                isLoadingCollections?
                <Box sx={{ pb: '100%', height: 0, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 0, height: '100%', display: 'flex', alignItems: 'center', left: '50%', transform: 'translate(-50%, 0)' }}>
                        {/* <Box component='img' src='/static/loading-homecard.jpg' sx={{width: '100%'}}/> */}
                        <LoadingScreen />
                    </Box>
                </Box>:
                <Fade {...properties}>
                    {collections.map((collection, index) => (
                        <CarouselInCollection key={index} collection={collection}/>
                    ))}
                </Fade>
            }
        </CardStyle>
    );
}