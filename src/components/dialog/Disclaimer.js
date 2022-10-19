import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Container,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledButton from '../signin-dlg/StyledButton';

const checkboxStyle = {
  '&.Mui-checked': {
    color: 'text.primary'
  },
  '&.MuiCheckbox-indeterminate': {
    color: 'text.secondary'
  }
};

Disclaimer.propTypes = {
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func
};

export default function Disclaimer(props) {
  const { isOpen, setOpen } = props;
  const [checkedAgree, setCheckedAgree] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckAgreement = (event) => {
    setCheckedAgree(event.target.checked);
  };

  const handleConfirm = () => {
    localStorage.setItem('pa-yes', 1);
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
      <DialogContent sx={{ display: 'grid' }}>
        <Container
          sx={{
            mt: 2,
            maxHeight: 500,
            overflowY: 'auto',
            scrollbarColor: '#d4aa70 #e4e4e4',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: 8
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#e4e4e4',
              borderRadius: 100
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 100,
              backgroundColor: '#0000003b',
              boxShadow: 'inset 2px 2px 5px 0 rgba(#fff, 0.5)'
            }
          }}
        >
          <Typography variant="subtitle1">
            The Pasar team is not liable for any losses resulting from using services provided by Pasar (and its
            suppliers), including but not limited to direct, indirect, incidental, punitive, and incurred losses:
          </Typography>
          <Typography variant="body2" component="div">
            <ol style={{ listStyleType: 'number', marginInlineStart: 16, marginBlock: '1em' }}>
              <li>
                User errors, such as password loss, illegal transactions, personal information leakage, or incorrect
                address inputs, and more
              </li>
              <li>Data loss, damage, or server failure</li>
              <li>Loss caused by business interruption</li>
              <li>
                Vulnerabilities or any type of program problems such as wallets and smart contracts, and any other
                functional problems related to the blockchain or encrypted assets such as forks and technical node
                problems
              </li>
              <li>
                Any unauthorized third party activities, including but not limited to the use of viruses, phishing,
                brute force, or other attack methods on services or encrypted assets
              </li>
              <li>
                Losses caused by the use of the services of this platform include, but are not limited to, legal issues,
                contract liability issues, economic issues, etc.
              </li>
              <li>
                Any indirect, special, or incidental loss or damage caused by infringement (including negligence),
                breach of contract or any other reason, regardless of whether such losses or damages can be reasonably
                foreseen by the Pasar team, and regardless of whether the Pasar team has been notified of the
                possibilities of such losses or damages in advance
              </li>
              <li>
                Any other losses related to the services provided by the Pasar platform that are not caused by the Pasar
                team
              </li>
              <li>
                The Pasar team does not make any explicit or implied guarantees for the use of the services of the Pasar
                platform, including but not limited to: the applicability of the services provided by this platform,
                errors or omissions, continuity, accuracy, reliability, and applicability to a particular use. In
                addition, the Pasar team does not make any promises or guarantees regarding the validity, accuracy,
                correctness, reliability, quality, stability, completeness, or timeliness of the technology and
                information relating to the services provided by the Pasar platform. Using the services provided by this
                platform is a personal choice taken by users at their own risk. The Pasar team does not make any
                explicit or implied guarantees regarding the market, value, or price of digital assets. Please be aware
                that the digital asset market is unstable, and the market can fluctuate or collapse at any time. Trading
                digital assets is a personal choice users take at their own risk, and users should be able to bear any
                potential losses independently.
              </li>
            </ol>
          </Typography>
          <Typography variant="subtitle1">
            The Pasar team does not provide any evaluation or comments as to whether the services provided by Pasar (and
            its suppliers) comply with the laws and regulations or relevant policy requirements of any particular
            jurisdiction. It is strongly recommended that users strictly abide by the laws of their respective
            jurisdictions.
          </Typography>
        </Container>
        <Stack direction="row" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', flex: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={checkedAgree} onChange={handleCheckAgreement} sx={checkboxStyle} />}
              label="I've read, understood and agreed to PASAR service agreement"
            />
          </Box>
          <StyledButton variant="contained" disabled={!checkedAgree} onClick={handleConfirm}>
            CONFIRM
          </StyledButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
