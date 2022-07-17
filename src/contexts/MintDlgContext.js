import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  current: 1,
  totalSteps: 1,
  isOpenMint: false,
  isOpenAccess: false,
  isReadySignForMint: false,
  isReadySignForAccess: false,
  setCurrent: () => {},
  setTotalSteps: () => {},
  setOpenMintDlg: () => {},
  setOpenAccessDlg: () => {},
  setReadySignForMint: () => {},
  setReadySignForAccess: () => {},
  setApprovalFunction: () => {},
};

const MintDlgContext = createContext(initialState);

MintDlgProvider.propTypes = {
  children: PropTypes.node
};

function MintDlgProvider({ children }) {
  const [current, setCurrent] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);
  const [isOpenMint, setOpenMintDlg] = useState(false);
  const [isOpenAccess, setOpenAccessDlg] = useState(false);
  const [isReadySignForMint, setReadySignForMint] = useState(false);
  const [isReadySignForAccess, setReadySignForAccess] = useState(false);
  const [approvalFunction, setApprovalFunction] = useState(()=>{});

  return (
    <MintDlgContext.Provider
      value={{
        current,
        totalSteps,
        isOpenMint,
        isOpenAccess,
        isReadySignForMint,
        isReadySignForAccess,
        approvalFunction,
        setCurrent,
        setTotalSteps,
        setOpenMintDlg,
        setOpenAccessDlg,
        setReadySignForMint,
        setReadySignForAccess,
        setApprovalFunction
      }}
    >
      {children}
    </MintDlgContext.Provider>
  );
}

export { MintDlgProvider, MintDlgContext };
