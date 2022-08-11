import React from 'react'
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from "@mui/styles";
import HoverVideoPlayer from "react-hover-video-player";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Icon } from '@iconify/react';

import { getAssetImage, chainTypes } from '../../utils/common'
import useSettings from '../../hooks/useSettings';

const BoxStyle = styled(Box)(({ theme }) => ({
    position: 'relative',
    paddingBottom: '100%',
    height: 0,
    borderRadius: 12,
    boxShadow: `${theme.palette.mode==='dark'?'#141618':'#d4d6d8'} 0px 1px 4px 0px inset, rgb(${theme.palette.mode==='dark'?'0 0 0':'255 255 255'} / 50%) 0px -1px 4px 0px inset`,
    background: theme.palette.background.neutral,
    overflow: 'hidden',
    '& .img-box': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    }
}));

const useStyles = makeStyles(theme => ({
  spinnerBox: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: '4em',
    height: '4em',
    border: '6px solid white',
    borderRadius: '50%',
    borderColor: 'white white transparent transparent',
    animation: `$loadingOverlaySpinner 1000ms linear infinite`,
  },
  "@keyframes loadingOverlaySpinner": {
    "0%": {
      transform: 'rotate(0deg)'
    },
    "100%": {
      transform: 'rotate(360deg)'
    }
  }
}));
const LoadingOverlay = ()=>{
  const classes = useStyles();
  return <Box className={classes.spinnerBox}>
    <Box className={classes.spinner}/>
  </Box>
}
const TabletImgBox = (props) => {
    const src = getAssetImage(props, true)
    const imageRef = React.useRef();
    const [isVideo, setIsVideo] = React.useState(false)
    const [videoIsLoaded, setVideoIsLoaded] = React.useState(false)
    const [isAfterLoad, setIsAfterLoad] = React.useState(false)

    React.useEffect(()=>{
      fetch(src)
        .then(response => {
          const contentype = response.headers.get("content-type")
          if(contentype.startsWith('video')) {
            setIsVideo(true)
          }
        })
        .catch(e=>{console.log(e)})
    }, [])

    React.useEffect(()=>{
      if(isVideo) {
        const obj = document.getElementById('videoId');
        obj.addEventListener('loadeddata', () => {
          if(obj.readyState >= 2) {
            setVideoIsLoaded(true)
          }
        });
      }
    }, [isVideo])
    const handleResize = ()=>{
      setIsAfterLoad(true)
    }

    const handleErrorImage = (e) => {
      if(e.target.src.indexOf("pasarprotocol.io") >= 0) {
        e.target.src = getAssetImage(props, true, 1)
      } else if(e.target.src.indexOf("ipfs.ela") >= 0) {
        e.target.src = getAssetImage(props, true, 2)
      } else {
        e.target.src = '/static/broken-image.svg'
      }
    }

    const imageStyle = {
      // borderRadius: 1,
      // boxShadow: (theme)=>theme.customShadows.z16,
      // display: 'inline-flex',
      maxHeight: '100%',
    }
    const { themeMode } = useSettings();
    const themeProp = {}
    if(themeMode==="dark"){
      themeProp.baseColor = '#333d48'
      themeProp.highlightColor = '#434d58'
    }
    return (
      <BoxStyle>
        {
          ((!isVideo && !isAfterLoad) || (isVideo && !videoIsLoaded)) &&
          <SkeletonTheme {...themeProp}>
            <Skeleton style={{ justifyContent: 'center', aspectRatio: '1/1', padding: 2, zIndex: 1}} />
          </SkeletonTheme>
        }
        <Box className='img-box' ref={imageRef}>
          {
            !isVideo?
            <LazyLoadImage 
              src={src}
              effect="blur" 
              wrapperProps={{
                style:{
                  display: 'contents'
                  // width: isAfterLoad?'auto':0,
                  // display: 'inline-flex'
                }
              }} 
              style={{...imageStyle}} 
              afterLoad={handleResize} 
              onError={handleErrorImage}
            />:

            <>
              <HoverVideoPlayer
                videoSrc={src}
                // pausedOverlay={<PausedOverlay />}
                loadingOverlay={<LoadingOverlay />}
                videoId="videoId"
                style={{width: '100%', height: '100%'}}
              />
              <Box sx={{position: 'absolute', top: 10, right: 10, color: '#eee', fontSize: '20pt', display: 'inline-block', lineHeight: 0, borderRadius: '50%', background: 'black'}}>
                <Icon icon="fa6-regular:circle-play" />
              </Box>
            </>
          }
        </Box>
      </BoxStyle>
    );
};
export default TabletImgBox