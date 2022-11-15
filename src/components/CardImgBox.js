import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import HoverVideoPlayer from 'react-hover-video-player';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Icon } from '@iconify/react';
import { chainTypes, getChainIndexFromChain } from '../utils/common';
import useSettings from '../hooks/useSettings';

const BoxStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '100%',
  height: 0,
  boxShadow: `${theme.palette.mode === 'dark' ? '#141618' : '#d4d6d8'} 0px 1px 4px 0px inset, rgb(${
    theme.palette.mode === 'dark' ? '0 0 0' : '255 255 255'
  } / 50%) 0px -1px 4px 0px inset`,
  background: theme.palette.background.neutral,
  overflow: 'hidden',
  '&:after': {
    content: "''",
    width: '200%',
    height: '100%',
    top: '-90%',
    left: '-20px',
    opacity: 0.1,
    transform: 'rotate(45deg)',
    background: `linear-gradient(to top, transparent, ${
      theme.palette.mode === 'dark' ? '#ffffff80' : '#fff'
    } 15%, rgba(${theme.palette.mode === 'dark' ? '0, 0, 0' : '255, 255, 255'},0.5))`,
    transition: '0.3s',
    position: 'absolute'
  },
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

const useStyles = makeStyles({
  spinnerBox: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner: {
    width: '4em',
    height: '4em',
    border: '6px solid white',
    borderRadius: '50%',
    borderColor: 'white white transparent transparent',
    animation: `$loadingOverlaySpinner 1000ms linear infinite`
  },
  '@keyframes loadingOverlaySpinner': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
});
const LoadingOverlay = () => {
  const classes = useStyles();
  return (
    <Box className={classes.spinnerBox}>
      <Box className={classes.spinner} />
    </Box>
  );
};
const CardImgBox = (props) => {
  const { isMoreLink = false, chain, thumbnail } = props;
  let chainIndex = getChainIndexFromChain(chain);
  if (chainIndex < 1) chainIndex = 1;
  const imageRef = React.useRef();
  const [isVideo, setIsVideo] = React.useState(false);
  const [videoIsLoaded, setVideoIsLoaded] = React.useState(false);
  const [isAfterLoad, setIsAfterLoad] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(thumbnail);
        const contentype = res.headers.get('content-type');
        if (contentype.startsWith('video')) {
          setIsVideo(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isVideo) {
      const obj = document.getElementById('videoId');
      obj.addEventListener('loadeddata', () => {
        if (obj.readyState >= 2) {
          setVideoIsLoaded(true);
        }
      });
    }
  }, [isVideo]);

  const handleResize = () => {
    setIsAfterLoad(true);
  };

  const imageStyle = {
    maxHeight: '100%',
    padding: '1px'
  };
  const { themeMode } = useSettings();
  const themeProp = {};
  if (themeMode === 'dark') {
    themeProp.baseColor = '#333d48';
    themeProp.highlightColor = '#434d58';
  }

  return (
    <BoxStyle className="card-img" sx={{ opacity: isMoreLink ? 0.5 : 1 }}>
      {((!isVideo && !isAfterLoad) || (isVideo && !videoIsLoaded)) && (
        <SkeletonTheme {...themeProp}>
          <Skeleton style={{ justifyContent: 'center', aspectRatio: '1/1', padding: 2, zIndex: 1 }} />
        </SkeletonTheme>
      )}
      <Box className="img-box" ref={imageRef}>
        {!isVideo ? (
          <LazyLoadImage
            src={thumbnail}
            effect="blur"
            wrapperProps={{
              style: {
                display: 'contents'
              }
            }}
            style={{ ...imageStyle }}
            afterLoad={handleResize}
          />
        ) : (
          <>
            <HoverVideoPlayer
              videoSrc={thumbnail}
              loadingOverlay={<LoadingOverlay />}
              videoId="videoId"
              style={{ width: '100%', height: '100%' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: '#eee',
                fontSize: '20pt',
                display: 'inline-block',
                lineHeight: 0,
                borderRadius: '50%',
                background: 'black'
              }}
            >
              <Icon icon="fa6-regular:circle-play" />
            </Box>
          </>
        )}
      </Box>
      <Box
        className="chain-type"
        sx={{
          position: 'absolute',
          bottom: 10,
          width: '100%',
          textAlign: 'center',
          opacity: 0,
          transition: 'opacity .2s'
        }}
      >
        <Box
          sx={{
            bgcolor: chainTypes[chainIndex - 1].color,
            borderRadius: 2,
            display: 'inline-flex',
            px: '10px',
            py: 1
          }}
        >
          <Typography variant="subtitle2" color="white">
            {chainTypes[chainIndex - 1].name}
          </Typography>
        </Box>
      </Box>
    </BoxStyle>
  );
};
export default CardImgBox;

CardImgBox.propTypes = {
  isMoreLink: PropTypes.bool,
  thumbnail: PropTypes.any,
  chain: PropTypes.string
};
