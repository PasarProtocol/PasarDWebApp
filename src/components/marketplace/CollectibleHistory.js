import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import palette from '../../theme/palette'

// material
import LoadingScreen from '../LoadingScreen';
import { MethodList, reduceHexAddress, getDidInfoFromAddress } from '../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired
};
function TransItem(props) {
  const { trans, creator, isLast } = props
  const [didName, setDidName] = React.useState('');
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: palette.light.grey['300'], pb: 2};
  let methodItem = MethodList.find((item)=>item.method===trans.event)
  if(!methodItem)
      methodItem = {color: 'grey', icon: 'tag', detail: []}
  const subject = trans[methodItem.verb.subject]
  
  React.useEffect(() => {
    if(subject) {
      if(subject === creator.address)
        setDidName(creator.name)
      else
        getDidInfoFromAddress(subject)
          .then((info) => {
            setDidName(info.name)
          })
          .catch((e) => {
          })
    }
  }, [subject]);

  return (
      <Stack direction="row" spacing={2} sx={sx}>
          <Link to={`/explorer/transaction/${trans.tHash}`} component={RouterLink} underline="none" sx={{borderRadius: 1}} >
            <Box
                component="img"
                alt=""
                src={`/static/${methodItem.icon}.svg`}
                sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer', background: methodItem.color, p: 2 }}
            />
          </Link>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" color='text.secondary' noWrap>
                {methodItem.verb.description}
                {methodItem.verb.withPrice?` ${parseFloat((trans.price/10**18).toFixed(7))} ELA`:''}
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
                <Link to={`/explorer/transaction/detail/${subject}`} component={RouterLink}>
                  {methodItem.verb.description==='Transferred'?'to':'by'} {didName || reduceHexAddress(subject)}
                </Link>
              </Typography>
          </Box>
          <Box>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                  {formatDistance(trans.timestamp*1000, new Date(), { addSuffix: true }).replace("about","").trim()}
              </Typography>
          </Box>
      </Stack>
  );
}
export default function CollectibleHistory(props) {
  return (
    <Stack spacing={2}>
      {props.isLoading && <LoadingScreen />}
      {props.dataList.map((trans, index) => (
          <TransItem 
            key={index}
            trans={trans}
            creator={props.creator}
            isLast={index===props.dataList.length-1}
          />
      ))}
    </Stack>
  );
}