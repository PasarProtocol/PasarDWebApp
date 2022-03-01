import { Box } from '@mui/material';

const CardImgBox = (props) => {
    const { src } = props;
    const imageStyle = {
      // borderRadius: 1,
      // boxShadow: (theme)=>theme.customShadows.z16,
      display: 'inline-flex',
      maxHeight: '100%',
    }
    return (
      <Box sx={{
          position: 'relative',
          paddingBottom: '100%',
          height: 0,
          boxShadow: '#d4d6d8 0px 1px 4px 0px inset, rgb(255 255 255 / 50%) 0px -1px 4px 0px inset',
          background: (theme)=>theme.palette.grey[200]
        }}>
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
        }}>
          <Box draggable = {false} component="img" src={src} sx={imageStyle} onError={(e) => e.target.src = '/static/broken-image.svg'}/>
        </Box>
      </Box>
    );
};
export default CardImgBox