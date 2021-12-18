// material
import { Card, CardHeader, Typography, Stack, LinearProgress, Box } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import mockData from '../../../utils/mock-data';

// ----------------------------------------------------------------------

const LABEL = ['Pending', 'Cancel', 'Done'];

const MOCK_SALES = [...Array(3)].map((_, index) => ({
  status: LABEL[index],
  quantity: mockData.number.percent(index) * 1000,
  value: mockData.number.percent(index)
}));

// ----------------------------------------------------------------------

export default function BookingBookedRoom() {
  return (
    <Card>
      <CardHeader title="Booked Room" />
      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {MOCK_SALES.map((progress) => (
          <LinearProgress
            variant="determinate"
            key={progress.status}
            value={progress.value}
            color={
              (progress.status === 'Pending' && 'warning') || (progress.status === 'Cancel' && 'error') || 'success'
            }
            sx={{ height: 8, bgcolor: 'grey.50016' }}
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pb: 3 }}>
        {MOCK_SALES.map((progress) => (
          <Stack key={progress.status} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: 'success.main',
                  ...(progress.status === 'Pending' && { bgcolor: 'warning.main' }),
                  ...(progress.status === 'Cancel' && { bgcolor: 'error.main' })
                }}
              />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {progress.status}
              </Typography>
            </Stack>

            <Typography variant="h6">{fShortenNumber(progress.quantity)}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
