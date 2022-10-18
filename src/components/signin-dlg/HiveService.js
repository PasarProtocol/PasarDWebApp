import { InsertOptions, ScriptRunner, Vault } from '@elastosfoundation/hive-js-sdk';
import { ApplicationDID } from '../../config';
import { getAppContext } from './LoadCredentials';

let hiveVault;
let scriptRunners = {};

const createVault = async () => {
  try {
    const pasarDid = sessionStorage.getItem('PASAR_DID');
    const userDid = `did:elastos:${pasarDid}`;
    const context = await getAppContext(userDid);
    const hiveVault = new Vault(context);

    const scriptRunner = await creatScriptRunner(userDid);
    if (scriptRunners === undefined) {
      scriptRunners = {};
    }

    scriptRunners[userDid] = scriptRunner;

    return hiveVault;
  } catch (error) {
    console.log('creat vault error: ', error);
    throw error;
  }
};

const creatScriptRunner = async (targetDid) => {
  const context = await getAppContext(targetDid);
  const scriptRunner = new ScriptRunner(context);
  if (scriptRunners === undefined) {
    scriptRunners = {};
  }
  scriptRunners[targetDid] = scriptRunner;

  return scriptRunner;
};

const getScriptRunner = async (targetDid) => {
  let scriptRunner = scriptRunners[targetDid];
  if (scriptRunner === undefined || scriptRunner === null) {
    scriptRunner = await creatScriptRunner(targetDid);
  }
  return scriptRunner;
};

const getVault = async () => {
  if (hiveVault === undefined || hiveVault === null) {
    hiveVault = await createVault();
  }
  return hiveVault;
};

const getScriptingService = async () => {
  const hiveVault = await getVault();
  const scriptingService = hiveVault.getScriptingService();

  return scriptingService;
};

const getDatabaseService = async () => {
  const databaseService = (await getVault()).getDatabaseService();
  return databaseService;
};

const getFilesService = async () => {
  const fileService = (await getVault()).getFilesService();
  return fileService;
};

export const createCollection = async (channelName) => {
  try {
    const databaseService = await getDatabaseService();
    const result = await databaseService.createCollection(channelName);
    return result;
  } catch (error) {
    console.log(`create ${channelName} collection error: ${error}`);
    const errString = JSON.stringify(error);
    const err = JSON.parse(errString);
    const errorCode = err.code;
    if (errorCode === 455) {
      // 455 already exists
      return null;
    }
    // TODO: throw error
    return error;
  }
};

export const registerScript = (scriptName, executable, condition, allowAnonymousUser, allowAnonymousApp) =>
  new Promise((resolve, reject) => {
    const pasarDid = sessionStorage.getItem('PASAR_DID');
    const userDid = `did:elastos:${pasarDid}`;
    getScriptingService(userDid)
      .then((scriptingService) =>
        scriptingService.registerScript(scriptName, executable, condition, allowAnonymousUser, allowAnonymousApp)
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        console.log('registerScript error: ', error);
      });
  });

export const callScript = (scriptName, document, targetDid, appid = ApplicationDID) =>
  new Promise((resolve, reject) => {
    getScriptRunner(targetDid)
      .then((scriptRunner) => scriptRunner.callScript(scriptName, document, targetDid, appid))
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const insertDBData = async (collectName, doc) => {
  try {
    const dbService = await getDatabaseService();
    const insertResult = await dbService.insertOne(collectName, doc, new InsertOptions(false, true));
    return insertResult;
  } catch (error) {
    console.log('insertDBData error: ', error);
    // TODO throw error
    return error;
  }
};

export const updateOneDBData = async (collectName, filter, update, option) => {
  try {
    const dbService = await getDatabaseService();
    const result = await dbService.updateOne(collectName, filter, update, option);
    return result;
  } catch (error) {
    console.log('updateOneDBData error: ', error);
    // TODO throw error
    return error;
  }
};

export const queryDBData = async (collectionName, filter) => {
  try {
    const dbService = await getDatabaseService();
    const result = dbService.findMany(collectionName, filter);
    return result;
  } catch (error) {
    console.log('queryDBData error: ', error);
    return error;
  }
};

export const deleateOneDBData = async (collectName, fillter) => {
  try {
    const dbService = await getDatabaseService();
    await dbService.deleteOne(collectName, fillter);
    return 'SUCCESS';
  } catch (error) {
    console.log('deleate one DB data error: ', error);
    return error;
  }
};

export const deleteCollection = async (collectionName) => {
  try {
    const databaseService = await getDatabaseService();
    const result = await databaseService.deleteCollection(collectionName);
    return result;
  } catch (error) {
    console.log('delete collection error: ', error);
    return error;
  }
};

export const uploadFileWithString = async (remotePath, img) => {
  try {
    const fileService = await getFilesService();
    return await fileService.upload(remotePath, Buffer.from(img, 'utf8'));
  } catch (error) {
    console.log(`upload file with string error: ${error}`);
    return error;
  }
};

export const downloadScripting = async (targetDid, transactionId) => {
  try {
    const scriptRunner = await getScriptRunner(targetDid);
    return await scriptRunner.downloadFile(transactionId);
  } catch (error) {
    console.log('downloadScripting error: ', error);
    return error;
  }
};

export const downloadFromUrl = async (avatarUrl) => {
  const avatarInfo = avatarUrl.replace('hive://', '');
  const splitAvatar = avatarInfo.split(/[@/?]+/);
  const splitLength = splitAvatar.length;
  if (splitLength < 4) return '';
  const avatarScriptName = splitAvatar[splitLength - 2];
  const avatarParam = avatarInfo;
  const tarDID = splitAvatar[0];
  const tarAppDID = splitAvatar[1];
  const scriptingService = await getScriptingService(tarDID);
  const result = await scriptingService.callScript(avatarScriptName, avatarParam, tarDID, tarAppDID);
  const transactionId = result.download.transaction_id;

  const avatarData = await scriptingService.downloadFile(transactionId);
  return avatarData;
};
