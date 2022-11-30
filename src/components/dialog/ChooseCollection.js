import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItemButton,
  Box,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import checkCircleIcon from '@iconify-icons/akar-icons/circle-check-fill';
import StyledButton from '../signin-dlg/StyledButton';
import { essentialsConnector } from '../signin-dlg/EssentialConnectivity';
import { reduceHexAddress, isInAppBrowser, chainTypes, fetchAPIFrom, getImageFromIPFSUrl } from '../../utils/common';

ChooseCollection.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  chainType: PropTypes.string,
  setERCtype: PropTypes.func,
  handleChoose: PropTypes.func
};

export default function ChooseCollection(props) {
  const { isOpen, setOpen, handleChoose, setERCtype, chainType } = props;
  const [selectedId, setSelectedId] = React.useState(-1);
  const [collections, setCollections] = React.useState([]);
  const [controller, setAbortController] = React.useState(new AbortController());

  React.useEffect(() => {
    const fetchData = async () => {
      if (sessionStorage.getItem('PASAR_LINK_ADDRESS') === '2') {
        controller.abort(); // cancel the previous request
        const newController = new AbortController();
        const { signal } = newController;
        setAbortController(newController);
        let essentialAddress = essentialsConnector.getWalletConnectProvider().wc.accounts[0];
        if (isInAppBrowser()) essentialAddress = await window.elastos.getWeb3Provider().address;

        const chain = chainTypes.find((item) => item.symbol === chainType).token.toLowerCase();
        if (essentialAddress) {
          try {
            const res = await fetchAPIFrom(
              `api/v1/getCollectionsByWalletAddr?pageNum=1&pageSize=30&chain=${chain}&walletAddr=${essentialAddress}`,
              { signal }
            );
            const json = await res.json();
            const cols = json?.data.data || [];
            const resCols = cols.map((item, index) => {
              const rlt = { ...item };
              return { ...rlt, index, avatar: getImageFromIPFSUrl(rlt?.data?.avatar) };
            });
            setCollections(resCols);
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainType]);

  const choose = () => {
    setERCtype(collections[selectedId].is721 ? 0 : 1);
    handleChoose(collections[selectedId]);
    setOpen(false);
  };

  const collectionClasses = [
    { type: 'ERC-721', collections: collections.filter((el) => el.is721) },
    { type: 'ERC-1155', collections: collections.filter((el) => !el.is721) }
  ];

  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)}>
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
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
          {collections.length > 0 ? 'My Collections' : 'No Collections Found'}
        </Typography>
        {collectionClasses.map(
          (classEl, _i) =>
            classEl.collections.length > 0 && (
              <Box key={_i}>
                <Typography variant="h5" color="origin.main" sx={{ px: 2, pt: 1 }}>
                  {classEl.type}
                </Typography>
                <List
                  sx={{ width: '100%', bgcolor: 'unset', pt: 0 }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  {classEl.collections.map((el, i) => (
                    <ListItemButton
                      key={i}
                      onClick={() => {
                        setSelectedId(el.index);
                      }}
                      selected={selectedId === el.index}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          draggable={false}
                          component={el.avatar ? 'img' : 'div'}
                          alt=""
                          src={el.avatar}
                          onError={(e) => (e.target.src = '/static/broken-image.svg')}
                          sx={{ width: 56, height: 56, borderRadius: '100%', backgroundColor: 'black' }}
                        />
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography variant="h5" sx={{ wordBreak: 'break-all' }}>
                            {el.name}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.2, fontWeight: 'normal' }}
                            noWrap
                          >
                            Contract Address : {reduceHexAddress(el.token)}
                            <br />
                            Items : {el.items}
                          </Typography>
                        </Box>
                        {selectedId === el.index && (
                          <Box sx={{ color: 'origin.main' }}>
                            <Icon icon={checkCircleIcon} width={20} />
                          </Box>
                        )}
                      </Stack>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            )
        )}
        {selectedId >= 0 && (
          <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
            <StyledButton variant="contained" onClick={choose}>
              OK
            </StyledButton>
          </Box>
        )}
        {collections.length === 0 && (
          <>
            <Typography variant="h5" sx={{ color: 'text.secondary', py: 2 }} align="center">
              We could not find any of your collections
            </Typography>
            <Box component="div" sx={{ width: 'fit-content', m: 'auto', py: 2 }}>
              <StyledButton variant="contained" component={RouterLink} to="/collections/create">
                Create New Collection
              </StyledButton>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
