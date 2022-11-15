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
  const { buyer = '', price = 0, timestamp = 0 } = trans;
  const [didName, setDidName] = React.useState('');
  const timeObj = getTime(timestamp);
  React.useEffect(() => {
    if (buyer) {
      getDidInfoFromAddress(buyer)
        .then((info) => {
          setDidName(info.name);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [buyer]);
  const coinName = coinType.name;

  return (
    <Stack direction="row" spacing={2}>
      <Box sx={{ minWidth: 48, display: 'flex' }}>
        <Jazzicon address={buyer} size={48} sx={{ mr: 0 }} />
      </Box>
      <Box sx={{ minWidth: 0, width: '100%' }}>
        <Typography variant="body2" noWrap>
          {parseFloat((price / 10 ** 18).toFixed(7))} {coinName}
        </Typography>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }}>
          by {didName || reduceHexAddress(buyer)}
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
  const { dataList = [], coinType } = props;
  return (
    <Stack spacing={2}>
      {dataList.map((trans, index) => (
        <Box key={index}>
          <TransItem trans={trans} coinType={coinType} />
          {index < dataList.length - 1 && <Divider sx={{ pb: 2 }} />}
        </Box>
      ))}
    </Stack>
  );
}
