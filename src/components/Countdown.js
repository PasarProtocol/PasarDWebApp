import React, { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Box, Grid, Typography, Stack } from '@mui/material';

// import "./countdown.scss";

export default function Countdown({deadline}) {
  const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});
  useEffect(() => {
    if(deadline <= new Date().getTime())
        return
    const tick = setInterval(() => {
        const days = differenceInDays(new Date(deadline).getTime(), Date.now())
        const hours = differenceInHours(new Date(deadline).getTime(), Date.now())%24
        const minutes = differenceInMinutes(new Date(deadline).getTime(), Date.now())%60
        const seconds = differenceInSeconds(new Date(deadline).getTime(), Date.now())%60
        setTimeLeft({'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds})
    }, 1000);

    return () => {
      clearInterval(tick);
    };
  }, []);

  return (
    <Stack direction='row' spacing={3} sx={{justifyContent: 'right'}}>
        <Box>
            <Typography variant="h3" align="center">{timeLeft.days}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">days</Typography>
        </Box>
        <Box>
            <Typography variant="h3" align="center">{timeLeft.hours}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">hours</Typography>
        </Box>
        <Box>
            <Typography variant="h3" align="center">{timeLeft.minutes}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">minutes</Typography>
        </Box>
        <Box>
            <Typography variant="h3" align="center">{timeLeft.seconds}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">seconds</Typography>
        </Box>
    </Stack>
  );
};
