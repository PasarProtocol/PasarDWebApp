import React from 'react';
import PropTypes from 'prop-types';
import prependHttp from 'prepend-http';
// material
import { Box, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import twitterIcon from '@iconify/icons-ant-design/twitter';
import mediumIcon from '@iconify/icons-ant-design/medium';
import TelegramIcon from '@mui/icons-material/Telegram';
import languageIcon from '@iconify/icons-ic/language';
import discordIcon from '@iconify/icons-ic/sharp-discord';

import useSettings from '../../hooks/useSettings';
import { MFab } from '../@material-extend';
// ----------------------------------------------------------------------

IconLinkButtonGroup.propTypes = {
  website: PropTypes.string,
  profile: PropTypes.string,
  feeds: PropTypes.string,
  twitter: PropTypes.string,
  discord: PropTypes.string,
  telegram: PropTypes.string,
  medium: PropTypes.string,
  align: PropTypes.string
};

export default function IconLinkButtonGroup(props) {
  const {
    website = '',
    profile = '',
    feeds = '',
    twitter = '',
    discord = '',
    telegram = '',
    medium = '',
    align = 'center'
  } = props;
  const { themeMode } = useSettings();
  const colorType = themeMode === 'light' ? 'primary' : 'default';
  return (
    <Stack spacing={1} direction="row" justifyContent={align}>
      {!!website && (
        <MFab size="small" color={colorType} href={prependHttp(website)} target="_blank" component="a">
          <Icon icon={languageIcon} width={24} height={24} />
        </MFab>
      )}
      {!!profile && (
        <MFab size="small" color={colorType} href={prependHttp(profile)} target="_blank">
          <Box
            component="img"
            src="/static/profile-icon.svg"
            width={20}
            height={20}
            sx={{ filter: themeMode === 'light' ? 'unset' : 'invert(1)' }}
          />
        </MFab>
      )}
      {!!feeds && (
        <MFab size="small" color={colorType} href={prependHttp(feeds)} target="_blank">
          <Box
            component="img"
            src="/static/empty-feeds-icon.svg"
            width={22}
            height={22}
            sx={{ filter: themeMode === 'light' ? 'unset' : 'invert(1)' }}
          />
        </MFab>
      )}
      {!!twitter && (
        <MFab size="small" color={colorType} href={prependHttp(twitter)} target="_blank">
          <Icon icon={twitterIcon} width={24} height={24} />
        </MFab>
      )}
      {!!discord && (
        <MFab size="small" color={colorType} href={prependHttp(discord)} target="_blank">
          <Icon icon={discordIcon} width={24} height={24} />
        </MFab>
      )}
      {!!telegram && (
        <MFab size="small" color={colorType} href={prependHttp(telegram)} target="_blank">
          <TelegramIcon />
        </MFab>
      )}
      {!!medium && (
        <MFab size="small" color={colorType} href={prependHttp(medium)} target="_blank">
          <Icon icon={mediumIcon} width={24} height={24} />
        </MFab>
      )}
    </Stack>
  );
}
