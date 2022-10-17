import React from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Grid,
  Typography,
  Link,
  InputLabel,
  Divider,
  FormControlLabel,
  Tooltip,
  Box,
  Paper
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { DefaultDIDAdapter, DIDBackend } from '@elastosfoundation/did-js-sdk';
import { Icon } from '@iconify/react';
import externalLinkFill from '@iconify/icons-eva/external-link-fill';

// components
import { MHidden } from '../../components/@material-extend';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import Page from '../../components/Page';
import RingAvatar from '../../components/RingAvatar';
import CustomSwitch from '../../components/custom-switch';
import ElastosConnectivityService from '../../utils/elastosConnectivityService';
import TransLoadingButton from '../../components/TransLoadingButton';
import KYCBadge from '../../components/badge/KYCBadge';
import DIABadge from '../../components/badge/DIABadge';
import IconLinkButtonGroup from '../../components/collection/IconLinkButtonGroup';
import {
  queryName,
  queryDescription,
  queryWebsite,
  queryTwitter,
  queryDiscord,
  queryTelegram,
  queryMedium,
  queryKycMe,
  updateName,
  updateDescription,
  updateWebsite,
  updateTwitter,
  updateDiscord,
  updateTelegram,
  updateMedium,
  updateKycMe,
  downloadAvatar
} from '../../components/signin-dlg/HiveAPI';
import { isInAppBrowser, getDiaTokenInfo, reduceHexAddress } from '../../utils/common';
import useSingin from '../../hooks/useSignin';
import { DidResolverUrl } from '../../config';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(13)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));
// ----------------------------------------------------------------------

const credentialItems = [
  { title: 'Name', description: 'name', id: 'name' },
  { title: 'Description', description: 'description', id: 'description' },
  { title: 'Website', description: 'website', id: 'website' },
  { title: 'Twitter', description: 'Twitter account', id: 'twitter' },
  { title: 'Discord', description: 'Discord account', id: 'discord' },
  { title: 'Telegram', description: 'Telegram account', id: 'telegram' },
  { title: 'Medium', description: 'Medium account', id: 'medium' },
  { title: 'KYC-me', description: 'KYC-me badge', id: 'KYC' }
];
const DescriptionStyle = {
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  display: '-webkit-box !important',
  fontWeight: 'normal',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word'
};
export default function EditProfile() {
  const [checkedItem, setCheckedItem] = React.useState(Array(8).fill(false));
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [onProgress, setOnProgress] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [badge, setBadge] = React.useState({ dia: 0, kyc: false });
  const [socials, setSocials] = React.useState({});
  const [updateState, setUpdateState] = React.useState(false);
  const [didInfo, setDidInfo] = React.useState({ name: '', description: '' });

  const { elaConnectivityService, setElastosConnectivityService } = useSingin();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const updateProfileData = [
    updateName,
    updateDescription,
    updateWebsite,
    updateTwitter,
    updateDiscord,
    updateTelegram,
    updateMedium,
    updateKycMe
  ];
  const queryProfileSocials = {
    website: queryWebsite,
    twitter: queryTwitter,
    discord: queryDiscord,
    telegram: queryTelegram,
    medium: queryMedium
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const connectivityService = new ElastosConnectivityService();
      setElastosConnectivityService(connectivityService);

      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2') navigate('/profile');
      else {
        const strWalletAddress = isInAppBrowser()
          ? await window.elastos.getWeb3Provider().address
          : essentialsConnector.getWalletConnectProvider().wc.accounts[0];
        setWalletAddress(strWalletAddress);

        getDiaTokenInfo(strWalletAddress).then((dia) => {
          if (dia !== '0') setBadgeFlag('dia', dia);
          else setBadgeFlag('dia', 0);
        });

        const targetDid = `did:elastos:${sessionStorage.getItem('PASAR_DID')}`;
        queryName(targetDid)
          .then((res) => {
            if (res.find_message && res.find_message.items.length) {
              setDidInfoValue('name', res.find_message.items[0].display_name);
              handleSetChecked(0);
            } else {
              setDidInfoValue('name', '');
            }

            queryDescription(targetDid).then((res) => {
              if (res.find_message && res.find_message.items.length) {
                setDidInfoValue('description', res.find_message.items[0].display_name);
                handleSetChecked(1);
              } else {
                setDidInfoValue('description', '');
              }
            });
            downloadAvatar(targetDid).then((res) => {
              if (res && res.length) {
                const base64Content = res.reduce((content, code) => {
                  content = `${content}${String.fromCharCode(code)}`;
                  return content;
                }, '');
                setAvatarUrl(`data:image/png;base64,${base64Content}`);
              }
            });
            queryKycMe(targetDid).then((res) => {
              if (res.find_message && res.find_message.items.length) {
                setBadgeFlag('kyc', true);
                handleSetChecked(7);
              } else setBadgeFlag('kyc', false);
            });
            Object.keys(queryProfileSocials).forEach((field, _i) => {
              queryProfileSocials[field](targetDid).then((res) => {
                if (res.find_message && res.find_message.items.length) {
                  setSocials((prevState) => {
                    const tempState = { ...prevState };
                    tempState[field] = res.find_message.items[0].display_name;
                    return tempState;
                  });
                  handleSetChecked(_i + 2);
                } else {
                  setSocials((prevState) => {
                    const tempState = { ...prevState };
                    delete tempState[field];
                    return tempState;
                  });
                }
              });
            });
          })
          .catch((e) => {
            enqueueSnackbar('Loading data failed', { variant: 'error' });
            console.log(e);
          });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState]);

  const handleSetChecked = (_i) => {
    setCheckedItem((prevState) => {
      const tempState = [...prevState];
      tempState[_i] = true;
      return tempState;
    });
  };

  const setDidInfoValue = (field, value) => {
    setDidInfo((prevState) => {
      const tempState = { ...prevState };
      tempState[field] = value;
      return tempState;
    });
  };

  const setBadgeFlag = (type, value) => {
    setBadge((prevState) => {
      const tempFlag = { ...prevState };
      tempFlag[type] = value;
      return tempFlag;
    });
  };

  const handleCheckItem = (event, i) => {
    setCheckedItem((prevState) => {
      const tempState = [...prevState];
      tempState[i] = event.target.checked;
      return tempState;
    });
  };

  const stopProvide = (errMsg) => {
    setOnProgress(false);
    enqueueSnackbar(errMsg, { variant: 'error' });
  };

  const handleSaveAction = async () => {
    setOnProgress(true);
    let kycVerifiablePresentation;
    const customItems = credentialItems.filter((item, i) => checkedItem[i]);
    try {
      if (customItems.length) {
        kycVerifiablePresentation = await elaConnectivityService.requestCustomCredentials(customItems);

        if (!kycVerifiablePresentation) {
          setOnProgress(false);
          return;
        }
        if (!DIDBackend.isInitialized()) {
          DIDBackend.initialize(new DefaultDIDAdapter(DidResolverUrl));
        }

        // Check presentation validity (genuine, not tampered)
        const valid = await kycVerifiablePresentation.isValid();
        if (!valid) {
          stopProvide('Invalid presentation');
          return;
        }

        // Get the presentation holder
        const presentationDID = kycVerifiablePresentation.getHolder().getMethodSpecificId();
        if (!presentationDID) {
          stopProvide('Unable to extract owner DID from the presentation');
          return;
        }

        // Make sure the holder of this presentation is the currently authentified user
        if (sessionStorage.getItem('PASAR_DID') !== presentationDID) {
          stopProvide('Presentation not issued by the currently authenticated user');
          return;
        }

        const credentials = kycVerifiablePresentation.getCredentials();
        if (!credentials.length) {
          stopProvide('Nothing to provide');
          return;
        }

        const profileData = credentials.reduce((props, c) => {
          props[c.id.fragment] = c.subject.properties[c.id.fragment];
          if (c.id.fragment === 'avatar') props[c.id.fragment] = props[c.id.fragment].data;
          return props;
        }, {});
        const birthDateCredential = credentials.find((c) => c.getType().indexOf('BirthDateCredential') >= 0);
        const genderCredential = credentials.find((c) => c.getType().indexOf('GenderCredential') >= 0);
        const countryCredential = credentials.find((c) => c.getType().indexOf('NationalityCredential') >= 0);
        if (!birthDateCredential && !genderCredential && !countryCredential && checkedItem[7]) {
          stopProvide('Nothing to provide KYC-me credentials');
          return;
        }
        await Promise.all(
          credentialItems.slice(0, credentialItems.length - 1).map((item, _i) => {
            const updateFunc = updateProfileData[_i];
            if (profileData[item.id] && checkedItem[_i]) return updateFunc(profileData[item.id], 'public');
            return updateFunc('', 'private');
          })
        );
        if (checkedItem[7] && profileData) {
          const { BirthDateCredential, GenderCredential, NationalityCredential } = profileData;
          const tempKYCdata = {
            birthdate: BirthDateCredential,
            gender: GenderCredential,
            country: NationalityCredential
          };
          await updateKycMe(JSON.stringify(tempKYCdata), 'public');
        } else {
          await updateKycMe('', 'private');
        }
      } else {
        const deleteProfileFuncArr = updateProfileData.map((func) => func('', 'private'));
        await Promise.all(deleteProfileFuncArr);
      }
      enqueueSnackbar('Save action success', { variant: 'success' });
      setUpdateState(!updateState);
      setOnProgress(false);
    } catch (error) {
      stopProvide('Request credentials error');
      try {
        await elaConnectivityService.disconnect();
      } catch (disconnectError) {
        // eslint-disable-next-line consistent-return
        return Promise.reject(disconnectError);
      }
      // eslint-disable-next-line consistent-return
      return Promise.reject(error);
    }
  };

  return (
    <RootStyle title="EditProfile | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{ mb: 3 }}>
          Edit Profile
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={7}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
              We do not store you personal information. Therefore, please choose your credentials from DID to display
              them on your public profile.
            </Typography>
          </Grid>
          <MHidden width="smUp">
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Avatar
              </Typography>
              <Paper
                sx={{ border: '1px solid', borderColor: 'action.disabledBackground', p: 3, mt: 3, textAlign: 'center' }}
              >
                <RingAvatar
                  address={walletAddress}
                  isImage={!!avatarUrl}
                  avatar={avatarUrl}
                  size={80}
                  outersx={{ m: 'auto' }}
                />
                <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
                  <Typography variant="h3">{didInfo.name || reduceHexAddress(walletAddress)}</Typography>
                  <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    {badge.kyc && (
                      <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                        <Box>
                          <KYCBadge />
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
                {didInfo.name && (
                  <Typography variant="subtitle2" sx={{ fontWeight: 'normal', fontSize: '0.925em' }}>
                    {reduceHexAddress(walletAddress)}
                  </Typography>
                )}
                {didInfo.description && (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'normal',
                      color: 'text.secondary',
                      pt: 1,
                      lineHeight: 1,
                      fontSize: '0.925em',
                      ...DescriptionStyle
                    }}
                  >
                    {didInfo.description}
                  </Typography>
                )}
                {Object.keys(socials).length > 0 && (
                  <Box sx={{ pt: 1.5 }}>
                    <IconLinkButtonGroup {...socials} />
                  </Box>
                )}
                <Stack spacing={0.5} direction="row" sx={{ justifyContent: 'center', pt: badge.dia > 0 ? 2 : 0 }}>
                  {badge.dia > 0 && <DIABadge balance={badge.dia} />}
                </Stack>
              </Paper>
            </Grid>
          </MHidden>
          <Grid item xs={12} sm={7}>
            <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
              {credentialItems.map((item, i) => (
                <Box key={i}>
                  <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                    {item.title}
                  </Typography>
                  <Stack direction="row">
                    <InputLabel sx={{ fontSize: 12, flex: 1 }}>Display {item.description}</InputLabel>
                    <FormControlLabel
                      checked={checkedItem[i]}
                      control={<CustomSwitch onChange={(event) => handleCheckItem(event, i)} />}
                      sx={{ mt: -1, mr: 0 }}
                      label=""
                    />
                  </Stack>
                  <Divider />
                  {item.title === 'KYC-me' && (
                    <Link href="http://kyc-me.io" target="_blank" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'origin.main' }}>
                        No such credentials yet? Get credentials on KYC-me.io now!
                      </Typography>
                      <Icon icon={externalLinkFill} width="15px" />
                    </Link>
                  )}
                </Box>
              ))}
              {/* <LoadingButton loading={onProgress} variant="contained" onClick={handleSaveAction} fullWidth>
              </LoadingButton> */}
            </Stack>
            <TransLoadingButton
              loading={onProgress}
              loadingText="Please Provide Credentials From Wallet"
              onClick={handleSaveAction}
              fullWidth
            >
              Save Credentials
            </TransLoadingButton>
          </Grid>
          <MHidden width="smDown">
            <Grid item sm={5}>
              <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                Preview
              </Typography>
              <Paper
                sx={{ border: '1px solid', borderColor: 'action.disabledBackground', p: 3, mt: 3, textAlign: 'center' }}
              >
                <RingAvatar
                  address={walletAddress}
                  isImage={!!avatarUrl}
                  avatar={avatarUrl}
                  size={110}
                  outersx={{ m: 'auto' }}
                />
                <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
                  <Typography variant="h3">{didInfo.name || reduceHexAddress(walletAddress)}</Typography>
                  <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    {badge.kyc && (
                      <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                        <Box>
                          <KYCBadge />
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
                {didInfo.name && (
                  <Typography variant="subtitle2" sx={{ fontWeight: 'normal', fontSize: '0.925em' }}>
                    {reduceHexAddress(walletAddress)}
                  </Typography>
                )}
                {didInfo.description && (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'normal',
                      color: 'text.secondary',
                      pt: 1,
                      lineHeight: 1,
                      fontSize: '0.925em',
                      ...DescriptionStyle
                    }}
                  >
                    {didInfo.description}
                  </Typography>
                )}
                {Object.keys(socials).length > 0 && (
                  <Box sx={{ pt: 1.5 }}>
                    <IconLinkButtonGroup {...socials} />
                  </Box>
                )}
                <Stack spacing={0.5} direction="row" sx={{ justifyContent: 'center', pt: badge.dia > 0 ? 2 : 0 }}>
                  {badge.dia > 0 && <DIABadge balance={badge.dia} />}
                </Stack>
              </Paper>
            </Grid>
          </MHidden>
        </Grid>
      </Container>
    </RootStyle>
  );
}
