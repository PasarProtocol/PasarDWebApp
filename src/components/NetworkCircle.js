import React from 'react';
import { Paper, Tooltip, Box } from '@mui/material';
import { chainTypes, getChainTypeFromId } from '../utils/common';
import { useUserContext } from '../contexts/UserContext';

const NetworkCircle = () => {
  const [chainType, setChainType] = React.useState('ESC');
  const [chainIndex, setChainIndex] = React.useState(0);
  const { wallet } = useUserContext();

  React.useEffect(() => {
    if (!wallet?.chainId) return;
    const currentChain = getChainTypeFromId(wallet?.chainId);
    setChainType(currentChain);
    if (currentChain) setChainIndex(chainTypes.findIndex((item) => item.symbol === currentChain));
  }, [wallet?.chainId]);

  let networkName = 'Unsupported network';
  if (chainType) {
    const chainItem = chainTypes.find((item) => item.symbol === chainType);
    if (chainItem) networkName = chainItem.name;
  }

  const iconFilter = (theme) => {
    if (!chainType) return 'invert(0.5)';
    return theme.palette.mode === 'dark' ? 'unset' : 'invert(0.9)';
  };
  return (
    <Tooltip title={`Current Network: ${networkName}`} arrow disableInteractive enterTouchDelay={0}>
      <Paper
        align="center"
        sx={{
          minWidth: 40,
          width: 40,
          height: 40,
          p: 1,
          ml: 1,
          borderWidth: 0,
          borderStyle: 'solid',
          borderColor: 'action.disabledBackground',
          borderRadius: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'transparent'
        }}
      >
        <Box
          draggable={false}
          component="img"
          src={`/static/${chainTypes[chainIndex].icon}`}
          sx={{ filter: iconFilter }}
        />
      </Paper>
    </Tooltip>
  );
};
export default NetworkCircle;
