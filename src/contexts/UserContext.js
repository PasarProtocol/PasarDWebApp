import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  user: {},
  openTopAlert: false,
  openSignInDlg: false,
  openDownloadEEDlg: false,
  navigationPath: null,
  wallet: {},
  openCredentials: false,
  elaConnectivityService: null,
  setUser: () => {},
  setOpenTopAlert: () => {},
  setOpenSignInDlg: () => {},
  setOpenDownloadEEDlg: () => {},
  setNavigationPath: () => {},
  setWallet: () => {},
  setOpenCredentials: () => {},
  setElastosConnectivityService: () => {}
};

const UserContext = createContext(initialState);

UserContextProvider.propTypes = {
  children: PropTypes.node
};

function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    link: sessionStorage.getItem('PASAR_LINK_ADDRESS'),
    did: sessionStorage.getItem('PASAR_DID'),
    token: sessionStorage.getItem('PASAR_TOKEN'),
    kycedProof: sessionStorage.getItem('KYCedProof'),
    avatar: '',
    didDoc: undefined,
    credentials: {}
  });
  const [openTopAlert, setOpenTopAlert] = useState(false);
  const [openSignInDlg, setOpenSignInDlg] = useState(false);
  const [openDownloadEEDlg, setOpenDownloadEEDlg] = useState(false);
  const [navigationPath, setNavigationPath] = useState(null);
  const [wallet, setWallet] = useState({ address: '', chainId: 0, diaBalance: 0 });
  const [openCredentials, setOpenCredentials] = useState(false);
  const [elaConnectivityService, setElastosConnectivityService] = useState(null);

  return (
    <UserContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        user,
        openTopAlert,
        openSignInDlg,
        openDownloadEEDlg,
        navigationPath,
        wallet,
        openCredentials,
        elaConnectivityService,
        setUser,
        setOpenTopAlert,
        setOpenSignInDlg,
        setOpenDownloadEEDlg,
        setNavigationPath,
        setWallet,
        setOpenCredentials,
        setElastosConnectivityService
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { UserContextProvider, UserContext, useUserContext };
