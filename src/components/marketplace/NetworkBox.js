import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Stack, Box } from '@mui/material';
import { chainTypes } from '../../utils/common';

const NetworkBox = (props) => {
  const { current } = props;
  const [chainIndex, setChainIndex] = React.useState(0);
  React.useEffect(() => {
    if (current === 'ESC' || current === 'ETH') setChainIndex(current === 'ESC' ? 0 : 1);
  }, [current]);

  return (
    <Paper
      align="center"
      sx={{
        display: 'inline-block',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'action.disabledBackground',
        boxShadow: (theme) => theme.customShadows.z1,
        borderRadius: 2,
        p: '10px 16px'
      }}
    >
      <Stack direction="row" alignItems="center">
        <Box
          sx={{
            backgroundColor: current ? chainTypes[chainIndex].color : 'text.disabled',
            borderRadius: '50%',
            p: '6px',
            mr: 1,
            width: 30,
            height: 30,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box draggable={false} component="img" src={`/static/${chainTypes[chainIndex].icon}`} sx={{}} />
        </Box>
        <Typography variant="subtitle1" color={current ? 'text.primary' : 'text.secondary'}>
          {chainTypes[chainIndex].name}
        </Typography>
      </Stack>
    </Paper>
  );
};
export default NetworkBox;

NetworkBox.propTypes = {
  current: PropTypes.string
};
