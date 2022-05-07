import React, {useRef, useState} from 'react';
// material
import { styled } from '@mui/material/styles';
import { Box, Accordion, AccordionSummary, AccordionDetails, Grid, MenuItem, List, TextField, FormControlLabel, Typography, Stack, 
  ListItemButton, ListItemIcon, ListItemText, Select, Drawer, Divider, Button, FormControl, FormHelperText} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import CheckIcon from '@mui/icons-material/Check';

import CustomSwitch from '../custom-switch';
import SearchBox from '../SearchBox';
import Scrollbar from '../Scrollbar';
import {fetchFrom, coinTypes} from '../../utils/common'
// ----------------------------------------------------------------------
const DrawerStyle = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '& .MuiPaper-root': {
      position: 'initial'
    }
  },
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    transition: theme.transitions.create(['top'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard
    }),
  }
}));
const AccordionStyle = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'unset'
}))
export default function CollectionFilterPan(props){
  const {sx, scrollMaxHeight, btnGroup, filterProps, handleFilter, address} = props
  const {range, selectedBtns, selectedAttributes={}} = filterProps
  const [minVal, setMinVal] = React.useState(range?range.min:'');
  const [maxVal, setMaxVal] = React.useState(range?range.max:'');
  const [isErrRangeInput, setErrRangeInput] = React.useState(false);
  const [collectionAttributes, setCollectionAttributes] = React.useState({});
  const [filterAttributes, setFilterAttributes] = React.useState({});
  const [filterTokens, setFilterTokens] = React.useState(coinTypes);

  React.useEffect(()=>{
    let isMounted = true;
    fetchFrom(`api/v2/sticker/getAttributeOfCollection/${address}`)
      .then((response) => {
        response.json().then((jsonData) => {
          if(jsonData.data && isMounted){
            setCollectionAttributes(jsonData.data)
            const tempData = {...jsonData.data}
            Object.keys(tempData).forEach(groupName=>{
              tempData[groupName] = Object.keys(tempData[groupName])
            })
            setFilterAttributes(tempData)
          }
        })
      })
    return () => { isMounted = false };
  }, [])
  React.useEffect(()=>{
    setMinVal(range.min)
    setMaxVal(range.max)
  }, [range])

  const searchTokens = (inputStr)=>{
    if(inputStr.length){
      setFilterTokens(coinTypes.filter(el=>el.name.toLowerCase().includes(inputStr.toLowerCase())))
    } else {
      setFilterTokens(coinTypes)
    }
  }
  
  const selectToken = (address)=>{
    handleFilter('token', address)
  }

  const applyRange = (e)=>{
    const range = {min: minVal, max: maxVal}
    if(minVal>maxVal && maxVal!==''){
      setErrRangeInput(true)
      return
    }
    setErrRangeInput(false)
    handleFilter('range', range)
  }
  const selectAttributes = (groupName, field)=>{
    handleFilter('attributes', {groupName, field})
  }
  const searchAttributes = (inputStr, groupName)=>{
    const tempAttributes = {...filterAttributes}
    if(inputStr.length)
      tempAttributes[groupName] = Object.keys(collectionAttributes[groupName]).filter(el=>el.toLowerCase().includes(inputStr.toLowerCase()))
    else
      tempAttributes[groupName] = Object.keys(collectionAttributes[groupName])
    setFilterAttributes(tempAttributes)
  }
  const filterGroupNames = Object.keys(filterAttributes)

  return(
    <Box
      variant="persistent"
      open
      sx={sx}
    >
      <Grid container width="100%">
        <Grid item xs={12} md={12}>
          <AccordionStyle
            defaultExpanded={Boolean(true)}
          >
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
              <Typography variant="body2">Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" sx={{flexWrap: 'wrap'}}>
                {
                  btnGroup.status.map((name, index)=>(
                    <Button 
                      key={index}
                      variant={
                        filterProps.selectedBtns&&filterProps.selectedBtns.includes(index)?"contained":"outlined"
                      }
                      color="inherit"
                      onClick={()=>handleFilter('statype', index)}
                      sx={{mr: 1, mb: 1}}
                    >
                      {name}
                    </Button>
                  ))
                }
              </Stack>
            </AccordionDetails>
          </AccordionStyle>
          <Divider />
        </Grid>
        <Grid item xs={12} md={12}>
          <AccordionStyle
            defaultExpanded={Boolean(true)}
          >
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
              <Typography variant="body2">Price Range</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                <Select
                  defaultValue={0}
                  // value={selected}
                  // onChange={handleChange}
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
                      <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
                    </ListItemIcon>
                    <ListItemText primary="Elastos (ELA)" />
                  </MenuItem>
                </Select>
                <Grid container>
                  <Grid item xs={5} md={5}>
                    <TextField label="Min" size="small" type="number" value={minVal} onChange={(e)=>setMinVal(e.target.value)} error={isErrRangeInput}/>
                  </Grid>
                  <Grid item xs={2} md={2} align="center">
                    <Typography variant="body2" sx={{pt: 1}}>to</Typography>
                  </Grid>
                  <Grid item xs={5} md={5}>
                    <TextField label="Max" size="small" type="number" value={maxVal} onChange={(e)=>setMaxVal(e.target.value)} error={isErrRangeInput}/>
                  </Grid>
                </Grid>
                <FormControl error={isErrRangeInput} variant="standard" sx={isErrRangeInput?{mt: '0 !important'}:{display: 'none'}}>
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
          <AccordionStyle
            defaultExpanded={Boolean(true)}
          >
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
              <Typography variant="body2">Tokens</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SearchBox sx={{width: '100%', mb: 1}} placeholder="Search tokens" onChange={searchTokens}/>
              <Scrollbar sx={{maxHeight: 200}}>
                <List
                  sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  {
                    filterTokens.map((el, i)=>(
                      <ListItemButton key={i} onClick={()=>{selectToken(el.address)}} selected={filterProps.selectedTokens.includes(el.address)}>
                        <ListItemIcon>
                          <Box 
                            draggable = {false}
                            component="img"
                            src={`/static/${el.icon}`}
                            sx={{
                              width: 24,
                              height: 24,
                              filter: (theme)=>theme.palette.mode==='dark'&&el.icon==='elastos.svg'?'invert(1)':'none'
                            }} 
                          />
                        </ListItemIcon>
                        <ListItemText primary={el.name} />
                        {
                          filterProps.selectedTokens.includes(el.address)&&<CheckIcon/>
                        }
                      </ListItemButton>
                    ))
                  }
                </List>
              </Scrollbar>
            </AccordionDetails>
          </AccordionStyle>
          <Divider />
        </Grid>
        {
          filterGroupNames.map((groupName, _i)=>{
            const filterGroup = filterAttributes[groupName]
            const originGroup = collectionAttributes[groupName]
            return <Grid key={_i} item xs={12} md={12}>
              <AccordionStyle
                defaultExpanded={Boolean(true)}
              >
                <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                  <Typography variant="body2">{groupName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SearchBox sx={{width: '100%', mb: 1}} placeholder="Filter" onChange={(inStr)=>{searchAttributes(inStr, groupName)}}/>
                  <Scrollbar sx={{maxHeight: 200}}>
                    <List
                      sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                    >
                      {
                        filterGroup.map((el, _j)=>{
                          const selectedSubGroup = selectedAttributes[groupName]
                          const isSelected = selectedSubGroup&&selectedSubGroup.includes(el)
                          return <ListItemButton key={_j} onClick={()=>{selectAttributes(groupName, el)}} selected={isSelected}>
                            <ListItemIcon>
                              <Icon icon={`fluent:checkbox-${isSelected?'checked':'unchecked'}-20-regular`} width={20}/>
                            </ListItemIcon>
                            <ListItemText primary={el} />
                            <Typography variant="body2">{originGroup[el]}</Typography>
                          </ListItemButton>
                        })
                      }
                    </List>
                  </Scrollbar>
                </AccordionDetails>
              </AccordionStyle>
              <Divider />
            </Grid>
          })
        }
      </Grid>
    </Box>
  )
}