import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Box, Link, Typography, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';
import MethodLabel from '../../MethodLabel';
import {
  reduceHexAddress,
  MethodList,
  getExplorerSrvByNetwork,
  getDateDistance,
  getChainIndexFromChain,
  getImageFromIPFSUrl
} from '../../../utils/common';

const RootStyle = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(2)
}));

const TypographyStyle = styled(Typography)(({ theme, alignsm }) => ({
  [theme.breakpoints.down('sm')]: {
    textAlign: alignsm
  }
}));

TransactionListItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default function TransactionListItem({ item }) {
  const { eventTypeName, transactionHash, timestamp, token } = item;
  const contract = item?.token?.contract || item?.contract;
  const chain = item?.token?.chain || item?.chain;
  const tokenId = item?.token?.tokenId || item?.tokenId;
  const chainIndex = getChainIndexFromChain(chain);
  const explorerSrvUrl = getExplorerSrvByNetwork(chainIndex);
  const methodItem = MethodList.find((el) => el.method === eventTypeName);
  const itemName = token?.name || '';
  const imgSrc = getImageFromIPFSUrl(token?.data?.thumbnail || token?.image);

  return (
    <RootStyle>
      {item.event === 'SetApprovalForAll' ? (
        <Box
          component="img"
          alt=""
          src={`/static/${methodItem.icon}.svg`}
          sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, background: methodItem.color, p: 2 }}
        />
      ) : (
        <Link
          to={`/explorer/collectible/detail/${[chain, contract, tokenId].join('&')}`}
          component={RouterLink}
          sx={{ borderRadius: 1 }}
        >
          <Box
            draggable={false}
            component="img"
            alt={itemName}
            src={imgSrc}
            sx={{ width: 48, height: 48, borderRadius: 1, mr: 2 }}
          />
        </Link>
      )}
      <Grid container spacing={2}>
        <Grid item xs={5} sm={3}>
          <Typography color="inherit" variant="subtitle2" noWrap>
            Name
          </Typography>
          <Link
            to={`/explorer/collectible/detail/${[chain, contract, tokenId].join('&')}`}
            component={RouterLink}
            color="text.secondary"
          >
            <Typography variant="body2">{itemName}</Typography>
          </Link>
        </Grid>
        <Grid item xs={7} sm={3}>
          <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
            Method
          </TypographyStyle>
          <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
            <MethodLabel methodName={eventTypeName} />
          </TypographyStyle>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="left">
            Tx Hash
          </TypographyStyle>
          <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="left">
            <Link href={`${explorerSrvUrl}/tx/${transactionHash}`} color="text.secondary" target="_blank">
              {reduceHexAddress(transactionHash)}
              <IconButton type="button" sx={{ p: '5px' }} aria-label="link">
                <Icon icon={externalLinkFill} width="17px" />
              </IconButton>
            </Link>
          </TypographyStyle>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TypographyStyle color="inherit" variant="subtitle2" noWrap align="center" alignsm="right">
            Date
          </TypographyStyle>
          <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} noWrap align="center" alignsm="right">
            {getDateDistance(timestamp)}
          </TypographyStyle>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
