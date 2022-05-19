import { FileDownloadExecutable, FindExecutable, UpdateOptions } from "@elastosfoundation/hive-js-sdk";
import { deleateOneDBData, deleteCollection, queryDBData, downloadScripting, uploadFileWithString, createCollection, registerScript, callScript, insertDBData, updateOneDBData } from './HiveService';
import { ApplicationDID } from '../../config'

const COLLECTION_NAME = "Profile"
const NAME = "name"
const DESCRIPTION = "description"
const WEBSITE = "website"
const TWITTER = "twitter"
const DISCORD = "discord"
const TELEGRAM = "telegram"
const MEDIUM = "medium"
const KYC_ME = "kyc_me"
const AVATAR = "avatar"
const AVATAR_REMOTE_PATH = "pasarAvatar"

export const createProfileCollection = async() => {
  await createCollection(COLLECTION_NAME)
}

export function registerAllScript() {
  return new Promise((resolve, reject) => {
    // const description = registerScripting(DESCRIPTION)
    // const website = registerScripting(WEBSITE)
    // const twitter = registerScripting(TWITTER)
    // const discord = registerScripting(DISCORD)
    // const telegram = registerScripting(TELEGRAM)
    // const medium = registerScripting(MEDIUM)
    // const kycMe = registerScripting(KYC_ME)
    // const avatar = registerAvatarDownloadScripting()
    const array = [
      registerScripting(DESCRIPTION), 
      registerScripting(WEBSITE), 
      registerScripting(TWITTER), 
      registerScripting(DISCORD), 
      registerScripting(TELEGRAM), 
      registerScripting(MEDIUM), 
      registerScripting(KYC_ME), 
      registerFileDownloadScripting(AVATAR)
    ]
    Promise.all(array).then(values => {
      console.log("Register scripting all Success, vaules = ", values)
      resolve('FINISH')
    }, reason => {
      console.log("Register scripting error, reason: ", reason)
      reject(reason)
    })
  })
}

export const prepareConnectToHive = async() => {
  const result = await registerScripting(NAME)
  return result
}

// export const registerScripting = async(scriptName) => {
//   try {
//     const executablefilter = {"property_identity": scriptName, "type": "public" }

//     const options = { "projection": { "_id": false }, "limit": 1 }
//     const executable = new FindExecutable("find_message", COLLECTION_NAME, executablefilter, options).setOutput(true)
//     const result = await registerScript(scriptName, executable, null, false)
//     console.log(`register scripting with ${scriptName} result: ${result}`)
//     return result
//   } catch (error) {
//     console.log(`register scripting with ${scriptName} error: ${error}`)
//     // TODO: throw error
//     return error
//   }
// }

export const registerScripting = (scriptName) => (
  new Promise((resolve, reject) => {
    const executablefilter = {"property_identity": scriptName, "type": "public" }
    const options = { "projection": { "_id": false }, "limit": 1 }
    const executable = new FindExecutable("find_message", COLLECTION_NAME, executablefilter, options).setOutput(true)
    registerScript(scriptName, executable, null, false)
      .then(result=>{
        console.log(`register scripting with ${scriptName} result: ${result}`)
        resolve(result)
      })
      .catch(error => {
        console.log(`register scripting with ${scriptName} error: ${error}`)
        reject(error)
      })
  })
)

const registerAvatarDownloadScripting = async() => {
  const result = await registerFileDownloadScripting(AVATAR)
  return result
}

// const registerFileDownloadScripting = async(scriptName) => {
//   try {
//     const executable = new FileDownloadExecutable(scriptName).setOutput(true)
//     const result = registerScript(scriptName, executable, null, false)
//     console.log(`register file download scripting with ${scriptName} result: ${result}`)
//     return result
//   } catch (error) {
//     console.log(`register file download scripting with ${scriptName} error: ${error}`)
//     // TODO: throw error
//     return error
//   }
// }

const registerFileDownloadScripting = (scriptName) => (
  new Promise((resolve, reject) => {
    const executable = new FileDownloadExecutable(scriptName).setOutput(true)
    registerScript(scriptName, executable, null, false)
      .then(result=>{
        console.log(`register file download scripting with ${scriptName} result: ${result}`)
        resolve(result)
      })
      .catch(error => {
        console.log(`register file download scripting with ${scriptName} error: ${error}`)
        reject(error)
      })
  })
)

export const queryName = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(NAME, targetDid, appid)
  return result
}

export const queryDescription = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(DESCRIPTION, targetDid, appid)
  return result
}

export const queryWebsite = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(WEBSITE, targetDid, appid)
  return result
}

export const queryTwitter = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(TWITTER, targetDid, appid)
  return result
}

export const queryDiscord = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(DISCORD, targetDid, appid)
  return result
}

export const queryTelegram = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(TELEGRAM, targetDid, appid)
  return result
}

export const queryMedium = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(MEDIUM, targetDid, appid)
  return result
}

export const queryKycMe = async(targetDid, appid = ApplicationDID) => {
  const result = await callQueryScript(KYC_ME, targetDid, appid)
  return result
}

// const callQueryScript = async(propertyIdentity, targetDid, appid = ApplicationDID) => {
//   try {
//     const doc = {"property_identity": propertyIdentity }
//     const result = await callScript(propertyIdentity, doc, targetDid, appid)
//     console.log(`call query ${propertyIdentity} result: ${result}.`)
//     return result
//   } catch (error) {
//     console.log(`call query ${propertyIdentity} error: ${error}.`)
//     // TODO: throw error
//     return error
//   }
// }

const callQueryScript = (propertyIdentity, targetDid, appid = ApplicationDID) => (
  new Promise((resolve, reject) => {
    const doc = {"property_identity": propertyIdentity }
    callScript(propertyIdentity, doc, targetDid, appid)
      .then(result=>{
        console.log(`call query ${propertyIdentity} result: ${result}.`)
        resolve(result)
      })
      .catch(error=>{
        console.log(`call query ${propertyIdentity} error: ${error}.`)
        reject(error)
      })
  })
)

export const insertName = async(displayName, type = "public") =>{
  const result = await insertProperty(NAME, displayName, type)
  return result
}

export const insertWebsite = async(displayName, type = "public") =>{
  const result = await insertProperty(WEBSITE, displayName, type)
  return result
}

export const insertDescription = async(displayName, type = "public") =>{
  const result = await insertProperty(DESCRIPTION, displayName, type)
  return result
}

export const insertTwitter = async(displayName, type = "public") =>{
  const result = await insertProperty(TWITTER, displayName, type)
  return result
}

export const insertDiscord = async(displayName, type = "public") =>{
  const result = await insertProperty(DISCORD, displayName, type)
  return result
}

export const insertTelegram = async(displayName, type = "public") =>{
  const result = await insertProperty(TELEGRAM, displayName, type)
  return result
}

export const insertMedium = async(displayName, type = "public") =>{
  const result = await insertProperty(MEDIUM, displayName, type)
  return result
}

export const insertKycMe = async(displayName, type = "public") =>{
  const result = await insertProperty(KYC_ME, displayName, type)
  return result
}

const insertProperty = async(propertyIdentity, displayName, type = "public") =>{
  const result = await insertDataToProfileDB(propertyIdentity, displayName, type)
  return result
}

const insertDataToProfileDB = async(propertyIdentity, displayName, type) =>{
  const doc = {
    "property_identity": propertyIdentity,
    "display_name": displayName,
    "type": type,
  }
  try {
    const insertResult = insertDBData(COLLECTION_NAME, doc)
    console.log(`Insert ${propertyIdentity} to Profile db result : ${insertResult}`)
    return insertResult
  } catch (error) {
    console.log(`Insert ${propertyIdentity} to Profile db error : ${error}`)
    return error
  }
}

export const updateName = async(displayName, type) =>{
  const result = await updateProperty(NAME, displayName, type)
  return result
}

export const updateDescription = async(displayName, type) =>{
  const result = await updateProperty(DESCRIPTION, displayName, type)
  return result
}

export const updateWebsite = async(displayName, type) =>{
  const result = await updateProperty(WEBSITE, displayName, type)
  return result
}

export const updateTwitter = async(displayName, type) =>{
  const result = await updateProperty(TWITTER, displayName, type)
  return result
}

export const updateDiscord = async(displayName, type) =>{
  const result = await updateProperty(DISCORD, displayName, type)
  return result
}

export const updateTelegram = async(displayName, type) =>{
  const result = await updateProperty(TELEGRAM, displayName, type)
  return result
}

export const updateMedium = async(displayName, type) =>{
  const result = await updateProperty(MEDIUM, displayName, type)
  return result
}

export const updateKycMe = async(displayName, type) =>{
  const result = await updateProperty(KYC_ME, displayName, type)
  return result
}

const updateProperty = async(propertyIdentity, displayName, type) =>{
  const result = await updateDataToProfileDB(propertyIdentity, displayName, type)
  return result
}

const updateDataToProfileDB = async(propertyIdentity, displayName, type = "public") =>{
  const doc = {
    "property_identity": propertyIdentity,
    "display_name": displayName,
    "type": type,
  }
  try {
    const option = new UpdateOptions(false, true)
    const filter = { "property_identity": propertyIdentity };
    const update = { "$set": doc };

    const insertResult = updateOneDBData(COLLECTION_NAME, filter, update, option)
    console.log("update Profile db result : ", insertResult)
    return insertResult
  } catch (error) {
    console.log("update Profile db error : ", error)
    return error
  }
}

// all property in profile
export const queryProfileFromDB = async () => {
  try {
    const filter = {}
    const result = queryDBData(COLLECTION_NAME, filter)
    return result
  } catch (error) {
     console.log("Query profile from DB error : ", error)
     return error
  }
}

export const deleteName = async() => {
  const result = await deleteData(NAME)
  return result
}

export const deleteDescription = async() => {
  const result = await deleteData(DESCRIPTION)
  return result
}

export const deleteWebsite = async() => {
  const result = await deleteData(WEBSITE)
  return result
}

export const deleteTwitter = async() => {
  const result = await deleteData(TWITTER)
  return result
}

export const deleteDiscord = async() => {
  const result = await deleteData(DISCORD)
  return result
}

export const deleteTelegram = async() => {
  const result = await deleteData(TELEGRAM)
  return result
}

export const deleteMedium = async() => {
  const result = await deleteData(MEDIUM)
  return result
}

export const deleteKycMe = async() => {
  const result = await deleteData(KYC_ME)
  return result
}

const deleteData = async(propertyIdentity) => {
  const doc = {
    "property_identity": propertyIdentity
  }
  try {
    const result = deleateOneDBData(COLLECTION_NAME, doc)
    console.log(`Delete ${propertyIdentity} in profile from DB result : ${result}`)
    return result
  } catch (error) {
    console.log(`Delete ${propertyIdentity} profile from DB error : ${error}`)
    return error
  }
}

export const deleteProfileCollection = async() => {
  const result = await deleteCollection(COLLECTION_NAME)
  return result
}

export const uploadAvatar = async(imgBase64) =>{
  const result = await uploadFileWithString(AVATAR_REMOTE_PATH, imgBase64)
  return result
}

// download avatar 
export const downloadAvatar = async(targetDid) => {
  try {
    const data = await downloadImageScripting(targetDid, AVATAR, AVATAR_REMOTE_PATH)
  return data
  } catch (error) {
    console.log(`download avatar error: ${error}`)
    return error
  }
}

export const downloadImageScripting = async(targetDid,scriptName, remotePath) => {
  const transactionId = await downloadScriptingTransactionID(targetDid, scriptName, remotePath)
  const data = await downloadScripting(targetDid, transactionId)
  return data
}

const downloadScriptingTransactionID = async(targetDid, scriptName, remotePath) => {
  const result = await callScript(scriptName, { "path": remotePath }, targetDid)
  const transactionId = result[scriptName].transaction_id

  return transactionId
}

