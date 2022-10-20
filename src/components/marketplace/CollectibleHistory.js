import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Link, Typography, Divider } from '@mui/material';
import LoadingScreen from '../LoadingScreen';
import {
  MethodList,
  reduceHexAddress,
  getDidInfoFromAddress,
  getCoinTypeFromToken,
  getDateDistance
} from '../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  creator: PropTypes.object
};
function TransItem(props) {
  const { trans, creator } = props;
  const [didName, setDidName] = React.useState('');
  let methodItem = MethodList.find((item) => item.method === trans.event);
  if (!methodItem) methodItem = { color: 'grey', icon: 'tag', detail: [] };
  const subject = trans[methodItem.verb.subject];
  const coinType = getCoinTypeFromToken(trans);
  const coinName = coinType.name;

  React.useEffect(() => {
    if (subject) {
      if (subject === creator.address) setDidName(creator.name);
      else
        getDidInfoFromAddress(subject)
          .then((info) => {
            setDidName(info.name);
          })
          .catch((e) => {
            console.error(e);
          });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  return (
    <Stack direction="row" spacing={2}>
      <Link
        to={`/explorer/transaction/${trans.tHash}`}
        component={RouterLink}
        underline="none"
        sx={{ borderRadius: 1 }}
      >
        <Box
          component="img"
          alt=""
          src={`/static/${methodItem.icon}.svg`}
          sx={{
            minWidth: 48,
            width: 48,
            height: 48,
            borderRadius: 1,
            cursor: 'pointer',
            background: methodItem.color,
            p: 2
          }}
        />
      </Link>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="body2" noWrap>
          {methodItem.verb.description}
          {methodItem.verb.withPrice ? ` ${parseFloat((trans.price / 10 ** 18).toFixed(7))} ${coinName}` : ''}
        </Typography>
        <Link to={`/explorer/transaction/detail/${subject}`} component={RouterLink}>
          <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
            {methodItem.verb.description === 'Transferred' ? 'to' : 'by'} {didName || reduceHexAddress(subject)}
          </Typography>
        </Link>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
          {getDateDistance(trans.timestamp)}
        </Typography>
      </Box>
    </Stack>
  );
}

CollectibleHistory.propTypes = {
  dataList: PropTypes.any,
  isLoading: PropTypes.bool,
  creator: PropTypes.object
};

export default function CollectibleHistory(props) {
  const historyData = props.dataList;
  historyData.forEach((trans, _i) => {
    if (trans.event === 'OrderBid' && _i < historyData.length - 1 && historyData[_i + 1].event === 'BuyOrder') {
      historyData[_i] = historyData[_i + 1];
      historyData[_i + 1] = trans;
    }
  });
  return (
    <Stack spacing={2}>
      {props.isLoading && <LoadingScreen />}
      {historyData.map((trans, index) => (
        <Box key={index}>
          <TransItem trans={trans} creator={props.creator} />
          {index < props.dataList.length - 1 && <Divider sx={{ pb: 2 }} />}
        </Box>
      ))}
    </Stack>
  );
}
