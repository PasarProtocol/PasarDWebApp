import {
  VaultSubscription,
  AboutService,
  ServiceEndpoint,
  HttpClient,
  AuthService,
  BackupSubscription,
  Provider,
  SubscriptionService,
  AlreadyExistsException,
  Vault,
  NotFoundException,
  InsertOptions,
  BackupResultResult,
  ScriptRunner
} from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import { DidResolverUrl } from '../../config';

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(DidResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getRestService = async (did) => {
  const appContext = await getAppContext(did);
  const nodeProvider = await appContext.getProviderAddress(did);
  const serviceEndpoint = new ServiceEndpoint(appContext, nodeProvider);
  const httpClient = new HttpClient(serviceEndpoint, HttpClient.WITH_AUTHORIZATION, HttpClient.DEFAULT_OPTIONS);
  return { serviceEndpoint, httpClient };
};

export const getCredentialsFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(DidResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        const credentials = didDoc.getCredentials();
        const properties = credentials.reduce((props, c) => {
          props[c.id.fragment] = c.subject.properties[c.id.fragment];
          return props;
        }, {});
        resolve(properties);
      })
      .catch((error) => {
        reject(error);
      });
  });
export const getDIDDocumentFromDID = (did) =>
  new Promise((resolve, reject) => {
    DIDBackend.initialize(new DefaultDIDAdapter(DidResolverUrl));
    const didObj = new DID(did);
    didObj
      .resolve(true)
      .then((didDoc) => {
        if (!didDoc) resolve({});
        resolve(didDoc);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getVault = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(DidResolverUrl);
  const vault = await instBCSHAH.getVaultServices(did);
  return vault;
};

export const fetchHiveScriptPictureToDataUrl = async (hiveScriptUrl, did) => {
  if (!hiveScriptUrl) return null;
  return new Promise((resolve) => {
    fetchHiveScriptPicture(hiveScriptUrl, did).then((rawPicture) => {
      if(!rawPicture)
        resolve('')
      else
        resolve(rawImageToBase64DataUrl(rawPicture));
    });
  });
};

export const rawImageToBase64DataUrl = (rawImg) => {
  const base64Data = Buffer.from(rawImg).toString('base64');
  return `data:image/png;base64,${base64Data}`;
};

export const getHiveAvatarUrlFromDIDAvatarCredential = (avatarCredentialSubject) => {
  if (avatarCredentialSubject.type && avatarCredentialSubject.type === 'elastoshive') {
    if (avatarCredentialSubject.data && avatarCredentialSubject['content-type']) {
      return avatarCredentialSubject.data;
    }
  }
  // Other cases: return nothing.
  return null;
};

export const fetchHiveScriptPicture = async (hiveScriptUrl, did) => {
  // DIRTY HACK START - delete this after a while. Reason: Essentials 2.1 android generates invalid script urls such as
  // ...&params={empty:0} // invalid json. - should be &params={\"empty\"":0}. DELETE this hack after a while.
  hiveScriptUrl = hiveScriptUrl.replace('params={empty:0}', 'params={"empty":0}');
  // DIRTY HACK END
  try {
    console.log('GlobalHiveService', 'Calling script url to download file', hiveScriptUrl);
    const pictureBuffer = await (await getVault(did)).getScriptingService().downloadFileByHiveUrl(hiveScriptUrl);

    if (!pictureBuffer || pictureBuffer.length === 0) {
      console.warn('GlobalHiveService', 'Got empty data while fetching hive script picture', hiveScriptUrl);
      return null;
    }
    console.log(
      'GlobalHiveService',
      'Got data after fetching hive script picture',
      hiveScriptUrl,
      'data length:',
      pictureBuffer.length
    );
    return pictureBuffer;
  } catch (e) {
    // Can't download the asset
    console.warn('GlobalHiveService', 'Failed to download hive asset at ', hiveScriptUrl, e);
    return null;
  }
};

export const getUserCredentials = async (did) => {
  try {
    let avatarUrl = '';
    const credentials = await getCredentialsFromDID(did);
    if (credentials && credentials.avatar) {
      const hiveAvatarUrl = getHiveAvatarUrlFromDIDAvatarCredential(credentials.avatar);
      if (did && credentials.avatar) avatarUrl = await fetchHiveScriptPictureToDataUrl(hiveAvatarUrl, did);
    }
    const name = credentials.name || '';
    const description = credentials.description || '';
    const website = credentials.website || '';
    const twitter = credentials.twitter || '';
    const discord = credentials.discord || '';
    const telegram = credentials.telegram || '';
    const medium = credentials.medium || '';
    const kycMe = credentials.kyc_me || '';
    return { avatarUrl, name, description, website, twitter, discord, telegram, medium, kycMe };
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
