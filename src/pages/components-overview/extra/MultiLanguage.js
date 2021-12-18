import { useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Radio,
  Container,
  CardHeader,
  Typography,
  RadioGroup,
  TablePagination,
  FormControlLabel
} from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

export default function MultiLanguage() {
  const { allLang, currentLang, translate, onChangeLang } = useLocales();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <RootStyle title="Components: Multi Language | Minimal-UI">
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
            heading="Multi Language"
            links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Multi Language' }]}
            moreLink={['https://react.i18next.com', 'https://mui.com/guides/localization/#main-content']}
          />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack spacing={5}>
          <Card>
            <CardHeader title="Flexible" />
            <Box sx={{ p: 3 }}>
              <RadioGroup row value={currentLang.value} onChange={(event) => onChangeLang(event.target.value)}>
                {allLang.map((lang) => (
                  <FormControlLabel key={lang.label} value={lang.value} label={lang.label} control={<Radio />} />
                ))}
              </RadioGroup>

              <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                <Box component="img" alt={currentLang.label} src={currentLang.icon} sx={{ mr: 1 }} />
                <Typography variant="h2">{translate('demo.title')}</Typography>
              </Box>
              <Typography variant="body1">{translate('demo.introduction')}</Typography>
            </Box>
          </Card>

          <Card>
            <CardHeader title="System" sx={{ pb: 2 }} />

            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Stack>
      </Container>
    </RootStyle>
  );
}
