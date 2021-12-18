import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import flashFill from '@iconify/icons-eva/flash-fill';
// material
import { Box, Card, Stack, Button, Avatar, Tooltip, Typography, CardHeader } from '@mui/material';
// utils
import mockData from '../../../utils/mock-data';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

const MOCK_CONTACTS = [...Array(5)].map((_, index) => ({
  id: mockData.id(index),
  name: mockData.name.fullName(index),
  email: mockData.email(index),
  avatar: mockData.image.avatar(index + 4)
}));

// ----------------------------------------------------------------------

export default function BankingContacts() {
  return (
    <Card>
      <CardHeader
        title="Contacts"
        subheader="You have 122 contacts"
        action={
          <Tooltip title="Add Contact">
            <MIconButton color="primary" size="large">
              <Icon icon={plusFill} width={20} height={20} />
            </MIconButton>
          </Tooltip>
        }
      />
      <Stack spacing={3} sx={{ p: 3 }}>
        {MOCK_CONTACTS.map((contact) => (
          <Stack direction="row" alignItems="center" key={contact.id}>
            <Avatar src={contact.avatar} sx={{ width: 48, height: 48 }} />
            <Box sx={{ flexGrow: 1, ml: 2, minWidth: 100 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} noWrap>
                {contact.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {contact.email}
              </Typography>
            </Box>

            <Tooltip title="Quick Transfer">
              <MIconButton size="small">
                <Icon icon={flashFill} width={22} height={22} />
              </MIconButton>
            </Tooltip>
          </Stack>
        ))}

        <Button variant="outlined" size="large" color="inherit">
          View All
        </Button>
      </Stack>
    </Card>
  );
}
