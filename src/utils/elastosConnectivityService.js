import { connectivity, DID as ConnDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';

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
const sTrustedProvider = Symbol('TrustedKYCProviders');

/**
 * Request the signdata on tokenID
 */
export async function requestSigndataOnTokenID(tokenId) {
  const didAccess = new ConnDID.DIDAccess();
  const signedData = await didAccess.signData(tokenId, { extraField: 0 }, 'signature');
  console.log(signedData);
  return signedData;
}

export default class ElastosConnectivityService {
  // TrustedKYCProviders = ["did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK"] // Trinity. Tech KYC DID
  constructor() {
    this._connector = new EssentialsConnector();
    this[sTrustedProvider] = ['did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK']; // Trinity. Tech KYC DID

    // unregistear if already registerd
    const arrIConnectors = connectivity.getAvailableConnectors();
    if (arrIConnectors.findIndex((option) => option.name === this._connector.name) !== -1) {
      connectivity.unregisterConnector(this._connector.name);
    }

    this.registerConnector().then(() => console.debug('Elastos Connectivity SDK connector is initialized'));
  }

  /**
   * Elastos Connectivity Client
   * Register the essential connector
   */
  async registerConnector() {
    await connectivity.registerConnector(this._connector);
  }

  /**
   * Disconnect the wallet session
   */
  async disconnect() {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      try {
        return this.isAlreadyConnected() ? this._connector.disconnectWalletConnect() : resolve();
      } catch (error) {
        console.error('Error while disconnecting the wallet', error);
        reject();
      }
    });
  }

  /**
   * Check if the user is already connected via essentials
   */
  isAlreadyConnected() {
    const isUsingEssentialsConnector =
      connectivity.getActiveConnector() && connectivity.getActiveConnector()?.name === this._connector.name;
    return isUsingEssentialsConnector && this._connector.hasWalletConnectSession();
  }

  /**
   * Restore the wallet connect session - TODO: should be done by the connector itself?
   */
  async restoreWalletSession() {
    return this._connector.getWalletConnectProvider().enable();
  }

  /**
   * This function will actually render an UI asking the user to select
   * his wallet. It will not resolve until the user has selected his wallet identity.
   */

  /**
   * Get the connector
   */
  get connector() {
    return this._connector;
  }

  /**
   * Request the KYC credentials
   */
  async requestKYCCredentials() {
    const didAccess = new ConnDID.DIDAccess();
    const presentation = await didAccess.requestCredentials({
      claims: [
        ConnDID.simpleTypeClaim('Your name', 'NameCredential', false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }]),
        ConnDID.simpleTypeClaim('Your birth date', 'BirthDateCredential', false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }]),
        ConnDID.simpleTypeClaim('Your gender', 'GenderCredential', false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }]),
        ConnDID.simpleTypeClaim('Your country', 'NationalityCredential', false)
          .withIssuers(this[sTrustedProvider])
          .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }])
      ]
    });
    return presentation;
  }

  /**
   * Request the Custom credentials
   */
  async requestCustomCredentials(claimItems) {
    const didAccess = new ConnDID.DIDAccess();
    const claimArray = claimItems.reduce((arr, item) => {
      if (item.title === 'KYC-me') {
        arr = [
          ...arr,
          ConnDID.simpleTypeClaim('Your birth date', 'BirthDateCredential', false)
            .withIssuers(this[sTrustedProvider])
            .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }]),
          ConnDID.simpleTypeClaim('Your gender', 'GenderCredential', false)
            .withIssuers(this[sTrustedProvider])
            .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }]),
          ConnDID.simpleTypeClaim('Your country', 'NationalityCredential', false)
            .withIssuers(this[sTrustedProvider])
            .withNoMatchRecommendations([{ title: 'KYC-me.io', url: 'https://kyc-me.io', urlTarget: 'internal' }])
        ];
        return arr;
      }
      arr.push(ConnDID.simpleIdClaim(`Your ${item.title}`, item.id, true));
      return arr;
    }, []);
    const presentation = await didAccess.requestCredentials({
      claims: claimArray
    });
    return presentation;
  }
}
