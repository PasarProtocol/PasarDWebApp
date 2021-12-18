// import faker from 'faker';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { Box, Stack, Link, Card, Button, Grid, Typography, CardHeader } from '@mui/material';
// utils
// import { mockImgCover } from '../../../utils/mockImages';
//
import Scrollbar from '../../Scrollbar';

// ----------------------------------------------------------------------
export default function CollectionView(props) {
  return (
    <Card>
        <Grid container>
            <Grid item xs={12} md={6} lg={6}>
                <CardHeader title={props.title} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <Box sx={{ pt: 3, pr: 2, textAlign: 'right' }}>
                    <Button
                        to="#"
                        size="small"
                        color="inherit"
                        component={RouterLink}
                        endIcon={<Icon icon={arrowIosForwardFill} />}
                    >
                    See more
                    </Button>
                </Box>
            </Grid>
        </Grid>
        <Scrollbar>
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              {props.children}
            </Stack>
        </Scrollbar>
    </Card>
  );
}
