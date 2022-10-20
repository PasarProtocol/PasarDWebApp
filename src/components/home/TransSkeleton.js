import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Stack, Divider } from '@mui/material';
import useSettings from '../../hooks/useSettings';
// ----------------------------------------------------------------------

export default function TransSkeleton() {
  const { themeMode } = useSettings();
  const themeProp = {};
  if (themeMode === 'dark') {
    themeProp.baseColor = '#333d48';
    themeProp.highlightColor = '#434d58';
  }
  return (
    <>
      <Box sx={{ pb: 1 }}>
        <SkeletonTheme {...themeProp}>
          <Stack direction="row" spacing={1}>
            <Skeleton width={48} height={48} />
            <Box sx={{ flexGrow: 1, lineHeight: '1.7em' }}>
              <h4>
                <Skeleton />
              </h4>
              <h4>
                <Skeleton />
              </h4>
            </Box>
          </Stack>
        </SkeletonTheme>
      </Box>
      <Divider />
    </>
  );
}
