import React, {useRef} from 'react';
// material
import { styled } from '@mui/material/styles';
import { Box, Accordion, AccordionSummary, AccordionDetails, Grid, MenuItem, List, TextField, FormControlLabel, Typography, Stack, 
  ListItemButton, ListItemIcon, ListItemText, Select, Drawer, Divider, Button} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';

import CustomSwitch from '../custom-switch';
import SearchBox from '../SearchBox';
import Scrollbar from '../Scrollbar';
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

export default function AssetFilterPan(props){
  const {sx, scrollMaxHeight, btnNames, filterProps, handleFilter} = props
  const minRef = useRef();
  const maxRef = useRef();

  const applyRange = (e)=>{
    const range = {min: minRef.current.value, max: maxRef.current.value}
    handleFilter('range', range)
  }

  return(
    <DrawerStyle
      variant="persistent"
      open
      sx={sx}
    >
      <Scrollbar sx={{maxHeight: scrollMaxHeight, px: 1}}>
        <Grid container width="100%">
          {/* <Grid item xs={12} md={12}>
            <Accordion
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
                    <Button key={index} variant={filterProps.selectedBtns.includes(index)?"contained":"outlined"} color="primary" onClick={()=>handleFilter('statype', index)}>
                      {name}
                    </Button>:
                    <Button key={index} variant="outlined" color="primary" onClick={()=>handleFilter('statype', index)}>
                      {name}
                    </Button>
                  ))
                }
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <Accordion
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
                        <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
                      </ListItemIcon>
                      <ListItemText primary="Elastos (ELA)" />
                    </MenuItem>
                  </Select>
                  <Grid container>
                    <Grid item xs={5} md={5}>
                      <TextField label="Min" size="small" type="number" inputRef={minRef} defaultValue={filterProps.range?filterProps.range.min:''}/>
                    </Grid>
                    <Grid item xs={2} md={2} align="center">
                      <Typography variant="body2" sx={{pt: 1}}>to</Typography>
                    </Grid>
                    <Grid item xs={5} md={5}>
                      <TextField label="Max" size="small" type="number" inputRef={maxRef} defaultValue={filterProps.range?filterProps.range.max:''}/>
                    </Grid>
                  </Grid>
                  <Button variant="contained" color="primary" width="100%" onClick={applyRange}>
                    Apply
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <Accordion
              defaultExpanded={1&&true}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                <Typography variant="body2">Collections</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SearchBox sx={{width: '100%', mb: 1}} placeholder="Search collections"/>
                <Scrollbar sx={{maxHeight: 200}}>
                  <List
                    sx={{ width: '100%', bgcolor: 'background.paper', pt: 0 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black' }} />
                      </ListItemIcon>
                      <ListItemText primary="Feeds NFT Sticker" />
                    </ListItemButton>
                  </List>
                </Scrollbar>
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <Accordion
              defaultExpanded={1&&true}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                <Typography variant="body2">Item Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1} direction='row'>
                {
                  [...btnNames].splice(2).map((name, index)=>(
                    filterProps.selectedBtns?
                    <Button key={index} variant={filterProps.selectedBtns.includes(index+2)?"contained":"outlined"} color="primary" onClick={()=>handleFilter('statype', index+2)}>
                      {name}
                    </Button>:
                    <Button key={index} variant="outlined" color="primary" onClick={()=>handleFilter('statype', index+2)}>
                      {name}
                    </Button>
                  ))
                }
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <Accordion
              defaultExpanded={1&&true}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                <Typography variant="body2">Explicit & Sensitive Content</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  checked={filterProps.adult || false}
                  control={<CustomSwitch onChange={(e)=>{handleFilter('adult', e.target.checked)}}/>}
                  label={filterProps.adult?"On":"Off"}
                  labelPlacement="end"
                  sx={{ml:2, pr:2}}
                />
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Grid>
        </Grid>
      </Scrollbar>
    </DrawerStyle>
  )
}