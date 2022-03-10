import React from 'react'
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography, IconButton } from '@mui/material';
import palette from '../../theme/palette'

// material
import LoadingScreen from '../LoadingScreen';
import Jazzicon from '../Jazzicon';
import { reduceHexAddress, getTime, getDidInfoFromAddress } from '../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired
};
function TransItem({ trans, isLast }) {
  const [didName, setDidName] = React.useState('');
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: palette.light.grey['300'], pb: 2};
  const timeObj = getTime(trans.timestamp)
  React.useEffect(() => {
    if(trans.buyerAddr) {
        getDidInfoFromAddress(trans.buyerAddr)
          .then((info) => {
            setDidName(info.name)
          })
          .catch((e) => {
          })
    }
  }, [trans]);

  return (
      <Stack direction="row" spacing={2} sx={sx}>
          <Jazzicon
            address={trans.buyerAddr}
            size={48}
          />
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" noWrap>
                {parseFloat((trans.price/10**18).toFixed(7))} ELA
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
                  by {didName || reduceHexAddress(trans.buyerAddr)}
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  {timeObj.date} {timeObj.time}
              </Typography>
          </Box>
      </Stack>
  );
}
export default function BitList(props) {
  return (
    <Stack spacing={2}>
      {/* {props.isLoading && <LoadingScreen />} */}
      {props.dataList.map((trans, index) => (
          <TransItem 
            key={index}
            trans={trans}
            isLast={index===props.dataList.length-1}
          />
      ))}
    </Stack>
  );
}