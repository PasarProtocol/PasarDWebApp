import React, { Component } from "react";
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const BoxStyle = styled(Box)(({ theme }) => ({
    width: '80%',
    height: '100%',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    position: 'relative',
    '& .indicators': {
        position: 'absolute',
        width: '100%',
        bottom: 20,
        zIndex: 1,
        padding: '0 20px'
    }
}));

export default function HomeAssetCarousel() {
    // const [current, setCurrentBox] = React.useState(0);
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
    const slideImages = [
      "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
      "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    ];
    const slideCollections = ['Bunny Punks', 'Pasar', 'Elastos']
    return (
        <BoxStyle className="carousel-box">
            <Fade {...properties}>
                {slideImages.map((each, index) => (
                    <Box key={index} sx={{
                        // position: 'relative',
                        pb: '100%',
                        height: 0,
                    }}>
                        <Typography variant="h5" sx={{position: 'absolute', top: 16, left: 16, color: 'white', zIndex: 1}}>{slideCollections[index]}</Typography>
                        <Box component='img' src={each} sx={{position: 'absolute', width: '100%', height: '100%'}}/>
                    </Box>
                ))}
            </Fade>
        </BoxStyle>
    );
}