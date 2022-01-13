import React from 'react';
import { isString } from 'lodash';
import * as math from 'mathjs';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip  } from '@mui/material';
import { Icon } from '@iconify/react';
// components
import Page from '../../components/Page';
import MintingTypeButton from '../../components/marketplace/MintingTypeButton';
import ItemTypeButton from '../../components/marketplace/ItemTypeButton';
import { UploadMultiFile, UploadSingleFile } from '../../components/upload';
import AssetCard from '../../components/marketplace/AssetCard';
import PaperRecord from '../../components/PaperRecord';
import CustomSwitch from '../../components/custom-switch';
import CoinSelect from '../../components/marketplace/CoinSelect';
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
  const [files, setFiles] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [isPutOnSale, setPutOnSale] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [properties, setProperties] = React.useState([{type: '', name: ''}]);

  React.useEffect(async () => {
    
  }, []);
  
  const handleDropSingleFile = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file)
    if (file) {
      setFile({
        ...file,
        preview: URL.createObjectURL(file)
      });
    }
  }, []);

  const handleDropMultiFile = React.useCallback(
    (acceptedFiles) => {
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
    const temp = [...properties]
    temp[index][key] = e.target.value
    if(!temp[index].type.length&&!temp[index].name.length){
      if(temp.length>1&&index<temp.length-1)
        temp.splice(index, 1)
    }
    else if(!temp[index].type.length||!temp[index].name.length){
      if(!temp[temp.length-1].type.length&&!temp[temp.length-1].name.length)
        temp.splice(temp.length-1, 1)
    }
    else if(temp[index].type.length&&temp[index].name.length){
      if(temp.findIndex((item)=>(!item.type.length||!item.name.length))<0)
        temp.push({type: '', name: ''})
    }
    setProperties(temp)
  };
  
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
                <Stack spacing={1} direction="row">
                  <UploadSingleFile file={file} onDrop={handleDropSingleFile} isAvatar={itemtype==="Avatar"} onRemove={handleSingleRemove} accept=".jpg, .png, .jpeg, .gif"/>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Name</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputLabel htmlFor="input-with-name">
                    Add item name
                  </InputLabel>
                  <InputStyle
                    id="input-with-name"
                    startAdornment={' '}
                  />
                </FormControl>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Description</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputLabel htmlFor="input-with-description">
                    Add item description
                  </InputLabel>
                  <InputStyle
                    id="input-with-description"
                    startAdornment={' '}
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
                    <ItemTypeButton type="Auction" onClick={()=>{setSaleType("Auction")}} current={saletype}/>
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
                    id="input-with-quantity"
                    defaultValue="1"
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
                      <MintingTypeButton type="Choose existing" description="collection" onClick={()=>{setCollection("Choose existing")}} current={collection} disabled={1&&true}/>
                    </div>
                  </Tooltip>
                  <Tooltip title="Coming Soon" arrow>
                    <div>
                      <MintingTypeButton type="ERC-1155" description="Create own collection" onClick={()=>{setCollection("ERC-1155")}} current={collection} disabled={1&&true}/>
                    </div>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" component="div" sx={{fontWeight: 'normal'}}>
                  Properties&nbsp;<Icon icon="eva:info-outline" style={{marginBottom: -4}}/>&nbsp;
                  <Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Type</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Name</Typography>
                  </Grid>
                </Grid>
                {
                  properties.map((property, index)=>(
                    <Grid container spacing={1} key={index} sx={index?{mt: 1}:{}}>
                      <Grid item md={6}>
                        <TextField label="Example: Size" size="small" fullWidth value={property.type} onChange={(e)=>{handleProperties('type', index, e)}}/>
                      </Grid>
                      <Grid item md={6}>
                        <TextField label="Example: Big" size="small" fullWidth value={property.name} onChange={(e)=>{handleProperties('name', index, e)}}/>
                      </Grid>
                    </Grid>
                  ))
                }
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth>
                  Create
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Preview</Typography>
              </Grid>
              <Grid item xs={12}>
                {
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
                      title={file.name && file.name}
                    />
                  )
                }
                {/* <AssetGrid assets={assets}/> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
