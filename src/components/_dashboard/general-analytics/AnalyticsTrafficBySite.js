import PropTypes from 'prop-types';
import { random } from 'lodash';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
// material
import { Box, Grid, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 32,
  height: 32
};

const MOCK_SOCIALS = [
  {
    name: 'FaceBook',
    value: random(9999, 99999),
    icon: <Icon icon={facebookFill} color="#1877F2" {...ICON_SIZE} />
  },
  {
    name: 'Google',
    value: random(9999, 99999),
    icon: <Icon icon={googleFill} color="#DF3E30" {...ICON_SIZE} />
  },
  {
    name: 'Linkedin',
    value: random(9999, 99999),
    icon: <Icon icon={linkedinFill} color="#006097" {...ICON_SIZE} />
  },
  {
    name: 'Twitter',
    value: random(9999, 99999),
    icon: <Icon icon={twitterFill} color="#1C9CEA" {...ICON_SIZE} />
  }
];

// ----------------------------------------------------------------------

SiteItem.propTypes = {
  site: PropTypes.shape({
    icon: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.number
  })
};

function SiteItem({ site }) {
  const { icon, value, name } = site;

  return (
    <Grid item xs={6}>
      <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
        <Box sx={{ mb: 0.5 }}>{icon}</Box>
        <Typography variant="h6">{fShortenNumber(value)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {name}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default function AnalyticsTrafficBySite() {
  return (
    <Card>
      <CardHeader title="Traffic by Site" />
      <CardContent>
        <Grid container spacing={2}>
          {MOCK_SOCIALS.map((site) => (
            <SiteItem key={site.name} site={site} />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
