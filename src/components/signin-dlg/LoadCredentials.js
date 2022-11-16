import { ServiceEndpoint } from '@elastosfoundation/hive-js-sdk';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import { BrowserConnectivitySDKHiveAuthHelper } from './BrowserConnectivitySDKHiveAuthHelper';
import { DidResolverUrl } from '../../config';
import {
  queryAvatarUrl,
  queryName,
  queryDescription,
  queryWebsite,
  queryTwitter,
  queryDiscord,
  queryTelegram,
  queryMedium,
  queryKycMe,
  downloadAvatar
} from './HiveAPI';
import { downloadFromUrl } from './HiveService';

export const getAppContext = async (did) => {
  const instBCSHAH = new BrowserConnectivitySDKHiveAuthHelper(DidResolverUrl);
  const appContext = await instBCSHAH.getAppContext(did);
  return appContext;
};

export const getServiceEndpoint = async (did, nodeProviderUrl) => {
  try {
    const appContext = await getAppContext(did);
    const nodeProvider = await appContext.getProviderAddress(did);
    const serviceEndpoint = new ServiceEndpoint(appContext, nodeProviderUrl || nodeProvider);
    return serviceEndpoint;
  } catch (err) {
    console.error(err);
    return undefined;
  }
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
      if (!rawPicture) resolve('');
      else resolve(rawImageToBase64DataUrl(rawPicture));
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

const getQueryDataFromObject = (resQuery) => {
  if (resQuery.find_message && resQuery.find_message.items.length) return resQuery.find_message.items[0].display_name;
  return '';
};

export const getCredentialsFromPasar = async (did) => {
  try {
    let avatarUrl = '';
    const resQueryAvatarUrl = await queryAvatarUrl(did);
    if (resQueryAvatarUrl.find_message && resQueryAvatarUrl.find_message.items.length) {
      const dataQueryAvatarUrl = resQueryAvatarUrl.find_message.items[0].display_name;
      const avatarData = await downloadFromUrl(dataQueryAvatarUrl);
      if (avatarData && avatarData.length) avatarUrl = `data:image/png;base64,${avatarData.toString('base64')}`;
    } else {
      const resDownloadAvatarUrl = await downloadAvatar(did);
      if (resDownloadAvatarUrl && resDownloadAvatarUrl.length) {
        const base64Content = resDownloadAvatarUrl.reduce((content, code) => {
          content = `${content}${String.fromCharCode(code)}`;
          return content;
        }, '');
        avatarUrl = `data:image/png;base64,${base64Content}`;
      }
    }
    const name = getQueryDataFromObject(await queryName(did));
    const description = getQueryDataFromObject(await queryDescription(did));
    const website = getQueryDataFromObject(await queryWebsite(did));
    const twitter = getQueryDataFromObject(await queryTwitter(did));
    const discord = getQueryDataFromObject(await queryDiscord(did));
    const telegram = getQueryDataFromObject(await queryTelegram(did));
    const medium = getQueryDataFromObject(await queryMedium(did));
    const kycMe = getQueryDataFromObject(await queryKycMe(did));
    return { avatarUrl, name, description, website, twitter, discord, telegram, medium, kycMe };
  } catch (err) {
    console.error(err);
    return {
      avatarUrl: '',
      name: '',
      description: '',
      website: '',
      twitter: '',
      discord: '',
      telegram: '',
      medium: '',
      kycMe: ''
    };
  }
};

export const getUserCredentials = async (did) => {
  const pasarCredential = await getCredentialsFromPasar(did);
  try {
    let avatarUrl = '';
    const credentials = await getCredentialsFromDID(did);
    if (credentials && credentials.avatar) {
      const hiveAvatarUrl = getHiveAvatarUrlFromDIDAvatarCredential(credentials.avatar);
      if (did && credentials.avatar) avatarUrl = await fetchHiveScriptPictureToDataUrl(hiveAvatarUrl, did);
    }
    const name = pasarCredential.name ? pasarCredential.name : credentials.name || '';
    const description = pasarCredential.description ? pasarCredential.description : credentials.description || '';
    const website = pasarCredential.website ? pasarCredential.website : credentials.website || '';
    const twitter = pasarCredential.twitter ? pasarCredential.twitter : credentials.twitter || '';
    const discord = pasarCredential.discord ? pasarCredential.discord : credentials.discord || '';
    const telegram = pasarCredential.telegram ? pasarCredential.telegram : credentials.telegram || '';
    const medium = pasarCredential.medium ? pasarCredential.medium : credentials.medium || '';
    const kycMe = pasarCredential.kycMe ? pasarCredential.kycMe : credentials.kyc_me || '';
    return { avatarUrl, name, description, website, twitter, discord, telegram, medium, kycMe };
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
