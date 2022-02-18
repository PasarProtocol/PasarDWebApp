import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  openSigninEssential: false,
  openDownloadEssential: false,
  afterSigninPath: null,
  diaBalance: 0,
  signinEssentialSuccess: false,
  elaConnectivityService: null,
  pasarLinkAddress: 0,
  setOpenSigninEssentialDlg: () => {},
  setOpenDownloadEssentialDlg: () => {},
  setAfterSigninPath: () => {},
  setSigninEssentialSuccess: () => {},
  setElastosConnectivityService: () => {},
  setDiaBalance: () => {},
  setPasarLinkAddress: () => {}
};

const SigninContext = createContext(initialState);

SigninProvider.propTypes = {
  children: PropTypes.node
};

function SigninProvider({ children }) {
  const [openSigninEssential, setOpenSigninEssentialDlg] = useState(false);
  const [openDownloadEssential, setOpenDownloadEssentialDlg] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [afterSigninPath, setAfterSigninPath] = useState(null);
  const [signinEssentialSuccess, setSigninEssentialSuccess] = useState(false);
  const [elaConnectivityService, setElastosConnectivityService] = useState(false);
  const [diaBalance, setDiaBalance] = useState(false);
  const [pasarLinkAddress, setPasarLinkAddress] = useState(0);

  return (
    <SigninContext.Provider
      value={{
        openSigninEssential,
        openDownloadEssential,
        openVerification,
        afterSigninPath,
        signinEssentialSuccess,
        elaConnectivityService,
        diaBalance,
        pasarLinkAddress,
        setOpenSigninEssentialDlg,
        setOpenDownloadEssentialDlg,
        setOpenVerification,
        setAfterSigninPath,
        setSigninEssentialSuccess,
        setElastosConnectivityService,
        setDiaBalance,
        setPasarLinkAddress
      }}
    >
      {children}
    </SigninContext.Provider>
  );
}

export { SigninProvider, SigninContext };
