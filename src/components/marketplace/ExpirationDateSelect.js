import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Select, MenuItem, TextField, Dialog, DialogContent, Typography, Stack } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { addDays } from 'date-fns';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import StyledButton from '../signin-dlg/StyledButton';
import { getDateTimeString, getTimeZone } from '../../utils/common';

const MenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  variant: 'menu'
};
const menuItems = ['1 day', '3 days', '5 days', '7 days', 'Pick a specific date'];
const pickDateIndex = 4;

const CalendarBoxStyle = styled(Box)(({ theme }) => ({
  '& .MuiCalendarPicker-root button.Mui-selected': {
    color: theme.palette.background.paper,
    backgroundColor: theme.palette.text.primary
  }
}));

export default function ExpirationDateSelect({ onChangeDate }) {
  const [selected, onChange] = React.useState(0);
  const [dateValue, setDateValue] = useState(new Date());
  const [timeValue, setTimeValue] = useState(
    `${dateValue.getHours().toString().padStart(2, 0)}:${dateValue.getMinutes().toString().padStart(2, 0)}`
  );
  const [isOpenPicker, setOpenPicker] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    onChange(selectedIndex);
    if (selectedIndex === pickDateIndex) onChangeDate(dateValue);
    else onChangeDate(addDays(new Date(), 1 + selectedIndex * 2));
  };
  const handleSpecificPicker = (event) => {
    if (event.target.getAttribute('data-value') === pickDateIndex.toString()) setOpenPicker(true);
  };
  const renderValue = (option) => {
    if (option === pickDateIndex) return <span>{getDateTimeString(dateValue)}</span>;
    return <span>{menuItems[option]}</span>;
  };
  const handleSpecificDate = () => {
    setOpenPicker(false);
  };
  const handleDateChange = (newDate) => {
    const splitTime = timeValue.split(':');
    newDate.setHours(splitTime[0]);
    newDate.setMinutes(splitTime[1]);
    newDate.setSeconds(0);
    setDateValue(newDate);
    onChangeDate(newDate);
  };
  const handleTimeChange = (e) => {
    const splitTime = e.target.value.split(':');
    const tempDate = dateValue;
    tempDate.setHours(splitTime[0]);
    tempDate.setMinutes(splitTime[1]);
    tempDate.setSeconds(0);
    if (tempDate < new Date()) {
      enqueueSnackbar('Past time can not be selected!', { variant: 'warning' });
      return;
    }
    setTimeValue(e.target.value);
    setDateValue(tempDate);
    onChangeDate(tempDate);
  };
  const handleClosePicker = () => {
    setOpenPicker(false);
  };
  return (
    <>
      <Select
        variant="standard"
        value={selected}
        onChange={handleChange}
        onClick={handleSpecificPicker}
        inputProps={{ 'aria-label': 'Without label' }}
        size="small"
        sx={{
          mr: 1,
          fontSize: 14,
          width: '100%',
          '& .MuiSelect-select': {
            py: 2
          }
        }}
        renderValue={renderValue}
        MenuProps={MenuProps}
      >
        {menuItems.map((type, i) => (
          <MenuItem key={i} value={i} autoFocus={selected === i}>
            {type}
          </MenuItem>
        ))}
      </Select>
      <Dialog open={isOpenPicker} onClose={handleClosePicker}>
        <DialogContent>
          <CalendarBoxStyle>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CalendarPicker disablePast date={dateValue} onChange={handleDateChange} />
            </LocalizationProvider>
          </CalendarBoxStyle>
          <Stack direction="row" sx={{ mb: 1 }}>
            <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ display: 'block' }}>
                Select time
              </Typography>
              Your time zone is UTC{getTimeZone()}
            </Typography>
            <TextField
              variant="standard"
              type="time"
              sx={{
                '& input[type="time"]': {
                  p: 1
                },
                '& input[type="time"]::-webkit-calendar-picker-indicator': {
                  cursor: 'pointer',
                  p: 1,
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[400],
                  borderRadius: '100%',
                  filter: (theme) => `invert(${theme.palette.mode === 'dark' ? 1 : 0})`
                },
                '& input[type="time"]::-webkit-calendar-picker-indicator:hover': {
                  borderColor: (theme) => theme.palette.grey[500]
                },
                '& :before, & :after': { display: 'none' }
              }}
              value={timeValue}
              onChange={handleTimeChange}
            />
          </Stack>
          <StyledButton variant="contained" onClick={handleSpecificDate} fullWidth>
            Apply
          </StyledButton>
        </DialogContent>
      </Dialog>
    </>
  );
}

ExpirationDateSelect.propTypes = {
  onChangeDate: PropTypes.func
};
