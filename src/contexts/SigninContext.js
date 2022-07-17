import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  openTopAlert: false,
  openSigninEssential: false,
  openDownloadEssential: false,
  afterSigninPath: null,
  diaBalance: 0,
  signinEssentialSuccess: false,
  elaConnectivityService: null,
  pasarLinkAddress: 0,
  pasarLinkChain: 0,
  setOpenTopAlert: () => {},
  setOpenSigninEssentialDlg: () => {},
  setOpenDownloadEssentialDlg: () => {},
  setAfterSigninPath: () => {},
  setSigninEssentialSuccess: () => {},
  setElastosConnectivityService: () => {},
  setDiaBalance: () => {},
  setPasarLinkAddress: () => {},
  setPasarLinkChain: () => {}
};

const SigninContext = createContext(initialState);

SigninProvider.propTypes = {
  children: PropTypes.node
};

function SigninProvider({ children }) {
  const [openTopAlert, setOpenTopAlert] = useState(false);
  const [openSigninEssential, setOpenSigninEssentialDlg] = useState(false);
  const [openDownloadEssential, setOpenDownloadEssentialDlg] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);
  const [afterSigninPath, setAfterSigninPath] = useState(null);
  const [signinEssentialSuccess, setSigninEssentialSuccess] = useState(false);
  const [elaConnectivityService, setElastosConnectivityService] = useState(false);
  const [diaBalance, setDiaBalance] = useState(0);
  const [pasarLinkAddress, setPasarLinkAddress] = useState(0);
  const [pasarLinkChain, setPasarLinkChain] = useState(0);

  return (
    <SigninContext.Provider
      value={{
        openTopAlert,
        openSigninEssential,
        openDownloadEssential,
        openCredentials,
        afterSigninPath,
        signinEssentialSuccess,
        elaConnectivityService,
        diaBalance,
        pasarLinkAddress,
        pasarLinkChain,
        setOpenTopAlert,
        setOpenSigninEssentialDlg,
        setOpenDownloadEssentialDlg,
        setOpenCredentials,
        setAfterSigninPath,
        setSigninEssentialSuccess,
        setElastosConnectivityService,
        setDiaBalance,
        setPasarLinkAddress,
        setPasarLinkChain
      }}
    >
      {children}
    </SigninContext.Provider>
  );
}

export { SigninProvider, SigninContext };
