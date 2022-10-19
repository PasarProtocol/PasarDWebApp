import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Stack } from '@mui/material';

import PaperRecord from '../PaperRecord';
import useSettings from '../../hooks/useSettings';
// ----------------------------------------------------------------------

export default function AssetCardSkeleton() {
  const { themeMode } = useSettings();
  const themeProp = {};
  if (themeMode === 'dark') {
    themeProp.baseColor = '#333d48';
    themeProp.highlightColor = '#434d58';
  }
  return (
    <PaperRecord>
      <SkeletonTheme {...themeProp}>
        <Stack direction="row" spacing={0.5} sx={{ p: 2, pb: 1 }}>
          <Skeleton circle width={26} height={26} />
          <Skeleton circle width={26} height={26} />
        </Stack>
        <Skeleton style={{ justifyContent: 'center', aspectRatio: '1/1' }} />
        <Box sx={{ p: 2 }}>
          <h3>
            <Skeleton />
          </h3>
          <h3>
            <Skeleton />
          </h3>
        </Box>
      </SkeletonTheme>
    </PaperRecord>
  );
}
