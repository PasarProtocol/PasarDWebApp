import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  openSigninEssential: false,
  openDownloadEssential: false,
  afterSigninPath: null,
  signinEssentialSuccess: false,
  setOpenSigninEssentialDlg: () => {},
  setOpenDownloadEssentialDlg: () => {},
  setAfterSigninPath: () => {},
  setSigninEssentialSuccess: () => {}
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

  return (
    <SigninContext.Provider
      value={{
        openSigninEssential,
        openDownloadEssential,
        afterSigninPath,
        signinEssentialSuccess,
        setOpenSigninEssentialDlg,
        setOpenDownloadEssentialDlg,
        setAfterSigninPath,
        setSigninEssentialSuccess
      }}
    >
      {children}
    </SigninContext.Provider>
  );
}

export { SigninProvider, SigninContext };
