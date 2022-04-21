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
import {coinTypes} from '../../utils/common'
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
  const {sx, scrollMaxHeight, btnNames, filterProps, handleFilter} = props
  const [minVal, setMinVal] = React.useState(filterProps.range?filterProps.range.min:'');
  const [maxVal, setMaxVal] = React.useState(filterProps.range?filterProps.range.max:'');
  const [isErrRangeInput, setErrRangeInput] = React.useState(false);

  React.useEffect(()=>{
    setMinVal(filterProps.range.min)
    setMaxVal(filterProps.range.max)
  }, [filterProps.range])

  const applyRange = (e)=>{
    const range = {min: minVal, max: maxVal}
    if(minVal>maxVal && maxVal!==''){
      setErrRangeInput(true)
      return
    }
    setErrRangeInput(false)
    handleFilter('range', range)
  }
  return(
    <Box
      variant="persistent"
      open
      sx={sx}
    >
      <Grid container width="100%">
        <Grid item xs={12} md={12}>
          <AccordionStyle
            defaultExpanded={1&&true}
          >
            <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
              <Typography variant="body2">Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1} direction='row'>
              {
                [...btnNames].splice(0,2).map((name, index)=>(
                  filterProps.selectedBtns?
                  <Button key={index} variant={filterProps.selectedBtns.includes(index)?"contained":"outlined"} color="inherit" onClick={()=>handleFilter('statype', index)}>
                    {name}
                  </Button>:
                  <Button key={index} variant="outlined" color="inherit" onClick={()=>handleFilter('statype', index)}>
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
            defaultExpanded={1&&true}
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
          {/* <Divider /> */}
        </Grid>
      </Grid>
    </Box>
  )
}