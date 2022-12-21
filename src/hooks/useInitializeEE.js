import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { isInAppBrowser, checkValidChain } from '../utils/common';
import { essentialsConnector, initConnectivitySDK } from '../components/signin-dlg/EssentialConnectivity';
import useConnectEE from './useConnectEE';

export default function useInitializeEE() {
  const [walletConnectProvider] = useState(essentialsConnector.getWalletConnectProvider());
  const { enqueueSnackbar } = useSnackbar();
  const { signOutWithEssentials } = useConnectEE();

  initConnectivitySDK();

  useEffect(() => {
    const handleEEAccountsChanged = (accounts) => {
      console.log('Account Changed: ', accounts);
    };
    const handleEEChainChanged = (chainId) => {
      console.log('ChainId Changed', chainId);
      if (chainId && !checkValidChain(chainId)) showChainErrorSnackBar();
    };
    const handleEEDisconnect = (code, reason) => {
      console.log('Disconnect code: ', code, ', reason: ', reason);
      signOutWithEssentials();
    };
    const handleEEError = (code, reason) => {
      console.error(code, reason);
    };

    if (isInAppBrowser()) {
      const inAppProvider = window.elastos.getWeb3Provider();
      const inAppWeb3 = new Web3(inAppProvider);
      inAppWeb3.eth.getChainId().then((chainId) => {
        if (chainId && !checkValidChain(chainId)) showChainErrorSnackBar();
      });
    } else {
      walletConnectProvider.on('accountsChanged', handleEEAccountsChanged);
      walletConnectProvider.on('chainChanged', handleEEChainChanged);
      walletConnectProvider.on('disconnect', handleEEDisconnect);
      walletConnectProvider.on('error', handleEEError);
    }
    return () => {
      if (walletConnectProvider.removeListener) {
        walletConnectProvider.removeListener('accountsChanged', handleEEAccountsChanged);
        walletConnectProvider.removeListener('chainChanged', handleEEChainChanged);
        walletConnectProvider.removeListener('disconnect', handleEEDisconnect);
        walletConnectProvider.removeListener('error', handleEEError);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnectProvider]);

  const showChainErrorSnackBar = async () => {
    enqueueSnackbar('Wrong network, only Elastos Smart Chain is supported', {
      variant: 'error',
      anchorOrigin: { horizontal: 'right', vertical: 'top' }
    });
  };
}
