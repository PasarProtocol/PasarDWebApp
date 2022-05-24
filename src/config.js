export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const cognitoConfig = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID
};

export const auth0Config = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN
};

export const mapConfig = process.env.REACT_APP_MAP_MAPBOX;

export const googleAnalyticsConfig = process.env.REACT_APP_GA_MEASUREMENT_ID;

export const donationAddress = "0x48353677e2aDe5f164a3731d7b18e22Ac0AbaFea";

export const blankAddress = "0x0000000000000000000000000000000000000000";

const addressForProduction = {
  stickerContract: "0x020c7303664bc88ae92cE3D380BF361E03B78B81",
  // erc20Contract: "0xf5d461622Df01421c3b6082F962fD7711E94a579",
  marketContract: "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
  registerContract: "0x0B3d9c78E0e22b1c005AA74734aE0a973f1c60FE",
  diaContract: "0x2C8010Ae4121212F836032973919E8AeC9AEaEE5",
  blockchain: 'Elastos Smart Chain (ESC)'
}

const addressForTest = {
  stickerContract: "0x32496388d7c0CDdbF4e12BDc84D39B9E42ee4CB0", // 0x6Ec3d652A8B5e64B24b4760417Fb140a0aA2d62e
  // erc20Contract: "0xf5d461622Df01421c3b6082F962fD7711E94a579",
  marketContract: "0x19088c509C390F996802B90bdc4bFe6dc3F5AAA7", // 0x86F5FDeC1b49E67393Ab8186EedBe5e49133E98f
  registerContract: "0x2b304ffC302b402785294629674A8C2b64cEF897", // 0x5d9Cf411cdebF75db34b45c014D4f44F558012C0
  diaContract: "0x85946E4b6AB7C5c5C60A7b31415A52C0647E3272",
  blockchain: 'Testnet (ESC)'
}

const rpcUrlForMain = "https://api.elastos.io/eth"
const rpcUrlForTest = "https://api-testnet.elastos.io/eth"

const escServerForMain = "https://esc.elastos.io"
const escServerForTest = "https://esc-testnet.elastos.io"

const ApplicationDIDForMain = "did:elastos:iZvAak2SUHaKwBHmPFsgtVVMGtTpi4r2kY"
// const ApplicationDIDForTest = "did:elastos:ic8pRXyAT3JqEXo4PzHQHv5rsoYyEyDwpB"

export const {stickerContract, marketContract, registerContract, diaContract, blockchain} = process.env.REACT_APP_ENV==="production"?addressForProduction:addressForTest

export const ipfsURL = process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_IPFS_URL_PRODUCTION:process.env.REACT_APP_IPFS_URL_TEST
export const rpcURL = process.env.REACT_APP_ENV==="production"?rpcUrlForMain:rpcUrlForTest
export const escURL = process.env.REACT_APP_ENV==="production"?escServerForMain:escServerForTest
export const ApplicationDID = ApplicationDIDForMain

export const trustedProviders = [
  "did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK" // Trinity Tech KYC
]
export const auctionOrderType = '2'

export const tokenConf = {diaDecimals: 18, diaValue: 0.01, nPPM: 1000000, PPM: 1000000}