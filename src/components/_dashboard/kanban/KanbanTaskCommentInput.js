import { Icon } from '@iconify/react';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
// material
import { Stack, Paper, Button, Tooltip, OutlinedInput } from '@mui/material';
//
import { MIconButton } from '../../@material-extend';
import MyAvatar from '../../MyAvatar';

// ----------------------------------------------------------------------

export default function KanbanTaskCommentInput() {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 3, px: 2.5 }}>
      <MyAvatar />

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
        <OutlinedInput
          fullWidth
          multiline
          row={2}
          placeholder="Type a message"
          sx={{ '& fieldset': { display: 'none' } }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Add photo">
              <MIconButton size="small">
                <Icon icon={roundAddPhotoAlternate} width={20} height={20} />
              </MIconButton>
            </Tooltip>
            <Tooltip title="Attachment">
              <MIconButton size="small">
                <Icon icon={attach2Fill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          </Stack>

          <Button variant="contained">Comment</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
