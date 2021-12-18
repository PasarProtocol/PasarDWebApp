import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { findIndex, isString } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';
// utils
import { MIconButton } from '../../@material-extend';
import { varFadeInRight } from '../../animate';
import LightboxModal from '../../LightboxModal';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  width: 64,
  height: 64,
  fontSize: 24,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
  '&:hover': { opacity: 0.72 }
}));

// ----------------------------------------------------------------------

function UploadFile() {
  const [files, setFiles] = useState([]);

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop
  });

  return (
    <>
      {files.map((file) => {
        const { name, preview } = file;
        const key = isString(file) ? file : name;

        return (
          <Box
            key={key}
            {...varFadeInRight}
            sx={{
              p: 0,
              m: 0.5,
              width: 64,
              height: 64,
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Paper
              variant="outlined"
              component="img"
              src={isString(file) ? file : preview}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
            />
            <Box sx={{ top: 6, right: 6, position: 'absolute' }}>
              <MIconButton
                size="small"
                onClick={() => handleRemove(file)}
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
          </Box>
        );
      })}

      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 })
        }}
      >
        <input {...getInputProps()} />

        <Box component={Icon} icon={plusFill} sx={{ color: 'text.secondary' }} />
      </DropZoneStyle>
    </>
  );
}

KanbanTaskAttachments.propTypes = {
  attachments: PropTypes.array.isRequired
};

export default function KanbanTaskAttachments({ attachments }) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const imagesLightbox = attachments;

  const handleOpenLightbox = (url) => {
    const selectedImage = findIndex(imagesLightbox, (index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  const handleCloseLightbox = () => {
    setOpenLightbox(false);
  };

  return (
    <>
      {attachments.map((attachment) => (
        <Box
          component="img"
          key={attachment}
          src={attachment}
          onClick={() => handleOpenLightbox(attachment)}
          sx={{ width: 64, height: 64, objectFit: 'cover', cursor: 'pointer', borderRadius: 1, m: 0.5 }}
        />
      ))}

      <UploadFile />

      <LightboxModal
        images={imagesLightbox}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
