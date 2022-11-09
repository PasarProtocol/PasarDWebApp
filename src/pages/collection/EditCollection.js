import React from 'react';
import Web3 from 'web3';
import bs58 from 'bs58';
import { useNavigate, useLocation } from 'react-router-dom';
import { isString } from 'lodash';
import { isMobile } from 'react-device-detect';
import CancelablePromise from 'cancelable-promise';
import { styled } from '@mui/material/styles';
import {
  Container,
  Grid,
  Typography,
  FormControl,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormHelperText
} from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { create } from 'ipfs-http-client';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import Page from '../../components/Page';
import { UploadSingleFile } from '../../components/upload';
import TransLoadingButton from '../../components/TransLoadingButton';
import CollectionCard from '../../components/collection/CollectionCard';
import CategorySelect from '../../components/collection/CategorySelect';
import { InputStyle, InputLabelStyle } from '../../components/CustomInput';
import RegisterCollectionDlg from '../../components/dialog/RegisterCollection';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import LoadingScreen from '../../components/LoadingScreen';
import LoadingWrapper from '../../components/LoadingWrapper';
import { REGISTER_CONTRACT_ABI } from '../../abi/registerABI';
import { ipfsURL } from '../../config';
import useOffSetTop from '../../hooks/useOffSetTop';
import useSingin from '../../hooks/useSignin';
import { requestSigndataOnTokenID } from '../../utils/elastosConnectivityService';
import {
  isInAppBrowser,
  getFilteredGasPrice,
  socialTypes,
  getContractAddressInCurrentNetwork,
  fetchAPIFrom,
  getImageFromIPFSUrl
} from '../../utils/common';
// ----------------------------------------------------------------------

const client = create(`${ipfsURL}/`);
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
const _gasLimit = 5000000;
export default function EditCollection() {
  const location = useLocation();
  const { chain, token } = location.state || {};
  const [isLoadingCollection, setLoadingCollection] = React.useState(false);
  const [collectionName, setCollectionName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [collection, setCollection] = React.useState({});
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [backgroundFile, setBackgroundFile] = React.useState(null);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const [socialUrl, setSocialUrl] = React.useState({
    website: '',
    profile: '',
    feeds: '',
    twitter: '',
    discord: '',
    telegram: '',
    medium: ''
  });
  const [onProgress, setOnProgress] = React.useState(false);
  const [currentPromise, setCurrentPromise] = React.useState(null);
  const [isOpenRegCollection, setOpenRegCollectionDlg] = React.useState(false);
  const [isReadySignForRegister, setReadySignForRegister] = React.useState(false);

  const nameRef = React.useRef();
  const symbolRef = React.useRef();
  const uploadAvatarRef = React.useRef();
  const uploadBackgroundRef = React.useRef();
  const descriptionRef = React.useRef();

  const { pasarLinkChain } = useSingin();
  const { enqueueSnackbar } = useSnackbar();
  const isOffset = useOffSetTop(40);
  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 88;
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2') navigate('/marketplace');

      setLoadingCollection(true);
      try {
        const res = await fetchAPIFrom(`api/v1/getCollectionInfo?chain=${chain}&collection=${token}`);
        const json = await res.json();
        setCollectionName(json?.data?.name || '');
        setSymbol(json?.data?.symbol || '');
        setDescription(json?.data?.data?.description);
        setCollection(json?.data || {});
        if (json?.data?.data?.category)
          setCategory(`${json.data.data.category.charAt(0).toUpperCase()}${json.data.data.category.slice(1)}`);
        if (json?.data?.data?.socials) setSocialUrl(json.data.data.socials);
      } catch (e) {
        console.error(e);
      }
      setLoadingCollection(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!isOpenRegCollection) {
      if (currentPromise) currentPromise.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenRegCollection]);

  const handleInputName = (e) => {
    setCollectionName(e.target.value);
  };

  const dropFileAction = (acceptedFiles, type) => {
    const accepted = acceptedFiles[0];
    if (accepted) {
      const tempFileObj = Object.assign(accepted, { preview: URL.createObjectURL(accepted) });
      if (type === 1) setAvatarFile(tempFileObj);
      else setBackgroundFile(tempFileObj);
    }
  };
  const handleDropAvatarFile = React.useCallback((acceptedFiles) => {
    dropFileAction(acceptedFiles, 1);
  }, []);
  const handleDropBackgroundFile = React.useCallback((acceptedFiles) => {
    dropFileAction(acceptedFiles, 2);
  }, []);
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
  };
  const handleRemoveBackground = () => {
    setBackgroundFile(null);
  };

  const handleInputSocials = (value, type) => {
    const tempUrls = { ...socialUrl };
    tempUrls[type] = value;
    setSocialUrl(tempUrls);
  };
  const getUrlfromFile = (file) => {
    if (!file) return '';
    return isString(file) ? file : file.preview;
  };
  const sendIpfsImage = (f, type) =>
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log('cancel ipfs');
        setOnProgress(false);
      });
      if (!f) {
        resolve(type === 'avatar' ? collection?.data?.avatar : collection?.data?.description);
        return;
      }
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(f);
      reader.onloadend = async () => {
        try {
          const fileContent = Buffer.from(reader.result);
          const added = await client.add(fileContent);
          console.log(added);
          const imageSrc = `pasar:image:${added.path}`;
          resolve(imageSrc);
        } catch (error) {
          reject(error);
        }
      };
    });
  const sendIpfsMetaJson = (avatar, background) =>
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log('cancel meta');
        setOnProgress(false);
      });

      // create the metadata object we'll be storing
      const did = sessionStorage.getItem('PASAR_DID') || '';
      const token = sessionStorage.getItem('PASAR_TOKEN');
      const user = jwtDecode(token);
      const { name, bio } = user;
      const proof = sessionStorage.getItem('KYCedProof') || '';
      const creatorObj = {
        did: `did:elastos:${did}`,
        name: name || '',
        description: bio || ''
      };
      if (proof.length) {
        creatorObj.KYCedProof = proof;
      }
      const dataObj = { avatar, background, description, category: category.toLowerCase(), socials: socialUrl };
      const plainBuffer = Buffer.from(JSON.stringify(dataObj));
      const plainText = bs58.encode(plainBuffer);
      requestSigndataOnTokenID(plainText)
        .then((rsp) => {
          // create the metadata object we'll be storing
          creatorObj.signature = rsp.signature;
          try {
            const jsonMetaObj = JSON.stringify({
              version: '1',
              creator: creatorObj,
              data: dataObj
            });
            // add the metadata itself as well
            const metaRecv = Promise.resolve(client.add(jsonMetaObj));
            resolve(metaRecv);
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  const uploadData = () =>
    new CancelablePromise((resolve, reject, onCancel) => {
      let avatarUri = '';
      onCancel(() => {
        console.log('cancel upload');
        setOnProgress(false);
      });

      let temPromise = sendIpfsImage(avatarFile, 'avatar');
      setCurrentPromise(temPromise);
      temPromise
        .then((imageSrc) => {
          avatarUri = imageSrc;
          temPromise = sendIpfsImage(backgroundFile, 'background');
          setCurrentPromise(temPromise);
          return temPromise;
        })
        .then((backgroundUri) => {
          temPromise = sendIpfsMetaJson(avatarUri, backgroundUri);
          setCurrentPromise(temPromise);
          return temPromise;
        })
        .then((metaRecv) => {
          const _uri = `pasar:json:${metaRecv.path}`;
          resolve({ _uri });
        })
        .catch((error) => {
          reject(error);
        });
    });

  const updateInfo = (paramObj) =>
    new CancelablePromise((resolve, reject, onCancel) => {
      console.log(paramObj);
      onCancel(() => {
        console.log('cancel update');
        setOnProgress(false);
      });

      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2') {
        reject(new Error());
        return;
      }

      const RegContractAddress = getContractAddressInCurrentNetwork(pasarLinkChain, 'register');
      const walletConnectWeb3 = new Web3(
        isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider()
      );
      walletConnectWeb3.eth
        .getAccounts()
        .then((accounts) => {
          const registerContract = new walletConnectWeb3.eth.Contract(REGISTER_CONTRACT_ABI, RegContractAddress);
          walletConnectWeb3.eth
            .getGasPrice()
            .then((_gasPrice) => {
              const gasPrice = getFilteredGasPrice(_gasPrice);
              console.log('Gas price:', gasPrice);

              console.log('Sending transaction with account address:', accounts[0]);
              const transactionParams = {
                from: accounts[0],
                gasPrice,
                gas: _gasLimit,
                value: 0
              };
              setReadySignForRegister(true);
              console.log(collectionName);
              registerContract.methods
                .updateTokenInfo(token, collectionName, paramObj._uri)
                .send(transactionParams)
                .on('receipt', (receipt) => {
                  setReadySignForRegister(false);
                  console.log('receipt', receipt);
                  resolve(true);
                })
                .on('error', (error) => {
                  console.error('error', error);
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  const updateCollection = () => {
    setOnProgress(true);
    setOpenRegCollectionDlg(true);
    let temPromise = uploadData();
    setCurrentPromise(temPromise);
    temPromise
      .then((paramObj) => {
        temPromise = updateInfo(paramObj);
        setCurrentPromise(temPromise);
        return temPromise;
      })
      .then((success) => {
        if (success) {
          enqueueSnackbar('Update collection success!', { variant: 'success' });
        } else enqueueSnackbar('Update collection error!', { variant: 'error' });
        setOnProgress(false);
        setOpenRegCollectionDlg(false);
        setCurrentPromise(null);
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar('Update collection error!', { variant: 'error' });
        setOnProgress(false);
        setOpenRegCollectionDlg(false);
        setCurrentPromise(null);
      });
  };
  const scrollToRef = (ref) => {
    if (!ref.current) return;
    let fixedHeight = isOffset ? APP_BAR_DESKTOP - 16 : APP_BAR_DESKTOP;
    fixedHeight = isMobile ? APP_BAR_MOBILE : fixedHeight;
    window.scrollTo({ top: ref.current.offsetTop - fixedHeight, behavior: 'smooth' });
  };
  const handleUpdateAction = () => {
    setOnValidation(true);
    if (!collectionName.length) scrollToRef(nameRef);
    else if (!symbol.length) scrollToRef(symbolRef);
    else if (!description.length) scrollToRef(descriptionRef);
    else updateCollection();
  };

  return (
    <RootStyle title="EditCollection | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{ mb: 3 }}>
          Edit Collection
        </Typography>
        {isLoadingCollection ? (
          <LoadingWrapper>
            <LoadingScreen />
          </LoadingWrapper>
        ) : (
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} sm={8} ref={nameRef}>
              <Typography variant="h4" sx={{ fontWeight: 'normal', pb: 1 }}>
                Collection Name
              </Typography>
              <FormControl error={isOnValidation && !collectionName.length} variant="standard" sx={{ width: '100%' }}>
                <InputStyle
                  id="input-with-name"
                  startAdornment={' '}
                  value={collectionName}
                  onChange={handleInputName}
                  aria-describedby="name-error-text"
                  inputProps={{
                    maxLength: 30
                  }}
                />
                <FormHelperText
                  id="name-error-text"
                  hidden={!isOnValidation || (isOnValidation && collectionName.length > 0)}
                >
                  Name is required
                </FormHelperText>
              </FormControl>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={8} ref={symbolRef}>
              <Typography variant="h4" sx={{ fontWeight: 'normal', pb: 1 }}>
                Symbol
              </Typography>
              <FormControl error={isOnValidation && !symbol.length} variant="standard" sx={{ width: '100%' }}>
                <InputStyle
                  startAdornment={' '}
                  value={symbol}
                  readOnly={Boolean(true)}
                  aria-describedby="symbol-error-text"
                  inputProps={{
                    maxLength: 15
                  }}
                />
                <FormHelperText
                  id="symbol-error-text"
                  hidden={!isOnValidation || (isOnValidation && symbol.length > 0)}
                >
                  Symbol is not exist
                </FormHelperText>
              </FormControl>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" sx={{ fontWeight: 'normal', pb: 1 }} ref={uploadAvatarRef}>
                Avatar
              </Typography>
              <UploadSingleFile
                file={avatarFile}
                onDrop={handleDropAvatarFile}
                onRemove={handleRemoveAvatar}
                accept=".jpg, .png, .jpeg, .gif"
              />

              <Typography variant="h4" sx={{ fontWeight: 'normal', py: 1 }} ref={uploadBackgroundRef}>
                Background Image
              </Typography>
              <UploadSingleFile
                file={backgroundFile}
                onDrop={handleDropBackgroundFile}
                onRemove={handleRemoveBackground}
                accept=".jpg, .png, .jpeg, .gif"
              />

              <Typography variant="h4" sx={{ fontWeight: 'normal', py: 1 }} ref={descriptionRef}>
                Description
              </Typography>
              <FormControl error={isOnValidation && !description.length} variant="standard" sx={{ width: '100%' }}>
                <InputLabelStyle
                  htmlFor="input-with-description"
                  sx={{
                    whiteSpace: 'break-spaces',
                    width: 'calc(100% / 0.75)',
                    position: 'relative',
                    transformOrigin: 'left'
                  }}
                >
                  Add collection description
                </InputLabelStyle>
                <InputStyle
                  id="input-with-description"
                  startAdornment={' '}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-describedby="description-error-text"
                  sx={{ mt: '-5px !important' }}
                  multiline={Boolean(true)}
                  inputProps={{
                    maxLength: 500
                  }}
                />
                <FormHelperText
                  id="description-error-text"
                  hidden={!isOnValidation || (isOnValidation && description.length > 0)}
                >
                  Description is required
                </FormHelperText>
              </FormControl>
              <Divider />

              <Typography variant="h4" sx={{ fontWeight: 'normal', py: 1 }}>
                Category
              </Typography>
              <CategorySelect selected={category} onChange={setCategory} />

              <Grid item xs={12}>
                <Accordion sx={{ bgcolor: 'unset' }}>
                  <AccordionSummary
                    expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                    sx={{ pl: 0 }}
                  >
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'normal' }}>
                      Socials&nbsp;
                      <Typography variant="caption" sx={{ color: 'origin.main' }}>
                        Optional
                      </Typography>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {socialTypes.map((type, index) => (
                      <Box key={index}>
                        <Typography variant="h4" sx={{ fontWeight: 'normal', color: 'origin.main' }}>
                          {type}
                        </Typography>
                        <FormControl variant="standard" sx={{ width: '100%' }}>
                          <InputLabelStyle
                            htmlFor={`input-with-${type}`}
                            sx={{
                              whiteSpace: 'break-spaces',
                              width: 'calc(100% / 0.75)',
                              position: 'relative',
                              transformOrigin: 'left'
                            }}
                          >
                            Add {type} URL
                          </InputLabelStyle>
                          <InputStyle
                            id={`input-with-${type}`}
                            startAdornment={' '}
                            value={socialUrl[type.toLowerCase()]}
                            onChange={(e) => handleInputSocials(e.target.value, type.toLowerCase())}
                            sx={{ mt: '-5px !important' }}
                          />
                        </FormControl>
                        <Divider />
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid
                container
                direction="column"
                spacing={1}
                sx={{ position: 'sticky', top: isOffset ? APP_BAR_DESKTOP - 16 : APP_BAR_DESKTOP }}
              >
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 'normal' }}>
                    Preview
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <CollectionCard
                    isPreview={Boolean(true)}
                    info={{
                      ...collection,
                      data: {
                        ...collection?.data,
                        avatar: avatarFile ? getUrlfromFile(avatarFile) : getImageFromIPFSUrl(collection?.data?.avatar),
                        background: backgroundFile
                          ? getUrlfromFile(backgroundFile)
                          : getImageFromIPFSUrl(collection?.data?.background)
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TransLoadingButton
                loading={onProgress}
                loadingText="Please wait while update collection"
                onClick={handleUpdateAction}
                fullWidth
              >
                Save
              </TransLoadingButton>
            </Grid>
          </Grid>
        )}
      </Container>
      <RegisterCollectionDlg
        type={2}
        isOpenDlg={isOpenRegCollection}
        setOpenDlg={setOpenRegCollectionDlg}
        isReadySign={isReadySignForRegister}
      />
    </RootStyle>
  );
}
