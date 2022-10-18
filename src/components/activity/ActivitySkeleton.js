import React from 'react';
import PropTypes from 'prop-types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Stack, TableRow, TableCell, Accordion, AccordionSummary } from '@mui/material';

import useSettings from '../../hooks/useSettings';
// ----------------------------------------------------------------------
ActivitySkeleton.propTypes = {
  isMobile: PropTypes.bool
};

export default function ActivitySkeleton(props) {
  const { isMobile = false } = props;
  const { themeMode } = useSettings();
  const themeProp = {};
  if (themeMode === 'dark') {
    themeProp.baseColor = '#333d48';
    themeProp.highlightColor = '#434d58';
  }
  return !isMobile ? (
    <TableRow tabIndex={-1}>
      {Array(2)
        .fill(0)
        .map((_, _i) => (
          <TableCell key={_i}>
            <Box sx={{ pb: 1 }}>
              <SkeletonTheme {...themeProp}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton width={48} height={48} style={{ borderRadius: 12 }} />
                  <Box sx={{ flexGrow: 1, lineHeight: '1.7em' }}>
                    <h3>
                      <Skeleton style={{ borderRadius: '0.4rem' }} />
                    </h3>
                  </Box>
                </Stack>
              </SkeletonTheme>
            </Box>
          </TableCell>
        ))}
      {Array(4)
        .fill(0)
        .map((_, _i) => (
          <TableCell key={_i}>
            <Box sx={{ pb: 1 }}>
              <SkeletonTheme {...themeProp}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ flexGrow: 1, lineHeight: '1.7em' }}>
                    <h3>
                      <Skeleton style={{ borderRadius: '0.4rem' }} />
                    </h3>
                  </Box>
                </Stack>
              </SkeletonTheme>
            </Box>
          </TableCell>
        ))}
    </TableRow>
  ) : (
    <Accordion
      sx={{
        border: '1px solid',
        borderColor: 'action.disabledBackground',
        boxShadow: (theme) => theme.customShadows.z1
      }}
    >
      <AccordionSummary sx={{ '& .MuiAccordionSummary-content': { width: '100%' } }}>
        <SkeletonTheme {...themeProp}>
          <Stack direction="row" spacing={1} alignItems="center" width="100%">
            <Skeleton width={48} height={48} style={{ borderRadius: 12 }} />
            <Box sx={{ flexGrow: 1, lineHeight: '1.4em' }}>
              <h4>
                <Skeleton style={{ borderRadius: '0.4rem' }} />
              </h4>
              <h4>
                <Skeleton style={{ borderRadius: '0.4rem' }} />
              </h4>
              <h4>
                <Skeleton style={{ borderRadius: '0.4rem' }} />
              </h4>
            </Box>
          </Stack>
        </SkeletonTheme>
      </AccordionSummary>
    </Accordion>
  );
}
