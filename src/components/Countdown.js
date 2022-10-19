import React from 'react';
import PropTypes from 'prop-types';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Box, Typography, Stack } from '@mui/material';

Countdown.propTypes = {
  deadline: PropTypes.any
};

export default function Countdown({ deadline }) {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  React.useEffect(() => {
    if (deadline <= new Date().getTime()) return;
    const tick = setInterval(() => {
      if (deadline <= new Date().getTime()) {
        clearInterval(tick);
        return;
      }
      const days = differenceInDays(new Date(deadline).getTime(), Date.now());
      const hours = differenceInHours(new Date(deadline).getTime(), Date.now()) % 24;
      const minutes = differenceInMinutes(new Date(deadline).getTime(), Date.now()) % 60;
      const seconds = differenceInSeconds(new Date(deadline).getTime(), Date.now()) % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="row" spacing={3} sx={{ justifyContent: 'right' }}>
      <Box>
        <Typography variant="h3" align="center">
          {timeLeft.days}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          days
        </Typography>
      </Box>
      <Box>
        <Typography variant="h3" align="center">
          {timeLeft.hours}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          hours
        </Typography>
      </Box>
      <Box>
        <Typography variant="h3" align="center">
          {timeLeft.minutes}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          minutes
        </Typography>
      </Box>
      <Box>
        <Typography variant="h3" align="center">
          {timeLeft.seconds}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          seconds
        </Typography>
      </Box>
    </Stack>
  );
}
