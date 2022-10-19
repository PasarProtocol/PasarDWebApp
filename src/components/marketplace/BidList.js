import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Divider } from '@mui/material';
import Jazzicon from '../Jazzicon';
import { reduceHexAddress, getTime, getDidInfoFromAddress } from '../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  coinType: PropTypes.any
};
function TransItem({ trans, coinType }) {
  const [didName, setDidName] = React.useState('');
  const timeObj = getTime(trans.timestamp);
  React.useEffect(() => {
    if (trans.buyerAddr) {
      getDidInfoFromAddress(trans.buyerAddr)
        .then((info) => {
          setDidName(info.name);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [trans]);
  const coinName = coinType.name;

  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ minWidth: 48, display: 'flex' }}>
        <Jazzicon address={trans.buyerAddr} size={48} sx={{ mr: 0 }} />
      </Box>
      <Box sx={{ minWidth: 0, width: '100%' }}>
        <Typography variant="body2" noWrap>
          {parseFloat((trans.price / 10 ** 18).toFixed(7))} {coinName}
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }}>
          by {didName || reduceHexAddress(trans.buyerAddr)}
        </Typography>
      </Box>
      <Box sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right">
          {timeObj.date} <wbr />
          {timeObj.time}
        </Typography>
      </Box>
    </Stack>
  );
}

BitList.propTypes = {
  dataList: PropTypes.any,
  coinType: PropTypes.any
};

export default function BitList(props) {
  return (
    <Stack spacing={2}>
      {props.dataList.map((trans, index) => (
        <Box key={index}>
          <TransItem trans={trans} coinType={props.coinType} />
          {index < props.dataList.length - 1 && <Divider sx={{ pb: 2 }} />}
        </Box>
      ))}
    </Stack>
  );
}
