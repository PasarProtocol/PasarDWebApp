import React, { useState, useEffect } from "react";
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Grid, Typography } from '@mui/material';

// import "./countdown.scss";

export default function Countdown({deadline}) {
  const [timeLeft, setTimeLeft] = useState({hours: 0, minutes: 0, seconds: 0});
  useEffect(() => {
    if(deadline <= new Date().toISOString().slice(0,10))
        return
    const tick = setInterval(() => {
        const hours = differenceInHours(new Date(deadline).getTime(), Date.now())
        const minutes = differenceInMinutes(new Date(deadline).getTime(), Date.now())%60
        const seconds = differenceInSeconds(new Date(deadline).getTime(), Date.now())%60
        setTimeLeft({'hours': hours, 'minutes': minutes, 'seconds': seconds})
    }, 1000);

    return () => {
      clearInterval(tick);
    };
  }, []);

  return (
    <Grid container direction="row">
        <Grid item xs={4}>
            <Typography variant="h3" align="center">{timeLeft.hours}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">hours</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="h3" align="center">{timeLeft.minutes}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">minutes</Typography>
        </Grid>
        <Grid item xs={4}>
            <Typography variant="h3" align="center">{timeLeft.seconds}</Typography>
            <Typography variant="body2" color='text.secondary' align="center">seconds</Typography>
        </Grid>
    </Grid>
  );
};
