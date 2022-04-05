import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  updateCount: 0,
  setUpdateCount: () => {},
};

const AuctionDlgContext = createContext(initialState);

AuctionDlgProvider.propTypes = {
  children: PropTypes.node
};

function AuctionDlgProvider({ children }) {
  const [updateCount, setUpdateCount] = useState(0);

  return (
    <AuctionDlgContext.Provider
      value={{
        updateCount,
        setUpdateCount
      }}
    >
      {children}
    </AuctionDlgContext.Provider>
  );
}

export { AuctionDlgProvider, AuctionDlgContext };
