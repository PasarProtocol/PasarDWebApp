import React from 'react';
import { isString } from 'lodash';
import * as math from 'mathjs';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip, Box,
  Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { create, urlSource } from 'ipfs-http-client'
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

// components
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
  const [price, setPrice] = React.useState(0);
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [uploadedCount, setUploadedCount] = React.useState(0);
  const [singleProperties, setSingleProperties] = React.useState([{type: '', name: ''}]);
  const [multiProperties, setMultiProperties] = React.useState([]);
  const [onProgress, setOnProgress] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  const quantityRef = React.useRef();

  document.addEventListener("wheel", (event) => {  
    if (document.activeElement.type === "number") {  
      document.activeElement.blur();  
    }  
  });

  React.useEffect(async () => {
    if(mintype==="Single")
      quantityRef.current.value = 1
  }, [mintype]);
  
  React.useEffect(async () => {
    const tempArr = [...files]
    setPreviewFiles(tempArr.map((file, i)=>{
      const { name, size, preview } = file;
      return isString(file) ? file : preview
    }))
    setUploadedCount(files.length)
    if(files.length)
      setMultiProperties([...Array(files.length)].map(el=>({type: '', name: ''})))
  }, [files]);

  const handleDropSingleFile = React.useCallback(async (acceptedFiles) => {
    const accepted = acceptedFiles[0];
    if (accepted) {
      setFile({
        ...accepted,
        object: accepted,
        preview: URL.createObjectURL(accepted)
      });
    }
  }, []);

  const handleDropMultiFile = React.useCallback(
    (acceptedFiles) => {
      acceptedFiles.splice(20)
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
    setFiles(filteredItems);
  };

  const handlePutOnSale = (event) => {
    setPutOnSale(event.target.checked);
  };

  const handleChangePrice = (event) => {
    setPrice(event.target.value)
    setRcvPrice(math.round(event.target.value*98/100, 3))
  };

  const handleProperties = (key, index, e) => {
    if(mintype==="Batch"){
      const temp = [...multiProperties]
      temp[index][key] = e.target.value
      setMultiProperties(temp)
    } else {
      const temp = [...singleProperties]
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
      setSingleProperties(temp)
    }
  };
  
  const mintAction = (e) => {
    if(!file)
      return
    setOnProgress(true)
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file.object);
    reader.onloadend = async () => {
      try {
        const fileContent = Buffer.from(reader.result)
        const added = await client.add(fileContent)
        const cid = added.path;
        
        // create the metadata object we'll be storing
        const metaObj = {
          "version":"1",
          "type":"general",
          "name":"testname",
          "description":"Test description",
          "image":`feeds:image:${cid}`,
          "kind":"png",
          "size":"135121",
          "thumbnail":`feeds:image:${cid}`,
          "properties": {
            "key1": "name1",
            "key2": "name2",
          },
        }
        const jsonMetaObj = JSON.stringify(metaObj);

        // add the metadata itself as well
        const metaRecv = await client.add(jsonMetaObj);

        // create the did object we'll be storing
        const didObj = {
          "version":"1",
          "did": "did:elastos:you_did_string"
        }
        const jsonDidObj = JSON.stringify(didObj);

        // add the did file itself as well
        const didRecv = await client.add(jsonDidObj);
        // const (metaRecv.path)

        setOnProgress(false)
      } catch (error) {
        enqueueSnackbar('Error uploading file', { variant: 'error' });
      }
    }
  }
  return (
    <RootStyle title="CreateItem | PASAR">
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
              <MintingTypeButton type="Multiple" description="Multiple identical items" onClick={()=>{setMintType("Multiple")}} current={mintype}/>
              <MintingTypeButton type="Batch" description="Multiple non-identical items" onClick={()=>{setMintType("Batch")}} current={mintype}/>
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
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Upload file</Typography>
              </Grid>
              <Grid item xs={12}>
              {
                mintype!=="Batch"?
                <UploadSingleFile
                  file={file}
                  onDrop={handleDropSingleFile}
                  isAvatar={itemtype==="Avatar"}
                  onRemove={handleSingleRemove}
                  accept=".jpg, .png, .jpeg, .gif"/>:
                <>
                  <UploadMultiFile
                    showPreview={1&&true}
                    files={files}
                    onDrop={handleDropMultiFile}
                    isAvatar={itemtype==="Avatar"}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    accept=".jpg, .png, .jpeg, .gif"
                    sx={{pb:1}}/>
                  {files.length>0&&<Divider/>}
                </>
              }
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Name</Typography>
              </Grid>
              <Grid item xs={12}>
                {
                  mintype==="Batch"?(
                    <>
                      <MintBatchName uploadedCount={uploadedCount} handleNameGroup={setMultiNames}/>
                    </>
                  ):(
                    <FormControl variant="standard" sx={{width: '100%'}}>
                      <InputLabel htmlFor="input-with-name">
                        Add item name
                      </InputLabel>
                      <InputStyle
                        id="input-with-name"
                        startAdornment={' '}
                        value={singleName}
                        onChange={(e)=>{setSingleName(e.target.value)}}
                      />
                    </FormControl>
                  )
                }
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Description</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputLabel htmlFor="input-with-description">
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
                  />
                </FormControl>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Explicit & Sensitive Content&nbsp;<Icon icon="eva:info-outline" style={{marginBottom: -4}}/></Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <InputLabel sx={{ fontSize: 12, flex: 1 }}>
                    Set this item as explicit and sensitive content
                  </InputLabel>
                  <FormControlLabel
                    control={<CustomSwitch onChange={()=>{}}/>}
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
                    List on market
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
                      mintype!=="Batch"&&<ItemTypeButton type="Auction" onClick={()=>{setSaleType("Auction")}} current={saletype}/>
                    }
                  </Stack>
                }
              </Grid>
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
                <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>Platform fee 2%&nbsp;<Icon icon="eva:info-outline" style={{marginBottom: -4, fontSize: 18}}/></Typography>
                <Typography variant="body2" component="div" sx={{fontWeight: 'normal'}}>
                  You will receive
                  <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main', display: 'inline'}}> {rcvprice} ELA </Typography>
                  per item
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Royalties&nbsp;<Icon icon="eva:info-outline" style={{marginBottom: -4}}/></Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputLabel htmlFor="input-with-royalties">
                    Enter royalties (Suggested: 10%)
                  </InputLabel>
                  <InputStyle
                    type="number"
                    id="input-with-royalties"
                    defaultValue="10"
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
                    disabled={mintype==="Single"}
                    type="number"
                    inputRef={quantityRef}
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
                  <MintingTypeButton type="FSTK" description="Single item" onClick={()=>{setCollection("FSTK")}} current={collection}/>
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
                      Properties&nbsp;<Icon icon="eva:info-outline" style={{marginBottom: -4}}/>&nbsp;
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
                            <TextField label="Example: Size" size="small" fullWidth value={property.type} onChange={(e)=>{handleProperties('type', index, e)}}/>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField label="Example: Big" size="small" fullWidth value={property.name} onChange={(e)=>{handleProperties('name', index, e)}}/>
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
                        Properties&nbsp;<Icon icon="eva:info-outline" style={{marginBottom: -4}}/>&nbsp;
                        <Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                      multiProperties.map((property, index)=>(
                        <div key={index}>
                          <Typography variant="h5" sx={{display: 'block', color: 'origin.main'}}>{multiNames[index]}</Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Type</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Name</Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={1} key={index} sx={{pb:1}}>
                            <Grid item xs={6}>
                              <TextField label="Example: Size" size="small" fullWidth value={property.type} onChange={(e)=>{handleProperties('type', index, e)}}/>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField label="Example: Big" size="small" fullWidth value={property.name} onChange={(e)=>{handleProperties('name', index, e)}}/>
                            </Grid>
                          </Grid>
                        </div>
                      ))
                    }
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              }
              <Grid item xs={12}>
                <LoadingButton loading={onProgress} variant="contained" onClick={mintAction} fullWidth>
                  Create
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" spacing={2}>
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
        </Grid>
      </Container>
    </RootStyle>
  );
}
