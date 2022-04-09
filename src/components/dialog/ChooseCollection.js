import React from 'react';
import Web3 from 'web3';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, List, ListItemButton, Button, Box, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import checkCircleIcon from '@iconify-icons/akar-icons/circle-check-fill';

import StyledButton from '../signin-dlg/StyledButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { reduceHexAddress, isInAppBrowser, fetchFrom, getIpfsUrl, getERCType } from '../../utils/common';

export default function ChooseCollection(props) {
  const { isOpen, setOpen, thisCollection, handleChoose, setERCtype } = props;
  const [selectedCollection, setSelected] = React.useState(thisCollection);
  const [collections, setCollections] = React.useState([]);

  React.useEffect(async () => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
      let essentialAddress = essentialsConnector.getWalletConnectProvider().wc.accounts[0]
      if (isInAppBrowser())
        essentialAddress = await window.elastos.getWeb3Provider().address
      
      if(essentialAddress)
        fetchFrom(`api/v2/sticker/getCollectionByOwner/${essentialAddress}`)
          .then((response) => {
            response.json().then((jsonAssets) => {
              setCollections(jsonAssets.data)
            })
          })
    }
  }, [])

  React.useEffect(() => {
    collections.forEach((item, _id)=>{
      if(!item.uri || item.avatar)
        return
      const metaUri = getIpfsUrl(item.uri)
      if(metaUri) {
        fetch(metaUri)
          .then(response => response.json())
          .then(data => {
            setCollections((prevStatus)=>{
              const tempCollections = [...prevStatus]
              tempCollections[_id].avatar = getIpfsUrl(data.data.avatar)
              return tempCollections
            })
          });
      }
    })
    
  }, [collections]);

  const choose = () => {
    getERCType(selectedCollection).then(setERCtype)
    handleChoose(selectedCollection)
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

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
          My Collections
        </Typography>
        <Typography variant="h5" color="origin.main" sx={{px: 2, pt: 1}}>
          ERC-721
        </Typography>
        <List
          sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {/* <Box component="div" sx={{ maxWidth: 200, m: 'auto', py: 2, textAlign: 'center' }}> */}
          {
            collections.map((el, i)=>(
              <ListItemButton key={i} onClick={()=>{setSelected(el.token)}} selected={selectedCollection === el.token}>
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
                    <Typography variant="h5" noWrap>
                      {el.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{lineHeight: 1.2, fontWeight: 'normal'}} noWrap>
                      Contract Address : {reduceHexAddress(el.token)}<br/>
                      Items : 0
                    </Typography>
                  </Box>
                  {
                    selectedCollection === el.token &&
                    <Box sx={{color: 'origin.main'}}><Icon icon={checkCircleIcon} width={20}/></Box>
                  }
                </Stack>
              </ListItemButton>
            ))
          }
          {/* </Box> */}
        </List>
        {
          !!selectedCollection&&
          <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
            <StyledButton variant='contained' onClick={choose}>
              OK
            </StyledButton>
          </Box>
        }
      </DialogContent>
    </Dialog>
  );
}
