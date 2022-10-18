import React from 'react';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Stack,
  Drawer,
  Divider,
  Button
} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import Scrollbar from '../Scrollbar';
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
    border: 0,
    transition: theme.transitions.create(['top'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard
    })
  }
}));
const AccordionStyle = styled(Accordion)({
  backgroundColor: 'unset'
});

ActivityFilterPan.propTypes = {
  sx: PropTypes.any,
  scrollMaxHeight: PropTypes.any,
  btnGroup: PropTypes.any,
  filterProps: PropTypes.any,
  handleFilter: PropTypes.any
};
export default function ActivityFilterPan(props) {
  const { sx, scrollMaxHeight, btnGroup, filterProps, handleFilter } = props;

  return (
    <DrawerStyle variant="persistent" open sx={sx}>
      <Scrollbar sx={{ maxHeight: scrollMaxHeight, px: 1 }}>
        <Grid container width="100%">
          <Grid item xs={12} md={12}>
            <AccordionStyle defaultExpanded={Boolean(true)}>
              <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />} sx={{ px: 4 }}>
                <Typography variant="body2">Event Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
                  {btnGroup.status.map((name, index) => (
                    <Button
                      key={index}
                      variant={
                        filterProps.selectedBtns && filterProps.selectedBtns.includes(index) ? 'contained' : 'outlined'
                      }
                      color="inherit"
                      onClick={() => handleFilter('eventype', index)}
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
        </Grid>
      </Scrollbar>
    </DrawerStyle>
  );
}
