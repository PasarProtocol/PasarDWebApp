import React from 'react'
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography, Divider } from '@mui/material';
import palette from '../../theme/palette'

// material
import LoadingScreen from '../LoadingScreen';
import Jazzicon from '../Jazzicon';
import { reduceHexAddress, getTime, getDidInfoFromAddress } from '../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired
};
function TransItem({ trans }) {
  const [didName, setDidName] = React.useState('');
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
      <Stack direction="row" spacing={2}>
          <Box sx={{minWidth: 48, display: 'flex'}}>
            <Jazzicon
              address={trans.buyerAddr}
              size={48}
            />
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" noWrap>
                {parseFloat((trans.price/10**18).toFixed(7))} ELA
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
                  by {didName || reduceHexAddress(trans.buyerAddr)}
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right">
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
        <Box key={index}>
          <TransItem 
            trans={trans}
          />
          {
            index<props.dataList.length-1&&
            <Divider sx={{pb: 2}}/>
          }
        </Box>
      ))}
    </Stack>
  );
}