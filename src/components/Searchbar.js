import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams, useLocation, NavLink as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { styled, alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Input,
  Slide,
  InputAdornment,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper
} from '@mui/material';

import { customShadows } from '../theme/shadows';
import Jazzicon from './Jazzicon';
import { getIpfsUrl, reduceHexAddress, fetchAPIFrom, getImageFromIPFSUrl } from '../utils/common';
// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'light' ? customShadows.dark.z8 : customShadows.light.z8,
  borderRadius: '0 0 16px 16px'
}));

const SearchBox = styled('div')({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  alignItems: 'center'
});

const SearchbarStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.9)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const ListItemTextStyle = styled(ListItemText)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

const defaultPlaceHolder = 'Search name, description, address and token ID';
// ----------------------------------------------------------------------
export default function Searchbar({ placeholder }) {
  const [isOpen, setOpen] = useState(false);
  const [needClose, setShowClose] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isOutOfSearchField, setLeaveSearchField] = useState(true);
  const [instanceSearchResult, setInstanceSearchResult] = useState(null);
  const [instanceCollectionAvatar, setInstanceCollectionAvatar] = useState({});
  const [isLoadingInstanceSearch, setLoadingInstanceSearch] = useState(false);
  const [linkToState, setLinkToState] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [controller, setAbortController] = useState(new AbortController());
  const params = useParams(); // params.key
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ref = useRef();

  if (placeholder === defaultPlaceHolder && !pathname.startsWith('/explorer'))
    placeholder = 'Search items, creators and token ID';

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
    setShowClose(false);
    setSearchStr('');
  };

  const handleChange = (e) => {
    if (e.which === 13) {
      changeAction(e.target.value);
    }
  };

  const changeAction = (value) => {
    if (pathname.startsWith('/explorer')) navigate(`/explorer/search/${value}`);
    else navigate(`/marketplace/search/${value}`);
  };

  const clearSearch = () => {
    if (ref.current) {
      ref.current.value = '';
      ref.current.focus();
      setShowClose(false);
      setSearchStr('');
    }
  };
  React.useEffect(() => {
    setShowAutocomplete(false);
  }, [linkToState]);

  React.useEffect(() => {
    setInstanceCollectionAvatar({});
    if (!instanceSearchResult) return;
    instanceSearchResult.collections.forEach((item, _i) => {
      const metaUri = getIpfsUrl(item.uri);
      if (metaUri) {
        fetch(metaUri)
          .then((response) => response.json())
          .then((res) => {
            setInstanceCollectionAvatar((prevState) => {
              const tempState = { ...prevState };
              tempState[_i] = getIpfsUrl(res.data.avatar);
              return tempState;
            });
          })
          .catch(console.log);
      }
    });
  }, [instanceSearchResult]);

  const determineClose = async (e) => {
    if (e.target.value.length) {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      setLoadingInstanceSearch(true);
      try {
        const res = await fetchAPIFrom(`api/v2/sticker/quickSearch?keyword=${e.target.value}`, { signal });
        const json = await res.json();
        const rlt = { ...json.data };
        rlt.items = rlt.items.map((item) => {
          const avatar = getImageFromIPFSUrl(item?.data?.thumbnail || item?.image);
          const objItem = { ...item, avatar };
          return objItem;
        });
        setInstanceSearchResult(rlt);
      } catch (e) {
        console.error(e);
      }
      setLoadingInstanceSearch(false);
      setShowAutocomplete(true);
    } else {
      setInstanceSearchResult(null);
    }
    setSearchStr(e.target.value);
    setShowClose(e.target.value.length > 0);
  };

  const handleBlurAction = () => {
    if (isOutOfSearchField) setShowAutocomplete(false);
    else ref.current.focus();
  };

  const handleLinkClick = () => {
    setLinkToState(!linkToState);
  };
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <IconButton onClick={handleOpen}>
            <Icon icon={searchFill} width={20} height={20} />
          </IconButton>
        )}

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchBox>
            <SearchbarStyle
              onBlur={handleBlurAction}
              onMouseDown={() => setShowAutocomplete(true)}
              onMouseEnter={() => setLeaveSearchField(false)}
              onMouseLeave={() => setLeaveSearchField(true)}
              onKeyPress={handleChange}
              onChange={determineClose}
            >
              <Input
                inputRef={ref}
                autoFocus
                fullWidth
                disableUnderline
                placeholder={placeholder}
                defaultValue={params.key}
                startAdornment={
                  <InputAdornment position="start">
                    <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
                endAdornment={
                  <>
                    {isLoadingInstanceSearch && (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress size={25} />
                      </Box>
                    )}
                    {needClose && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={clearSearch}>
                          <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled' }} />
                        </IconButton>
                      </InputAdornment>
                    )}
                  </>
                }
                sx={{ mr: 1 }}
              />
              {/* <Button variant="contained" onClick={handleClose}> Search </Button> */}
            </SearchbarStyle>
            {searchStr.length > 0 &&
              showAutocomplete &&
              !isLoadingInstanceSearch &&
              instanceSearchResult &&
              (instanceSearchResult.collections.length > 0 ||
                instanceSearchResult.items.length > 0 ||
                instanceSearchResult.accounts.length > 0) && (
                <Box
                  onMouseDown={() => {
                    if (isOutOfSearchField) setShowAutocomplete(false);
                  }}
                  sx={{
                    width: '100%',
                    overflow: 'auto',
                    inset: `${APPBAR_MOBILE}px 0px 0px`,
                    position: 'fixed',
                    zIndex: -1
                  }}
                >
                  <ListWrapperStyle
                    onBlur={handleBlurAction}
                    onMouseDown={() => setShowAutocomplete(true)}
                    onMouseEnter={() => setLeaveSearchField(false)}
                    onMouseLeave={() => setLeaveSearchField(true)}
                  >
                    <List component="nav" aria-labelledby="nested-list-subheader">
                      {instanceSearchResult.collections.length > 0 && (
                        <>
                          <ListItem>
                            <ListItemText primary="Collections" sx={{ color: 'text.secondary' }} />
                          </ListItem>
                          <Divider />
                          {instanceSearchResult.collections.map((item, _i) => {
                            const { chain, token } = item;

                            return (
                              <ListItemButton
                                key={_i}
                                component={RouterLink}
                                to={`/collections/detail/${[chain, token].join('&')}`}
                                onClick={handleLinkClick}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    alt="Collection"
                                    src={instanceCollectionAvatar[_i]}
                                    sx={{ width: 30, height: 30 }}
                                  />
                                </ListItemAvatar>
                                <ListItemTextStyle
                                  primary={item.name}
                                  secondary={`by ${reduceHexAddress(item.owner)}`}
                                  primaryTypographyProps={{
                                    style: {
                                      display: 'inline'
                                    }
                                  }}
                                />
                              </ListItemButton>
                            );
                          })}
                        </>
                      )}
                      {instanceSearchResult.items.length > 0 && (
                        <>
                          <ListItem>
                            <ListItemText primary="Items" sx={{ color: 'text.secondary' }} />
                          </ListItem>
                          <Divider />
                          {instanceSearchResult.items.map((item, _i) => (
                            <ListItemButton
                              key={_i}
                              component={RouterLink}
                              to={`/marketplace/detail/${[item.chain, item.contract, item.tokenId].join('&')}`}
                              // state={{tokenId: item.tokenId, baseToken: item.baseToken}}
                              onClick={handleLinkClick}
                            >
                              <ListItemAvatar>
                                <Avatar alt="NFT" src={item.avatar} sx={{ width: 30, height: 30 }} />
                              </ListItemAvatar>
                              <ListItemTextStyle
                                primary={item.name}
                                secondary={item.status}
                                primaryTypographyProps={{
                                  style: {
                                    display: 'inline'
                                  }
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </>
                      )}
                      {instanceSearchResult.accounts.length > 0 && (
                        <>
                          <ListItem>
                            <ListItemText primary="Accounts" sx={{ color: 'text.secondary' }} />
                          </ListItem>
                          <Divider />
                          {instanceSearchResult.accounts.map((item, _i) => (
                            <ListItemButton
                              key={_i}
                              component={RouterLink}
                              to={`/profile/others/${item.address}`}
                              onClick={handleLinkClick}
                            >
                              <ListItemAvatar>
                                <Jazzicon address={item.address} size={30} sx={{ mr: 0 }} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={reduceHexAddress(item.address)}
                                primaryTypographyProps={{
                                  style: {
                                    display: 'inline'
                                  }
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </>
                      )}
                    </List>
                  </ListWrapperStyle>
                </Box>
              )}
          </SearchBox>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}

Searchbar.propTypes = {
  placeholder: PropTypes.string
};
Searchbar.defaultProps = {
  placeholder: defaultPlaceHolder
};
