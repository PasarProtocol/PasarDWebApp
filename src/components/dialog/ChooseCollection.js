import React from 'react';
import Web3 from 'web3';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, List, ListItemButton, Button, Box, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import checkCircleIcon from '@iconify-icons/akar-icons/circle-check-fill';

import StyledButton from '../signin-dlg/StyledButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { reduceHexAddress, isInAppBrowser, fetchFrom, getIpfsUrl, getERCType, chainTypes } from '../../utils/common';

export default function ChooseCollection(props) {
  const location = useLocation();
  const { token } = location.state || {}
  const { isOpen, setOpen, handleChoose, setERCtype, chainType } = props;
  const [selectedId, setSelectedId] = React.useState(-1);
  const [collections, setCollections] = React.useState([]);
  const [controller, setAbortController] = React.useState(new AbortController());

  React.useEffect(async () => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      controller.abort(); // cancel the previous request
      const newController = new AbortController();
      const { signal } = newController;
      setAbortController(newController);
      let essentialAddress = essentialsConnector.getWalletConnectProvider().wc.accounts[0]
      if (isInAppBrowser())
        essentialAddress = await window.elastos.getWeb3Provider().address
      
      const chainParam = chainTypes.findIndex(item=>item.symbol===chainType)
      if(essentialAddress)
        fetchFrom(`api/v2/sticker/getCollectionByOwner/${essentialAddress}?marketPlace=${chainParam}`, { signal })
          .then((response) => {
            response.json().then((jsonCollections) => {
              if(!jsonCollections.data)
                return
              const tempCollections = jsonCollections.data.map((item, index)=>{
                const tempItem = {...item, avatar: '', index}
                return tempItem
              })
              setCollections(tempCollections)
            })
          })
          .catch(error=>{})
    }
  }, [chainType])

  React.useEffect(() => {
  }, [collections]);

  React.useEffect(() => {
    if(token) {
      const tokenIndex = collections.findIndex(item=>item.token===token)
      if(tokenIndex>=0) {
        // console.log(collections[tokenIndex])
        setSelectedId(tokenIndex)
        setERCtype(collections[tokenIndex].is721?0:1)
        // getERCType(collections[tokenIndex].token).then(setERCtype)
        const tempCollection = collections[tokenIndex]
        if(!tempCollection.uri || tempCollection.avatar) {
          handleChoose(tempCollection)
        } else {
          const metaUri = getIpfsUrl(tempCollection.uri)
          if(metaUri) {
            fetch(metaUri)
              .then(response => response.json())
              .then(data => {
                handleChoose({...tempCollection, avatar: getIpfsUrl(data.data.avatar)})
              })
              .catch(console.log);
          }
        }
      }
    }
    
    if(collections.length) {
      collections.forEach((item, _i)=>{
        fetchFrom(`api/v2/sticker/getTotalCountCollectibles/${item.token}?marketPlace=${item.marketPlace}`)
          .then((response) => {
            response.json().then((jsonData) => {
              setCollections((prevStatus)=>{
                const tempCollections = [...prevStatus]
                tempCollections[_i].items = jsonData.data.total
                return tempCollections
              })
            })
          })
        
        if(!item.uri || item.avatar)
          return
        const metaUri = getIpfsUrl(item.uri)
        if(metaUri) {
          fetch(metaUri)
            .then(response => response.json())
            .then(data => {
              setCollections((prevStatus)=>{
                const tempCollections = [...prevStatus]
                tempCollections[_i].avatar = getIpfsUrl(data.data.avatar)
                return tempCollections
              })
            })
            .catch(console.log);
        }
      })
    }
  }, [collections.length]);

  const choose = () => {
    setERCtype(collections[selectedId].is721?0:1)
    // getERCType(collections[selectedId].token).then(setERCtype)
    handleChoose(collections[selectedId])
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const collectionClasses = [{type: "ERC-721", collections: collections.filter(el=>el.is721)}, {type: "ERC-1155", collections: collections.filter(el=>!el.is721)}]
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h3" component="div" sx={{ color: 'text.primary' }} align="center">
          {collections.length>0?"My Collections":"No Collections Found"}
        </Typography>
        {
          collectionClasses.map((classEl, _i) => (
            classEl.collections.length>0&&
            <Box key={_i}>
              <Typography variant="h5" color="origin.main" sx={{px: 2, pt: 1}}>
                {classEl.type}
              </Typography>
              <List
                sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                {
                  classEl.collections.map((el, i)=>(
                    <ListItemButton key={i} onClick={()=>{setSelectedId(el.index)}} selected={selectedId === el.index}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            draggable = {false}
                            component={el.avatar?"img":"div"}
                            alt=''
                            src={el.avatar}
                            onError={(e) => e.target.src = '/static/broken-image.svg'}
                            sx={{ width: 56, height: 56, borderRadius: '100%', backgroundColor: 'black' }}
                        />
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography variant="h5" sx={{wordBreak: 'break-all'}}>
                            {el.name}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary" sx={{lineHeight: 1.2, fontWeight: 'normal'}} noWrap>
                            Contract Address : {reduceHexAddress(el.token)}<br/>
                            Items : {el.items}
                          </Typography>
                        </Box>
                        {
                          selectedId === el.index &&
                          <Box sx={{color: 'origin.main'}}><Icon icon={checkCircleIcon} width={20}/></Box>
                        }
                      </Stack>
                    </ListItemButton>
                  ))
                }
              </List>
            </Box>
          ))
        }
        {
          selectedId>=0&&
          <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
            <StyledButton variant='contained' onClick={choose}>
              OK
            </StyledButton>
          </Box>
        }
        {
          collections.length===0&&
          <>
            <Typography variant="h5" sx={{ color: 'text.secondary', py: 2 }} align='center'>We could not find any of your collections</Typography>
            <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
              <StyledButton variant='contained' component={RouterLink} to="/collections/create">
                Create New Collection
              </StyledButton>
            </Box>
          </>
        }
      </DialogContent>
    </Dialog>
  );
}
