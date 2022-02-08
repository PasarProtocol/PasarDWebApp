import axios from 'axios';
import Web3 from 'web3';
import { createHash } from 'crypto';
import { create, urlSource } from 'ipfs-http-client'
import { subDays, differenceInDays  } from 'date-fns';
import Jazzicon from "@metamask/jazzicon";
// import { DIDURL } from '@elastosfoundation/did-js-sdk/typings';
import { essentialsConnector } from '../components/signin-dlg/EssentialConnectivity';
import {marketContract as CONTRACT_ADDRESS, diaContract as DIA_CONTRACT_ADDRESS} from '../config';
import {PASAR_CONTRACT_ABI} from '../abi/pasarABI';
import {DIAMOND_CONTRACT_ABI} from '../abi/diamondABI';

const client = create('https://ipfs-test.trinity-feeds.app/');

// Get Abbrevation of hex addres //
export const reduceHexAddress = strAddress => strAddress?`${strAddress.substring(0, 5)}...${strAddress.substring(strAddress.length - 3, strAddress.length)}`:'';

// Get time from timestamp //
export const getTime = timestamp => {
  const date = new Date(timestamp * 1000);
  const pieces = date.toUTCString().split(" ");
  const [wd, d, m, y] = pieces;
  const dateStr = [m, d, y].join("-");

  let hours = date.getUTCHours();
  const suffix = hours >= 12 ? "PM":"AM";
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours.toString().padStart(2,'0');
  const min = date.getUTCMinutes().toString().padStart(2,'0');
  const sec = date.getUTCSeconds().toString().padStart(2,'0');
  const timeStr = [hours, min, sec].join(':').concat(" ").concat([suffix, "+UTC"].join(' '));
  return {'date':dateStr, 'time':timeStr};
};

const getIpfsUrl = id => {
  if(!id)
    return ""
  const prefixLen = id.split(':', 2).join(':').length
  if(prefixLen>=id.length)
    return ""
  const uri = id.substring(prefixLen+1)
  return `https://ipfs0.trinity-feeds.app/ipfs/${uri}`
}

export const getAssetImage = (metaObj, isThumbnail=false) => {
  const {asset, thumbnail, tokenJsonVersion, data} = metaObj
  let cid = asset
  if(tokenJsonVersion==="2" && !asset){
    if(isThumbnail)
      cid = data.thumbnail
    else cid = data.image
  }
  else if(isThumbnail)
    cid = thumbnail
  return getIpfsUrl(cid)
}

export const generateJazzicon = (address, size) => {
  if(!address)
    return Jazzicon(size, 0)
  return Jazzicon(size, parseInt(address.slice(2, 12), 16))
}

export const getElapsedTime = createdtimestamp => {
  const currentTimestamp = new Date().getTime() / 1000;
  const timestamp = currentTimestamp - createdtimestamp;
  let strDate = '';
  const nDay = parseInt(timestamp / (24 * 3600), 10);
  const nHour = parseInt(timestamp/ 3600, 10) % 24;
  const nMin = parseInt(timestamp / 60, 10) % 60;
  if (nDay > 0) strDate += nDay.concat('d');
  else if (nHour > 0) strDate += ' '.concat(nHour).concat('h');
  else if (nMin > 0) strDate += ' '.concat(nMin).concat('m');
  if (strDate === '') strDate = '0m';
  strDate += ' ago';
  return strDate;
};

export const getBalance = async (connectProvider) => {
    if(!connectProvider)
      return 0
    // const walletConnectProvider = essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(connectProvider);
  
    const accounts = await walletConnectWeb3.eth.getAccounts();
    const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
    return balance
};

export function dateRangeBeforeDays(days) {
  return [...Array(days).keys()].map((i) => subDays(new Date(), i).toISOString().slice(0, 10));
}

export function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

export async function getCoinUSD() {
  try {
    const resCoinPrice = await fetch('https://esc.elastos.io/api?module=stats&action=coinprice')
    const jsonData = await resCoinPrice.json()
    if(jsonData&&jsonData.result.coin_usd)
      return jsonData.result.coin_usd
    return 0
  } catch (error) {
    return 0
  }
}
export function getDiaTokenPrice(connectProvider) {
  return new Promise((resolve, reject) => {
    if(!connectProvider)
      return 0
    const walletConnectWeb3 = new Web3(connectProvider);
    walletConnectWeb3.eth.getBlockNumber().then(blocknum=>{
      const graphQLParams = {
          "query": `query tokenPriceData { token(id: "0x2c8010ae4121212f836032973919e8aec9aeaee5", block: {number: ${blocknum}}) { derivedELA } bundle(id: "1", block: {number: ${blocknum}}) { elaPrice } }`,
          "variables": null,
          "operationName": "tokenPriceData"
      }
      axios({
        "method": "POST",
        "url": 'https://api.glidefinance.io/subgraphs/name/glide/exchange',
        "headers": {
            "content-type": "application/json",
            // "x-rapidapi-host": "reddit-graphql-proxy.p.rapidapi.com",
            // "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "accept": "application/json"
        },
        "data": graphQLParams
      }).then(response=>{
        try {
          resolve(response.data.data)
        } catch (error) {
          reject(error);
        }
      });
    }).catch((error) => {
      reject(error);
    })
  })
}
export function getDiaTokenInfo(connectProvider, strAddress) {
  return new Promise((resolve, reject) => {
    if(!connectProvider)
      return 0
    const walletConnectWeb3 = new Web3(connectProvider);
    // const web3 = new Web3(Web3.givenProvider);
    // const MyContract = new web3.eth.Contract(DIAMOND_CONTRACT_ABI, DIA_CONTRACT_ADDRESS);
    // MyContract.methods.balanceOf(strAddress).call().then(console.log);

    const diamondContract = new walletConnectWeb3.eth.Contract(DIAMOND_CONTRACT_ABI, DIA_CONTRACT_ADDRESS)
    diamondContract.methods.balanceOf(strAddress).call()
    .then(result=>{
      // console.log(result)
      if(result === '0'){
        return '0';
      }
      const balance = walletConnectWeb3.utils.fromWei(result, 'ether');
      resolve(balance)
    }).catch((error) => {
      reject(error);
    })
  })
}

export function removeLeadingZero(value) {
  return value.replace(/-/g, '').replace(/^0+(?!\.|$)/, '')
}

export function callContractMethod(type, paramObj){
  return new Promise((resolve, reject) => {

    if(sessionStorage.getItem('PASAR_LINK_ADDRESS')!=='2'){
      reject(new Error)
      return
    }

    const walletConnectWeb3 = new Web3(essentialsConnector.getWalletConnectProvider())
    walletConnectWeb3.eth.getAccounts().then((accounts)=>{
      // console.log(accounts)
      const marketContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, CONTRACT_ADDRESS)
      walletConnectWeb3.eth.getGasPrice().then((gasPrice)=>{
        console.log("Gas price:", gasPrice); 

        const _gasLimit = 5000000;
        console.log("Sending transaction with account address:", accounts[0]);
        const transactionParams = {
          'from': accounts[0],
          'gasPrice': gasPrice,
          'gas': _gasLimit,
          'value': 0
        };
        let method = null
        if(type === 'createOrderForSale'){
          console.log("createOrderForSale");
          const {_id, _amount, _price, _didUri} = paramObj
          method = marketContract.methods.createOrderForSale(_id, _amount, _price, _didUri)
        }
        else if(type === 'buyOrder'){
          console.log("buyOrder");
          const {_orderId, _didUri} = paramObj
          method = marketContract.methods.buyOrder(_orderId, _didUri)
        }
        else{
          reject(new Error)
          return
        }
        const {beforeSendFunc, afterSendFunc} = paramObj
        if(beforeSendFunc)
          beforeSendFunc()
        method.send(transactionParams)
          .on('receipt', (receipt) => {
              if(afterSendFunc)
                afterSendFunc()
              console.log("receipt", receipt);
              resolve(true)
          })
          .on('error', (error, receipt) => {
              console.error("error", error);
              reject(error)
          });

      }).catch((error) => {
        reject(error);
      })
    }).catch((error) => {
      reject(error);
    })
  })
}

export const MethodList = [
  {
    method: 'Mint', 
    color: '#C4C4C4', 
    icon: 'hammer', 
    detail: [
      {description: 'Collectible created from mint address', field: 'from', copyable: true, ellipsis: true},
      {description: 'By', field: 'to', copyable: true, ellipsis: true},
    ],
    verb: {description: 'Minted', withPrice: false, subject: 'to'}
  },
  {
    method: 'SafeTransferFromWithMemo', 
    color: '#2B86DA', 
    icon: 'exchange', 
    detail: [
      {description: 'Collectible transferred to', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ],
    verb: {description: 'Transferred', withPrice: false, subject: 'to'}
  },
  {
    method: 'SafeTransferFrom', 
    color: '#789AB9', 
    icon: 'exchange', 
    detail: [
      {description: 'Collectible transferred to', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ],
    verb: {description: 'Transferred', withPrice: false, subject: 'to'}
  },
  {
    method: 'SetApprovalForAll', 
    color: '#17E9C3', 
    icon: 'stamp', 
    detail: [
      {description: 'Marketplace contract approved →', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ]
  },
  {
    method: 'Burn', 
    color: '#E96317', 
    icon: 'trashcan', 
    detail: [
      {description: 'Collectible sent to burn address', field: 'to', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ],
    verb: {description: 'Burnt', withPrice: false, subject: 'from'}
  },
  {
    method: 'CreateOrderForSale', 
    color: '#5B25CD', 
    icon: 'marketplace', 
    detail: [
      {description: 'Collectible listed on marketplace →', field: 'marketplace', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
      {description: 'For a value of', field: 'price', copyable: false},
    ],
    verb: {description: 'Listed for', withPrice: true, subject: 'from'}
  },
  {
    method: 'BuyOrder', 
    color: '#25CD7C', 
    icon: 'basket', 
    detail: [
      {description: 'Collectible purchased from', field: 'from', copyable: true, ellipsis: true},
      {description: 'By', field: 'to', copyable: true, ellipsis: true},
      {description: 'For a value of', field: 'price', copyable: false},
    ],
    verb: {description: 'Purchased for', withPrice: true, subject: 'to'}
  },
  {
    method: 'CancelOrder', 
    color: '#D60000', 
    icon: 'remove', 
    detail: [
      {description: 'Collectible removed from marketplace →', field: 'marketplace', copyable: true, ellipsis: true},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
    ],
    verb: {description: 'Removed', withPrice: false, subject: 'from'}
  },
  {
    method: 'ChangeOrderPrice', 
    color: '#CD6B25', 
    icon: 'tag', 
    detail: [
      {description: 'Collectible value updated to', field: 'data.newPrice', copyable: false},
      {description: 'By', field: 'from', copyable: true, ellipsis: true},
      {description: 'From initial value of', field: 'data.oldPrice', copyable: false},
    ],
    verb: {description: 'Updated for', withPrice: true, subject: 'to'}
  },
  {
    method: 'Bid', 
    color: '#CD25BC', 
    icon: 'auction',
    verb: {description: 'Bid', withPrice: true, subject: 'to'}
  }
]

export const sendIpfsDidJson = async () => {
  // create the metadata object we'll be storing
  const did = sessionStorage.getItem('did') ? sessionStorage.getItem('did') : '';
  const didObj = {
    'version': '2',
    'did': `did:elastos:${did}`
  };
  const jsonDidObj = JSON.stringify(didObj);
  console.log(jsonDidObj);
  // add the metadata itself as well
  const didUri = await client.add(jsonDidObj);
  return `did:elastos:${didUri.path}`;
};

// export const getRepresentativeOwnerName = (document) => {
//   let name = null;

//   // Try to find suitable credentials in the document - start with the application credential type
//   const applicationCredentials = document.getCredentialsByType("ApplicationCredential");
//   if (applicationCredentials && applicationCredentials.length > 0) {
//     const credSubject = applicationCredentials[0].getSubject();
//     if ("name" in credSubject)
//       name = credSubject.name;
//   }

//   // Check the "name" standard
//   if (!name) {
//     const nameCredentials = document.getCredentialsByType("NameCredential");
//     if (nameCredentials && nameCredentials.length > 0) {
//       const credSubject = nameCredentials[0].getSubject();
//       if ("name" in credSubject)
//         name = credSubject.name;
//     }
//   }

//   // Check the legacy "name"
//   if (!name) {
//     const nameCredential = document.getCredentialById(new DIDURL("#name"));
//     if (nameCredential) {
//       const credSubject = nameCredential.getSubject();
//       if ("name" in credSubject)
//         name = credSubject.name;
//     }
//   }

//   return name;
// }