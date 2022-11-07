import PropTypes from 'prop-types';
import { Box } from '@mui/material';

VolumeIcon.propTypes = {
  chainIndex: PropTypes.number
};

export default function VolumeIcon(props) {
  const { chainIndex } = props;
  const volumeIconTypes = [
    { icon: 'elastos.svg', style: { filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none') } },
    {
      icon: 'ethereum.svg',
      style: { filter: (theme) => (theme.palette.mode === 'light' ? 'invert(0.8)' : 'invert(0.2)'), width: 16 }
    },
    { icon: 'erc20/FSN.svg', style: { width: 16 } }
  ];
  let volumeIcon = null;
  if (chainIndex > 0) volumeIcon = volumeIconTypes[chainIndex - 1];
  else if (chainIndex === undefined) volumeIcon = null;
  else [volumeIcon] = volumeIconTypes;

  return volumeIcon ? (
    <Box
      component="img"
      src={`/static/${volumeIcon.icon}`}
      sx={{ width: 18, display: 'inline', verticalAlign: 'middle', ...volumeIcon.style }}
    />
  ) : null;
}
