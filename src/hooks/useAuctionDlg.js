import { useContext } from 'react';
import { AuctionDlgContext } from '../contexts/AuctionDlgContext';

// ----------------------------------------------------------------------

const useAuctionDlg = () => useContext(AuctionDlgContext);

export default useAuctionDlg;