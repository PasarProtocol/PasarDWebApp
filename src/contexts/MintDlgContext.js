import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  current: 1,
  isOpenMint: false,
  isOpenAccess: false,
  isReadySignForMint: false,
  isReadySignForAccess: false,
  setCurrent: () => {},
  setOpenMintDlg: () => {},
  setOpenAccessDlg: () => {},
  setReadySignForMint: () => {},
  setReadySignForAccess: () => {},
};

const MintDlgContext = createContext(initialState);

MintDlgProvider.propTypes = {
  children: PropTypes.node
};

function MintDlgProvider({ children }) {
  const [current, setCurrent] = useState(false);
  const [isOpenMint, setOpenMintDlg] = useState(false);
  const [isOpenAccess, setOpenAccessDlg] = useState(false);
  const [isReadySignForMint, setReadySignForMint] = useState(false);
  const [isReadySignForAccess, setReadySignForAccess] = useState(false);

  return (
    <MintDlgContext.Provider
      value={{
        current,
        isOpenMint,
        isOpenAccess,
        isReadySignForMint,
        isReadySignForAccess,
        setCurrent,
        setOpenMintDlg,
        setOpenAccessDlg,
        setReadySignForMint,
        setReadySignForAccess
      }}
    >
      {children}
    </MintDlgContext.Provider>
  );
}

export { MintDlgProvider, MintDlgContext };
