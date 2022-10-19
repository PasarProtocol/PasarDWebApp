import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { generateJazzicon } from '../utils/common';

const StyledIdenticon = styled('div')(({ size }) => ({
  width: size,
  height: size,
  display: 'inline-flex',
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: 'black',
  marginRight: 8
}));

Identicon.propTypes = {
  address: PropTypes.string,
  sx: PropTypes.any,
  size: PropTypes.number
};

export default function Identicon(props) {
  const ref = useRef();
  const { address, sx, size = 40 } = props;
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(generateJazzicon(address, size));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return <StyledIdenticon sx={sx} ref={ref} size={size} />;
}
