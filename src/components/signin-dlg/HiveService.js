import {InsertOptions, File as HiveFile, VaultServices, AppContext, Logger as HiveLogger } from "@elastosfoundation/hive-js-sdk";
import {JWTParserBuilder, JWTHeader, DID as DID2, DIDBackend, DefaultDIDAdapter, JSONObject, VerifiablePresentation  } from '@elastosfoundation/did-js-sdk';
import {connectivity, DID as ConDID} from "@elastosfoundation/elastos-connectivity-sdk-js";
import { ApplicationDID } from '../../config'

let vaults 

const creatAppContext = async (appInstanceDidDocument, userDidString) => {
  try {
    HiveLogger.setDefaultLevel(HiveLogger.TRACE)
    const resolver = "https://api.trinity-tech.cn/eid"
    DIDBackend.initialize(new DefaultDIDAdapter(resolver))
    try {
      const catchPath = '/data/userDir/data/store/catch'
      AppContext.setupResolver(resolver, catchPath)
    } catch (error) {
      console.log("AppContext.setupResolver error: ",error)
    }
    // auth
    const context = AppContext.build({
    getLocalDataDir() {
      return "/data/userDir/data/store/develop"
    },
    getAppInstanceDocument(){
      try {
        return appInstanceDidDocument
      } catch (error) {
        console.log("getAppInstanceDocument error: ",error)
      }
    },
    async getAuthorization(jwtToken)  {
      const authToken = await generateHiveAuthPresentationJWT(jwtToken)
    return authToken
    }
  }, userDidString);
  return context
  } catch (error) {
    console.log("creatAppContext error: ",error)
  }
}

const createVault = async (targetDid) => {
  try {
    const appinstanceDocument = await getAppInstanceDIDDoc()
    const context = await creatAppContext(appinstanceDocument, targetDid)
    const vault = new VaultServices(context)
    if (vaults === undefined) {
      vaults = {}
    }
    vaults[targetDid] = vault
    return vault
  }
  catch (error) {
    console.log("creat vault error: ", error)
  }
}

const getVault = async (targetDid) => {
  if (vaults === undefined) {
    await createVault(targetDid)
  }
  let vault = vaults[targetDid]
  if (vault === null || vault === undefined) {
    vault = await createVault(targetDid)
    return vault
  }
  return vault
}

const getMyVault = async () => {
  const pasarDid = sessionStorage.getItem('PASAR_DID')
  const userDid = `did:elastos:${pasarDid}`
  if (vaults === undefined) {
    await createVault(userDid)
  }
  const vault = vaults[userDid]
  return vault
}

const getScriptingService = async (targetDid) => {
  const vault = await getVault(targetDid)
  const scriptingService = vault.getScriptingService()

  return scriptingService
}

const getMyScriptingService = async () => {
  const vault = await getMyVault()
  const scriptingService = vault.getScriptingService()

  return scriptingService
}

const getDatabaseService = async () => {
  const databaseService = (await getMyVault()).getDatabaseService()
  return databaseService
}

const getFilesService = async () =>  {
  const fileService = (await getMyVault()).getFilesService()
  return fileService
}

export const createCollection = async(channelName) => {
  try {
    const databaseService = await getDatabaseService()
    const result = await databaseService.createCollection(channelName)
    return result
  } catch (error) {
    console.log(`create ${channelName} collection error: ${error}`)
    const errString = JSON.stringify(error)
    const err = JSON.parse(errString)
    const errorCode = err.code
    if (errorCode === 455) {
      // 455 already exists
      return null
    }
    // TODO: throw error
    return error
  }
}

// export const registerScript = async(scriptName, executable, condition, allowAnonymousUser, allowAnonymousApp) => {
//   try {
//     const pasarDid = sessionStorage.getItem('PASAR_DID')
//     const userDid = `did:elastos:${pasarDid}`
//     const scriptingService = await getScriptingService(userDid)
//     await scriptingService.registerScript(scriptName, executable, condition, allowAnonymousUser, allowAnonymousApp)
//     return null
//   } catch (error) {
//     console.log("regisregisterScriptter error: ", error)
//    // TODO throw error 
//   }
// }

// export const callScript = async(scriptName, document, targetDid, appid = ApplicationDID) => {
//   const scriptingService = await getScriptingService(targetDid)
//   const result = await scriptingService.callScript(scriptName, document, targetDid, appid)
//   return result
// }

export const registerScript = (scriptName, executable, condition, allowAnonymousUser, allowAnonymousApp) => (
  new Promise((resolve, reject) => {
    const pasarDid = sessionStorage.getItem('PASAR_DID')
    const userDid = `did:elastos:${pasarDid}`
    getScriptingService(userDid)
      .then(scriptingService=>(
        scriptingService.registerScript(scriptName, executable, condition, allowAnonymousUser, allowAnonymousApp)
      ))
      .then(res=>{
        resolve(res)
      })
      .catch(error => {
        reject(error)
        console.log("registerScript error: ", error)
      });
  })
)

export const callScript = (scriptName, document, targetDid, appid = ApplicationDID) => (
  new Promise((resolve, reject) => {
    getScriptingService(targetDid)
      .then(scriptingService=>(
        scriptingService.callScript(scriptName, document, targetDid, appid)
      ))
      .then(res=>{
        resolve(res)
      })
      .catch(error => {
        reject(error)
      });
  })
)

export const insertDBData = async(collectName, doc) => {
  try {
    const dbService = await getDatabaseService()
    const insertResult = await dbService.insertOne(collectName, doc, new InsertOptions(false, true))
    return insertResult
  } catch (error) {
    console.log("insertDBData error: ", error)
    // TODO throw error
    return error
  }
}

export const updateOneDBData = async(collectName, filter, update, option) => {
  try {
    const dbService = await getDatabaseService()
    const result = await dbService.updateOne(collectName, filter, update, option)
    return result
  } catch (error) {
    console.log("updateOneDBData error: ", error)
    // TODO throw error
    return error
  }
}

export const queryDBData = async(collectionName, filter) => {    
  try {
    const dbService = await getDatabaseService()
    const result = dbService.findMany(collectionName, filter)
    return result
  } catch (error) {
    console.log("queryDBData error: ", error)
    return error
  }
}

export const deleateOneDBData = async(collectName, fillter) => {
  try {
    const dbService = await getDatabaseService()
    await dbService.deleteOne(collectName, fillter)
    return "SUCCESS"
  } catch (error) {
    console.log("deleate one DB data error: ", error)
    return error
  }
}

export const deleteCollection = async(collectionName) => {
    try {
      const databaseService = await getDatabaseService()
      const result = await databaseService.deleteCollection(collectionName)
      return result
    } catch (error) {
      console.log("delete collection error: ", error)
      return error
    }
}

export const uploadFileWithString= async(remotePath, img) => {
  try {
    const fileService = await getFilesService()
    return await fileService.upload(remotePath, Buffer.from(img, 'utf8'))
  }
  catch (error) {
    console.log(`upload file with string error: ${error}`)
    return error
  }
}

export const downloadScripting = async(targetDid, transactionId) => {
  try {
    const scriptingService = await getScriptingService(targetDid)
    return await scriptingService.downloadFile(transactionId)
  } catch (error) {
    console.log("downloadScripting error: ", error)
    return error
  }
}


// ----------------------- 
const storePassword = "storepass"
const generateHiveAuthPresentationJWT = async (challeng) => {
  if (challeng === null || challeng === undefined || challeng === '') {
    console.log('Params error')
  }

  // Parse, but verify on chain that this JWT is valid first 
  const JWTParser = new JWTParserBuilder().build()
  const parseResult = await JWTParser.parse(challeng)
  const claims = parseResult.getBody()
  if (claims === undefined) {
    return // 抛出error
  }
  const _payload = claims.payload
  const _nonce = _payload.nonce
  const hiveDid = claims.getIssuer()
  const appIdCredential = await issueDiplomaFor()
  const presentation = await createPresentation(appIdCredential, hiveDid, _nonce, storePassword)
  const token = await createChallengeResponse(presentation, hiveDid, storePassword)
  return token
}

const createChallengeResponse = async(vp, hiveDid, storepass) => {
  const exp = new Date()
  const iat = new Date().getTime()
  exp.setFullYear(exp.getFullYear() + 2)
  const expTime = exp.getTime()

  // Create JWT token with presentation.
  const doc = await getAppInstanceDIDDoc()
	const info = await new ConDID.DIDAccess().getExistingAppInstanceDIDInfo()
  const token = await doc.jwtBuilder()
    .addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
		.addHeader("version", "1.0")
		.setSubject("DIDAuthResponse")
		.setAudience(hiveDid)
		.setIssuedAt(iat)
		.setExpiration(expTime)
		.claimsWithJson("presentation", vp.toString(true))
		.sign(info.storePassword);
	return token
}

async function getAppInstanceDIDDoc() {
  const didAccess = new ConDID.DIDAccess()
  const info = await didAccess.getOrCreateAppInstanceDID()
  const instanceDIDDocument = await info.didStore.loadDid(info.did.toString())
  return instanceDIDDocument
}

async function issueDiplomaFor() {
  connectivity.setApplicationDID(ApplicationDID)
  const didAccess = new ConDID.DIDAccess()
  let credential = await didAccess.getExistingAppIdentityCredential()
  if (credential) {
    return credential
  }

  credential = await didAccess.generateAppIdCredential()

  if (credential) {
  return credential
  }
}

 async function createPresentation(vc, hiveDid, nonce, storepass){
  const access = new ConDID.DIDAccess()
  const info = await access.getOrCreateAppInstanceDID()
  const info2 = await access.getExistingAppInstanceDIDInfo()
  const vpb = await VerifiablePresentation.createFor(info.did, null, info.didStore)
  const vp = await vpb.credentials(vc).realm(hiveDid).nonce(nonce).seal(info2.storePassword)
  return vp
}