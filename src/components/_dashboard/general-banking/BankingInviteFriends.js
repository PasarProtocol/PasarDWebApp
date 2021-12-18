// material
import { styled, alpha } from '@mui/material/styles';
import { Box, Card, Stack, Typography, Button, OutlinedInput } from '@mui/material';

// ----------------------------------------------------------------------

const ContentStyle = styled(Card)(({ theme }) => ({
  marginTop: -120,
  boxShadow: 'none',
  padding: theme.spacing(5),
  paddingTop: theme.spacing(16),
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`
}));

// ----------------------------------------------------------------------

export default function BankingInviteFriends() {
  return (
    <div>
      <Box
        component="img"
        src="/static/illustrations/illustration_invite.png"
        sx={{
          zIndex: 9,
          position: 'relative',
          left: 40,
          width: 140,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))'
        }}
      />
      <ContentStyle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">
            Invite friends <br /> and earn
          </Typography>
          <Typography variant="h2">$50</Typography>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
          Praesent egestas tristique nibh. Duis lobortis massa imperdiet quam.
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <OutlinedInput
            size="small"
            placeholder="Email"
            sx={{
              width: 1,
              color: 'common.white',
              fontWeight: 'fontWeightMedium',
              bgcolor: (theme) => alpha(theme.palette.common.black, 0.16),
              '& input::placeholder': {
                color: (theme) => alpha(theme.palette.common.white, 0.48)
              },
              '& fieldset': { display: 'none' }
            }}
          />
          <Button color="warning" variant="contained">
            Invite
          </Button>
        </Stack>
      </ContentStyle>
    </div>
  );
}
