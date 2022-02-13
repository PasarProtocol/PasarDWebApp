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

export const blankAddress = "0x0000000000000000000000000000000000000000";

const addressForProduction = {
  stickerContract: "0x020c7303664bc88ae92cE3D380BF361E03B78B81",
  marketContract: "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
  diaContract: "0x2C8010Ae4121212F836032973919E8AeC9AEaEE5",
  blockchain: 'Elastos Smart Chain (ESC)'
}

const addressForTest = {
  stickerContract: "0xed1978c53731997f4DAfBA47C9b07957Ef6F3961",
  marketContract: "0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087",
  diaContract: "0x85946E4b6AB7C5c5C60A7b31415A52C0647E3272",
  blockchain: 'Testnet (ESC)'
}

export const {stickerContract, marketContract, diaContract, blockchain} = process.env.REACT_APP_ENV==="production"?addressForProduction:addressForTest

export const ipfsURL = process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_IPFS_URL_PRODUCTION:process.env.REACT_APP_IPFS_URL_TEST