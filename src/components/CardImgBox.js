import { Box } from '@mui/material';

const CardImgBox = (props) => {
    const { src } = props;
    const imageStyle = {
      borderRadius: 1,
      boxShadow: (theme)=>theme.customShadows.z16,
      position: 'relative',
      alignItems: 'center',
      height: 'auto',
      maxHeight: '100%',
      maxWidth: '100%'
    }
    return (
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          aspectRatio: '1 / 1',
          width: '100%',
        }}>
        <Box sx={{mt: .5, alignItems: 'center', display: 'flex'}}>
          <Box draggable = {false} component="img" src={src} sx={imageStyle} onError={(e) => e.target.src = '/static/broken-image.svg'}/>
        </Box>
      </Box>
    );
};
export default CardImgBox