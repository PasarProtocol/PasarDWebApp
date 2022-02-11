import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Box } from '@mui/material';
import PaperRecord from '../PaperRecord';

// ----------------------------------------------------------------------

export default function AssetCardSkeleton() {
  return (
      <PaperRecord sx={{p:2, mb: '2px'}}>
        <SkeletonTheme borderRadius="0.5rem">
          <Skeleton circle width={24} height={24} style={{marginBottom: 5}}/>
          <Skeleton style={{ justifyContent: 'center', aspectRatio: '1/1', display: 'flex', marginBottom: -20 }} />
          <h2><Skeleton/></h2>
          <h5><Skeleton count={2}/></h5>
          <h2><Skeleton/></h2>
          <Box sx={{height: '20px'}}/>
        </SkeletonTheme>
      </PaperRecord>
  )
}