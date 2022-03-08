import React from 'react';
// material
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Typography, Grid, IconButton, Stack, Link } from '@mui/material';
import { Icon } from '@iconify/react';
import twitterIcon from '@iconify/icons-ant-design/twitter';
import mediumIcon from '@iconify/icons-ant-design/medium';
import TelegramIcon from '@mui/icons-material/Telegram';
import languageIcon from '@iconify/icons-ic/language';
import discordIcon from '@iconify/icons-ic/sharp-discord'

import { MFab } from '../@material-extend';
import Discord from '../LinkIcons/Discord'
// ----------------------------------------------------------------------
export default function IconLinkButtonGroup(props) {
  return (
    <Stack
      spacing={1}
      direction="row"
      justifyContent='center'
    >
      <MFab size="small">
        <Icon icon={languageIcon} width={24} height={24} />
      </MFab>
      <MFab size="small">
        <Icon icon={twitterIcon} width={24} height={24} />
      </MFab>
      <MFab size="small">
        <Icon icon={discordIcon} width={24} height={24} />
      </MFab>
      <MFab size="small">
        <TelegramIcon />
      </MFab>
      <MFab size="small">
        <Icon icon={mediumIcon} width={24} height={24} />
      </MFab>
    </Stack>
  );
}