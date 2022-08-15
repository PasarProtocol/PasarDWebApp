import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Box, Stack, Divider, TableRow, TableCell } from '@mui/material';

import PaperRecord from '../PaperRecord';
import useSettings from '../../hooks/useSettings';
// ----------------------------------------------------------------------

export default function ActivitySkeleton() {
  const { themeMode } = useSettings();
  const themeProp = {}
  if(themeMode==="dark"){
    themeProp.baseColor = '#333d48'
    themeProp.highlightColor = '#434d58'
  }
  return (
    <TableRow tabIndex={-1}>
      {
        Array(2).fill(0).map((item, _i) => (
          <TableCell key={_i}>
            <Box sx={{pb: 1}}>
              <SkeletonTheme {...themeProp}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton width={48} height={48} style={{ borderRadius: 12 }}/>
                  <Box sx={{flexGrow: 1, lineHeight: '1.7em'}}>
                    <h3><Skeleton style={{ borderRadius: '0.4rem' }}/></h3>
                  </Box>
                </Stack>
              </SkeletonTheme>
            </Box>
          </TableCell>
        ))
      }
      {
        Array(4).fill(0).map((item, _i) => (
          <TableCell key={_i}>
            <Box sx={{pb: 1}}>
              <SkeletonTheme {...themeProp}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{flexGrow: 1, lineHeight: '1.7em'}}>
                    <h3><Skeleton style={{ borderRadius: '0.4rem' }}/></h3>
                  </Box>
                </Stack>
              </SkeletonTheme>
            </Box>
          </TableCell>
        ))
      }
    </TableRow>
  )
}