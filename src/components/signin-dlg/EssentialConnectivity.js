import { useContext } from "react";
import { EssentialsConnector } from "@elastosfoundation/essentials-connector-client-browser";
import { connectivity } from "@elastosfoundation/elastos-connectivity-sdk-js";


export const essentialsConnector = new EssentialsConnector();

let connectivityInitialized = false;

export function useConnectivitySDK() {

  if (connectivityInitialized)
    return;

  console.log("Preparing the Elastos connectivity SDK");
  
  connectivity.registerConnector(essentialsConnector).then(() => {
    connectivityInitialized = true;

    console.log("essentialsConnector", essentialsConnector)
    console.log("Wallet connect provider", essentialsConnector.getWalletConnectProvider());

    const hasLink = isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession();
    console.log("Has link to essentials?", hasLink);

    // Restore the wallet connect session - TODO: should be done by the connector itself?
    if (hasLink && !essentialsConnector.getWalletConnectProvider().connected)
      essentialsConnector.getWalletConnectProvider().enable();
  });
}

export function isUsingEssentialsConnector() {
  const activeConnector = connectivity.getActiveConnector();
  if(!activeConnector) return false;
  return activeConnector && activeConnector.name === essentialsConnector.name;
}