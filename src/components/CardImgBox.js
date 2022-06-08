import React from 'react'
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAssetImage } from '../utils/common'

const BoxStyle = styled(Box)(({ theme }) => ({
    position: 'relative',
    paddingBottom: '100%',
    height: 0,
    boxShadow: `${theme.palette.mode==='dark'?'#141618':'#d4d6d8'} 0px 1px 4px 0px inset, rgb(${theme.palette.mode==='dark'?'0 0 0':'255 255 255'} / 50%) 0px -1px 4px 0px inset`,
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
      background: `linear-gradient(to top, transparent, ${theme.palette.mode==='dark'?'#ffffff80':'#fff'} 15%, rgba(${theme.palette.mode==='dark'?'0, 0, 0':'255, 255, 255'},0.5))`,
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

const CardImgBox = (props) => {
    const { isMoreLink=false } = props;
    const src = getAssetImage(props, true)
    const imageRef = React.useRef();

    const handleResize = ()=>{
      if(!imageRef.current)
        return
      const { clientWidth: imgWidth, clientHeight: imgHeight } = imageRef.current;
      if(imgWidth > imgHeight)
        imageRef.current.style.width = '100%'
      else
        imageRef.current.style.height = '100%'
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
      display: 'inline-flex',
      maxHeight: '100%',
      p: '1px'
    }
    return (
      <BoxStyle className='card-img' sx={{opacity: isMoreLink?.5:1}}>
        <Box className='img-box'>
          <Box draggable = {false} component="img" src={src} sx={imageStyle} ref={imageRef} onLoad={handleResize} onError={handleErrorImage}/>
        </Box>
      </BoxStyle>
    );
};
export default CardImgBox