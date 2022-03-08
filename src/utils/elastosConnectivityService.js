// import {
//   Claim,
//   CredentialDisclosureRequest,
//   DIDAccess
// } from "@elastosfoundation/elastos-connectivity-sdk-js/typings/did";
import { connectivity, DID as ConnDID, DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { EssentialsConnector } from "@elastosfoundation/essentials-connector-client-browser";

/**
 * Elastos Connectivity Service
 *
 * Responsible for interacting with the Elastos Connectivity Client JS SDK
 *
 * Notes on the connectivity client:
 * The connectivity client require first a "connector", a connector is an identity provider (a wallet).
 * In our case Elastos essentials
 * The SDK then use WalletConnect, a web3 standard to connect blockchain wallets to DApps and get infos from the wallet.
 * In our case we are using Essentials as the main connector.
 *
 * The SDK Connectivity is stateful.
 * Stateful in a way that after having initialized and registered the "connector", the sdk register the connector as an in-memory instance.
 * We can then use sdk functions without specifying reference to the connector as it's designed to used the registered connector isntance.
 *
 * todo: Ask if that correct
 *
 * @see https://github.com/elastos/Elastos.Connectivity.Client.JS.SDK/
 */
const sTrustedProvider = Symbol("TrustedKYCProviders");

const getVerifiablePresentation = async () => {
  const didAccess = new DID.DIDAccess();
  const nameClaim = DID.simpleIdClaim("Your name", "name", false)
  const credentialRequest = { claims: [nameClaim] }
  return didAccess.requestCredentials(credentialRequest);
}

export default class ElastosConnectivityService {
  // TrustedKYCProviders = ["did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK"] // Trinity. Tech KYC DID
  constructor() {
    this._connector = new EssentialsConnector()
    this[sTrustedProvider] = ["did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK"] // Trinity. Tech KYC DID
    
    // unregistear if already registerd
    const arrIConnectors = connectivity.getAvailableConnectors();
    if (arrIConnectors.findIndex((option) => option.name === this._connector.name) !== -1) {
      connectivity.unregisterConnector(this._connector.name);
      // console.log('unregister connector succeed.');
    }

    this.registerConnector().then(() => console.debug("Elastos Connectivity SDK connector is initialized"))
  }

  /**
   * Elastos Connectivity Client
   * Register the essential connector
   */
  async registerConnector() {
    await connectivity.registerConnector(this._connector)
  }

  /**
   * Disconnect the wallet session
   */
  async disconnect() {
    return new Promise((resolve, reject) => {
      try {
        return this.isAlreadyConnected() ? this._connector.disconnectWalletConnect() : resolve();
      } catch (error) {
        console.error("Error while disconnecting the wallet", error);
        reject();
      }
    })
  }

  /**
   * Check if the user is already connected via essentials
   */
  isAlreadyConnected() {
    const isUsingEssentialsConnector = connectivity.getActiveConnector() && connectivity.getActiveConnector()?.name === this._connector.name;
    return isUsingEssentialsConnector && this._connector.hasWalletConnectSession()
  }

  /**
   * Restore the wallet connect session - TODO: should be done by the connector itself?
   */
  async restoreWalletSession() {
    return this._connector.getWalletConnectProvider().enable()
  }

  /**
   * This function will actually render an UI asking the user to select
   * his wallet. It will not resolve until the user has selected his wallet identity.
   */

  /**
   * Get the connector
   */
  get connector() {
    return this._connector
  }

  /**
   * Request the KYC credentials
   */
  async requestKYCCredentials() {
    const didAccess = new ConnDID.DIDAccess();
    const presentation = await didAccess.requestCredentials({
      claims: [
        ConnDID.simpleTypeClaim("Your name", "NameCredential", false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([
            { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
          ]),
        ConnDID.simpleTypeClaim("Your birth date", "BirthDateCredential", false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([
            { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
          ]),
        ConnDID.simpleTypeClaim("Your gender", "GenderCredential", false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([
            { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
          ]),
        ConnDID.simpleTypeClaim("Your country", "CountryCredential", false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([
            { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
          ]),
      ]
    });
    return presentation
  }
  
  /**
   * Request the Custom credentials
   */
   async requestCustomCredentials(claimItems) {
    const didAccess = new ConnDID.DIDAccess();
    const presentation = await didAccess.requestCredentials({
      claims: claimItems.map(item=>(
        ConnDID.simpleTypeClaim(`Your ${item.title}`, item.title, true)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([
            { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
          ])
      ))
      // claims: [
      //   ConnDID.simpleTypeClaim("Your name", "NameCredential", false)
      //     .withIssuers(this[sTrustedProvider])
      //     .withNoMatchRecommendations([
      //       { title: "KYC-me.io", url: "https://kyc-me.io", urlTarget: "internal" }
      //     ]),
      // ]
    });
    return presentation
  }
}