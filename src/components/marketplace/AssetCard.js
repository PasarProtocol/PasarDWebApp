import React from 'react';
import PropTypes from 'prop-types';
import * as math from 'mathjs';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Countdown from 'react-countdown';
import { Box, Link, IconButton, Menu, MenuItem, Typography, Stack, Tooltip } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SyncAltSharpIcon from '@mui/icons-material/SyncAltSharp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import PaperRecord from '../PaperRecord';
import DisclaimerDlg from '../dialog/Disclaimer';
import SellDlg from '../dialog/Sell';
import UpdateDlg from '../dialog/UpdatePrice';
import CancelDlg from '../dialog/CancelSale';
import DeleteDlg from '../dialog/DeleteItem';
import TransferDlg from '../dialog/Transfer';
import NeedBuyDIADlg from '../dialog/NeedBuyDIA';
import AuctionDlg from '../dialog/Auction';
import SettleOrderDlg from '../dialog/SettleOrder';
import CardImgBox from '../CardImgBox';
import useSingin from '../../hooks/useSignin';
import BadgeProfile from './BadgeProfile';
import StyledButton from '../signin-dlg/StyledButton';
import { auctionOrderType } from '../../config';
import { getChainTypeFromId, fetchAPIFrom } from '../../utils/common';

// ----------------------------------------------------------------------
const TimeCountBoxStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 50,
  right: 8,
  zIndex: 2,
  borderRadius: theme.spacing(2),
  padding: '2px 8px',
  backdropFilter: 'blur(6px)',
  background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box, linear-gradient(180deg, #a951f4, #FF5082) border-box`,
  border: '2px solid transparent'
}));

AssetCard.propTypes = {
  chain: PropTypes.string,
  contract: PropTypes.string,
  tokenId: PropTypes.string,
  uniqueKey: PropTypes.string,
  name: PropTypes.string,
  orderId: PropTypes.number,
  orderType: PropTypes.number,
  orderState: PropTypes.number,
  amount: PropTypes.number,
  price: PropTypes.number,
  baseToken: PropTypes.string,
  endTime: PropTypes.number,
  tokenOwner: PropTypes.string,
  royaltyOwner: PropTypes.string,
  royaltyFee: PropTypes.number,
  bids: PropTypes.number,
  lastBid: PropTypes.number,
  lastBidder: PropTypes.string,
  reservePrice: PropTypes.number,
  buyoutPrice: PropTypes.number,
  thumbnail: PropTypes.string,
  type: PropTypes.number,
  coinUSD: PropTypes.any,
  coinType: PropTypes.object,
  isLink: PropTypes.bool,
  isMoreLink: PropTypes.bool,
  isDragging: PropTypes.bool,
  showPrice: PropTypes.bool,
  myaddress: PropTypes.string,
  updateCount: PropTypes.number,
  handleUpdate: PropTypes.func,
  orderChain: PropTypes.string,
  defaultCollectionType: PropTypes.number
};

export default function AssetCard(props) {
  const {
    chain,
    contract,
    tokenId,
    uniqueKey,
    name,
    orderId,
    orderType,
    orderState,
    amount = 1,
    price,
    baseToken,
    endTime,
    tokenOwner,
    royaltyOwner,
    royaltyFee,
    bids,
    lastBid,
    reservePrice,
    buyoutPrice,
    type,
    coinUSD,
    coinType = {},
    isLink,
    isMoreLink,
    isDragging = false,
    showPrice = false,
    myaddress,
    updateCount,
    handleUpdate,
    orderChain,
    defaultCollectionType = 0
  } = props;

  const [collection, setCollection] = React.useState({});
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [disclaimerOpen, setOpenDisclaimer] = React.useState(false);
  const [sellOpen, setOpenSell] = React.useState(false);
  const [auctionOpen, setOpenAuction] = React.useState(false);
  const [updateOpen, setOpenUpdate] = React.useState(false);
  const [cancelOpen, setOpenCancel] = React.useState(false);
  const [deleteOpen, setOpenDelete] = React.useState(false);
  const [transferOpen, setOpenTransfer] = React.useState(false);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [settleOpen, setSettleOrderOpen] = React.useState(false);
  const [auctionEnded, setAuctionEnded] = React.useState(false);
  const [continueAction, setContinueAction] = React.useState('');
  const [state, setState] = React.useState({ isFirstSale: false, isOnSale: orderState === 1 });

  const { diaBalance, setOpenDownloadEssentialDlg, pasarLinkChain } = useSingin();
  const { enqueueSnackbar } = useSnackbar();

  // buynow: 0, onauction: 1, notmet: 2, hasbids: 3, hasended: 4
  let status = -1;
  if (orderType === 1 && orderState === 1) status = 0;
  else if (orderType === 2) {
    if (orderState === 1) {
      if (bids > 0) status = 3;
      else status = 2;
    } else if (orderState === 2) status = 4;
  }
  const isListedOwnedByMe =
    state.isOnSale && myaddress === tokenOwner;
  const isUnlistedOwnedByMe = !state.isOnSale && myaddress === tokenOwner;
  const isListedByOthers = state.isOnSale && myaddress !== royaltyOwner && myaddress !== tokenOwner;
  const isUnlistedByOthers = !state.isOnSale && myaddress !== royaltyOwner && myaddress !== tokenOwner;

  React.useEffect(() => {
    const interval = setInterval(() => checkHasEnded(), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAPIFrom(`api/v1/getCollectionInfo?collection=${contract}&chain=${chain}`);
        const json = await res.json();
        setCollection(json?.data || {});
      } catch (e) {
        console.error(e);
      }
    };
    if (contract && chain) fetchData();
  }, [chain, contract]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAPIFrom('api/v1/checkFirstSale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([uniqueKey])
      });
      const json = await res.json();
      if ((json?.data || []).length)
        setState({ isFirstSale: json.data[0]?.isFirstSale || false, isOnSale: json.data[0]?.isOnSale || false });
    };
    if (uniqueKey) fetchData();
  }, [uniqueKey]);

  React.useEffect(() => {
    if (continueAction && !disclaimerOpen) {
      if (continueAction === 'sell') setOpenSell(true);
      else if (continueAction === 'auction') setOpenAuction(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disclaimerOpen]);

  const handlePutOnAction = (type) => {
    if (localStorage.getItem('pa-yes') === '1') {
      if (type === 'sell') setOpenSell(true);
      else if (type === 'auction') setOpenAuction(true);
      return;
    }
    setOpenDisclaimer(true);
    setContinueAction(type);
  };

  const checkHasEnded = () => {
    const tempEndTime = endTime * 1000;
    if (!tempEndTime) return;
    if (!auctionEnded && tempEndTime <= Date.now()) setAuctionEnded(true);
  };

  const handleSell = () => {
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3') {
      setOpenDownloadEssentialDlg(true);
      return;
    }
    handlePutOnAction('sell');
  };

  const handleClosePopup = (e) => {
    const chainType = getChainTypeFromId(pasarLinkChain);
    const type = e.target.getAttribute('value');
    switch (type) {
      case 'sell':
        if (
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' ||
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'
        ) {
          setOpenDownloadEssentialDlg(true);
          return;
        }
        handlePutOnAction('sell');
        break;
      case 'auction':
        if (
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' ||
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'
        ) {
          setOpenDownloadEssentialDlg(true);
          return;
        }
        handlePutOnAction('auction');
        break;
      case 'update':
        if (
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' ||
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'
        ) {
          setOpenDownloadEssentialDlg(true);
          return;
        }
        if (status === 3 && !auctionEnded) {
          enqueueSnackbar('Already has been bid', { variant: 'warning' });
          return;
        }
        setOpenUpdate(true);
        break;
      case 'cancel':
        if (
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' ||
          sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'
        ) {
          setOpenDownloadEssentialDlg(true);
          return;
        }
        if (status === 3 && !auctionEnded) {
          enqueueSnackbar('Already has been bid', { variant: 'warning' });
          return;
        }
        setOpenCancel(true);
        break;
      case 'claim':
        setSettleOrderOpen(true);
        break;
      case 'delete':
        setOpenDelete(true);
        break;
      case 'transfer':
        if (chainType !== 'ESC' || diaBalance >= 0.01) setOpenTransfer(true);
        else setOpenBuyDIA(true);
        break;
      default:
        break;
    }
    setOpenPopup(null);
  };
  const dlgProps = { name, tokenId, orderId, updateCount, handleUpdate, baseToken, v1State: orderChain === 'v1', is721: collection.is721, chain };

  return (
    <Box>
      <PaperRecord
        sx={{
          mb: '2px',
          position: 'relative',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          transform: 'translateY(0px)',
          '&:hover': {
            boxShadow: '0 4px 8px 0px rgb(0 0 0 / 30%)',
            transform: 'translateY(-4px)',
            '& .card-img:after': {
              transform: 'rotate(25deg)',
              top: '-30%',
              opacity: 0.18
            },
            '& .card-img>.chain-type': isLink
              ? {
                  opacity: 1
                }
              : {}
          }
        }}
      >
        <Stack sx={{ p: 2, pb: 1 }} direction="row">
          <Stack sx={{ flexGrow: 1 }} direction="row" spacing={0.5}>
            <BadgeProfile type={1} collection={collection} defaultCollectionType={defaultCollectionType} />
            {tokenOwner && <BadgeProfile type={2} walletAddress={tokenOwner} />}
            {state.isOnSale && !!reservePrice && <BadgeProfile type={3} isReservedAuction={lastBid >= reservePrice} />}
            {state.isOnSale && !!buyoutPrice && <BadgeProfile type={4} />}
          </Stack>
          <Box>
            {((type === 1 && myaddress === tokenOwner) ||
              (type === 2 && (isListedOwnedByMe || isUnlistedOwnedByMe))) && (
              <IconButton
                color="inherit"
                size="small"
                sx={{ p: 0 }}
                onClick={isLink ? (event) => setOpenPopup(event.currentTarget) : () => {}}
                disabled={
                  !(
                    sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' &&
                    ((type === 1 && myaddress === tokenOwner && (auctionEnded || (!auctionEnded && !lastBid))) ||
                      (type === 2 &&
                        ((isListedOwnedByMe && (auctionEnded || (!auctionEnded && !lastBid))) || isUnlistedOwnedByMe)))
                  )
                }
              >
                <MoreHorizIcon />
              </IconButton>
            )}
            <Menu
              keepMounted
              id="simple-menu"
              anchorEl={isOpenPopup}
              onClose={handleClosePopup}
              open={Boolean(isOpenPopup)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {type === 0 && (
                <div>
                  <MenuItem onClick={handleClosePopup}>
                    <ThumbDownOffAltIcon />
                    &nbsp;Report Creator
                  </MenuItem>
                  <MenuItem onClick={handleClosePopup}>
                    <ThumbDownOffAltIcon />
                    &nbsp;Report Owner
                  </MenuItem>
                  <MenuItem onClick={handleClosePopup}>
                    <ShareOutlinedIcon />
                    &nbsp;Share
                  </MenuItem>
                </div>
              )}
              {type === 1 && myaddress === tokenOwner && sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' && (
                <div>
                  {!auctionEnded ? (
                    <>
                      {!lastBid && (
                        <div>
                          <MenuItem value="update" onClick={handleClosePopup}>
                            <LocalOfferOutlinedIcon />
                            &nbsp;Update Price
                          </MenuItem>
                          <MenuItem value="cancel" onClick={handleClosePopup}>
                            <CancelOutlinedIcon />
                            &nbsp;Cancel Sale
                          </MenuItem>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {!lastBid || lastBid < reservePrice ? (
                        <div>
                          <MenuItem value="cancel" onClick={handleClosePopup}>
                            <CancelOutlinedIcon />
                            &nbsp;Cancel Sale
                          </MenuItem>
                        </div>
                      ) : (
                        <div>
                          <MenuItem value="claim" onClick={handleClosePopup}>
                            <GavelIcon />
                            &nbsp;Claim Item
                          </MenuItem>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              {(type === 2 || type === 3) &&
                sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2' &&
                ((isListedOwnedByMe && (
                  <div>
                    {!auctionEnded ? (
                      <>
                        {!lastBid && (
                          <div>
                            <MenuItem value="update" onClick={handleClosePopup}>
                              <LocalOfferOutlinedIcon />
                              &nbsp;Update Price
                            </MenuItem>
                            <MenuItem value="cancel" onClick={handleClosePopup}>
                              <CancelOutlinedIcon />
                              &nbsp;Cancel Sale
                            </MenuItem>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {!lastBid || lastBid < reservePrice ? (
                          <div>
                            <MenuItem value="cancel" onClick={handleClosePopup}>
                              <CancelOutlinedIcon />
                              &nbsp;Cancel Sale
                            </MenuItem>
                          </div>
                        ) : (
                          <div>
                            <MenuItem value="claim" onClick={handleClosePopup}>
                              <GavelIcon />
                              &nbsp;Claim Item
                            </MenuItem>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )) ||
                  (isUnlistedOwnedByMe && (
                    <div>
                      <MenuItem value="sell" onClick={handleClosePopup}>
                        <StorefrontIcon />
                        &nbsp;Sell
                      </MenuItem>
                      <MenuItem value="auction" onClick={handleClosePopup}>
                        <GavelIcon />
                        &nbsp;Auction
                      </MenuItem>
                      <MenuItem value="transfer" onClick={handleClosePopup}>
                        <SyncAltSharpIcon />
                        &nbsp;Transfer
                      </MenuItem>
                      <MenuItem value="delete" onClick={handleClosePopup}>
                        <DeleteOutlineIcon />
                        &nbsp;Delete
                      </MenuItem>
                    </div>
                  )))}
            </Menu>
          </Box>
        </Stack>
        {orderType === auctionOrderType && !!endTime && (status !== -1 || status !== 4) && (
          <TimeCountBoxStyle>
            {auctionEnded ? (
              <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                Auction has ended
              </Typography>
            ) : (
              <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                <Countdown date={endTime * 1000} />{' '}
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  left
                </Typography>{' '}
                ⏰
              </Typography>
            )}
          </TimeCountBoxStyle>
        )}
        <Box>
          {isLink ? (
            <Link
              component={RouterLink}
              to={
                isMoreLink
                  ? `/collections/detail/${[chain, contract].join('&')}`
                  : `/marketplace/detail/${[chain, contract, tokenId].join('&')}`
              }
              alt=""
              underline="none"
              onClick={(e) => {
                if (isDragging) e.preventDefault();
              }}
            >
              {isMoreLink ? (
                <Box sx={{ position: 'relative', background: '#161c24' }}>
                  <CardImgBox {...props} />
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      width: '100%',
                      top: '50%',
                      color: 'white',
                      position: 'absolute',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    + more
                  </Typography>
                </Box>
              ) : (
                <CardImgBox {...props} />
              )}
            </Link>
          ) : (
            <CardImgBox {...props} />
          )}
        </Box>
        <Box sx={{ p: 2 }}>
          <Stack direction="row">
            <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: { xs: '1rem' } }}>
              {name}
            </Typography>
            {orderType === auctionOrderType && state.isOnSale ? (
              <Tooltip title={lastBid ? 'Top Bid' : 'Starting Price'} arrow enterTouchDelay={0}>
                <Typography
                  variant="subtitle2"
                  sx={{ display: 'inline-table', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em' }}
                  noWrap
                >
                  {lastBid ? lastBid / 1e18 : price} {coinType.name}
                </Typography>
              </Tooltip>
            ) : (
              <Typography
                variant="subtitle2"
                sx={{ display: 'inline-table', alignItems: 'center', fontWeight: 'normal', fontSize: '0.925em' }}
                noWrap
              >
                1/{amount}
              </Typography>
            )}
          </Stack>
          {((type === 0 && state.isOnSale) ||
            (type === 0 && !state.isOnSale && showPrice) ||
            type === 1 ||
            (type === 2 && isListedOwnedByMe) ||
            (type === 2 && isListedByOthers) ||
            (type === 3 && state.isOnSale && !auctionEnded)) && (
            <Stack direction="row">
              <Box
                component="img"
                src={`/static/${coinType.icon}`}
                sx={{
                  width: 20,
                  m: 'auto',
                  display: 'inline',
                  filter: (theme) => (theme.palette.mode === 'dark' && coinType.index === 0 ? 'invert(1)' : 'none')
                }}
              />
              <Typography component="div" sx={{ color: 'origin.main', flexGrow: 1 }} noWrap>
                &nbsp;
                <Typography variant="subtitle1" sx={{ display: 'inline-flex' }}>
                  {price} {coinType.name}
                </Typography>
                &nbsp;
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'inline-flex', alignItems: 'end' }}
                >
                  ≈ USD {math.round(coinUSD * price, 2)}
                </Typography>
              </Typography>
            </Stack>
          )}
          {((type === 0 && !state.isOnSale && !showPrice) || ((type === 2 || type === 3) && isUnlistedByOthers)) && (
            <Typography variant="h6" sx={{ color: 'origin.main', fontSize: { xs: '1rem' } }} align="center">
              Not on Sale
            </Typography>
          )}
          {(type === 2 || type === 3) && isUnlistedOwnedByMe && (
            <StyledButton variant="contained" size="small" fullWidth sx={{ mt: 1, mb: 0.5 }} onClick={handleSell}>
              Sell
            </StyledButton>
          )}
          {type === 3 && state.isOnSale && auctionEnded && (
            <StyledButton
              variant="contained"
              size="small"
              fullWidth
              sx={{ mt: 1, mb: 0.5 }}
              onClick={() => setSettleOrderOpen(true)}
            >
              Claim Item
            </StyledButton>
          )}
        </Box>
      </PaperRecord>
      <DisclaimerDlg isOpen={disclaimerOpen} setOpen={setOpenDisclaimer} />
      <SellDlg
        isOpen={sellOpen}
        setOpen={setOpenSell}
        {...dlgProps}
        isMinter={royaltyOwner === myaddress}
        royalties={royaltyFee}
      />
      <UpdateDlg
        isOpen={updateOpen}
        setOpen={setOpenUpdate}
        {...dlgProps}
        state={state}
        royalties={royaltyFee}
        orderType={orderType}
      />
      <CancelDlg isOpen={cancelOpen} setOpen={setOpenCancel} {...dlgProps} />
      <DeleteDlg isOpen={deleteOpen} setOpen={setOpenDelete} {...dlgProps} />
      <TransferDlg isOpen={transferOpen} setOpen={setOpenTransfer} {...dlgProps} />
      <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance} />
      <AuctionDlg isOpen={auctionOpen} setOpen={setOpenAuction} {...dlgProps} />
      <SettleOrderDlg
        isOpen={settleOpen}
        setOpen={setSettleOrderOpen}
        info={{ ...props }}
        address={myaddress}
        {...{ updateCount, handleUpdate }}
      />
    </Box>
  );
}
