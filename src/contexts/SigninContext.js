import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  openSigninEssential: false,
  openDownloadEssential: false,
  afterSigninPath: null,
  setOpenSigninEssentialDlg: () => {},
  setOpenDownloadEssentialDlg: () => {},
  setAfterSigninPath: () => {},
};

const SigninContext = createContext(initialState);

SigninProvider.propTypes = {
  children: PropTypes.node
};

function SigninProvider({ children }) {
  const [openSigninEssential, setOpenSigninEssentialDlg] = useState(false);
  const [openDownloadEssential, setOpenDownloadEssentialDlg] = useState(false);
  const [afterSigninPath, setAfterSigninPath] = useState(null);

  return (
    <SigninContext.Provider
      value={{
        openSigninEssential,
        openDownloadEssential,
        afterSigninPath,
        setOpenSigninEssentialDlg,
        setOpenDownloadEssentialDlg,
        setAfterSigninPath,
      }}
    >
      {children}
    </SigninContext.Provider>
  );
}

export { SigninProvider, SigninContext };
