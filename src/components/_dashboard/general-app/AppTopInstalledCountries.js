import PropTypes from 'prop-types';
import { random } from 'lodash';
import { Icon } from '@iconify/react';
import appleFilled from '@iconify/icons-ant-design/apple-filled';
import windowsFilled from '@iconify/icons-ant-design/windows-filled';
import androidFilled from '@iconify/icons-ant-design/android-filled';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, CardHeader, Typography, Stack } from '@mui/material';
// utils
import mockData from '../../../utils/mock-data';
//
import Scrollbar from '../../Scrollbar';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const MOCK_INSTALLED = ['de', 'en', 'fr', 'kr', 'us'].map((country, index) => ({
  id: mockData.id(index),
  name:
    (country === 'de' && 'Germany') ||
    (country === 'en' && 'England') ||
    (country === 'fr' && 'France') ||
    (country === 'kr' && 'Korean') ||
    'USA',
  android: random(99999),
  windows: random(99999),
  apple: random(99999),
  flag: `/static/icons/ic_flag_${country}.svg`
}));

const ItemBlockStyle = styled((props) => <Stack direction="row" alignItems="center" {...props} />)({
  minWidth: 72,
  flex: '1 1'
});

const ItemIconStyle = styled(Icon)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled
}));

// ----------------------------------------------------------------------

CountryItem.propTypes = {
  country: PropTypes.shape({
    id: PropTypes.string,
    flag: PropTypes.string,
    name: PropTypes.string,
    android: PropTypes.number,
    windows: PropTypes.number,
    apple: PropTypes.number
  })
};

function CountryItem({ country }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <ItemBlockStyle sx={{ minWidth: 120 }}>
        <Box component="img" alt={country.name} src={country.flag} sx={{ height: 20, mr: 1 }} />
        <Typography variant="subtitle2">{country.name}</Typography>
      </ItemBlockStyle>
      <ItemBlockStyle>
        <ItemIconStyle icon={androidFilled} />
        <Typography variant="body2">{fShortenNumber(country.android)}</Typography>
      </ItemBlockStyle>
      <ItemBlockStyle>
        <ItemIconStyle icon={windowsFilled} />
        <Typography variant="body2">{fShortenNumber(country.windows)}</Typography>
      </ItemBlockStyle>
      <ItemBlockStyle sx={{ minWidth: 88 }}>
        <ItemIconStyle icon={appleFilled} />
        <Typography variant="body2">{fShortenNumber(country.windows)}</Typography>
      </ItemBlockStyle>
    </Stack>
  );
}

export default function AppTopInstalledCountries() {
  return (
    <Card>
      <CardHeader title="Top Installed Countries" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {MOCK_INSTALLED.map((country) => (
            <CountryItem key={country.id} country={country} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}
