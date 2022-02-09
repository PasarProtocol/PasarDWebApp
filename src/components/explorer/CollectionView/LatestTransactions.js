import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Icon } from '@iconify/react';
import { Box, Stack, Link, Typography, IconButton } from '@mui/material';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import palette from '../../../theme/palette'

// material
import CollectionView from './Template'
import LoadingScreen from '../../LoadingScreen';
import MethodLabel from '../../MethodLabel';
import { MethodList, reduceHexAddress } from '../../../utils/common';
// ----------------------------------------------------------------------
TransItem.propTypes = {
  trans: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired
};
function TransItem({ trans, isLast }) {
  const sx = isLast?{}:{borderBottom: '1px solid', borderColor: palette.light.grey['300'], pb: 2};
  let methodItem = MethodList.find((item)=>item.method===trans.event)
    if(!methodItem)
        methodItem = {color: 'grey', icon: 'tag', detail: []}
  return (
      <Stack direction="row" spacing={2} sx={sx}>
          <Link href={`/explorer/transaction/${trans.tHash}`} underline="none" sx={{borderRadius: 1}} >
            <Box
                component="img"
                alt=""
                src={`/static/${methodItem.icon}.svg`}
                sx={{ width: 48, height: 48, borderRadius: 1, cursor: 'pointer', background: methodItem.color, p: 2 }}
            />
          </Link>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" color='text.secondary' noWrap>
                <Link href={`https://esc.elastos.io/tx/${trans.tHash}`} target="_blank">
                  Tx Hash : {reduceHexAddress(trans.tHash)}
                  <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                      <Icon icon={externalLinkFill} width="17px"/>
                  </IconButton>
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} noWrap>
                  Tx Fee : {trans.gasFee?trans.gasFee:0} ELA
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
export default function LatestTransactions(props) {
  return (
    <CollectionView title={props.title} to="transaction">
      {props.isLoading && <LoadingScreen />}
      {props.dataList.map((trans, index) => (
          <TransItem 
            key={index}
            trans={trans}
            isLast={index===props.dataList.length-1}
          />
      ))}
    </CollectionView>
  );
}