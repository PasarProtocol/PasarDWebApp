import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  user: {},
  setUser: () => {}
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
    address: sessionStorage.getItem('PASAR_ADDRESS'),
    kycedProof: sessionStorage.getItem('KYCedProof')
  });

  return (
    <UserContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { UserContextProvider, UserContext, useUserContext };
