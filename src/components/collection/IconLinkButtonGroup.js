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

import useSettings from '../../hooks/useSettings';
import { MFab } from '../@material-extend';
import Discord from '../LinkIcons/Discord'
// ----------------------------------------------------------------------
export default function IconLinkButtonGroup(props) {
  const { themeMode } = useSettings();
  const colorType = themeMode==='light'?'primary':'default'
  return (
    <Stack
      spacing={1}
      direction="row"
      justifyContent='center'
    >
      <MFab size="small" color= {colorType}>
        <Icon icon={languageIcon} width={24} height={24} />
      </MFab>
      <MFab size="small" color= {colorType}>
        <Icon icon={twitterIcon} width={24} height={24} />
      </MFab>
      <MFab size="small" color= {colorType}>
        <Icon icon={discordIcon} width={24} height={24} />
      </MFab>
      <MFab size="small" color= {colorType}>
        <TelegramIcon />
      </MFab>
      <MFab size="small" color= {colorType}>
        <Icon icon={mediumIcon} width={24} height={24} />
      </MFab>
    </Stack>
  );
}