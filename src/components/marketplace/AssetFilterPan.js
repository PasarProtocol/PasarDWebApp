import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  MenuItem,
  List,
  TextField,
  FormControlLabel,
  Typography,
  Stack,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  Drawer,
  Divider,
  Button,
  FormControl,
  FormHelperText
} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import CheckIcon from '@mui/icons-material/Check';

import CustomSwitch from '../custom-switch';
import SearchBox from '../SearchBox';
import Scrollbar from '../Scrollbar';
import StyledButton from '../signin-dlg/StyledButton';
import {
  getCoinTypesGroup4Filter,
  fetchAPIFrom,
  getChainIndexFromChain,
  coinTypesGroup,
  getImageFromIPFSUrl
} from '../../utils/common';
// ----------------------------------------------------------------------
const DrawerStyle = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '& .MuiPaper-root': {
      position: 'initial'
    }
  },
  '& .MuiDrawer-paper': {
    zIndex: 1099,
    backgroundColor: 'unset',
    boxSizing: 'border-box',
    transition: theme.transitions.create(['top'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard
    })
  }
}));
const AccordionStyle = styled(Accordion)({
  backgroundColor: 'unset'
});

AssetFilterPan.propTypes = {
  chain: PropTypes.string,
  btnGroup: PropTypes.any,
  filterProps: PropTypes.any,
  handleFilter: PropTypes.func,
  scrollMaxHeight: PropTypes.string,
  sx: PropTypes.any
};

export default function AssetFilterPan(props) {
  const { chain, btnGroup, filterProps, handleFilter, scrollMaxHeight, sx } = props;
  const { selectedBtns = [], selectedTokens = [], selectedCollections = [], range, adult } = filterProps;
  const chainIndex = getChainIndexFromChain(chain);
  const coinTypeClass = getCoinTypesGroup4Filter();
  const coinTypes = chainIndex > 0 ? coinTypeClass[chainIndex - 1] : coinTypesGroup.ESC;
  const [minVal, setMinVal] = React.useState(range?.min || '');
  const [maxVal, setMaxVal] = React.useState(range?.max || '');
  const [isErrRangeInput, setErrRangeInput] = React.useState(false);
  const [collections, setCollections] = React.useState([]);
  const [filterCollections, setFilterCollections] = React.useState([]);
  const [filterTokens, setFilterTokens] = React.useState(coinTypes);
  const [controller, setAbortController] = React.useState(new AbortController());

  React.useEffect(() => {
    const fetchData = async () => {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);

      const resCnt = await fetchAPIFrom(`api/v1/listCollections?pageNum=1&pageSize=1&chain=${chain}`, {
        signal
      });
      const jsonCnt = await resCnt.json();
      const res = await fetchAPIFrom(
        `api/v1/listCollections?pageNum=1&pageSize=${jsonCnt?.data?.total ?? 10}&chain=${chain}`,
        {
          signal
        }
      );
      const json = await res.json();
      const cols = json?.data?.data || [];
      const resCols = cols.map((item) => {
        const rlt = {};
        return {
          ...rlt,
          key: [item?.chain || '', item?.token || ''].join('&'),
          chain: item?.chain || '',
          token: item?.token || '',
          avatar: getImageFromIPFSUrl(item?.data?.avatar),
          name: item?.name || ''
        };
      });
      setCollections(resCols);
      setFilterCollections(resCols);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  React.useEffect(() => {
    setMinVal(range?.min || '');
    setMaxVal(range?.max || '');
  }, [range]);

  const applyRange = () => {
    const range = { min: minVal, max: maxVal };
    if (minVal * 1 > maxVal * 1 && maxVal !== '') {
      setErrRangeInput(true);
      return;
    }
    setErrRangeInput(false);
    handleFilter('range', range);
  };

  const searchCollections = (inputStr) => {
    if (inputStr.length) {
      setFilterCollections(collections.filter((el) => el.name.toLowerCase().includes(inputStr.toLowerCase())));
    } else {
      setFilterCollections(collections);
    }
  };

  const searchTokens = (inputStr) => {
    if (inputStr.length) {
      setFilterTokens(coinTypes.filter((el) => el.name.toLowerCase().includes(inputStr.toLowerCase())));
    } else {
      setFilterTokens(coinTypes);
    }
  };

  return (
    <DrawerStyle variant="persistent" open sx={sx}>
      <Scrollbar sx={{ maxHeight: scrollMaxHeight, px: 1 }}>
        <Grid container width="100%">
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={1 && true}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Status</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
                  {btnGroup.status.map((name, index) => (
                    <Button
                      key={index}
                      variant={selectedBtns.includes(index) ? 'contained' : 'outlined'}
                      color="inherit"
                      onClick={() => handleFilter('statype', index)}
                      sx={{ mr: 1, mb: 1 }}
                    >
                      {name}
                    </Button>
                  ))}
                </Stack>
              </AccordionDetails>
            </AccordionStyle>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={1 && true}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Price Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <Select
                    defaultValue={0}
                    inputProps={{ 'aria-label': 'Without label' }}
                    size="small"
                    sx={{
                      mr: 1,
                      width: '100%',
                      '& .MuiListItemText-root, & .MuiListItemText-root>span': {
                        display: 'inline'
                      }
                    }}
                  >
                    <MenuItem value={0}>
                      <ListItemIcon>
                        <Box
                          component="img"
                          src="/static/elastos.svg"
                          sx={{
                            width: 18,
                            display: 'inline',
                            filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none')
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Elastos (ELA)" />
                    </MenuItem>
                  </Select>
                  <Grid container>
                    <Grid item xs={5} md={5}>
                      <TextField
                        label="Min"
                        size="small"
                        type="number"
                        value={minVal}
                        onChange={(e) => setMinVal(e.target.value)}
                        error={isErrRangeInput}
                      />
                    </Grid>
                    <Grid item xs={2} md={2} align="center">
                      <Typography variant="body2" sx={{ pt: 1 }}>
                        to
                      </Typography>
                    </Grid>
                    <Grid item xs={5} md={5}>
                      <TextField
                        label="Max"
                        size="small"
                        type="number"
                        value={maxVal}
                        onChange={(e) => setMaxVal(e.target.value)}
                        error={isErrRangeInput}
                      />
                    </Grid>
                  </Grid>
                  <FormControl
                    error={isErrRangeInput}
                    variant="standard"
                    sx={isErrRangeInput ? { mt: '0 !important' } : { display: 'none' }}
                  >
                    <FormHelperText id="name-error-text">Max value must be higher than min value</FormHelperText>
                  </FormControl>
                  <StyledButton variant="contained" fullWidth onClick={applyRange}>
                    Apply
                  </StyledButton>
                </Stack>
              </AccordionDetails>
            </AccordionStyle>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={1 && true}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Collections</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SearchBox
                  sx={{ width: '100%', mb: 1 }}
                  placeholder="Search collections"
                  onChange={searchCollections}
                  getSearchKeyFromURL={false}
                />
                <Scrollbar sx={{ maxHeight: 200 }}>
                  <List
                    sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    {filterCollections.map((el, i) => (
                      <ListItemButton
                        key={i}
                        onClick={() => handleFilter('collection', { key: el.key, chain: el.chain, token: el.token })}
                        selected={selectedCollections.findIndex((item) => item.key === el.key) >= 0}
                      >
                        <ListItemIcon>
                          <Box
                            draggable={false}
                            component={el.avatar ? 'img' : 'div'}
                            src={el.avatar}
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 2,
                              p: (el?.avatar || '').startsWith('/static') ? 0.5 : 0,
                              backgroundColor: 'black'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={el.name} primaryTypographyProps={{ noWrap: true }} />
                        {selectedCollections.findIndex((item) => item.key === el.key) >= 0 && <CheckIcon />}
                      </ListItemButton>
                    ))}
                  </List>
                </Scrollbar>
              </AccordionDetails>
            </AccordionStyle>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={1 && true}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Item Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1} direction="row">
                  {btnGroup.type.map((name, index) =>
                    selectedBtns ? (
                      <Button
                        key={index}
                        variant={selectedBtns.includes(index + btnGroup.status.length) ? 'contained' : 'outlined'}
                        color="inherit"
                        onClick={() => handleFilter('statype', index + btnGroup.status.length)}
                      >
                        {name}
                      </Button>
                    ) : (
                      <Button
                        key={index}
                        variant="outlined"
                        color="inherit"
                        onClick={() => handleFilter('statype', index + btnGroup.status.length)}
                      >
                        {name}
                      </Button>
                    )
                  )}
                </Stack>
              </AccordionDetails>
            </AccordionStyle>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={1 && true}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Tokens</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SearchBox sx={{ width: '100%', mb: 1 }} placeholder="Search tokens" onChange={searchTokens} />
                <Scrollbar sx={{ maxHeight: 200 }}>
                  <List
                    sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    {filterTokens.map((el, i) => (
                      <ListItemButton
                        key={i}
                        onClick={() => handleFilter('token', el.address)}
                        selected={selectedTokens.includes(el.address)}
                      >
                        <ListItemIcon>
                          <Box
                            draggable={false}
                            component="img"
                            src={`/static/${el.icon}`}
                            sx={{
                              width: 24,
                              height: 24,
                              filter: (theme) =>
                                theme.palette.mode === 'dark' && el.icon === 'elastos.svg' ? 'invert(1)' : 'none'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={el.name}
                          primaryTypographyProps={
                            chainIndex < 2 && i < 2
                              ? {
                                  sx: { fontWeight: 'bold' }
                                }
                              : {}
                          }
                        />
                        {selectedTokens.includes(el.address) && <CheckIcon />}
                      </ListItemButton>
                    ))}
                  </List>
                </Scrollbar>
              </AccordionDetails>
            </AccordionStyle>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={1 && true}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Explicit & Sensitive Content</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  checked={adult || false}
                  control={<CustomSwitch onChange={(e) => handleFilter('adult', e.target.checked)} />}
                  label={adult ? 'On' : 'Off'}
                  labelPlacement="end"
                  sx={{ ml: 2, pr: 2 }}
                />
              </AccordionDetails>
            </AccordionStyle>
            <Divider />
          </Grid>
        </Grid>
      </Scrollbar>
    </DrawerStyle>
  );
}
