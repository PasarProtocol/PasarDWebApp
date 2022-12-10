import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation, NavLink as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  alpha,
  OutlinedInput,
  InputAdornment,
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
import { customShadows } from '../../theme/shadows';
import Jazzicon from '../Jazzicon';
import { getIpfsUrl, reduceHexAddress, fetchAPIFrom, getImageFromIPFSUrl } from '../../utils/common';

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'light' ? customShadows.dark.z8 : customShadows.light.z8
}));

const SearchStyle = styled(OutlinedInput)(({ theme, sx, needbgcolor }) => {
  const bgColor = needbgcolor ? { backgroundColor: theme.palette.background.default } : {};
  return {
    ...bgColor,
    [theme.breakpoints.up('md')]: {
      width: sx.width
    },
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    borderRadius: theme.shape.borderRadiusMd,
    transition: theme.transitions.create(['box-shadow', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.common.white, 0.04),
      ...bgColor,
      boxShadow:
        theme.palette.mode === 'dark' ? 'rgb(62 76 92) 0px 3px 6px 0px' : 'rgb(190 190 190 / 50%) 0px 4px 8px 0px'
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#818e9c !important' : '#e0e0e0 !important',
      borderWidth: `2px !important`
    },
    '&.MuiOutlinedInput-root:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#818e9c !important' : '#e0e0e0 !important',
      borderWidth: `2px !important`
    },
    '& fieldset': {
      borderWidth: `1px !important`
    },
    input: {
      padding: 8,
      paddingLeft: 3
    }
  };
});

const ListItemTextStyle = styled(ListItemText)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

const defaultPlaceHolder = 'Search name, description, address and token ID';
// ----------------------------------------------------------------------
export default function SearchBox(props) {
  const { sx, onChange, needbgcolor = false, needAutocomplete = false, getSearchKeyFromURL = true } = props;
  const { placeholder } = props;
  const params = useParams(); // params.key
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [needClose, setShowClose] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isOutOfSearchField, setLeaveSearchField] = useState(false);
  const [controller, setAbortController] = useState(new AbortController());
  const [instanceSearchResult, setInstanceSearchResult] = useState(null);
  const [instanceCollectionAvatar, setInstanceCollectionAvatar] = useState({});
  const [isLoadingInstanceSearch, setLoadingInstanceSearch] = useState(false);
  const [linkToState, setLinkToState] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const ref = useRef();

  const handleChange = (e) => {
    if (e.which === 13) {
      // press enter
      changeAction(e.target.value);
    }
  };
  const clearSearch = () => {
    if (ref.current) {
      ref.current.value = '';
      ref.current.focus();
      setShowClose(false);
      setSearchStr('');
    }
  };
  const changeAction = (value) => {
    if (onChange) onChange(value);
    else if (pathname.startsWith('/explorer')) navigate(`/explorer/search/${value}`);
    else navigate(`/marketplace/search/${value}`);
  };

  React.useEffect(() => {
    if (!params.key) ref.current.value = '';
  }, [params.key]);

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
        const res = await fetchAPIFrom(`api/v1/quickSearch?keyword=${e.target.value}`, { signal });
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
    setLeaveSearchField(true);
  };

  return needAutocomplete ? (
    <Box
      sx={{ width: '100%', px: 3, position: 'relative' }}
      onBlur={handleBlurAction}
      onMouseDown={() => setShowAutocomplete(true)}
      onMouseEnter={() => setLeaveSearchField(false)}
      onMouseLeave={() => setLeaveSearchField(true)}
    >
      <SearchStyle
        inputRef={ref}
        defaultValue={getSearchKeyFromURL ? params.key : placeholder}
        placeholder={placeholder}
        onKeyPress={handleChange}
        onChange={determineClose}
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
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
        sx={{ width: 550, ...sx }}
        needbgcolor={needbgcolor ? 1 : 0}
      />
      {searchStr.length > 0 &&
        showAutocomplete &&
        !isLoadingInstanceSearch &&
        instanceSearchResult &&
        (instanceSearchResult.collections.length > 0 ||
          instanceSearchResult.items.length > 0 ||
          instanceSearchResult.accounts.length > 0) && (
          <Box sx={{ position: 'absolute', width: '100%', left: 0, px: 3 }}>
            <ListWrapperStyle>
              <List component="nav" aria-labelledby="nested-list-subheader">
                {instanceSearchResult.collections.length > 0 && (
                  <>
                    <ListItem>
                      <ListItemText primary="Collections" sx={{ color: 'text.secondary' }} />
                    </ListItem>
                    <Divider />
                    {instanceSearchResult.collections.map((item, _i) => {
                      const { token, chain } = item;
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
                            secondary={`by ${reduceHexAddress(item?.owner)}`}
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
                        <ListItemTextStyle
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
    </Box>
  ) : (
    <SearchStyle
      inputRef={ref}
      defaultValue={params.key}
      placeholder={placeholder}
      onKeyPress={handleChange}
      onChange={determineClose}
      startAdornment={
        <InputAdornment position="start">
          <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      }
      endAdornment={
        needClose && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={clearSearch}>
              <Box component={Icon} icon={closeFill} sx={{ color: 'text.disabled' }} />
            </IconButton>
          </InputAdornment>
        )
      }
      sx={{ width: 550, ...sx }}
      needbgcolor={needbgcolor ? 1 : 0}
    />
  );
}

SearchBox.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
  needAutocomplete: PropTypes.bool,
  needbgcolor: PropTypes.bool
};
SearchBox.defaultProps = {
  placeholder: defaultPlaceHolder,
  needAutocomplete: false,
  needbgcolor: false
};
