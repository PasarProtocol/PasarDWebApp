import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';
import sharpContentCopy from '@iconify/icons-ic/sharp-content-copy';
import { Icon } from '@iconify/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { reduceHexAddress } from '../utils/common';
// ----------------------------------------------------------------------

AddressCopyButton.propTypes = {
  address: PropTypes.string,
  type: PropTypes.string
};

export default function AddressCopyButton(props) {
  const { address, type = '' } = props;
  const { enqueueSnackbar } = useSnackbar();
  const onCopy = () => {
    enqueueSnackbar('Copied to clipboard', { variant: 'success' });
  };

  const startIcon = {};
  switch (type) {
    case 'contract':
      startIcon.startIcon = <Icon icon="teenyicons:contract-outline" width="18px" />;
      break;
    case 'diamond':
      startIcon.startIcon = <Icon icon="mdi-light:diamond" width="18px" />;
      break;
    default:
      break;
  }

  return (
    <CopyToClipboard text={address} onCopy={onCopy}>
      <Button
        variant="outlined"
        endIcon={<Icon icon={sharpContentCopy} width="17px" />}
        {...startIcon}
        color="inherit"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {reduceHexAddress(address)}
      </Button>
    </CopyToClipboard>
  );
}
