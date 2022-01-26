import { isString } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
// material
import { alpha, styled } from '@mui/material/styles';
import { Paper, Box, Typography, Button, Stack } from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
// utils
import { MIconButton } from '../@material-extend';
import { fData } from '../../utils/formatNumber';
//

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  textAlign: 'center',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 0),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  border: `2px dashed ${theme.palette.grey[500_32]}`,
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
  // backgroundColor: theme.palette.background.neutral,
  // '&:hover': {
  //   opacity: 0.72,
  //   cursor: 'pointer'
  // },
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  onRemove: PropTypes.func,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  sx: PropTypes.object
};

export default function UploadSingleFile({ error, file, onRemove, isAvatar, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other
  });

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>
            {errors.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(file && { p: 8 })
        }}
        onClick={(e)=>e.preventDefault()}
      >
        <input {...getInputProps()} />

        {
          !file && <Box sx={{ p: 3 }}>
            <Typography variant="body2" align="center">
              File types supported:PNG, JPEG, JPG, GIF
              {isAvatar&&(
                <>
                  <br/>Canvas size must be 600x600 pixels<br/>Max. size:5 MB<br/>Recommended GIF animation length: Less than 10 seconds
                </>
                )
              }
            </Typography>
            <Stack sx={{p: 3}} spacing={1} align="center">
              <Typography variant="body2">
                <Box draggable = {false} component="img" src="/static/upload.svg" sx={{width: 60}}/>
              </Typography>
              <Typography variant="body2">
                Drag and drop your file here
              </Typography>
              <Typography variant="body2">
                or
              </Typography>
              <Button variant="contained" {...getRootProps()}>
                Choose File
              </Button>
            </Stack>
          </Box>
        }
        {file && (
          <>
            <Box
              draggable = {false}
              component="img"
              alt="file preview"
              src={isString(file) ? file : file.preview}
              sx={{
                top: 8,
                borderRadius: 1,
                objectFit: 'cover',
                maxHeight: 500
              }}
            />
            <Box sx={{
                top: 64,
                left: 64,
                width: 'calc(100% - 128px)',
                height: 'calc(100% - 128px)',
                bgcolor: 'action.focus',
                position: 'absolute',
                opacity: 0,
                cursor: 'pointer',
                borderRadius: 1,

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                '&:hover': {
                  opacity: 1
                }
              }}
              {...getRootProps()}
            >
              <Box draggable = {false} component="img" src="/static/upload.svg" sx={{width: 60}}/>
            </Box>
            <Box sx={{ top: 16, right: 16, position: 'absolute' }}>
              <MIconButton
                onClick={() => onRemove(file)}
                sx={{
                  p: '2px',
                  color: 'common.white',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48)
                  }
                }}
              >
                <Icon icon={closeFill} />
              </MIconButton>
            </Box>
          </>
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && <ShowRejectionItems />}
    </Box>
  );
}
