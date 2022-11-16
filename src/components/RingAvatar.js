import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Jazzicon from './Jazzicon';

RingAvatar.propTypes = {
  size: PropTypes.number,
  outersx: PropTypes.any,
  isImage: PropTypes.bool,
  avatar: PropTypes.string,
  address: PropTypes.string
};

export default function RingAvatar(props) {
  const { size, outersx, isImage = false } = props;
  let { avatar = '' } = props;
  if (!avatar) avatar = '/static/broken-image.svg';

  return (
    <Box
      sx={{
        borderRadius: '50%',
        width: size + 18,
        height: size + 18,
        borderColor: (theme) => theme.palette.origin.main,
        backgroundColor: (theme) => theme.palette.background.paper,
        p: '5px',
        background: (theme) =>
          `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box`,
        border: '4px solid transparent',
        ...outersx
      }}
    >
      {isImage ? (
        <Box
          draggable={false}
          component="img"
          src={avatar}
          sx={{ width: size, height: size, borderRadius: '100%' }}
          onError={(e) => {
            e.target.src = '/static/circle-loading.svg';
          }}
        />
      ) : (
        <Jazzicon {...props} />
      )}
    </Box>
  );
}
