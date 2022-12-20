import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { ApplicationDID } from '../../config';

export const essentialsConnector = new EssentialsConnector();
let connectivityInitialized = false;

export const initConnectivitySDK = () => {
  if (connectivityInitialized) return;
  // unregistear if already registerd
  const arrIConnectors = connectivity.getAvailableConnectors();
  if (arrIConnectors.findIndex((option) => option.name === essentialsConnector.name) !== -1) {
    connectivity.unregisterConnector(essentialsConnector.name);
  }

  connectivity.registerConnector(essentialsConnector).then(() => {
    connectivity.setApplicationDID(ApplicationDID);
    connectivityInitialized = true;
    const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
    // Restore the wallet connect session - TODO: should be done by the connector itself?
    if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
      essentialsConnector.getWalletConnectProvider().enable();
  });
};

export const isUsingEssentialsConnector = () => {
  const activeConnector = connectivity.getActiveConnector();
  return activeConnector && activeConnector.name === essentialsConnector.name;
};
