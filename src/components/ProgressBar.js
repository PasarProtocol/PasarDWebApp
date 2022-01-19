import * as React from 'react';
import { styled } from '@mui/material/styles';
import {useNProgress} from 'nprogress';
import { makeStyles } from "@mui/styles";
import { Container } from '@mui/material';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const useStyles = makeStyles({
  bar: {
    transitionDuration: `100ms`,
  },
  container: ({ isFinished }) => ({
    position: 'fixed',
    top: 0,
    width: '100%',
    maxWidth: 'unset',
    padding: 0,
    zIndex: 100000,
    opacity: isFinished ? 0 : 1,
    pointerEvents: 'none',
    transition: `opacity 100ms linear`,
  }),
})

const BorderProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 1,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 1,
    backgroundColor: theme.palette.mode === 'light' ? '#FF5082' : '#308fe8',
  },
}))

const ProgressBar = ({ isFinished, progress }) => {
  const classes = useStyles({ isFinished })

  return (
    <Container classes={{ root: classes.container }}>
      <BorderProgressBar
        // classes={{ bar1Determinate: classes.bar }}
        value={progress}
        variant="determinate"
      />
    </Container>
  )
}
export default ProgressBar