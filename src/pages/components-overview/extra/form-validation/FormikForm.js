import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import { useState, useRef } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';
// material
import {
  Stack,
  Button,
  Checkbox,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  FormHelperText,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
// utils
import { fData } from '../../../../utils/formatNumber';
import { fTimestamp } from '../../../../utils/formatTime';
import HelperFormik from '../../../../utils/helperFormik';
// components
import { QuillEditor, DraftEditor } from '../../../../components/editor';
//
import { FormSchema, defaultValues } from '.';

// ----------------------------------------------------------------------

FormikForm.propTypes = {
  openDevTool: PropTypes.bool
};

export default function FormikForm({ openDevTool }) {
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(
        JSON.stringify(
          {
            ...values,
            photo: values.photo?.name,
            startDate: values.startDate && fTimestamp(values.startDate),
            endDate: values.endDate && fTimestamp(values.endDate),
            draftEditor: draftToHtml(convertToRaw(values.draftEditor.getCurrentContent()))
          },
          null,
          2
        )
      );
      resetForm();
    }
  });

  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickAttachPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              {...getFieldProps('fullName')}
              error={Boolean(touched.fullName && errors.fullName)}
              helperText={touched.fullName && errors.fullName}
            />

            <TextField
              fullWidth
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              label="Age"
              {...getFieldProps('age')}
              error={Boolean(touched.age && errors.age)}
              helperText={touched.age && errors.age}
            />

            <Stack spacing={1}>
              <Stack spacing={{ xs: 2, sm: 3 }} direction={{ xs: 'column', sm: 'row' }}>
                <DatePicker
                  label="Start date"
                  {...getFieldProps('startDate')}
                  onChange={(date) => setFieldValue('startDate', date)}
                  renderInput={(params) => (
                    <TextField fullWidth {...params} error={Boolean(touched.startDate && errors.startDate)} />
                  )}
                  inputFormat="dd/MM/yyyy"
                />

                <DatePicker
                  label="End date"
                  {...getFieldProps('endDate')}
                  onChange={(date) => setFieldValue('endDate', date)}
                  renderInput={(params) => (
                    <TextField fullWidth {...params} error={Boolean(touched.endDate && errors.endDate)} />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </Stack>

              {Boolean(touched.startDate && errors.startDate) && (
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.startDate}
                </FormHelperText>
              )}
              {Boolean(touched.endDate && errors.endDate) && (
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.endDate}
                </FormHelperText>
              )}
            </Stack>

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              {...getFieldProps('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />

            <div>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                Quill Editor
              </Typography>
              <QuillEditor
                id="formik-content"
                value={values.quillEditor}
                onChange={(val) => setFieldValue('quillEditor', val)}
                error={Boolean(touched.quillEditor && errors.quillEditor)}
              />
              {touched.quillEditor && errors.quillEditor && (
                <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                  {touched.quillEditor && errors.quillEditor}
                </FormHelperText>
              )}
            </div>

            <div>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                Draft Editor
              </Typography>
              <DraftEditor
                editorState={values.draftEditor}
                onEditorStateChange={(val) => setFieldValue('draftEditor', val)}
                error={Boolean(touched.draftEditor && errors.draftEditor)}
              />
              {touched.draftEditor && errors.draftEditor && (
                <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                  {touched.draftEditor && errors.draftEditor}
                </FormHelperText>
              )}
            </div>

            <div>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Button
                  color="warning"
                  variant="contained"
                  onClick={handleClickAttachPhoto}
                  startIcon={<Icon icon={cloudUploadFill} />}
                >
                  Upload photo
                </Button>

                <div>
                  {values.photo?.name && <Typography variant="subtitle2">{values.photo.name}</Typography>}
                  {values.photo?.size && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {fData(values.photo.size)}
                    </Typography>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  id="photo"
                  name="photo"
                  type="file"
                  onChange={(event) => {
                    setFieldValue('photo', event.target.files?.[0]);
                  }}
                  style={{ display: 'none' }}
                />
              </Stack>
              {touched.photo && errors.photo && (
                <FormHelperText sx={{ px: 2, display: 'block' }} error>
                  {errors.photo}
                </FormHelperText>
              )}
            </div>

            <Stack>
              <FormControlLabel
                control={<Checkbox {...getFieldProps('terms')} checked={values.terms} />}
                label=" Terms and Conditions"
              />

              {touched.terms && errors.terms && (
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.terms}
                </FormHelperText>
              )}
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!dirty}
            >
              Submit Formik Form
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>

      {openDevTool && <HelperFormik formik={formik} placement="left" />}
    </>
  );
}
