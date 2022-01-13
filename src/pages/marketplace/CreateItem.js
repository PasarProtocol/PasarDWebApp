import React from 'react';
import { isString } from 'lodash';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link } from '@mui/material';
// components
import Page from '../../components/Page';
import MintingTypeButton from '../../components/marketplace/MintingTypeButton';
import ItemTypeButton from '../../components/marketplace/ItemTypeButton';
import { UploadMultiFile, UploadSingleFile } from '../../components/upload';
import AssetCard from '../../components/marketplace/AssetCard';
import PaperRecord from '../../components/PaperRecord';
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

// ----------------------------------------------------------------------

export default function Collectible() {
  const [mintype, setMintType] = React.useState("Single");
  const [itemtype, setItemType] = React.useState("General");
  const [files, setFiles] = React.useState([]);
  const [file, setFile] = React.useState(null);
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
              <ItemTypeButton type="General" description="Single item" onClick={()=>{setItemType("General")}} current={itemtype}/>
              <ItemTypeButton type="Avatar" description="Multiple identical items" onClick={()=>{setItemType("Avatar")}} current={itemtype}/>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Upload file</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1} direction="row">
                  <UploadSingleFile file={file} onDrop={handleDropSingleFile} onRemove={handleSingleRemove} accept=".jpg, .png, .jpeg, .gif"/>
                </Stack>
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
                    // <span>ss</span>
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
