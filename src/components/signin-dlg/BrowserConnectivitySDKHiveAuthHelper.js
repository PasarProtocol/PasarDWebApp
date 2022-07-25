import {
  Claims,
  DIDDocument,
  DIDBackend,
  DefaultDIDAdapter,
  JWTHeader,
  JWTParserBuilder,
  VerifiableCredential,
  VerifiablePresentation
} from '@elastosfoundation/did-js-sdk';
import { DID as ConnDID, DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import {
  AppContext,
  AppContextProvider,
  DIDResolverAlreadySetupException,
  Vault
} from '@elastosfoundation/hive-js-sdk';
import dayjs from 'dayjs';

/**
 * This is a sample hive auth helper that makes everything automatic for apps using hive to
 * authenticate on hive vaults.
 *
 * This authentication flow is for the connectivity SDK.
 */
export class BrowserConnectivitySDKHiveAuthHelper {
  #didAccess;

  constructor(didResolverUrl) {
    try {
      AppContext.setupResolver(didResolverUrl, '/anyfakedir/browserside/for/didstores');
    } catch (e) {
      if (e instanceof DIDResolverAlreadySetupException) {
        // silent error, it's ok
      } else {
        console.error('AppContext.setupResolver() exception:', e);
      }
    }
    DIDBackend.initialize(new DefaultDIDAdapter(didResolverUrl));
    this.didAccess = new ConnDID.DIDAccess();
  }

  async getAppContext(userDid, onAuthError) {
    const appInstanceDIDInfo = await this.didAccess.getOrCreateAppInstanceDID();

    console.log('hiveauthhelper', 'Getting app instance DID document');
    const didDocument = await appInstanceDIDInfo.didStore.loadDid(
      appInstanceDIDInfo.did.toString()
    );
    console.log(
      'hiveauthhelper',
      'Got app instance DID document. Now creating the Hive client',
      didDocument.toJSON()
    );

    const appContextProvider = {
      getLocalDataDir: () => '/',
      getAppInstanceDocument: () => Promise.resolve(didDocument),
      getAuthorization: (authenticationChallengeJWtCode) => {
        /**
         * Called by the Hive plugin when a hive backend needs to authenticate the user and app.
         * The returned data must be a verifiable presentation, signed by the app instance DID, and
         * including a appid certification credential provided by the identity application.
         */
        console.log(
          'hiveauthhelper',
          'Hive client authentication challenge callback is being called with token:',
          authenticationChallengeJWtCode
        );
        try {
          return this.handleVaultAuthenticationChallenge(authenticationChallengeJWtCode);
        } catch (e) {
          console.error('hiveauthhelper', 'Exception in authentication handler:', e);
          if (onAuthError) onAuthError(e);
          return null;
        }
      }
    };

    const appContext = await AppContext.build(appContextProvider, userDid);
    return appContext;
  }

  /* public async getSubscriptionService(targetDid: string, providerAddress: string = null, onAuthError?: (e: Error) => void): Promise<VaultSubscriptionService> {
    const appContext = await this.getAppContext(targetDid, onAuthError);
    if (!providerAddress)
      providerAddress = await AppContext.getProviderAddress(targetDid); // TODO: cache, don't resolve every time
    return new VaultSubscriptionService(appContext, providerAddress);
  } */

  // eslint-disable-next-line default-param-last
  async getVaultServices(userDid, providerAddress = null, onAuthError) {
    const appContext = await this.getAppContext(userDid, onAuthError);
    if (!providerAddress) providerAddress = await AppContext.getProviderAddress(userDid); // TODO: cache, don't resolve every time
    return new Vault(appContext, providerAddress);
  }

  /**
   * Debug method to delete user's hive vault authentication in order to force a new authentication flow.
   */
  /* private clearVaultAccessToken() {
    GlobalHiveService.instance.vaultStatus.subscribe(s => {
      if (s) {
        console.log("DELETING HIVE VAULT ACCESS TOKEN");
        void GlobalHiveService.instance.getActiveVault().revokeAccessToken();
      }
    });
  } */

  /*
  - auth challenge: JWT (iss, nonce)
  - hive sdk:
    - verify jwt
    - extract iss and nonce
  - consumer dapp:
    - generate app instance presentation including nonce=nonce, realm=iss, app id credential
    - embed presentation as JWT and return to the hive auth handler
  - server side:
    - verify jwt (using local app instance did public key provided before)
    - generate access token
  */
  handleVaultAuthenticationChallenge(jwtToken) {
    return this.generateAuthPresentationJWT(jwtToken);
  }

  /**
   * Generates a JWT token needed by hive vaults to authenticate users and app.
   * That JWT contains a verifiable presentation that contains server challenge info, and the app id credential
   * issued by the end user earlier.
   */
  async generateAuthPresentationJWT(authChallengeJwttoken) {
    console.log('hiveauthhelper', 'Starting process to generate hive auth presentation JWT');
    // Parse, but verify on chain that this JWT is valid first
    try {
      const claims = (
        await new JWTParserBuilder()
          .setAllowedClockSkewSeconds(300)
          .build()
          .parse(authChallengeJwttoken)
      ).getBody();
      if (claims == null) throw new Error('Invalid jwt token as authorization.');

      // The request JWT must contain iss and nonce fields
      if (!claims.getIssuer() || !claims.get('nonce')) {
        throw new Error('The received authentication JWT token does not contain iss or nonce');
      }

      // Generate a hive authentication presentation and put the credential + back-end info such as nonce inside
      const nonce = claims.get('nonce');
      const realm = claims.getIssuer();

      console.log('hiveauthhelper', 'Getting app instance DID');
      const appInstanceDIDResult = await this.didAccess.getOrCreateAppInstanceDID();
      const appInstanceDID = appInstanceDIDResult.did;

      const appInstanceDIDInfo = await this.didAccess.getExistingAppInstanceDIDInfo();

      console.log('hiveauthhelper', 'Getting app identity credential');
      let appIdCredential = await this.didAccess.getExistingAppIdentityCredential();

      if (!appIdCredential) {
        console.log('hiveauthhelper', 'Empty app id credential. Trying to generate a new one');

        appIdCredential = await this.generateAppIdCredential();
        if (!appIdCredential) {
          console.warn('hiveauthhelper', 'Failed to generate a new App ID credential');
          throw new Error('Failed to generate a new App ID credential');
        }
      }

      // Create the presentation that includes hive back end challenge (nonce) and the app id credential.
      console.log(
        'hiveauthhelper',
        'Creating DID presentation response for Hive authentication challenge'
      );
      const builder = await VerifiablePresentation.createFor(
        appInstanceDID.toString(),
        null,
        appInstanceDIDResult.didStore
      );
      const presentation = await builder
        .credentials(appIdCredential)
        .realm(realm)
        .nonce(nonce)
        .seal(appInstanceDIDInfo.storePassword);

      if (presentation) {
        // Generate the hive back end authentication JWT
        console.log(
          'hiveauthhelper',
          'Opening DID store to create a JWT for presentation:',
          presentation.toJSON()
        );
        const didStore = await DID.DIDHelper.openDidStore(appInstanceDIDInfo.storeId);

        console.log('hiveauthhelper', 'Loading DID document');
        try {
          const didDocument = await didStore.loadDid(appInstanceDIDInfo.didString);
          const validityDays = 2;
          console.log('hiveauthhelper', 'App instance DID document', didDocument.toJSON());
          console.log('hiveauthhelper', 'Creating JWT');

          try {
            // Create JWT token with presentation.
            // const info = await new ConDID.DIDAccess().getExistingAppInstanceDIDInfo();
            const jwtToken = await didDocument
              .jwtBuilder()
              .addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
              .addHeader('version', '1.0')
              .setSubject('DIDAuthResponse')
              .setAudience(claims.getIssuer())
              .setIssuedAt(dayjs().unix())
              .setExpiration(dayjs().add(3, 'month').unix())
              .setNotBefore(dayjs().unix())
              .claimsWithJson('presentation', presentation.toString(true))
              .sign(appInstanceDIDInfo.storePassword);

            console.log('hiveauthhelper', 'JWT created for presentation:', jwtToken);
            return jwtToken;
          } catch (err) {
            throw new Error(err);
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new Error('No presentation generated');
      }
    } catch (e) {
      // Verification error?
      // Could not verify the received JWT as valid - reject the authentication request by returning a null token
      const msg = `The received authentication JWT token signature cannot be verified or failed to verify: ${e}. Is the hive back-end DID published? Are you on the right network?`;
      throw new Error(msg);
    }
  }

  async generateAppIdCredential() {
    const storedAppInstanceDID = await this.didAccess.getOrCreateAppInstanceDID();
    if (!storedAppInstanceDID) {
      return null;
    }

    // No such credential, so we have to create one. Send an intent to get that from the did app
    console.log('hiveauthhelper', 'Starting to generate a new App ID credential.');

    // Ask the identity wallet (eg: Essentials) to generate an app id credential.
    const didAccess = new ConnDID.DIDAccess();
    const appIdCredential = await didAccess.generateAppIdCredential();

    // Save this issued credential for later use.
    await storedAppInstanceDID.didStore.storeCredential(appIdCredential);

    // This generated credential must contain the following properties:
    // TODO: CHECK THAT THE RECEIVED CREDENTIAL CONTENT IS VALID
    // appInstanceDid
    // appDid

    return appIdCredential;
  }
}
