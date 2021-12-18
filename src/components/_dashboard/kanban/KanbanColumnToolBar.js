import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreHorizontalFill from '@iconify/icons-eva/more-horizontal-fill';
// material
import { Stack, OutlinedInput, MenuItem, Box, Typography } from '@mui/material';
//
import MenuPopover from '../../MenuPopover';
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

KanbanColumnToolBar.propTypes = {
  columnName: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
};

export default function KanbanColumnToolBar({ columnName, onDelete, onUpdate }) {
  const anchorRef = useRef(null);
  const renameRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(columnName);

  useEffect(() => {
    if (open) {
      if (renameRef !== null) {
        renameRef.current.focus();
      }
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickRename = () => {
    handleClose();
  };

  const handleChangeColumnName = (event) => {
    setValue(event.target.value);
  };

  const handleUpdateColumn = (event) => {
    if (event.key === 'Enter') {
      renameRef.current.blur();
      onUpdate(event.target.value);
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ pt: 3 }}>
        <OutlinedInput
          inputRef={renameRef}
          size="small"
          placeholder="Section name"
          value={value}
          onChange={handleChangeColumnName}
          onKeyUp={handleUpdateColumn}
          sx={{
            typography: 'h6',
            fontWeight: 'fontWeightBold',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent'
            }
          }}
        />

        <MIconButton ref={anchorRef} size="small" onClick={handleOpen} color={open ? 'inherit' : 'default'}>
          <Icon icon={moreHorizontalFill} width={20} height={20} />
        </MIconButton>
      </Stack>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1, width: 'auto' }}>
        <MenuItem onClick={handleClickRename} sx={{ py: 0.75, px: 1.5 }}>
          <Box component={Icon} icon={editFill} sx={{ width: 20, height: 20, flexShrink: 0, mr: 1 }} />
          <Typography variant="body2">Rename section</Typography>
        </MenuItem>
        <MenuItem onClick={onDelete} sx={{ py: 0.75, px: 1.5 }}>
          <Box component={Icon} icon={trash2Outline} sx={{ width: 20, height: 20, flexShrink: 0, mr: 1 }} />
          <Typography variant="body2">Delete section</Typography>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
