import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  openSigninEssential: false,
  openDownloadEssential: false,
  afterSigninPath: null,
  diaBalance: 0,
  signinEssentialSuccess: false,
  pasarLinkAddress: 0,
  setOpenSigninEssentialDlg: () => {},
  setOpenDownloadEssentialDlg: () => {},
  setAfterSigninPath: () => {},
  setSigninEssentialSuccess: () => {},
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
  const [afterSigninPath, setAfterSigninPath] = useState(null);
  const [signinEssentialSuccess, setSigninEssentialSuccess] = useState(false);
  const [diaBalance, setDiaBalance] = useState(false);
  const [pasarLinkAddress, setPasarLinkAddress] = useState(0);

  return (
    <SigninContext.Provider
      value={{
        openSigninEssential,
        openDownloadEssential,
        afterSigninPath,
        signinEssentialSuccess,
        diaBalance,
        pasarLinkAddress,
        setOpenSigninEssentialDlg,
        setOpenDownloadEssentialDlg,
        setAfterSigninPath,
        setSigninEssentialSuccess,
        setDiaBalance,
        setPasarLinkAddress
      }}
    >
      {children}
    </SigninContext.Provider>
  );
}

export { SigninProvider, SigninContext };
