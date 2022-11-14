import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import HoverVideoPlayer from 'react-hover-video-player';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Icon } from '@iconify/react';
import { getImageFromIPFSUrl } from '../../utils/common';
import useSettings from '../../hooks/useSettings';

const BoxStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '100%',
  height: 0,
  borderRadius: 12,
  background: theme.palette.mode === 'dark' ? theme.palette.background.neutral : theme.palette.grey[300],
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

const TabletImgBox = (props) => {
  const src = getImageFromIPFSUrl(props?.data?.image || props?.image);
  const imageRef = React.useRef();
  const [isVideo, setIsVideo] = React.useState(false);
  const [videoIsLoaded, setVideoIsLoaded] = React.useState(false);
  const [isAfterLoad, setIsAfterLoad] = React.useState(false);

  React.useEffect(() => {
    fetch(src)
      .then((response) => {
        const contentype = response.headers.get('content-type');
        if (contentype.startsWith('video')) {
          setIsVideo(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
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

  const handleErrorImage = (e) => {
    e.target.src = '/static/broken-image.svg';
  };

  const imageStyle = {
    maxHeight: '100%'
  };
  const { themeMode } = useSettings();
  const themeProp = {};
  if (themeMode === 'dark') {
    themeProp.baseColor = '#333d48';
    themeProp.highlightColor = '#434d58';
  }
  return (
    <BoxStyle>
      {((!isVideo && !isAfterLoad) || (isVideo && !videoIsLoaded)) && (
        <SkeletonTheme {...themeProp}>
          <Skeleton style={{ justifyContent: 'center', aspectRatio: '1/1', padding: 2, zIndex: 1, display: 'flex' }} />
        </SkeletonTheme>
      )}
      <Box className="img-box" ref={imageRef}>
        {!isVideo ? (
          <LazyLoadImage
            src={src}
            effect="blur"
            wrapperProps={{
              style: {
                display: 'contents'
              }
            }}
            style={{ ...imageStyle }}
            afterLoad={handleResize}
            onError={handleErrorImage}
          />
        ) : (
          <>
            <HoverVideoPlayer
              videoSrc={src}
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
    </BoxStyle>
  );
};

TabletImgBox.propTypes = {
  data: PropTypes.any,
  image: PropTypes.any
};
export default TabletImgBox;
