import React from 'react';
import Web3 from 'web3';
import bs58 from 'bs58';
import raw from 'raw.macro';
import { useNavigate } from 'react-router-dom';
import { isString } from 'lodash';
import { isMobile } from 'react-device-detect';
import CancelablePromise from 'cancelable-promise';
import { styled } from '@mui/material/styles';
import {
  Container,
  Stack,
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
import StandardTypeButton from '../../components/collection/StandardTypeButton';
import { InputStyle, InputLabelStyle, TextFieldStyle } from '../../components/CustomInput';
import CreateItemDlg from '../../components/dialog/CreateItem';
import RegisterCollectionDlg from '../../components/dialog/RegisterCollection';
import NeedMoreDIADlg from '../../components/dialog/NeedMoreDIA';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';

import { REGISTER_CONTRACT_ABI } from '../../abi/registerABI';
import { TOKEN_721_ABI } from '../../abi/token721ABI';
import { TOKEN_1155_ABI } from '../../abi/token1155ABI';
import { blankAddress, diaContract as DIA_TOKEN_ADDRESS, ipfsURL, tokenConf } from '../../config';
import useOffSetTop from '../../hooks/useOffSetTop';
import useSingin from '../../hooks/useSignin';

import { requestSigndataOnTokenID } from '../../utils/elastosConnectivityService';
import {
  isInAppBrowser,
  removeLeadingZero,
  isNumberString,
  getChainTypeFromId,
  socialTypes,
  getDiaBalanceDegree,
  getFilteredGasPrice,
  getContractAddressInCurrentNetwork,
  fetchAPIFrom
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

const tokenStandard = {
  'ERC-721': { abi: TOKEN_721_ABI, code: 'token721.code' },
  'ERC-1155': { abi: TOKEN_1155_ABI, code: 'token1155.code' }
};
const _gasLimit = 5000000;
export default function CreateCollection() {
  const [address, setAddress] = React.useState('');
  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [standard, setStandard] = React.useState('ERC-721');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [backgroundFile, setBackgroundFile] = React.useState(null);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const [recipientRoyaltiesGroup, setRecipientRoyaltiesGroup] = React.useState([{ address: '', royalties: '' }]);
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
  const [current, setCurrent] = React.useState(1);
  const [currentPromise, setCurrentPromise] = React.useState(null);
  const [isOpenRegCollection, setOpenRegCollectionDlg] = React.useState(false);
  const [isCreateItemOpen, setOpenCreateItem] = React.useState(false);
  const [baseToken, setBaseToken] = React.useState('');
  const [isReadySignForRegister, setReadySignForRegister] = React.useState(false);
  const [moreDIAOpen, setOpenMoreDIA] = React.useState(false);
  const [collectionCount, setCollectionCount] = React.useState(0);

  const nameRef = React.useRef();
  const symbolRef = React.useRef();
  const uploadAvatarRef = React.useRef();
  const uploadBackgroundRef = React.useRef();
  const descriptionRef = React.useRef();

  const { diaBalance, pasarLinkChain } = useSingin();
  const { enqueueSnackbar } = useSnackbar();
  const isOffset = useOffSetTop(40);
  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 88;
  const navigate = useNavigate();
  const chainType = getChainTypeFromId(pasarLinkChain);

  React.useEffect(() => {
    const fetchData = async () => {
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2') navigate('/marketplace');
      if (isInAppBrowser()) setAddress(await window.elastos.getWeb3Provider().address);
      else if (essentialsConnector.getWalletConnectProvider())
        setAddress(essentialsConnector.getWalletConnectProvider().wc.accounts[0]);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setRecipientRoyaltiesGroup((prevState) => {
        const tempState = [{ address, royalties: '10' }, ...prevState];
        return tempState;
      });
      try {
        const res = await fetchAPIFrom(`api/v1/getCollectionsByWalletAddr?pageNum=1&pageSize=1&chain=all&walletAddr=${address}`, {});
        const json = await res.json();
        setCollectionCount(json?.data.total ?? 0);
      } catch (e) {
        console.error(e);
      }
    };
    if (address) fetchData();
  }, [address]);

  React.useEffect(() => {
    if (!isOpenRegCollection) {
      if (currentPromise) currentPromise.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenRegCollection]);

  const handleInputName = (e) => {
    setName(e.target.value);
  };
  const handleInputSymbol = (e) => {
    setSymbol(e.target.value);
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

  const handleRecipientRoyaltiesGroup = (key, index, e) => {
    let inputValue = e.target.value;
    if (key === 'royalties') {
      if (inputValue.length > 0 && !isNumberString(inputValue)) return;
      if (inputValue < 0 || inputValue > 30) return;
      inputValue = removeLeadingZero(inputValue);
    }
    const temp = [...recipientRoyaltiesGroup];
    temp[index][key] = inputValue;
    if (!temp[index].address.length && !temp[index].royalties.length) {
      if (temp.length > 1 && index < temp.length - 1) temp.splice(index, 1);
      if (temp.findIndex((item) => !item.address.length || !item.royalties.length) < 0 && temp.length < 3)
        temp.push({ address: '', royalties: '' });
    } else if (!temp[index].address.length || !temp[index].royalties.length) {
      if (!temp[temp.length - 1].address.length && !temp[temp.length - 1].royalties.length)
        temp.splice(temp.length - 1, 1);
    } else if (temp[index].address.length && temp[index].royalties.length) {
      if (temp.findIndex((item) => !item.address.length || !item.royalties.length) < 0 && temp.length < 3)
        temp.push({ address: '', royalties: '' });
    }
    setRecipientRoyaltiesGroup(temp);
  };

  let duproperties = {};
  recipientRoyaltiesGroup.forEach((item, index) => {
    if (!item.address.length) return;
    duproperties[item.address] = duproperties[item.address] || [];
    duproperties[item.address].push(index);
  });
  duproperties = Object.keys(duproperties)
    .filter((key) => duproperties[key].length > 1)
    .reduce((obj, key) => {
      obj.push(key);
      return obj;
    }, []);

  const handleInputSocials = (value, type) => {
    const tempUrls = { ...socialUrl };
    tempUrls[type] = value;
    setSocialUrl(tempUrls);
  };
  const getUrlfromFile = (file) => {
    if (!file) return '';
    return isString(file) ? file : file.preview;
  };
  const sendIpfsImage = (f) =>
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log('cancel ipfs');
        setOnProgress(false);
      });

      const reader = new window.FileReader();
      reader.readAsArrayBuffer(f);
      reader.onloadend = async () => {
        try {
          const fileContent = Buffer.from(reader.result);
          const added = await client.add(fileContent);
          console.log(added);
          resolve({ origin: { ...added }, type: f.type });
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
          const metaObj = {
            version: '1',
            creator: creatorObj,
            data: dataObj
          };
          console.log(metaObj);
          try {
            const jsonMetaObj = JSON.stringify(metaObj);
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
      let avatarSrc = '';
      let backgroundSrc = '';
      onCancel(() => {
        console.log('cancel upload');
        setOnProgress(false);
      });

      let temPromise = sendIpfsImage(avatarFile);
      setCurrentPromise(temPromise);
      temPromise
        .then((added) => {
          avatarSrc = `pasar:image:${added.origin.path}`;
          temPromise = sendIpfsImage(backgroundFile);
          setCurrentPromise(temPromise);
          return temPromise;
        })
        .then((added) => {
          backgroundSrc = `pasar:image:${added.origin.path}`;
          temPromise = sendIpfsMetaJson(avatarSrc, backgroundSrc);
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
  const deployContract = (paramObj) =>
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log('cancel deploy');
        setOnProgress(false);
      });

      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2') {
        reject(new Error());
        return;
      }
      const diaTokenValue = BigInt(
        (10 ** tokenConf.diaDecimals * tokenConf.diaValue * tokenConf.nPPM) / tokenConf.PPM
      ).toString();
      let deployArgs = [name, symbol, paramObj._uri, DIA_TOKEN_ADDRESS, diaTokenValue];
      if (chainType !== 'ESC') deployArgs = [name, symbol, paramObj._uri, blankAddress, '0'];
      const walletConnectWeb3 = new Web3(
        isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider()
      );
      walletConnectWeb3.eth
        .getAccounts()
        .then((accounts) => {
          const { abi: tokenABI, code: tokenCode } = tokenStandard[standard];
          let registerContract = new walletConnectWeb3.eth.Contract(tokenABI);
          walletConnectWeb3.eth
            .getGasPrice()
            .then((_gasPrice) => {
              const gasPrice = getFilteredGasPrice(_gasPrice);
              registerContract = registerContract.deploy({
                data: '0x'.concat(raw(`../../bytecode/${tokenCode}`)),
                arguments: deployArgs
              });
              const transactionParams = {
                from: accounts[0],
                gas: _gasLimit,
                gasPrice
              };
              if (isInAppBrowser()) transactionParams.to = '';
              registerContract
                .send(transactionParams)
                .then((newContractInstance) => {
                  console.log('Contract deployed at address: ', newContractInstance.options.address);
                  resolve({ _uri: paramObj._uri, _address: newContractInstance.options.address });
                })
                .catch((error) => {
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
  const registerCollection = (paramObj) =>
    new CancelablePromise((resolve, reject, onCancel) => {
      const propertiesObj = recipientRoyaltiesGroup.reduce(
        (obj, item) => {
          if (item.address !== '' && item.royalties !== '') {
            obj.owners.push(item.address);
            obj.feeRates.push(item.royalties * 10000);
          }
          return obj;
        },
        { owners: [], feeRates: [] }
      );

      onCancel(() => {
        console.log('cancel register');
        setOnProgress(false);
        setCurrent(1);
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
              registerContract.methods
                .registerToken(paramObj._address, name, paramObj._uri, propertiesObj.owners, propertiesObj.feeRates)
                .send(transactionParams)
                .on('receipt', (receipt) => {
                  setReadySignForRegister(false);
                  setBaseToken(paramObj._address);
                  console.log('receipt', receipt);
                  resolve(true);
                  setTimeout(() => {navigate('/profile/myitem/5');}, 2000)
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
  const createCollection = () => {
    setOnProgress(true);
    setOpenRegCollectionDlg(true);
    let temPromise = uploadData();
    setCurrentPromise(temPromise);
    temPromise
      .then((paramObj) => {
        temPromise = deployContract(paramObj);
        setCurrentPromise(temPromise);
        return temPromise;
      })
      .then((paramObj) => {
        setCurrent(2);
        temPromise = registerCollection(paramObj);
        setCurrentPromise(temPromise);
        return temPromise;
      })
      .then((success) => {
        if (success) {
          enqueueSnackbar('Create collection success!', { variant: 'success' });
          setOpenCreateItem(true);
        } else enqueueSnackbar('Create collection error!', { variant: 'error' });
        setOnProgress(false);
        setOpenRegCollectionDlg(false);
        setCurrentPromise(null);
        setCurrent(1);
      })
      .catch((e) => {
        console.error(e);
        enqueueSnackbar('Create collection error!', { variant: 'error' });
        setOnProgress(false);
        setOpenRegCollectionDlg(false);
        setCurrentPromise(null);
        setCurrent(1);
      });
  };
  const scrollToRef = (ref) => {
    if (!ref.current) return;
    let fixedHeight = isOffset ? APP_BAR_DESKTOP - 16 : APP_BAR_DESKTOP;
    fixedHeight = isMobile ? APP_BAR_MOBILE : fixedHeight;
    window.scrollTo({ top: ref.current.offsetTop - fixedHeight, behavior: 'smooth' });
  };
  const handleCreateAction = () => {
    const degree = getDiaBalanceDegree(diaBalance, pasarLinkChain);
    setOnValidation(true);
    if (!name.length) scrollToRef(nameRef);
    else if (!symbol.length) scrollToRef(symbolRef);
    else if (!avatarFile) scrollToRef(uploadAvatarRef);
    else if (!backgroundFile) scrollToRef(uploadBackgroundRef);
    else if (!description.length) scrollToRef(descriptionRef);
    else if (
      duproperties.length ||
      recipientRoyaltiesGroup.filter((el) => el.address.length > 0 && !el.royalties.length).length
    )
      enqueueSnackbar('Fee recipient properties are invalid.', { variant: 'warning' });
    else if (
      recipientRoyaltiesGroup.filter(
        (el) => el.address.length % 42 || (el.address.length === 42 && !Web3.utils.isAddress(el.address))
      ).length
    )
      enqueueSnackbar('Fee recipient address is invalid.', { variant: 'warning' });
    else if (recipientRoyaltiesGroup.reduce((sum, el) => (sum += el.royalties * 1), 0) > 30)
      enqueueSnackbar('Total royalties must not be more than 30%', { variant: 'warning' });
    else if (
      chainType === 'ESC' &&
      ((degree === 0 && collectionCount >= 1) ||
        (degree === 1 && collectionCount >= 2) ||
        (degree === 2 && collectionCount >= 5) ||
        (degree === 3 && collectionCount >= 10))
    )
      setOpenMoreDIA(true);
    else createCollection();
  };
  return (
    <RootStyle title="CreateCollection | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{ mb: 3 }}>
          Create Collection
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" sx={{ fontWeight: 'normal', color: 'text.secondary' }}>
              Create an ERC-721 collection on the Elastos Smart Chain Mainnet Network
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" sx={{ fontWeight: 'normal', pb: 1 }}>
              Token Standard
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'end' }}>
              <Box>
                <Typography variant="subtitle2" align="center" sx={{ mb: 0.5 }}>
                  <span role="img" aria-label="">
                    🔥
                  </span>{' '}
                  Recommended
                </Typography>
                <StandardTypeButton
                  type="ERC-721"
                  description="Non-fungible token"
                  onClick={() => {
                    setStandard('ERC-721');
                  }}
                  current={standard}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8} ref={nameRef}>
            <Typography variant="h4" sx={{ fontWeight: 'normal', pb: 1 }}>
              Collection Name
            </Typography>
            <FormControl error={isOnValidation && !name.length} variant="standard" sx={{ width: '100%' }}>
              <InputLabelStyle htmlFor="input-with-name">Enter collection name</InputLabelStyle>
              <InputStyle
                id="input-with-name"
                startAdornment={' '}
                value={name}
                onChange={handleInputName}
                aria-describedby="name-error-text"
                inputProps={{
                  maxLength: 30
                }}
              />
              <FormHelperText id="name-error-text" hidden={!isOnValidation || (isOnValidation && name.length > 0)}>
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
              <InputLabelStyle htmlFor="input-with-name">Enter token symbol (Example: PSRC)</InputLabelStyle>
              <InputStyle
                id="input-with-name"
                startAdornment={' '}
                value={symbol}
                onChange={handleInputSymbol}
                aria-describedby="name-error-text"
                inputProps={{
                  maxLength: 15
                }}
              />
              <FormHelperText id="name-error-text" hidden={!isOnValidation || (isOnValidation && symbol.length > 0)}>
                Symbol is required
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
              error={isOnValidation && !avatarFile}
              onDrop={handleDropAvatarFile}
              onRemove={handleRemoveAvatar}
              accept=".jpg, .png, .jpeg, .gif"
            />
            <FormHelperText
              error={isOnValidation && !avatarFile}
              hidden={!isOnValidation || (isOnValidation && avatarFile !== null)}
            >
              Image file is required
            </FormHelperText>

            <Typography variant="h4" sx={{ fontWeight: 'normal', py: 1 }} ref={uploadBackgroundRef}>
              Background Image
            </Typography>
            <UploadSingleFile
              file={backgroundFile}
              error={isOnValidation && !backgroundFile}
              onDrop={handleDropBackgroundFile}
              onRemove={handleRemoveBackground}
              accept=".jpg, .png, .jpeg, .gif"
            />
            <FormHelperText
              error={isOnValidation && !backgroundFile}
              hidden={!isOnValidation || (isOnValidation && backgroundFile !== null)}
            >
              Image file is required
            </FormHelperText>

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

            <Typography variant="h4" component="div" sx={{ fontWeight: 'normal', py: 1 }}>
              Fee Recipient Address & Royalties
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Typography variant="caption" sx={{ display: 'block', pl: '15px', pb: '10px' }}>
                  Fee Recipient Address
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ display: 'block', pl: '15px', pb: '10px' }}>
                  Royalties (%)
                </Typography>
              </Grid>
            </Grid>
            {recipientRoyaltiesGroup.map((item, index) => {
              const addressErrFlag =
                isOnValidation &&
                (duproperties.includes(item.address) ||
                  item.address.length % 42 > 0 ||
                  (item.address.length === 42 && !Web3.utils.isAddress(item.address)));
              let addressErrText = '';
              if (isOnValidation && item.address.length % 42) addressErrText = 'Not a valid address';
              else if (isOnValidation && item.address.length === 42 && !Web3.utils.isAddress(item.address))
                addressErrText = 'Not a valid address';
              else if (isOnValidation && duproperties.includes(item.address)) addressErrText = 'Duplicated address';

              return (
                <Grid container spacing={1} key={index} sx={index ? { mt: 1 } : {}}>
                  <Grid item xs={8}>
                    <TextFieldStyle
                      label="Example: 0x012...ABC"
                      size="small"
                      fullWidth
                      inputProps={{ maxLength: 42 }}
                      value={item.address}
                      onChange={(e) => {
                        handleRecipientRoyaltiesGroup('address', index, e);
                      }}
                      error={addressErrFlag}
                      helperText={addressErrText}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextFieldStyle
                      // type="number"
                      label="Example: 10"
                      size="small"
                      fullWidth
                      value={item.royalties}
                      onChange={(e) => {
                        handleRecipientRoyaltiesGroup('royalties', index, e);
                      }}
                      error={isOnValidation && item.address.length > 0 && !item.royalties.length}
                      helperText={
                        isOnValidation && item.address.length > 0 && !item.royalties.length ? 'Can not be empty.' : ''
                      }
                    />
                  </Grid>
                </Grid>
              );
            })}
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
                    name,
                    description,
                    owner: address,
                    avatar: getUrlfromFile(avatarFile),
                    background: getUrlfromFile(backgroundFile)
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TransLoadingButton
              loading={onProgress}
              loadingText="Please wait while create collection"
              onClick={handleCreateAction}
              fullWidth
            >
              Create
            </TransLoadingButton>
          </Grid>
        </Grid>
      </Container>
      <RegisterCollectionDlg
        type={1}
        current={current}
        isOpenDlg={isOpenRegCollection}
        setOpenDlg={setOpenRegCollectionDlg}
        isReadySign={isReadySignForRegister}
      />
      <CreateItemDlg isOpen={isCreateItemOpen} setOpen={setOpenCreateItem} token={baseToken} />
      <NeedMoreDIADlg
        isOpen={moreDIAOpen}
        setOpen={setOpenMoreDIA}
        balance={diaBalance}
        actionText="create more collections"
      />
    </RootStyle>
  );
}
