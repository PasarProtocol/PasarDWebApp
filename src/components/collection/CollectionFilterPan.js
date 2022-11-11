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
  Typography,
  Stack,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  Divider,
  Button,
  FormControl,
  FormHelperText
} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import CheckIcon from '@mui/icons-material/Check';
import SearchBox from '../SearchBox';
import Scrollbar from '../Scrollbar';
import { coinTypesGroup, fetchAPIFrom, getChainIndexFromChain } from '../../utils/common';
// ----------------------------------------------------------------------
const AccordionStyle = styled(Accordion)({
  backgroundColor: 'unset'
});

CollectionFilterPan.propTypes = {
  sx: PropTypes.any,
  btnGroup: PropTypes.any,
  filterProps: PropTypes.any,
  handleFilter: PropTypes.func,
  token: PropTypes.string,
  chain: PropTypes.number
};

export default function CollectionFilterPan(props) {
  const { sx, btnGroup, filterProps, handleFilter, token, chain } = props;
  const { selectedBtns = [], selectedTokens = [], range, selectedAttributes = {} } = filterProps;
  const chainIndex = getChainIndexFromChain(chain);
  const coinTypeClass = Object.values(coinTypesGroup);
  const coinTypes = chainIndex > 0 ? coinTypeClass[chainIndex - 1] : coinTypesGroup.ESC;
  const [minVal, setMinVal] = React.useState(range?.min || '');
  const [maxVal, setMaxVal] = React.useState(range?.max || '');
  const [isErrRangeInput, setErrRangeInput] = React.useState(false);
  const [collectionAttributes, setCollectionAttributes] = React.useState({}); // Obj element is obj
  const [filterAttributes, setFilterAttributes] = React.useState({}); // Obj element is array
  const [filterTokens, setFilterTokens] = React.useState(coinTypes);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAPIFrom(`api/v1/getAttributesOfCollection?chain=${chain}&collection=${token}`, {});
      const json = await res.json();
      if (json?.data) {
        const colAttr = json?.data || {};
        setCollectionAttributes(colAttr);
        const attributes = { ...colAttr };
        Object.keys(attributes).forEach((attrGroupName) => {
          attributes[attrGroupName] = Object.keys(attributes[attrGroupName]);
        });
        setFilterAttributes(attributes);
      }
    };
    fetchData();
  }, [chain, token]);

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

  const searchTokens = (inputStr) => {
    if (inputStr.length)
      setFilterTokens(coinTypes.filter((el) => el.name.toLowerCase().includes(inputStr.toLowerCase())));
    else setFilterTokens(coinTypes);
  };

  const searchAttributes = (inputStr, groupName) => {
    const tempAttributes = { ...filterAttributes };
    if (inputStr.length)
      tempAttributes[groupName] = Object.keys(collectionAttributes[groupName]).filter((el) =>
        el.toLowerCase().includes(inputStr.toLowerCase())
      );
    else tempAttributes[groupName] = Object.keys(collectionAttributes[groupName]);
    setFilterAttributes(tempAttributes);
  };
  const attributeGroupNames = Object.keys(filterAttributes);

  return (
    <Box sx={sx}>
      <Scrollbar>
        <Box variant="persistent">
          <Grid container width="100%">
            <Grid item xs={12} md={12}>
              <AccordionStyle defaultExpanded={Boolean(true)}>
                <AccordionSummary
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                  sx={{ px: 4 }}
                >
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
              <AccordionStyle defaultExpanded={Boolean(true)}>
                <AccordionSummary
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                  sx={{ px: 4 }}
                >
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
                    <Button variant="contained" color="primary" width="100%" onClick={applyRange}>
                      Apply
                    </Button>
                  </Stack>
                </AccordionDetails>
              </AccordionStyle>
              <Divider />
            </Grid>
            <Grid item xs={12} md={12}>
              <AccordionStyle defaultExpanded={Boolean(true)}>
                <AccordionSummary
                  expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                  sx={{ px: 4 }}
                >
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
                          <ListItemText primary={el.name} />
                          {selectedTokens.includes(el.address) && <CheckIcon />}
                        </ListItemButton>
                      ))}
                    </List>
                  </Scrollbar>
                </AccordionDetails>
              </AccordionStyle>
              <Divider />
            </Grid>
            {attributeGroupNames.map((groupName, _i) => {
              const objSubGroupNames = collectionAttributes[groupName]; // obj
              const arrSubGroupNames = filterAttributes[groupName]; // array
              return (
                <Grid key={_i} item xs={12} md={12}>
                  <AccordionStyle defaultExpanded={Boolean(true)}>
                    <AccordionSummary
                      expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                      sx={{ px: 4 }}
                    >
                      <Typography variant="body2">{groupName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <SearchBox
                        sx={{ width: '100%', mb: 1 }}
                        placeholder="Filter"
                        onChange={(inStr) => searchAttributes(inStr, groupName)}
                      />
                      <Scrollbar sx={{ maxHeight: 200 }}>
                        <List
                          sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                        >
                          {arrSubGroupNames.map((el, _j) => {
                            const arrSelectedGroup = selectedAttributes[groupName] || [];
                            const isSelected = arrSelectedGroup.indexOf(el) >= 0;
                            return (
                              <ListItemButton
                                key={_j}
                                onClick={() => handleFilter('attributes', { groupName, name: el })}
                                selected={isSelected}
                              >
                                <ListItemIcon>
                                  <Icon
                                    icon={`fluent:checkbox-${isSelected ? 'checked' : 'unchecked'}-20-regular`}
                                    width={20}
                                  />
                                </ListItemIcon>
                                <ListItemText primary={el} />
                                <Typography variant="body2">{objSubGroupNames[el]}</Typography>
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Scrollbar>
                    </AccordionDetails>
                  </AccordionStyle>
                  <Divider />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Scrollbar>
    </Box>
  );
}
