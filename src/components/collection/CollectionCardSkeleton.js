import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Stack } from '@mui/material';

import PaperRecord from '../PaperRecord';
import useSettings from '../../hooks/useSettings';
import palette from '../../theme/palette';

// ----------------------------------------------------------------------
const avatarStyle = {
  width: 56,
  height: 56,
  display: 'flex',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: -29,
  margin: 'auto'
};

export default function CollectionCardSkeleton() {
  const { themeMode } = useSettings();
  const themeProp = {};
  if (themeMode === 'dark') {
    themeProp.baseColor = '#333d48';
    themeProp.highlightColor = '#434d58';
  }
  return (
    <PaperRecord sx={{ overflow: 'hidden' }}>
      <SkeletonTheme {...themeProp}>
        <Stack sx={{ position: 'relative', height: '120px', mb: '25px' }}>
          <Stack sx={{ height: '100%', overflow: 'hidden' }}>
            <Skeleton height={120} style={{ lineHeight: 'unset' }} />
          </Stack>
          <Box sx={avatarStyle}>
            <Skeleton
              circle
              width={56}
              height={56}
              style={{ border: '1px solid', borderColor: palette[themeMode].background.paper }}
            />
          </Box>
        </Stack>
        <Box sx={{ p: 2 }}>
          <h3>
            <Skeleton />
          </h3>
          <h5>
            <Skeleton />
          </h5>
          <h5>
            <Skeleton count={2} />
          </h5>
        </Box>
      </SkeletonTheme>
    </PaperRecord>
  );
}
