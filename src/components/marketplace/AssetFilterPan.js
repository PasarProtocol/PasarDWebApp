import React from 'react';
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
  const {sx, scrollMaxHeight, btnNames, selectedBtns, handleBtnFunc} = props
  return(
    <DrawerStyle
      variant="persistent"
      open
      sx={sx}
    >
      <Scrollbar sx={{maxHeight: scrollMaxHeight, px: 1}}>
        <Grid container width="100%">
          <Grid item xs={12} md={12}>
            <Accordion
              defaultExpanded={1&&true}
            >
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                <Typography variant="body2">Status</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {
                  [...btnNames].splice(0,2).map((name, index)=>(
                    <Button key={index} variant={selectedBtns.includes(index)?"contained":"outlined"} color="primary" onClick={()=>handleBtnFunc(index)}>
                      {name}
                    </Button>
                  ))
                }
              </AccordionDetails>
            </Accordion>
            <Divider />
          </Grid>
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
                      <TextField label="Min" size="small"/>
                    </Grid>
                    <Grid item xs={2} md={2} align="center">
                      <Typography variant="body2" sx={{pt: 1}}>to</Typography>
                    </Grid>
                    <Grid item xs={5} md={5}>
                      <TextField label="Max" size="small"/>
                    </Grid>
                  </Grid>
                  <Button variant="contained" color="primary" width="100%">
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
                <SearchBox sx={{width: '100%'}} rootsx={{px: '0 !important', mb: 1}} placeholder="Search collections"/>
                <Scrollbar sx={{maxHeight: 200}}>
                  <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    {
                      [...Array(10)].map((value, id)=>(
                          <ListItemButton key={id}>
                            <ListItemIcon>
                              <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black' }} />
                            </ListItemIcon>
                            <ListItemText primary="Feeds NFT Sticker" />
                          </ListItemButton>
                      ))
                    }
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
                {
                  [...btnNames].splice(2).map((name, index)=>(
                    <Button key={index} variant={selectedBtns.includes(index+2)?"contained":"outlined"} color="primary" onClick={()=>handleBtnFunc(index+2)}>
                      {name}
                    </Button>
                  ))
                }
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
                  control={<CustomSwitch onChange={()=>{}}/>}
                  label="Off"
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