import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { ApplicationDID } from '../../config';

export const essentialsConnector = new EssentialsConnector();

let connectivityInitialized = false;

export function initConnectivitySDK() {
  if (connectivityInitialized) return;

  console.log('Preparing the Elastos connectivity SDK');

  // unregistear if already registerd
  const arrIConnectors = connectivity.getAvailableConnectors();
  if (arrIConnectors.findIndex((option) => option.name === essentialsConnector.name) !== -1) {
    connectivity.unregisterConnector(essentialsConnector.name);
    console.log('unregister connector succeed.');
  }

  connectivity.registerConnector(essentialsConnector).then(() => {
    connectivity.setApplicationDID(ApplicationDID);
    connectivityInitialized = true;

    console.log('essentialsConnector', essentialsConnector);
    console.log('Wallet connect provider', essentialsConnector.getWalletConnectProvider());

    const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
    console.log('Has link to essentials?', hasLink);

    // Restore the wallet connect session - TODO: should be done by the connector itself?
    if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
      essentialsConnector.getWalletConnectProvider().enable();
  });
}

export function isUsingEssentialsConnector() {
  const activeConnector = connectivity.getActiveConnector();
  return activeConnector && activeConnector.name === essentialsConnector.name;
}
