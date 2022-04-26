import React from 'react';
import Web3 from 'web3';
import bs58 from 'bs58'
import { useNavigate } from 'react-router-dom';
import { isString } from 'lodash';
import { isMobile } from 'react-device-detect';
import CancelablePromise from 'cancelable-promise';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip, Box,
  Accordion, AccordionSummary, AccordionDetails, FormHelperText } from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import checkCircleIcon from '@iconify-icons/akar-icons/circle-check-fill';
import { create, urlSource } from 'ipfs-http-client';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';

// components
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import { UploadSingleFile } from '../../components/upload';
import TransLoadingButton from '../../components/TransLoadingButton';
import CollectionCard from '../../components/collection/CollectionCard';
import CategorySelect from '../../components/collection/CategorySelect';
import { InputStyle, InputLabelStyle, TextFieldStyle } from '../../components/CustomInput';
import RegisterCollectionDlg from '../../components/dialog/RegisterCollection';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';

import {REGISTER_CONTRACT_ABI} from '../../abi/registerABI'
import {registerContract as CONTRACT_ADDRESS, ipfsURL} from '../../config'
import useOffSetTop from '../../hooks/useOffSetTop';
import { requestSigndataOnTokenID } from '../../utils/elastosConnectivityService';
import { isInAppBrowser, removeLeadingZero, getContractInfo, socialTypes } from '../../utils/common';
// ----------------------------------------------------------------------

const client = create(`${ipfsURL}/`)
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

const CheckIcon = ({loaded})=>{
  if(loaded)
   return <Box sx={{color: 'origin.main'}}><Icon icon={checkCircleIcon} width={20}/></Box>
  return ''
}
// ----------------------------------------------------------------------
export default function ImportCollection() {
  const [address, setAddress] = React.useState('')
  const [contractAddress, setContractAddress] = React.useState('')
  const [collectionInfo, setCollectionInfo] = React.useState({name: '', symbol: ''})
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('General');
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [backgroundFile, setBackgroundFile] = React.useState(null);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const [isFilledAddress, setFilledAddress] = React.useState(false);
  const [recipientRoyaltiesGroup, setRecipientRoyaltiesGroup] = React.useState([{address: '', royalties: ''}]);
  const [socialUrl, setSocialUrl] = React.useState({website: '', profile: '', feeds: '', twitter: '', discord: '', telegram: '', medium: ''});
  const [onProgress, setOnProgress] = React.useState(false);
  const [autoLoaded, setAutoLoaded] = React.useState(false);
  const [currentPromise, setCurrentPromise] = React.useState(null);
  const [isOpenRegCollection, setOpenRegCollectionDlg] = React.useState(false);
  const [isReadySignForRegister, setReadySignForRegister] = React.useState(false);
  
  const contractRef = React.useRef();
  const uploadAvatarRef = React.useRef();
  const uploadBackgroundRef = React.useRef();
  const descriptionRef = React.useRef();

  const { enqueueSnackbar } = useSnackbar();
  const isOffset = useOffSetTop(40);
  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 88;
  const navigate = useNavigate();
  
  React.useEffect(async () => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2')
      navigate('/marketplace')
      
    if(isInAppBrowser())
      setAddress(await window.elastos.getWeb3Provider().address)
    else if(essentialsConnector.getWalletConnectProvider())
      setAddress(essentialsConnector.getWalletConnectProvider().wc.accounts[0])
  }, []);

  React.useEffect(() => {
    if(!isOpenRegCollection){
      if(currentPromise)
        currentPromise.cancel()
    }
  }, [isOpenRegCollection]);

  const handleInputAddress = (e)=>{
    const inputAddress = e.target.value
    if(inputAddress.length>=42){
      if(contractAddress===inputAddress.substring(0,42))
        return
      getCollectionInfo(inputAddress.substring(0,42))
    } else {
      setFilledAddress(false)
    }
    setContractAddress(inputAddress.substring(0,42))
  }
  
  const dropFileAction = (acceptedFiles, type) => {
    const accepted = acceptedFiles[0];
    if (accepted) {
      const tempFileObj = Object.assign(accepted, {preview: URL.createObjectURL(accepted)})
      if(type===1)
        setAvatarFile(tempFileObj)
      else
        setBackgroundFile(tempFileObj)
    }
  }
  const handleDropAvatarFile = React.useCallback((acceptedFiles) => {dropFileAction(acceptedFiles, 1)}, []);
  const handleDropBackgroundFile = React.useCallback((acceptedFiles) => {dropFileAction(acceptedFiles, 2)}, []);
  const handleRemoveAvatar = (file) => {setAvatarFile(null)};
  const handleRemoveBackground = (file) => {setBackgroundFile(null)};

  const handleRecipientRoyaltiesGroup = (key, index, e) => {
    let inputValue = e.target.value
    if(key==='royalties') {
      if(inputValue<0 || inputValue>30)
        return
      inputValue = removeLeadingZero(inputValue)
    }

    const temp = [...recipientRoyaltiesGroup]
    temp[index][key] = inputValue
    if(!temp[index].address.length&&!temp[index].royalties.length){
      if(temp.length>1&&index<temp.length-1)
        temp.splice(index, 1)
      if(temp.findIndex((item)=>(!item.address.length||!item.royalties.length))<0 && temp.length<3)
        temp.push({address: '', royalties: ''})
    }
    else if(!temp[index].address.length||!temp[index].royalties.length){
      if(!temp[temp.length-1].address.length&&!temp[temp.length-1].royalties.length)
        temp.splice(temp.length-1, 1)
    }
    else if(temp[index].address.length&&temp[index].royalties.length){
      if(temp.findIndex((item)=>(!item.address.length||!item.royalties.length))<0 && temp.length<3)
        temp.push({address: '', royalties: ''})
    }
    setRecipientRoyaltiesGroup(temp)
  };

  let duproperties = {};
  recipientRoyaltiesGroup.forEach((item,index) => {
    if(!item.address.length) return
    duproperties[item.address] = duproperties[item.address] || [];
    duproperties[item.address].push(index);
  });
  duproperties = Object.keys(duproperties)
    .filter(key => duproperties[key].length>1)
    .reduce((obj, key) => {
      obj.push(key)
      return obj
    }, []);

  const handleInputSocials = (value, type) => {
    const tempUrls = {...socialUrl}
    tempUrls[type] = value
    setSocialUrl(tempUrls)
  }
  const getUrlfromFile = (file) => {
    if(!file)
      return ''
    return isString(file)?file:file.preview
  }
  const getCollectionInfo = (inputAddress) => {
    getContractInfo(inputAddress).then(res=>{
      setCollectionInfo(res)
      setAutoLoaded(true)
    }).catch(e=>{
      setCollectionInfo({name: '', symbol: ''})
      setAutoLoaded(false)
      setFilledAddress(true)
    })
  }
  const sendIpfsImage = (f)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log("cancel ipfs")
        setOnProgress(false)
      });
      
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(f);
      reader.onloadend = async() => {
        try {
          const fileContent = Buffer.from(reader.result)
          const added = await client.add(fileContent)
          console.log(added)
          resolve({'origin': {...added}, 'type':f.type})
        } catch (error) {
          reject(error);
        }
      }
    })
  )
  const sendIpfsMetaJson = (avatar, background)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log("cancel meta")
        setOnProgress(false)
      });
      
      // create the metadata object we'll be storing
      const did = sessionStorage.getItem('PASAR_DID') || ''
      const token = sessionStorage.getItem("PASAR_TOKEN");
      const user = jwtDecode(token);
      const {name, bio} = user;
      const proof = sessionStorage.getItem("KYCedProof") || ''
      const creatorObj = {
        "did": `did:elastos:${did}`,
        "name": name || '',
        "description": bio || '',
      }
      if(proof.length) {
        creatorObj.KYCedProof = proof
      }
      const dataObj = { avatar, background, description, category: category.toLowerCase(), "socials": socialUrl}
      const plainBuffer = Buffer.from(JSON.stringify(dataObj))
      const plainText = bs58.encode(plainBuffer)
      requestSigndataOnTokenID(plainText).then(rsp=>{
        // create the metadata object we'll be storing
        creatorObj.signature = rsp.signature
        const metaObj = {
          "version": "1",
          "creator": creatorObj,
          "data": dataObj
        }
        console.log(metaObj)
        try {
          const jsonMetaObj = JSON.stringify(metaObj);
          // add the metadata itself as well
          const metaRecv = Promise.resolve(client.add(jsonMetaObj))
          resolve(metaRecv)
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  )
  const uploadData = ()=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      let avatarSrc = ''
      let backgroundSrc = ''
      onCancel(() => {
        console.log("cancel upload")
        setOnProgress(false)
      });

      let temPromise = sendIpfsImage(avatarFile)
      setCurrentPromise(temPromise)
      temPromise.then((added) => {
        avatarSrc = `pasar:image:${added.origin.path}`
        temPromise = sendIpfsImage(backgroundFile)
        setCurrentPromise(temPromise)
        return temPromise
      }).then((added) => {
        backgroundSrc = `pasar:image:${added.origin.path}`
        temPromise = sendIpfsMetaJson(avatarSrc, backgroundSrc)
        setCurrentPromise(temPromise)
        return temPromise
      }).then((metaRecv) => {
        const _uri = `pasar:json:${metaRecv.path}`
        resolve({ _uri })
      }).catch((error) => {
        reject(error);
      })
    })
  )
  
  const registerCollection = (paramObj)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      const propertiesObj = recipientRoyaltiesGroup.reduce((obj, item) => {
        if(item.address!=='' && item.royalties!=='') {
          obj.owners.push(item.address)
          obj.feeRates.push(item.royalties*10000)
        }
        return obj
      }, {owners: [], feeRates: []})

      onCancel(() => {
        console.log("cancel register")
        setOnProgress(false)
      });
    
      if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2'){
        reject(new Error)
        return
      }

      const walletConnectWeb3 = new Web3(isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
      // getCurrentWeb3Provider().then((walletConnectWeb3) => {
        walletConnectWeb3.eth.getAccounts().then((accounts)=>{
          const registerContract = new walletConnectWeb3.eth.Contract(REGISTER_CONTRACT_ABI, CONTRACT_ADDRESS)
          walletConnectWeb3.eth.getGasPrice().then((gasPrice)=>{
            console.log("Gas price:", gasPrice); 
    
            const _gasLimit = 5000000;
            console.log("Sending transaction with account address:", accounts[0]);
            const transactionParams = {
              'from': accounts[0],
              'gasPrice': gasPrice,
              'gas': _gasLimit,
              'value': 0
            };
            setReadySignForRegister(true)
            registerContract.methods.registerToken(contractAddress, collectionInfo.name, paramObj._uri, propertiesObj.owners, propertiesObj.feeRates).send(transactionParams)
              .on('receipt', (receipt) => {
                  setReadySignForRegister(false)
                  console.log("receipt", receipt);
                  resolve(true)
              })
              .on('error', (error, receipt) => {
                  console.error("error", error);
                  reject(error)
              });
  
          }).catch((error) => {
            reject(error);
          })
        }).catch((error) => {
          reject(error);
        })
      // }) 
    })
  )
  const importCollection = () => {
    setOnProgress(true)
    setOpenRegCollectionDlg(true)
    let temPromise = uploadData()
    setCurrentPromise(temPromise)
    temPromise.then((paramObj) => {
      temPromise = registerCollection(paramObj)
      setCurrentPromise(temPromise)
      return temPromise
    }).then((success) => {
      if(success){
        enqueueSnackbar('Import collection success!', { variant: 'success' });
        // setTimeout(()=>{
        //   navigate('/marketplace')
        // }, 3000)
      }
      else
        enqueueSnackbar('Import collection error!', { variant: 'warning' });
      setOnProgress(false)
      setOpenRegCollectionDlg(false)
      setCurrentPromise(null)
    }).catch((error) => {
      enqueueSnackbar('Import collection error!', { variant: 'error' });
      setOnProgress(false)
      setOpenRegCollectionDlg(false)
      setCurrentPromise(null)
    });
  }
  const scrollToRef = (ref)=>{
    if(!ref.current)
      return
    let fixedHeight = isOffset?APP_BAR_DESKTOP-16:APP_BAR_DESKTOP
    fixedHeight = isMobile?APP_BAR_MOBILE:fixedHeight
    window.scrollTo({top: ref.current.offsetTop-fixedHeight, behavior: 'smooth'})
  }
  const handleImportAction = () => {
    setOnValidation(true)
    if(!contractAddress.length || !autoLoaded)
      scrollToRef(contractRef)
    else if(!avatarFile)
      scrollToRef(uploadAvatarRef)
    else if(!backgroundFile)
      scrollToRef(uploadBackgroundRef)
    else if(!description.length)
      scrollToRef(descriptionRef)
    else if(duproperties.length || recipientRoyaltiesGroup.filter(el=>el.address.length>0&&!el.royalties.length).length)
      enqueueSnackbar('Fee recipient properties are invalid.', { variant: 'warning' });
    else if(recipientRoyaltiesGroup.reduce((sum, el)=>sum+=el.royalties*1, 0)>30)
      enqueueSnackbar('Total royalties must not be more than 30%', { variant: 'warning' });
    else
      importCollection()
  }
  return (
    <RootStyle title="ImportCollection | PASAR">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{mb: 3}}>
          Import Collection
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" sx={{fontWeight: 'normal', color: 'text.secondary'}}>
              What is the address of your ERC-721 or ERC-1155 contract on the Elastos Smart Chain Mainnet Network?
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8} ref={contractRef}>
            <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}}>Contract/Collection Address</Typography>
            <FormControl error={(isOnValidation&&(!contractAddress.length||!autoLoaded))||(isFilledAddress&&!autoLoaded)} variant="standard" sx={{width: '100%'}}>
              <InputLabelStyle htmlFor="input-with-address">
                Enter your ERC-721 or ERC-1155 contract/collection address
              </InputLabelStyle>
              <InputStyle
                id="input-with-address"
                startAdornment={' '}
                endAdornment={<CheckIcon loaded={autoLoaded}/>}
                value={contractAddress}
                onChange={handleInputAddress}
                aria-describedby="address-error-text"
              />
              <FormHelperText
                id="address-error-text"
                hidden={
                  !(isOnValidation&&(!contractAddress.length||!autoLoaded))&&!(isFilledAddress&&!autoLoaded)
                }
              >
                {
                  isFilledAddress&&!autoLoaded?"Address not found":"Address is required"
                }
              </FormHelperText>
            </FormControl>
            <Divider/>
          </Grid>
          {
            autoLoaded&&
            <>
              <Grid item xs={12} sm={8}>
                <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}}>Collection Name</Typography>
                <InputStyle
                  endAdornment={<CheckIcon loaded={autoLoaded}/>}
                  value={collectionInfo.name}
                  readOnly={Boolean(true)}
                  sx={{width: '100%'}}
                />
                <Divider/>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}}>Symbol</Typography>
                <InputStyle
                  endAdornment={<CheckIcon loaded={autoLoaded}/>}
                  value={collectionInfo.symbol}
                  readOnly={Boolean(true)}
                  sx={{width: '100%'}}
                />
                <Divider/>
              </Grid>
            </>
          }
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}} ref={uploadAvatarRef}>Avatar</Typography>
            <UploadSingleFile
              file={avatarFile}
              error={isOnValidation&&!avatarFile}
              onDrop={handleDropAvatarFile}
              onRemove={handleRemoveAvatar}
              accept=".jpg, .png, .jpeg, .gif"/>
            <FormHelperText error={isOnValidation&&!avatarFile} hidden={!isOnValidation||(isOnValidation&&avatarFile!==null)}>Image file is required</FormHelperText>

            <Typography variant="h4" sx={{fontWeight: 'normal', py: 1}} ref={uploadBackgroundRef}>Background Image</Typography>
            <UploadSingleFile
              file={backgroundFile}
              error={isOnValidation&&!backgroundFile}
              onDrop={handleDropBackgroundFile}
              onRemove={handleRemoveBackground}
              accept=".jpg, .png, .jpeg, .gif"/>
            <FormHelperText error={isOnValidation&&!backgroundFile} hidden={!isOnValidation||(isOnValidation&&backgroundFile!==null)}>Image file is required</FormHelperText>
            
            <Typography variant="h4" sx={{fontWeight: 'normal', py: 1}} ref={descriptionRef}>Description</Typography>
            <FormControl error={isOnValidation&&!description.length} variant="standard" sx={{width: '100%'}}>
              <InputLabelStyle htmlFor="input-with-description" sx={{ whiteSpace: 'break-spaces', width: 'calc(100% / 0.75)', position: 'relative', transformOrigin: 'left' }}>
                Add collection description
              </InputLabelStyle>
              <InputStyle
                id="input-with-description"
                startAdornment={' '}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                aria-describedby="description-error-text"
                sx={{mt: '-5px !important'}}
              />
              <FormHelperText id="description-error-text" hidden={!isOnValidation||(isOnValidation&&description.length>0)}>Description is required</FormHelperText>
            </FormControl>
            <Divider/>
            
            <Typography variant="h4" sx={{fontWeight: 'normal', py: 1}}>Category</Typography>
            <CategorySelect selected={category} onChange={setCategory} />
            
            <Typography variant="h4" component="div" sx={{fontWeight: 'normal', py: 1}}>
              Fee Recipient Address & Royalties
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Fee Recipient Address</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Royalties (%)</Typography>
              </Grid>
            </Grid>
            {
              recipientRoyaltiesGroup.map((item, index)=>(
                <Grid container spacing={1} key={index} sx={index?{mt: 1}:{}}>
                  <Grid item xs={8}>
                    <TextFieldStyle
                      label="Example: 0x012...ABC"
                      size="small"
                      fullWidth
                      value={item.address}
                      onChange={(e)=>{handleRecipientRoyaltiesGroup('address', index, e)}}
                      error={isOnValidation&&duproperties.includes(item.address)}
                      helperText={isOnValidation&&duproperties.includes(item.address)?'Duplicated address':''}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextFieldStyle
                      type="number"
                      label="Example: 10"
                      size="small"
                      fullWidth
                      value={item.royalties}
                      onChange={(e)=>{handleRecipientRoyaltiesGroup('royalties', index, e)}}
                      error={isOnValidation&&item.address.length>0&&!item.royalties.length}
                      helperText={isOnValidation&&item.address.length>0&&!item.royalties.length?'Can not be empty.':''}
                    />
                  </Grid>
                </Grid>
              ))
            }
            <Grid item xs={12}>
              <Accordion sx={{bgcolor: 'unset'}}>
                <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{pl: 0}}>
                  <Typography variant="h4" component="div" sx={{fontWeight: 'normal'}}>
                    Socials&nbsp;<Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {
                    socialTypes.map((type, index)=>
                      <Box key={index}>
                        <Typography variant="h4" sx={{fontWeight: 'normal', color: 'origin.main'}}>{type}</Typography>
                        <FormControl variant="standard" sx={{width: '100%'}}>
                          <InputLabelStyle htmlFor={`input-with-${type}`} sx={{ whiteSpace: 'break-spaces', width: 'calc(100% / 0.75)', position: 'relative', transformOrigin: 'left' }}>
                            Add {type} URL
                          </InputLabelStyle>
                          <InputStyle
                            id={`input-with-${type}`}
                            startAdornment={' '}
                            value={socialUrl[type.toLowerCase()]}
                            onChange={(e)=>handleInputSocials(e.target.value, type.toLowerCase())}
                            sx={{mt: '-5px !important'}}
                          />
                        </FormControl>
                        <Divider/>
                      </Box>
                    )
                  }
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" spacing={1} sx={{position: 'sticky', top: isOffset?APP_BAR_DESKTOP-16:APP_BAR_DESKTOP}}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Preview</Typography>
              </Grid>
              <Grid item xs={12} sx={{width: '100%'}}>
                <CollectionCard 
                  isPreview={Boolean(true)}
                  info={{
                    name: collectionInfo.name,
                    description,
                    owner: address,
                    avatar: getUrlfromFile(avatarFile),
                    background: getUrlfromFile(backgroundFile)
                  }}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TransLoadingButton loading={onProgress} loadingText="Please wait while import collection" onClick={handleImportAction} fullWidth>
              Import
            </TransLoadingButton>
          </Grid>
        </Grid>
      </Container>
      <RegisterCollectionDlg isOpenDlg={isOpenRegCollection} setOpenDlg={setOpenRegCollectionDlg} isReadySign={isReadySignForRegister}/>
    </RootStyle>
  );
}