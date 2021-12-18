import { useState } from 'react';
import * as Yup from 'yup';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Switch, Container, CardHeader, CardContent, FormControlLabel } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import FormikForm from './FormikForm';
import ReactHookForm from './ReactHookForm';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export const defaultValues = {
  fullName: '',
  email: '',
  age: '',
  startDate: null,
  endDate: null,
  password: '',
  confirmPassword: '',
  quillEditor: '',
  draftEditor: '',
  photo: null,
  terms: false
};

export const FormSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(6, 'Mininum 6 characters')
    .max(15, 'Maximum 15 characters'),
  email: Yup.string().required('Email is required').email('That is not an email'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be a positive number')
    .integer()
    .moreThan(18, 'Age must be greater than or equal to 18')
    .lessThan(120, 'Age must be less than or equal to 120'),
  startDate: Yup.date().nullable().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .nullable()
    .min(Yup.ref('startDate'), 'End date must be later than start date'),
  password: Yup.string().required('Password is required').min(6, 'Password should be of minimum 6 characters length'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], "Password's not match"),
  quillEditor: Yup.string().required('Quill editor is required').min(200),
  draftEditor: Yup.mixed().test(
    'max text',
    'Draft editor Must Be At Least 200 Characters',
    (value) => value && value.getCurrentContent().getPlainText('\u0001').length > 200
  ),
  terms: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
  photo: Yup.mixed()
    .required('Photo is is required')
    .test('fileFormat', 'Unsupported Format', (value) => value && FILE_FORMATS.includes(value.type))
    .test(
      'fileSize',
      `File must be less than or equal to ${fData(MAX_FILE_SIZE)}`,
      (value) => value && value.size <= MAX_FILE_SIZE
    )
});

export default function FormValidation() {
  const [openDevTool, setOpenDevTool] = useState(false);

  const handleChange = (event) => {
    setOpenDevTool(event.target.checked);
  };

  return (
    <RootStyle title="Form Validation | Minimal-UI">
      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
        }}
      >
        <Container maxWidth="lg">
          <HeaderBreadcrumbs
            heading="Form Validation"
            links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Form Validation' }]}
            moreLink={['https://formik.org/', 'https://react-hook-form.com/', 'https://github.com/jquense/yup']}
          />
        </Container>
      </Box>

      <Container sx={{ mt: 10 }}>
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'flex-end' }}>
          <FormControlLabel control={<Switch checked={openDevTool} onChange={handleChange} />} label="Open Dev Tool" />
        </Box>

        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ position: 'static' }}>
              <CardHeader title="Formik Form" />
              <CardContent>
                <FormikForm openDevTool={openDevTool} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ position: 'static' }}>
              <CardHeader title="React Hook Form" />
              <CardContent>
                <ReactHookForm openDevTool={openDevTool} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
