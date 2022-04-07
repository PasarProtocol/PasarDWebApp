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
  const {website='', twitter='', discord='', telegram='', medium=''} = props
  const { themeMode } = useSettings();
  const colorType = themeMode==='light'?'primary':'default'
  return (
    <Stack
      spacing={1}
      direction="row"
      justifyContent='center'
    >
      {
        !!website&&
        <MFab size="small" color= {colorType} href={website} target='_blank'>
          <Icon icon={languageIcon} width={24} height={24} />
        </MFab>
      }
      {
        !!twitter&&
        <MFab size="small" color= {colorType} href={twitter} target='_blank'>
          <Icon icon={twitterIcon} width={24} height={24} />
        </MFab>
      }
      {
        !!discord&&
        <MFab size="small" color= {colorType} href={discord} target='_blank'>
          <Icon icon={discordIcon} width={24} height={24} />
        </MFab>
      }
      {
        !!telegram&&
        <MFab size="small" color= {colorType} href={telegram} target='_blank'>
          <TelegramIcon />
        </MFab>
      }
      {
        !!medium&&
        <MFab size="small" color= {colorType} href={medium} target='_blank'>
          <Icon icon={mediumIcon} width={24} height={24} />
        </MFab>
      }
    </Stack>
  );
}