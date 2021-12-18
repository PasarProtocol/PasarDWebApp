import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import { DevTool } from '@hookform/devtools';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useRef } from 'react';
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
// components
import { QuillEditor, DraftEditor } from '../../../../components/editor';
//
import { FormSchema, defaultValues } from '.';

// ----------------------------------------------------------------------

ReactHookForm.propTypes = {
  openDevTool: PropTypes.bool
};

export default function ReactHookForm({ openDevTool }) {
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    watch,
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues
  });
  const watchAllFields = watch();

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickAttachPhoto = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(
      JSON.stringify(
        {
          ...data,
          photo: data.photo?.name,
          startDate: data.startDate && fTimestamp(data.startDate),
          endDate: data.endDate && fTimestamp(data.endDate),
          draftEditor: draftToHtml(convertToRaw(data.draftEditor.getCurrentContent()))
        },
        null,
        2
      )
    );
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="fullName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Full Name" error={Boolean(error)} helperText={error?.message} />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Email address" error={Boolean(error)} helperText={error?.message} />
            )}
          />

          <Controller
            name="age"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Age" error={Boolean(error)} helperText={error?.message} />
            )}
          />

          <Stack spacing={1}>
            <Stack spacing={{ xs: 2, sm: 3 }} direction={{ xs: 'column', sm: 'row' }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Start date"
                    renderInput={(params) => <TextField fullWidth {...params} error={Boolean(error)} />}
                    inputFormat="dd/MM/yyyy"
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="End date"
                    renderInput={(params) => <TextField fullWidth {...params} error={Boolean(error)} />}
                    inputFormat="dd/MM/yyyy"
                  />
                )}
              />
            </Stack>

            {Boolean(errors.startDate) && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.startDate?.message}
              </FormHelperText>
            )}

            {Boolean(errors.endDate) && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.endDate?.message}
              </FormHelperText>
            )}
          </Stack>

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />

          <div>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
              Quill Editor
            </Typography>
            <Controller
              name="quillEditor"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <QuillEditor id="hook-content" value={field.value} onChange={field.onChange} error={Boolean(error)} />
              )}
            />
            {Boolean(errors.quillEditor) && (
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {errors.quillEditor?.message}
              </FormHelperText>
            )}
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
              Draft Editor
            </Typography>
            <Controller
              name="draftEditor"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DraftEditor editorState={field.value} onEditorStateChange={field.onChange} error={Boolean(error)} />
              )}
            />
            {Boolean(errors.draftEditor) && (
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {errors.draftEditor?.message}
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
                {watchAllFields.photo?.name && <Typography variant="subtitle2">{watchAllFields.photo.name}</Typography>}
                {watchAllFields.photo?.size && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fData(watchAllFields.photo.size)}
                  </Typography>
                )}
              </div>

              <input
                {...register('photo')}
                ref={fileInputRef}
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setValue('photo', file);
                }}
                style={{ display: 'none' }}
              />
            </Stack>

            {errors.photo && (
              <FormHelperText sx={{ px: 2, display: 'block' }} error>
                {errors.photo.message}
              </FormHelperText>
            )}
          </div>

          <div>
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label=" Terms and Conditions"
                />
              )}
            />

            {errors.terms && (
              <FormHelperText sx={{ px: 2 }} error>
                {errors.terms.message}
              </FormHelperText>
            )}
          </div>

          <LoadingButton
            fullWidth
            color="info"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Submit React Hook Form
          </LoadingButton>
        </Stack>
      </form>

      {openDevTool && <DevTool control={control} placement="top-right" />}
    </>
  );
}
