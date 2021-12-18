// material
import { styled } from '@mui/material/styles';
import { Box, Container, Stack, Card, CardHeader } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import DataGridBasic from './DataGridBasic';
import DataGridCustom from './DataGridCustom';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export default function DataGridComponent() {
  return (
    <RootStyle title="Components: DataGrid | Minimal-UI">
      <Box
        sx={{
          pt: 6,
          pb: 1,
          mb: 10,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
        }}
      >
        <Container maxWidth="lg">
          <HeaderBreadcrumbs
            heading="DataGrid"
            links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'DataGrid' }]}
            moreLink="https://material-ui.com/components/data-grid"
          />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack spacing={5}>
          <Card>
            <CardHeader title="Basic" sx={{ mb: 2 }} />
            <Box sx={{ height: 390 }}>
              <DataGridBasic />
            </Box>
          </Card>

          <Card>
            <CardHeader title="Custom" sx={{ mb: 2 }} />
            <Box sx={{ height: 720 }}>
              <DataGridCustom />
            </Box>
          </Card>
        </Stack>
      </Container>
    </RootStyle>
  );
}
