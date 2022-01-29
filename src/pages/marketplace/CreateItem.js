import React from 'react';
import { isString } from 'lodash';
import {isMobile} from 'react-device-detect';
import * as math from 'mathjs';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip, Box,
  Accordion, AccordionSummary, AccordionDetails, FormHelperText } from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { ethers } from 'ethers';
import { create, urlSource } from 'ipfs-http-client'
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

// components
import { MHidden } from '../../components/@material-extend';
import useOffSetTop from '../../hooks/useOffSetTop';
import Page from '../../components/Page';
import MintingTypeButton from '../../components/marketplace/MintingTypeButton';
import ItemTypeButton from '../../components/marketplace/ItemTypeButton';
import { UploadMultiFile, UploadSingleFile } from '../../components/upload';
import AssetCard from '../../components/marketplace/AssetCard';
import MultiMintGrid from '../../components/marketplace/MultiMintGrid';
import PaperRecord from '../../components/PaperRecord';
import CustomSwitch from '../../components/custom-switch';
import CoinSelect from '../../components/marketplace/CoinSelect';
import MintBatchName from '../../components/marketplace/MintBatchName';
import {stickerContract as CONTRACT_ADDRESS} from '../../config'
import {hash, removeLeadingZero} from '../../utils/common';
import {STICKER_CONTRACT_ABI} from '../../abi/stickerABI'
import ProgressBar from '../../components/ProgressBar'
// ----------------------------------------------------------------------

const client = create('http://ipfs-test.trinity-feeds.app/')
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

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const InputStyle = styled(Input)(({ theme }) => ({
  '&:before': {
    borderWidth: 0
  }
}));

// ----------------------------------------------------------------------

export default function CreateItem() {
  const [mintype, setMintType] = React.useState("Single");
  const [itemtype, setItemType] = React.useState("General");
  const [saletype, setSaleType] = React.useState("");
  const [collection, setCollection] = React.useState("FSTK");
  const [file, setFile] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [singleName, setSingleName] = React.useState("");
  const [multiNames, setMultiNames] = React.useState([]);
  const [previewFiles, setPreviewFiles] = React.useState([]);
  const [isPutOnSale, setPutOnSale] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [price, setPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [royalties, setRoyalties] = React.useState(10);
  const [uploadedCount, setUploadedCount] = React.useState(0);
  const [singleProperties, setSingleProperties] = React.useState([{type: '', name: ''}]);
  const [multiProperties, setMultiProperties] = React.useState([]);
  const [onProgress, setOnProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  const isOffset = useOffSetTop(40);
  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 88;
  // const royaltiesRef = React.useRef();
  const explicitRef = React.useRef();
  const uploadRef = React.useRef();
  const nameRef = React.useRef();
  const descriptionRef = React.useRef();
  
  React.useEffect(async () => {
    if(mintype!=="Multiple")
      setQuantity(1)
  }, [mintype]);

  React.useEffect(() => {
    if(progress===100)
      setTimeout(()=>{setProgress(0)}, 110)
  }, [progress]);
  
  React.useEffect(async () => {
    const tempArr = [...files]
    setPreviewFiles(tempArr.map((file, i)=>{
      const { name, size, preview } = file;
      return isString(file) ? file : preview
    }))
    setUploadedCount(files.length)
    if(files.length)
      setMultiProperties([...Array(files.length)].map(el=>([{type: '', name: ''}])))
  }, [files]);

  const handleDropSingleFile = React.useCallback((acceptedFiles) => {
    const accepted = acceptedFiles[0];
    if (accepted) {
      setFile(
        Object.assign(accepted, {
          preview: URL.createObjectURL(accepted)
        })
      )
    }
  }, []);

  const handleDropMultiFile = React.useCallback((acceptedFiles) => {
      acceptedFiles.splice(20)
      if(acceptedFiles.length<2){
        enqueueSnackbar('Allow at least 2 items!', { variant: 'warning' });
        return
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const handleSingleRemove = (file) => {
    setFile(null);
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    if(filteredItems.length<2){
      enqueueSnackbar('Allow at least 2 items!', { variant: 'warning' });
      return
    }
    setFiles(filteredItems);
  };

  const handlePutOnSale = (event) => {
    setPutOnSale(event.target.checked);
  };

  const handleChangePrice = (event) => {
    let priceValue = event.target.value
    if(priceValue<0)
      return
    priceValue = removeLeadingZero(priceValue)
    setPrice(priceValue)
    setRcvPrice(math.round(priceValue*98/100, 3))
  };

  const handleChangeRoyalties = (event) => {
    if(event.target.value<0 || event.target.value>20)
      return
    setRoyalties(removeLeadingZero(event.target.value))
  };

  const handleProperties = (properties, key, index, e) => {
    const temp = [...properties]
    temp[index][key] = e.target.value
    if(!temp[index].type.length&&!temp[index].name.length){
      if(temp.length>1&&index<temp.length-1)
        temp.splice(index, 1)
      if(temp.findIndex((item)=>(!item.type.length||!item.name.length))<0)
        temp.push({type: '', name: ''})
    }
    else if(!temp[index].type.length||!temp[index].name.length){
      if(!temp[temp.length-1].type.length&&!temp[temp.length-1].name.length)
        temp.splice(temp.length-1, 1)
    }
    else if(temp[index].type.length&&temp[index].name.length){
      if(temp.findIndex((item)=>(!item.type.length||!item.name.length))<0)
        temp.push({type: '', name: ''})
    }
    return temp
  };
  const handleSingleProperties = (key, index, e) => {
    const tempSingleProperties = handleProperties(singleProperties, key, index, e)
    setSingleProperties(tempSingleProperties)
  }
  const handleMultiProperties = (key, multindex, index, e) => {
    const tempMultiProperties = [...multiProperties]
    tempMultiProperties[multindex] = handleProperties(multiProperties[multindex], key, index, e)
    setMultiProperties(tempMultiProperties)
  }
  const progressStep = (pos, index)=>{
    if(mintype!=="Batch")
      return pos
    return pos/files.length + 100*index/files.length
  }
  const mint2net = (paramObj, index=0)=>(
    new Promise((resolve, reject) => {
      const _tokenSupply = quantity
      const _royaltyFee = royalties*10000
      try {
        const { ethereum } = window

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const stickerContract = new ethers.Contract(CONTRACT_ADDRESS, STICKER_CONTRACT_ABI, signer)

          // console.log("Initialize payment")
          setProgress(progressStep(50, index))
          
          stickerContract.mint(paramObj._id, _tokenSupply, paramObj._uri, _royaltyFee, paramObj._didUri).then((nftTxn)=>{
            setProgress(progressStep(70, index))
            // console.log("Mining... please wait")
            nftTxn.wait().then(()=>{
              // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
              resolve(true)
            }).catch((error) => {
              reject(error)
            })
          }).catch((error) => {
            reject(error)
          })
        } else {
          resolve(false)
          // console.log("Ethereum object does not exist")
        }
      } catch (err) {
        reject(err)
      }
    })
  )
  const sendIpfsImage = (f)=>(
    new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(f);
      reader.onloadend = async() => {
        try {
          const fileContent = Buffer.from(reader.result)
          const added = await client.add(fileContent)
          resolve({...added, 'type':f.type})
        } catch (error) {
          reject(error);
        }
      }
    })
  )
  const sendIpfsMetaJson = (added, index=0)=>(
    new Promise((resolve, reject) => {
      let collectibleName = singleName;
      let propertiesObj = singleProperties.reduce((obj, item) => {
        if(item.type!=='' && item.name!=='')
          obj[item.type] = item.name
        return obj
      }, {})
      if(mintype==="Batch"){
        collectibleName = multiNames[index]
        propertiesObj = multiProperties[index].reduce((obj, item) => {
          if(item.type!=='' && item.name!=='')
            obj[item.type] = item.name
          return obj
        }, {})
      }
      // create the metadata object we'll be storing
      const metaObj = {
        "version": "2",
        "type": itemtype==="General"?'image':itemtype.toLowerCase(),
        "name": collectibleName,
        "description": description,
        "data": {
          "image": `pasar:image:${added.path}`,
          "kind": added.type.replace('image/', ''),
          "size": added.size,
          "thumbnail": `pasar:image:${added.path}`
        },
        "adult": explicitRef.current.checked,
        "properties": propertiesObj,
      }
      try {
        const jsonMetaObj = JSON.stringify(metaObj);
        // add the metadata itself as well
        const metaRecv = Promise.resolve(client.add(jsonMetaObj))
        resolve(metaRecv)
      } catch (error) {
        reject(error);
      }
    })
  )
  const sendIpfsDidJson = ()=>(
    new Promise((resolve, reject) => {
      // create the metadata object we'll be storing
      const didObj = {
        "version":"2",
        "did": "did:elastos:you_did_string"
      }
      try {
        const jsonDidObj = JSON.stringify(didObj);
        // add the metadata itself as well
        const didRecv = Promise.resolve(client.add(jsonDidObj))
        resolve(didRecv)
      } catch (error) {
        reject(error);
      }
    })
  )
  const uploadData = ()=>(
    new Promise((resolve, reject) => {
      let _id = ''
      let _uri = ''
      let _didUri = ''
      if (!file)
        return;
      setProgress(5)
      sendIpfsImage(file).then((added) => {
        _id = `0x${hash(added.path)}`
        setProgress(15)
        return sendIpfsMetaJson(added)
      }).then((metaRecv) => {
        setProgress(30)
        _uri = `feeds:json:${metaRecv.path}`
        return sendIpfsDidJson()
      }).then((didRecv) => {
        setProgress(45)
        _didUri = `feeds:json:${didRecv.path}`
        resolve({ _id, _uri, _didUri })
      }).catch((error) => {
        reject(error);
      })
    })
  )
  const uploadOneOfBatch = (f, _didUri, index)=>(
    new Promise((resolve, reject) => {
      let _id = ''
      let _uri = ''
      if (!f)
        return;
      setProgress(progressStep(10, index))
      sendIpfsImage(f).then((added) => {
        _id = `0x${hash(added.path)}`
        setProgress(progressStep(20, index))
        return sendIpfsMetaJson(added, index)
      }).then((metaRecv) => {
        setProgress(progressStep(40, index))
        _uri = `feeds:json:${metaRecv.path}`
        resolve({ _id, _uri, _didUri })
      }).catch((error) => {
        reject(error);
      })
    })
  )
  const mintSingle = () => {
    if(!file)
      return
    setOnProgress(true)
    uploadData().then((paramObj) => mint2net(paramObj)).then((success) => {
      setProgress(100)
      if(success)
        enqueueSnackbar('Mint token success!', { variant: 'success' });
      else
        enqueueSnackbar('Mint token error!', { variant: 'warning' });
      setOnProgress(false)
    }).catch((error) => {
      setProgress(100)
      enqueueSnackbar('Mint token error!', { variant: 'error' });
      setOnProgress(false)
    });
  }
  const mintBatch = () => {
    if(!files.length)
      return
    setOnProgress(true)
    setProgress(3)
    sendIpfsDidJson().then((didRecv) => {
      setProgress(6)
      const _didUri = `feeds:json:${didRecv.path}`
      mintBatchMain(_didUri)
    }).catch((error) => {
      setProgress(100)
      enqueueSnackbar('Mint token error!', { variant: 'error' });
      setOnProgress(false)
    })
  }
  const mintBatchMain = (_didUri) => {
    // const delay = file => new Promise(resolve => setTimeout(resolve, ms));
    files.reduce( (p, f, i) => 
      p.then(() => 
        uploadOneOfBatch(f, _didUri, i)
      ).then((paramObj) => 
        mint2net(paramObj, i)
      ).then((success) => {
        setProgress(progressStep(100, i))
        if(success)
          enqueueSnackbar(`Mint token_${(i+1)} success!`, { variant: 'success' });
        else
          enqueueSnackbar(`Mint token_${(i+1)} error!`, { variant: 'warning' });
        if((i+1)===files.length)
          setOnProgress(false)
      }).catch((error) => {
        setProgress(progressStep(100, i))
        enqueueSnackbar(`Mint token_${(i+1)} error!`, { variant: 'error' });
        if((i+1)===files.length)
          setOnProgress(false)
      })
    , Promise.resolve() );
  }
  const handleMintAction = (e) => {
    setOnValidation(true)
    if(mintype!=="Batch"&&!file || mintype==="Batch"&&!files.length)
      scrollToRef(uploadRef)
    else if(mintype!=="Batch"&&!singleName.length)
      scrollToRef(nameRef)
    else if(!description.length)
      scrollToRef(descriptionRef)
    else
      if(mintype!=="Batch")
        mintSingle()
      else
        mintBatch()
  }
  const scrollToRef = (ref)=>{
    if(!ref.current)
      return
    let fixedHeight = isOffset?APP_BAR_DESKTOP-16:APP_BAR_DESKTOP
    fixedHeight = isMobile?APP_BAR_MOBILE:fixedHeight
    window.scrollTo({top: ref.current.offsetTop-fixedHeight, behavior: 'smooth'})
  }
  return (
    <RootStyle title="CreateItem | PASAR">
      <ProgressBar isFinished={(progress===0||progress===100)} progress={progress} />
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{mb: 3}}>
          <span role="img" aria-label="">🔨</span> Create Item 
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Minting Type</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row">
              <MintingTypeButton type="Single" description="Single item" onClick={()=>{setMintType("Single")}} current={mintype}/>
              <Tooltip title="Coming Soon" arrow>
                <div>
                  <MintingTypeButton type="Multiple" description="Multiple identical items" onClick={()=>{setMintType("Multiple")}} current={mintype} disabled={1&&true}/>
                </div>
              </Tooltip>
              <Tooltip title="Coming Soon" arrow>
                <div>
                  <MintingTypeButton type="Batch" description="Multiple non-identical items" onClick={()=>{setMintType("Batch")}} current={mintype} disabled={1&&true}/>
                </div>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Item Type</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row">
              <ItemTypeButton type="General" onClick={()=>{setItemType("General")}} current={itemtype}/>
              <ItemTypeButton type="Avatar" onClick={()=>{setItemType("Avatar")}} current={itemtype}/>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12} ref={uploadRef}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Upload file</Typography>
              </Grid>
              <Grid item xs={12}>
                {
                  mintype!=="Batch"?
                  <>
                    <UploadSingleFile
                      file={file}
                      error={isOnValidation&&!file}
                      onDrop={handleDropSingleFile}
                      isAvatar={itemtype==="Avatar"}
                      onRemove={handleSingleRemove}
                      accept=".jpg, .png, .jpeg, .gif"/>
                    <FormHelperText error={isOnValidation&&!file} hidden={!isOnValidation||(isOnValidation&&file!==null)}>Image file is required</FormHelperText>
                  </>:
                  <>
                    <UploadMultiFile
                      showPreview={1&&true}
                      error={isOnValidation&&!files.length}
                      files={files}
                      onDrop={handleDropMultiFile}
                      isAvatar={itemtype==="Avatar"}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      accept=".jpg, .png, .jpeg, .gif"
                      sx={{pb:1}}/>
                    <FormHelperText error={isOnValidation&&!files.length} hidden={!isOnValidation||(isOnValidation&&files.length>0)}>Image files are required</FormHelperText>
                    {files.length>0&&<Divider/>}
                  </>
                }
              </Grid>
              <Grid item xs={12} ref={nameRef}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Name</Typography>
              </Grid>
              <Grid item xs={12}>
                {
                  mintype==="Batch"?(
                    <>
                      <MintBatchName uploadedCount={uploadedCount} handleNameGroup={setMultiNames}/>
                    </>
                  ):(
                    <FormControl error={isOnValidation&&!singleName.length} variant="standard" sx={{width: '100%'}}>
                      <InputLabel htmlFor="input-with-name">
                        Add item name
                      </InputLabel>
                      <InputStyle
                        id="input-with-name"
                        startAdornment={' '}
                        value={singleName}
                        onChange={(e)=>{setSingleName(e.target.value)}}
                        aria-describedby="name-error-text"
                      />
                      <FormHelperText id="name-error-text" hidden={!isOnValidation||(isOnValidation&&singleName.length>0)}>Item name is required</FormHelperText>
                    </FormControl>
                  )
                }
                <Divider/>
              </Grid>
              <Grid item xs={12} ref={descriptionRef}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Description</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl error={isOnValidation&&!description.length} variant="standard" sx={{width: '100%'}}>
                  <InputLabel htmlFor="input-with-description" sx={{ whiteSpace: 'break-spaces', width: 'calc(100% / 0.75)', position: 'relative', transformOrigin: 'left' }}>
                    {
                      mintype!=="Batch"?
                      "Add item description":
                      "Fixed Description (Leave blank if you want to manually edit each item description on the preview cards)"
                    }
                  </InputLabel>
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
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Explicit & Sensitive Content&nbsp;
                  <Tooltip title="Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing Pasar" arrow disableInteractive>
                    <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <InputLabel sx={{ fontSize: 12, flex: 1 }}>
                    Set this item as explicit and sensitive content
                  </InputLabel>
                  <FormControlLabel
                    control={<CustomSwitch inputRef={explicitRef}/>}
                    sx={{mt:-1, mr: 0}}
                    label=""
                  />
                </Stack>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Put on Sale</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <InputLabel sx={{ fontSize: 12, flex: 1 }}>
                    List on market directly after minting
                  </InputLabel>
                  <FormControlLabel
                    control={<CustomSwitch onChange={handlePutOnSale}/>}
                    sx={{mt:-1, mr: 0}}
                    label=""
                  />
                </Stack>
                {
                  isPutOnSale&&
                  <Stack spacing={1} direction="row">
                    <ItemTypeButton type="FixedPrice" onClick={()=>{setSaleType("FixedPrice")}} current={saletype}/>
                    {
                      mintype!=="Batch"&&
                      <Tooltip title="Coming Soon" arrow>
                        <div>
                          <ItemTypeButton type="Auction" onClick={()=>{setSaleType("Auction")}} current={saletype} disabled={1&&true}/>
                        </div>
                      </Tooltip>
                    }
                  </Stack>
                }
              </Grid>
              {
                isPutOnSale&&
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{fontWeight: 'normal'}}>Price</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" sx={{width: '100%'}}>
                      <InputLabel htmlFor="input-with-price">
                        Enter a fixed price of each item
                      </InputLabel>
                      <InputStyle
                        type="number"
                        id="input-with-price"
                        value={price}
                        onChange={handleChangePrice}
                        startAdornment={' '}
                        endAdornment={
                          <CoinSelect/>
                        }
                      />
                    </FormControl>
                    <Divider/>
                    <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>Platform fee 2%&nbsp;
                      <Tooltip title="We take 2% of every transaction that happens on Pasar for providing the platform to users" arrow disableInteractive>
                        <Icon icon="eva:info-outline" style={{marginBottom: -4, fontSize: 18}}/>
                      </Tooltip>
                    </Typography>
                    <Typography variant="body2" component="div" sx={{fontWeight: 'normal'}}>
                      You will receive
                      <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main', display: 'inline'}}> {rcvprice} ELA </Typography>
                      per item
                    </Typography>
                  </Grid>
                </>
              }
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Royalties&nbsp;
                  <Tooltip title="Royalties are the percentage cut of the total value of item sold and will be paid to the original creator" arrow disableInteractive>
                    <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputLabel htmlFor="input-with-royalties">
                    Enter royalties (Suggested: 10%, Maximum: 20%)
                  </InputLabel>
                  <InputStyle
                    type="number"
                    id="input-with-royalties"
                    value={royalties}
                    onChange={handleChangeRoyalties}
                    startAdornment={' '}
                    endAdornment='%'
                  />
                </FormControl>
                <Divider/>
                <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>You will receive royalties for every secondary sales on Pasar</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Quantity</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputStyle
                    disabled={mintype!=="Multiple"}
                    type="number"
                    value={quantity}
                    onChange={(e)=>setQuantity(e.target.value)}
                  />
                </FormControl>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Collection</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1} direction="row">
                  <MintingTypeButton type="FSTK" description="Feeds NFT Sticker" onClick={()=>{setCollection("FSTK")}} current={collection}/>
                  <Tooltip title="Coming Soon" arrow>
                    <div>
                      <MintingTypeButton type="Choose" description="existing collection" onClick={()=>{setCollection("Choose")}} current={collection} disabled={1&&true}/>
                    </div>
                  </Tooltip>
                  <Tooltip title="Coming Soon" arrow>
                    <div>
                      <MintingTypeButton type="ERC-1155" description="Create own collection" onClick={()=>{setCollection("ERC-1155")}} current={collection} disabled={1&&true}/>
                    </div>
                  </Tooltip>
                </Stack>
              </Grid>
              {
                mintype!=="Batch"?
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="div" sx={{fontWeight: 'normal'}}>
                      Properties&nbsp;
                      <Tooltip title="Attributes or traits to describe the item" arrow disableInteractive>
                        <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                      </Tooltip>&nbsp;
                      <Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Type</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Name</Typography>
                      </Grid>
                    </Grid>
                    {
                      singleProperties.map((property, index)=>(
                        <Grid container spacing={1} key={index} sx={index?{mt: 1}:{}}>
                          <Grid item xs={6}>
                            <TextField label="Example: Size" size="small" fullWidth value={property.type} onChange={(e)=>{handleSingleProperties('type', index, e)}}/>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField label="Example: Big" size="small" fullWidth value={property.name} onChange={(e)=>{handleSingleProperties('name', index, e)}}/>
                          </Grid>
                        </Grid>
                      ))
                    }
                  </Grid>
                </>:
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{pl: 0}}>
                      <Typography variant="h4" component="div" sx={{fontWeight: 'normal'}}>
                        Properties&nbsp;
                        <Tooltip title="Attributes or traits to describe the item" arrow disableInteractive>
                          <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                        </Tooltip>&nbsp;
                        <Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                      multiProperties.map((properties, multiIndex)=>(
                        <div key={multiIndex}>
                          <Typography variant="h5" sx={{display: 'block', color: 'origin.main'}}>{multiNames[multiIndex]}</Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Type</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Name</Typography>
                            </Grid>
                          </Grid>
                          {
                            properties.map((property, index)=>(
                              <Grid container spacing={1} key={index} sx={{pb:1}}>
                                <Grid item xs={6}>
                                  <TextField label="Example: Size" size="small" fullWidth value={property.type} onChange={(e)=>{handleMultiProperties('type', multiIndex, index, e)}}/>
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField label="Example: Big" size="small" fullWidth value={property.name} onChange={(e)=>{handleMultiProperties('name', multiIndex, index, e)}}/>
                                </Grid>
                              </Grid>
                            ))
                          }
                        </div>
                      ))
                    }
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              }
              <MHidden width="smDown">
                <Grid item xs={12}>
                  <LoadingButton loading={onProgress} variant="contained" onClick={handleMintAction} fullWidth>
                    Create
                  </LoadingButton>
                </Grid>
              </MHidden>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" spacing={2} sx={{position: 'sticky', top: isOffset?APP_BAR_DESKTOP-16:APP_BAR_DESKTOP}}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Preview</Typography>
              </Grid>
              <Grid item xs={12} sx={{width: '100%'}}>
                {
                  mintype!=="Batch"&&(
                    !file?(
                      <PaperRecord sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 500
                        }}
                      >
                        <Typography variant="body2" align="center">
                          Upload file<br/>to preview<br/>item
                        </Typography>
                      </PaperRecord>
                    ):(
                      <AssetCard
                        thumbnail={isString(file) ? file : file.preview}
                        title={singleName}
                        description={description}
                        price={price}
                        quantity={quantity}
                      />
                    )
                  )
                }
                {
                  mintype==="Batch"&&(
                    !files.length?(
                      <PaperRecord sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 500
                        }}
                      >
                        <Typography variant="body2" align="center">
                          Upload file<br/>to preview<br/>item
                        </Typography>
                      </PaperRecord>
                    ):(
                      <MultiMintGrid assets={previewFiles} multiNames={multiNames} description={description} quantity={quantity} price={price}/>
                    )
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          <MHidden width="smUp">
            <Grid item xs={12}>
              <LoadingButton loading={onProgress} variant="contained" onClick={handleMintAction} fullWidth>
                Create
              </LoadingButton>
            </Grid>
          </MHidden>
        </Grid>
      </Container>
    </RootStyle>
  );
}
