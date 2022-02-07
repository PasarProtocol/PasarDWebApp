import { useContext } from 'react';
import { MintDlgContext } from '../contexts/MintDlgContext';

// ----------------------------------------------------------------------

const useMintDlg = () => useContext(MintDlgContext);

export default useMintDlg;