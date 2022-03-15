import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const BoxStyle = styled(Box)(({ theme }) => ({
    position: 'relative',
    paddingBottom: '100%',
    height: 0,
    boxShadow: `${theme.palette.mode==='dark'?'#141618':'#d4d6d8'} 0px 1px 4px 0px inset, rgb(${theme.palette.mode==='dark'?'0 0 0':'255 255 255'} / 50%) 0px -1px 4px 0px inset`,
    background: (theme)=>theme.palette.grey[200],
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
    const { src } = props;
    const imageStyle = {
      // borderRadius: 1,
      // boxShadow: (theme)=>theme.customShadows.z16,
      display: 'inline-flex',
      maxHeight: '100%',
    }
    return (
      <BoxStyle className='card-img'>
        <Box className='img-box'>
          <Box draggable = {false} component="img" src={src} sx={imageStyle} onError={(e) => e.target.src = '/static/broken-image.svg'}/>
        </Box>
      </BoxStyle>
    );
};
export default CardImgBox