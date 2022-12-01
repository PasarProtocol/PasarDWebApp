export const firebaseConfig = {
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
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
  MAIN_CONTRACT: {
    ESC: {
      sticker: "0xF63f820F4a0bC6E966D61A4b20d24916713Ebb95",
      market: "0xaeA699E4dA22986eB6fa2d714F5AC737Fe93a998",
      register: "0x3d0AD66765C319c2A1c6330C1d815608543dcc19"
    },
    ETH: {
      sticker: "0x020c7303664bc88ae92cE3D380BF361E03B78B81",
      market: "0x940b857f2D5FA0cf9f0345B43C0e3308cD9E4A62",
      register: "0x24A7af00c8d03F2FeEb89045B2B93c1D7C3ffB08"
    },
    FSN: {
      sticker: blankAddress,
      market: "0xa18279eBDfA5747e79DBFc23fa999b4Eaf2A9780",
      register: "0x020c7303664bc88ae92cE3D380BF361E03B78B81"
    }
  },
  feedsContract: "0x020c7303664bc88ae92cE3D380BF361E03B78B81",
  // erc20Contract: "0xf5d461622Df01421c3b6082F962fD7711E94a579",
  v1marketContract: "0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0",
  diaContract: "0x2C8010Ae4121212F836032973919E8AeC9AEaEE5",
  welaContract: "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4",
  glideContract: "0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27",
  elkContract: "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C",
  ethUsdcContract: "0xA06be0F5950781cE28D965E5EFc6996e88a8C141",
  bunnyContract: "0x75740FC7058DA148752ef8a9AdFb73966DEb42a8",
  bnbBusdContract: "0x9f1d0Ed4E041C503BD487E5dc9FC935Ab57F9a57",
  elaOnEthContract: "0xe6fd75ff38Adca4B97FBCD938c86b98772431867",
  pasarERC20Contract: '',
  pasarVestingContract: '',
  pasarStakingContract: '',
  pasarMiningContract: '',
  blockchain: 'Elastos Smart Chain (ESC)'
}

const addressForTest = {
  MAIN_CONTRACT: {
    ESC: {
      sticker: "0x32496388d7c0CDdbF4e12BDc84D39B9E42ee4CB0",
      market: "0x19088c509C390F996802B90bdc4bFe6dc3F5AAA7",
      register: "0x2b304ffC302b402785294629674A8C2b64cEF897"
    },
    ETH: {
      sticker: "0xAB5bB5FcEFc9703814AF68077387BC09Be12190b",
      market: "0x7d797f3564073FFF8E75D9D5Be57EBC01512b554",
      register: "0x2C8615B32cf6535Eb38DD076aD822E7c2362a4c7"
    },
    FSN: {
      sticker: blankAddress,
      market: "0xa18279eBDfA5747e79DBFc23fa999b4Eaf2A9780",
      register: "0x020c7303664bc88ae92cE3D380BF361E03B78B81"
    }
  },
  feedsContract: "0xed1978c53731997f4DAfBA47C9b07957Ef6F3961",
  // erc20Contract: "0xf5d461622Df01421c3b6082F962fD7711E94a579",
  v1marketContract: "0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087",
  diaContract: "0x85946E4b6AB7C5c5C60A7b31415A52C0647E3272",
  welaContract: "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4",
  glideContract: "0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27",
  elkContract: "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C",
  ethUsdcContract: "0xA06be0F5950781cE28D965E5EFc6996e88a8C141",
  bunnyContract: "0x75740FC7058DA148752ef8a9AdFb73966DEb42a8",
  bnbBusdContract: "0x9f1d0Ed4E041C503BD487E5dc9FC935Ab57F9a57",
  elaOnEthContract: "0x8c947E0fA67e91370587076A4108Df17840e9982",
  pasarERC20Contract: '0x2E54635bee5F1451A7f138797d96f22e3Cba5453',
  pasarVestingContract: '0xB2d03B5c9Dc4429EDde239183AaF39D74e29a536',
  pasarStakingContract: '0xc7a57f6203f9F9b82cafb966c8940cA0527713A2',
  pasarMiningContract: '0xB27CC87EaF372F78E3Ca4da38b013E154e7247e0',
  blockchain: 'Testnet (ESC)'
}

const rpcUrlForMain = "https://api.elastos.io/eth"
const rpcUrlForTest = "https://api-testnet.elastos.io/eth"

const NetworkExplorerServer = {
  MainNet: {
    ESC: "https://esc.elastos.io",
    ETH: "https://etherscan.io",
    FSN: "https://fsnscan.com"
  },
  TestNet: {
    ESC: "https://esc-testnet.elastos.io",
    ETH: "https://goerli.etherscan.io",
    FSN: "https://blocks.fusionnetwork.io/#!/transaction"
  }
}

const ApplicationDIDForMain = "did:elastos:iZvAak2SUHaKwBHmPFsgtVVMGtTpi4r2kY"
// const ApplicationDIDForTest = "did:elastos:ic8pRXyAT3JqEXo4PzHQHv5rsoYyEyDwpB"
export const DidResolverUrl = 'https://api.elastos.io/eid'
// process.env.REACT_APP_ENV === 'production' ? 'mainnet' : 'testnet';

export const { MAIN_CONTRACT, feedsContract, v1marketContract, diaContract, welaContract, glideContract,
  elkContract, ethUsdcContract, bunnyContract, bnbBusdContract, elaOnEthContract, pasarVestingContract, pasarStakingContract, pasarMiningContract, pasarERC20Contract, blockchain } = process.env.REACT_APP_ENV === "production" ? addressForProduction : addressForTest
export const mainDiaContract = process.env.REACT_APP_ENV === "production" ? addressForProduction.diaContract: addressForTest.diaContract;

export const ipfsURL = process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_IPFS_URL_PRODUCTION : process.env.REACT_APP_IPFS_URL_TEST
export const rpcURL = process.env.REACT_APP_ENV === "production" ? rpcUrlForMain : rpcUrlForTest
export const ExplorerServer = process.env.REACT_APP_ENV === "production" ? NetworkExplorerServer.MainNet : NetworkExplorerServer.TestNet
export const ApplicationDID = ApplicationDIDForMain

export const trustedProviders = [
  "did:elastos:iqjN3CLRjd7a4jGCZe6B3isXyeLy7KKDuK" // Trinity Tech KYC
]
export const auctionOrderType = 2

export const tokenConf = { diaDecimals: 18, diaValue: 0.01, nPPM: 1000000, PPM: 1000000 }
