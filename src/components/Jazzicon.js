import { useEffect, useRef } from "react";
import { styled } from '@mui/material/styles';
import { generateJazzicon } from '../utils/common';

const StyledIdenticon = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'inline-flex',
  borderRadius: '50%',
  backgroundColor: 'black',
  marginRight: 8
}));

export default function Identicon(props) {
  const ref = useRef()
  const {address, sx} = props
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(generateJazzicon(address));
    }
  }, [address]);

  return <StyledIdenticon sx={sx} ref={ref} />;
}