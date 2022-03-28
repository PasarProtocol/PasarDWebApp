import React from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { isString } from 'lodash';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip, Box,
  Accordion, AccordionSummary, AccordionDetails, FormHelperText } from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import checkCircleIcon from '@iconify-icons/akar-icons/circle-check-fill';
import { create, urlSource } from 'ipfs-http-client';
import { useSnackbar } from 'notistack';

// components
import { MHidden } from '../../components/@material-extend';
import useOffSetTop from '../../hooks/useOffSetTop';
import Page from '../../components/Page';
import { UploadSingleFile } from '../../components/upload';
import {stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS, ipfsURL} from '../../config'
import ProgressBar from '../../components/ProgressBar'
import TransLoadingButton from '../../components/TransLoadingButton';
import CollectionCard from '../../components/collection/CollectionCard';
import CategorySelect from '../../components/collection/CategorySelect';
import { InputStyle, InputLabelStyle, TextFieldStyle } from '../../components/CustomInput';
import { isInAppBrowser, removeLeadingZero } from '../../utils/common';
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
const socialTypes = ['Website', 'Twitter', 'Discord', 'Telegram', 'Medium']
export default function ImportCollection() {
  const [address, setAddress] = React.useState('')
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState(0);
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [coverFile, setCoverFile] = React.useState(null);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const [recipientRoyaltiesGroup, setRecipientRoyaltiesGroup] = React.useState([{address: '', royalties: ''}]);
  const [socialUrl, setSocialUrl] = React.useState({Website: '', Twitter: '', Discord: '', Telegram: '', Medium: ''});
  const [onProgress, setOnProgress] = React.useState(false);
  const [autoLoaded, setAutoLoaded] = React.useState(false);
  
  const isOffset = useOffSetTop(40);
  const APP_BAR_DESKTOP = 88;
  const navigate = useNavigate();
  
  React.useEffect(async () => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2')
      navigate('/marketplace')
  }, []);

  const handleInputAddress = (e)=>{
    const inputAddress = e.target.value
    if(inputAddress.length>=42){
      getCollectionInfo(inputAddress.substring(0,42))
    }
    setAddress(inputAddress.substring(0,42))
  }
  
  const dropFileAction = (acceptedFiles, type) => {
    const accepted = acceptedFiles[0];
    if (accepted) {
      const tempFileObj = Object.assign(accepted, {preview: URL.createObjectURL(accepted)})
      if(type===1)
        setAvatarFile(tempFileObj)
      else
        setCoverFile(tempFileObj)
    }
  }
  const handleDropAvatarFile = React.useCallback((acceptedFiles) => {dropFileAction(acceptedFiles, 1)}, []);
  const handleDropCoverFile = React.useCallback((acceptedFiles) => {dropFileAction(acceptedFiles, 2)}, []);
  const handleRemoveAvatar = (file) => {setAvatarFile(null)};
  const handleRemoveCover = (file) => {setCoverFile(null)};

  const handleRecipientRoyaltiesGroup = (key, index, e) => {
    let inputValue = e.target.value
    if(key==='royalties') {
      if(inputValue<0)
        return
      inputValue = removeLeadingZero(inputValue)
    }

    const temp = [...recipientRoyaltiesGroup]
    temp[index][key] = inputValue
    if(!temp[index].address.length&&!temp[index].royalties.length){
      if(temp.length>1&&index<temp.length-1)
        temp.splice(index, 1)
      if(temp.findIndex((item)=>(!item.address.length||!item.royalties.length))<0)
        temp.push({address: '', royalties: ''})
    }
    else if(!temp[index].address.length||!temp[index].royalties.length){
      if(!temp[temp.length-1].address.length&&!temp[temp.length-1].royalties.length)
        temp.splice(temp.length-1, 1)
    }
    else if(temp[index].address.length&&temp[index].royalties.length){
      if(temp.findIndex((item)=>(!item.address.length||!item.royalties.length))<0)
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
    setAutoLoaded(true)
  }
  const handleImportAction = () => {

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
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}}>Contract/Collection Address</Typography>
            <FormControl error={isOnValidation&&!address.length} variant="standard" sx={{width: '100%'}}>
              <InputLabelStyle htmlFor="input-with-address">
                Enter your ERC-721 or ERC-1155 contract/collection address
              </InputLabelStyle>
              <InputStyle
                id="input-with-address"
                startAdornment={' '}
                endAdornment={<CheckIcon loaded={autoLoaded}/>}
                value={address}
                onChange={handleInputAddress}
                aria-describedby="address-error-text"
              />
              <FormHelperText id="address-error-text" hidden={!isOnValidation||(isOnValidation&&address.length>0)}>Address is required</FormHelperText>
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
                  value="Bunny Punk"
                  readOnly={Boolean(true)}
                  sx={{width: '100%'}}
                />
                <Divider/>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}}>Symbol</Typography>
                <InputStyle
                  endAdornment={<CheckIcon loaded={autoLoaded}/>}
                  value="BUNNY"
                  readOnly={Boolean(true)}
                  sx={{width: '100%'}}
                />
                <Divider/>
              </Grid>
            </>
          }
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" sx={{fontWeight: 'normal', pb: 1}}>Avatar</Typography>
            <UploadSingleFile
              file={avatarFile}
              error={isOnValidation&&!avatarFile}
              onDrop={handleDropAvatarFile}
              onRemove={handleRemoveAvatar}
              accept=".jpg, .png, .jpeg, .gif"/>
            <FormHelperText error={isOnValidation&&!avatarFile} hidden={!isOnValidation||(isOnValidation&&avatarFile!==null)}>Image file is required</FormHelperText>

            <Typography variant="h4" sx={{fontWeight: 'normal', py: 1}}>Cover Photo</Typography>
            <UploadSingleFile
              file={coverFile}
              error={isOnValidation&&!coverFile}
              onDrop={handleDropCoverFile}
              onRemove={handleRemoveCover}
              accept=".jpg, .png, .jpeg, .gif"/>
            <FormHelperText error={isOnValidation&&!coverFile} hidden={!isOnValidation||(isOnValidation&&coverFile!==null)}>Image file is required</FormHelperText>
            
            <Typography variant="h4" sx={{fontWeight: 'normal', py: 1}}>Description</Typography>
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
              <Grid item xs={6}>
                <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Fee Recipient Address</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Royalties (%)</Typography>
              </Grid>
            </Grid>
            {
              recipientRoyaltiesGroup.map((item, index)=>(
                <Grid container spacing={1} key={index} sx={index?{mt: 1}:{}}>
                  <Grid item xs={6}>
                    <TextFieldStyle
                      label="Example: 0x012...ABC"
                      size="small"
                      fullWidth
                      value={item.address}
                      onChange={(e)=>{handleRecipientRoyaltiesGroup('address', index, e)}}
                      error={isOnValidation&&duproperties.includes(item.address)}
                      helperText={isOnValidation&&duproperties.includes(item.address)?'Duplicated type':''}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldStyle
                      type="number"
                      label="Example: 10"
                      size="small"
                      fullWidth
                      value={item.royalties}
                      onChange={(e)=>{handleRecipientRoyaltiesGroup('royalties', index, e)}}
                      error={isOnValidation&&item.royalties.length>0&&!item.royalties.length}
                      helperText={isOnValidation&&item.royalties.length>0&&!item.royalties.length?'Can not be empty.':''}
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
                            value={socialUrl[type]}
                            onChange={(e)=>handleInputSocials(e.target.value, type)}
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
                    title: 'Collection Name',
                    detail: description,
                    avatar: getUrlfromFile(avatarFile),
                    coverImage: getUrlfromFile(coverFile)
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
    </RootStyle>
  );
}