import axios from 'axios';
import Web3 from 'web3';
import * as math from 'mathjs';
import { createHash } from 'crypto';
import { create } from 'ipfs-http-client';
import { format, subDays, subHours, formatDistance } from 'date-fns';
import Jazzicon from '@metamask/jazzicon';
import { DID, DIDBackend, DefaultDIDAdapter } from '@elastosfoundation/did-js-sdk';
import jwtDecode from 'jwt-decode';

import { essentialsConnector } from '../components/signin-dlg/EssentialConnectivity';
import {
  MAIN_CONTRACT,
  v1marketContract as V1_MARKET_CONTRACT_ADDRESS,
  diaContract as DIA_CONTRACT_ADDRESS,
  welaContract as WELA_CONTRACT_ADDRESS,
  glideContract as GLIDE_CONTRACT_ADDRESS,
  elkContract as ELK_CONTRACT_ADDRESS,
  ethUsdcContract as EUSDC_CONTRACT_ADDRESS,
  bunnyContract as BUNNY_CONTRACT_ADDRESS,
  bnbBusdContract as BUSD_CONTRACT_ADDRESS,
  elaOnEthContract as ELA_ON_ETH_CONTRACT_ADDRESS,
  pasarERC20Contract as PASAR_TOKEN_ADDRESS,
  pasarVestingContract as VESTING_CONTRACT_ADDRESS,
  pasarStakingContract as STAKING_CONTRACT_ADDRESS,
  pasarMiningContract as MINING_CONTRACT_ADDRESS,
  blankAddress,
  ipfsURL as PasarIpfs,
  rpcURL,
  ExplorerServer,
  feedsContract
} from '../config';
import { PASAR_CONTRACT_ABI } from '../abi/pasarABI';
import { V1_PASAR_CONTRACT_ABI } from '../abi/pasarV1ABI';
import { ERC20_CONTRACT_ABI } from '../abi/diamondABI';
import { REGISTER_CONTRACT_ABI } from '../abi/registerABI';
import { COMMON_CONTRACT_ABI } from '../abi/commonABI';
import { TOKEN_ERC20_ABI } from '../abi/token20ABI';
import { TOKEN_VESTING_ABI } from '../abi/tokenVestingABI';
import { TOKEN_STAKING_ABI } from '../abi/tokenStakingABI';
import { TOKEN_MINING_ABI } from '../abi/tokenMiningABI';

const pricingContract = [
  blankAddress,
  DIA_CONTRACT_ADDRESS,
  WELA_CONTRACT_ADDRESS,
  GLIDE_CONTRACT_ADDRESS,
  ELK_CONTRACT_ADDRESS,
  EUSDC_CONTRACT_ADDRESS,
  BUNNY_CONTRACT_ADDRESS,
  BUSD_CONTRACT_ADDRESS
];
const ipfsUrls = [PasarIpfs, 'https://ipfs.ela.city', 'https://gateway.pinata.cloud'];

// Get Abbrevation of hex addres //
export const reduceHexAddress = (strAddress) => {
  if (!strAddress) return '';
  if (strAddress.length < 10) return strAddress;
  return `${strAddress.substring(0, 6)}...${strAddress.substring(strAddress.length - 3, strAddress.length)}`;
};

export const fetchAPIFrom = (uri, props = {}) => {
  const backendURL =
    process.env.REACT_APP_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_URL_PRODUCTION
      : process.env.REACT_APP_BACKEND_URL_TEST;
  return fetch(`${backendURL}/${uri}`, props);
};

// Get time from timestamp //
export const getTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const pieces = date.toString().split(' ');
  const [, m, d, y] = pieces;
  const dateStr = [m, d, y].join('-');

  let hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours.toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const sec = date.getSeconds().toString().padStart(2, '0');
  const timeStr = [hours, min, sec]
    .join(':')
    .concat(' ')
    .concat([suffix, `UTC${getTimeZone()}`].join(' '));
  return { date: dateStr, time: timeStr };
};

export const getDateTimeString = (date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

export const getDateDistance = (timestamp) =>
  timestamp
    ? formatDistance(timestamp * 1000, new Date(), { addSuffix: true })
        .replace('about', '')
        .trim()
    : '';

export const getTimeZone = () => {
  const e = String(-new Date().getTimezoneOffset() / 60);
  return e.includes('-') ? e : '+'.concat(e);
};

export const getIpfsUrl = (uri, ipfsType = 0) => {
  if (!uri) return '';
  const ipfsUrl = ipfsUrls[ipfsType];
  if ((uri.match(/:/g) || []).length !== 2) return '';

  const prefixLen = uri.split(':', 2).join(':').length;
  if (prefixLen >= uri.length) return '';
  const tempUri = uri.substring(prefixLen + 1);
  return `${ipfsUrl}/ipfs/${tempUri}`;
};

export const getImageFromIPFSUrl = (url) => {
  // pasar:image:xxx
  // feeds:image:xxx, feeds:imgage:xxx
  // ipfs://xxx
  // https://xxxx blob:http://
  // no data
  if (url) {
    if (url.startsWith('blob:http')) return url;
    if (url.startsWith('https://')) return url;
    if (url.startsWith('ipfs://')) return `${PasarIpfs}/ipfs/${url.slice(7)}`;
    const segments = url.split(':').filter((item) => item);
    if (segments.length === 3 && (segments[0] === 'pasar' || segments[0] === 'feeds'))
      return `${PasarIpfs}/ipfs/${segments[2]}`;
  }
  return '/static/broken-image.svg';
};

export const getHiveHubImageFromIPFSUrl = (url) => {
  if (url) {
    const segments = url.split(':').filter((item) => item);
    if (segments.length === 3) {
      if(segments[2] === "undefined") {
        return `${PasarIpfs}/ipfs/QmPEWCF6kNL1Bs1gSWJAqqitbwWMEWvLQGaezJgENYkS48`;
      }
      if((segments[0] === 'pasar' || segments[0] === 'feeds')) {
        return `${PasarIpfs}/ipfs/${segments[2]}`;
      }
    }
  }
  return '/static/broken-image.svg';
};

export const getCollectionTypeFromImageUrl = (metaObj) => {
  const { asset, tokenJsonVersion, data } = metaObj;
  let cid = asset;
  if (tokenJsonVersion === '2') {
    if (data) cid = data.image;
  }
  if (!cid) return 1;
  const prefix = cid.split(':')[0];
  if (prefix === 'pasar') return 0;
  return 1;
};

export const generateJazzicon = (address, size) => {
  if (!address) return Jazzicon(size, 0);
  return Jazzicon(size, parseInt(address.slice(2, 12), 16));
};

export const getElapsedTime = (createdtimestamp) => {
  const currentTimestamp = new Date().getTime() / 1000;
  const timestamp = currentTimestamp - createdtimestamp;
  let strDate = '';
  const nDay = parseInt(timestamp / (24 * 3600), 10);
  const nHour = parseInt(timestamp / 3600, 10) % 24;
  const nMin = parseInt(timestamp / 60, 10) % 60;
  if (nDay > 0) strDate += nDay.concat('d');
  else if (nHour > 0) strDate += ' '.concat(nHour).concat('h');
  else if (nMin > 0) strDate += ' '.concat(nMin).concat('m');
  if (strDate === '') strDate = '0m';
  strDate += ' ago';
  return strDate;
};

export const getBalance = async (connectProvider) => {
  if (!connectProvider) return 0;
  const walletConnectWeb3 = new Web3(connectProvider);

  const accounts = await walletConnectWeb3.eth.getAccounts();
  const balance = await walletConnectWeb3.eth.getBalance(accounts[0]);
  return balance;
};
export const getFSNBalance = async (address) => {
  const walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider('https://testnet.fusionnetwork.io'));
  const balance = await walletConnectWeb3.eth.getBalance(address);
  return balance;
};

export const getBalanceByAllCoinTypes = (connectProvider, chainId, balanceHandler) =>
  new Promise((resolve, reject) => {
    if (!connectProvider) {
      resolve(false);
      return;
    }
    const currentCoinTypes = getCoinTypesInCurrentNetwork(chainId);
    const chainType = getChainTypeFromId(chainId);
    const startPos = getStartPosOfCoinTypeByChainType(chainType);
    const walletConnectWeb3 = new Web3(connectProvider);
    walletConnectWeb3.eth
      .getAccounts()
      .then((accounts) => {
        const getBalanceFuncs = currentCoinTypes.map((coin, _i) => {
          if (coin.address === blankAddress)
            return walletConnectWeb3.eth
              .getBalance(accounts[0])
              .then((balance) => {
                balanceHandler(_i + startPos, math.round(balance / 1e18, 4));
              })
              .catch((e) => {
                console.error(e);
              });

          return getERC20TokenBalance(coin.address, accounts[0], connectProvider)
            .then((balance) => {
              balanceHandler(_i + startPos, balance * 1);
            })
            .catch((e) => {
              console.error(e);
            });
        });
        Promise.all(getBalanceFuncs)
          .then(() => {
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getDiaBalanceDegree = (balance, chainId) => {
  const chainType = getChainTypeFromId(chainId);
  const diaBalance = balance * 1;
  if (chainType && chainType !== 'ESC') return 4;
  if (diaBalance >= 1) return 3;
  if (diaBalance >= 0.1) return 2;
  if (diaBalance >= 0.01) return 1;
  return 0;
};

export function dateRangeBeforeDays(days) {
  if (days > 2) return [...Array(days).keys()].map((i) => format(subDays(new Date(), i), 'yyyy-MM-dd'));

  const resultArray = [];
  let currentIndex = 0;
  let currentDate = format(new Date(), 'yyyy-MM-dd HH:00');
  do {
    resultArray.push(currentDate);
    currentIndex += 1;
    currentDate = format(subHours(new Date(), currentIndex), 'yyyy-MM-dd HH:00');
  } while (currentDate >= format(subDays(new Date(), 1), 'yyyy-MM-dd 00:00'));
  return resultArray;
}

export function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

export async function getCoinUSD() {
  // return new Promise((resolve) => {
  //   getERC20TokenPrice(blankAddress)
  //     .then((result) => {
  //       if (result.bundle.elaPrice) resolve(result.bundle.elaPrice);
  //       else resolve(0);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       resolve(0);
  //     });
  // });
  const response = await fetchAPIFrom('api/v1/price');
  return (await response.json()).ELA;
}

export async function getERC20TokenPrice(tokenAddress) {
  // return new Promise((resolve, reject) => {
  //   const walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
  //
  //   walletConnectWeb3.eth
  //     .getBlockNumber()
  //     .then((blocknum) => {
  //       const graphQLParams = {
  //         query: `query tokenPriceData { token(id: "${tokenAddress.toLowerCase()}", block: {number: ${blocknum}}) { derivedELA } bundle(id: "1", block: {number: ${blocknum}}) { elaPrice } }`,
  //         variables: null,
  //         operationName: 'tokenPriceData'
  //       };
  //       axios({
  //         method: 'POST',
  //         url: 'https://api.glidefinance.io/subgraphs/name/glide/exchange',
  //         headers: {
  //           'content-type': 'application/json',
  //           accept: 'application/json'
  //         },
  //         data: graphQLParams
  //       }).then((response) => {
  //         try {
  //           resolve(response.data.data);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });
  try {
    const res2 = await fetchAPIFrom('api/v1/getQuotedTokensRate');
    const data = await res2.json();
    for(let i = 0; i < data.data.length; i+=1) {
      if (data.data[i].token === tokenAddress.toLowerCase()) {
        return data.data[i].price;
      }
    }
  } catch (e) {
    return 0;
  }
}

export async function getTokenPriceInEthereum() {
  // return new Promise((resolve) => {
  //   const url =
  //     // 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=elastos,ethereum,fsn&order=market_cap_desc&per_page=6&page=1&sparkline=false';
  //     'https://api.coingecko.com/api/v3/simple/price?ids=elastos,ethereum,fsn&vs_currencies=usd';
  //   // 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD';
  //   // 'https://api.coinstats.app/public/v1/coins/ethereum?currency=USD';
  //   axios
  //     .get(url)
  //     .then((res) => {
  //       const ret = [0, 0, 0];
  //       if (res?.data?.ethereum?.usd) ret[0] = res.data.ethereum.usd;
  //       if (res?.data?.elastos?.usd) ret[1] = res.data.elastos.usd;
  //       if (res?.data?.fsn?.usd) ret[2] = res.data.fsn.usd;
  //       resolve(ret);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       resolve([0, 0, 0]);
  //     });
  // });
    const response = await fetchAPIFrom('api/v1/price');
    const data = await response.json();
    return [data.ETH, data.ELA, data.FSN];
}

export function setAllTokenPrice2(setCoinPriceByType) {
  const fetchCoinPrice = async () => {
    const res = await fetchAPIFrom('api/v1/price');
    const tokenPrice = await res.json();
    setCoinPriceByType(0, tokenPrice.ELA);
    setCoinPriceByType(10, tokenPrice.ELA);
    setCoinPriceByType(coinTypes.length, tokenPrice.ETH);
    setCoinPriceByType(coinTypes.length + coinTypesForEthereum.length, tokenPrice.FSN);

    const res2 = await fetchAPIFrom('api/v1/getQuotedTokensRate');
    const data = await res2.json();
    const tokenRates = data.data;
    const tokenRatesMap = {}
    tokenRates.forEach((tokenRate) => {
      if(!tokenRatesMap[tokenRate.chain]) {
        tokenRatesMap[tokenRate.chain] = {}
      }
      tokenRatesMap[tokenRate.chain][tokenRate.token] = tokenRate.price;
    });

    coinTypes.forEach((coin, index) => {
      if(coin.name === 'ELA') {
        return;
      }
      setCoinPriceByType(index, tokenRatesMap.ela[coin.address.toLowerCase()]);
    })
    setCoinPriceByType(2, 0.1);
  }
  fetchCoinPrice();
}

// export function setAllTokenPrice(setCoinPriceByType) {
//   getCoinUSD().then((res) => {
//     setCoinPriceByType(0, res);
//   });
//   getDiaTokenPrice().then((res) => {
//     if (!res || !res.token) return;
//     setCoinPriceByType(1, res.token.derivedELA * res.bundle.elaPrice);
//   });
//   coinTypes.forEach((token, _i) => {
//     if (_i < 2) return;
//     if (token.name === 'PASAR') {
//       setCoinPriceByType(_i, 0.1);
//       return;
//     }
//     getERC20TokenPrice(token.address).then((res) => {
//       if (!res || !res.token) return;
//       setCoinPriceByType(_i, res.token.derivedELA * res.bundle.elaPrice);
//     });
//   });
//   getTokenPriceInEthereum().then((res) => {
//     res.forEach((value, _i) => {
//       setCoinPriceByType(coinTypes.length + _i, value);
//     });
//   });
// }
export function getDiaTokenInfo(strAddress, connectProvider = null) {
  return getERC20TokenBalance(DIA_CONTRACT_ADDRESS, strAddress, connectProvider);
}
export function getElaOnEthTokenInfo(strAddress, connectProvider = null) {
  return getERC20TokenBalance(ELA_ON_ETH_CONTRACT_ADDRESS, strAddress, connectProvider);
}
function getERC20TokenBalance(erc20ContractAddress, strAddress, connectProvider = null) {
  return new Promise((resolve, reject) => {
    try {
      let walletConnectWeb3;
      if (connectProvider) walletConnectWeb3 = new Web3(connectProvider);
      else if (Web3.givenProvider || Web3.currentProvider || window.ethereum)
        walletConnectWeb3 = new Web3(Web3.givenProvider || Web3.currentProvider || window.ethereum);
      else walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
      const diamondContract = new walletConnectWeb3.eth.Contract(ERC20_CONTRACT_ABI, erc20ContractAddress);
      diamondContract.methods
        .balanceOf(strAddress)
        .call()
        .then((result) => {
          if (result === '0') {
            resolve(result);
            return;
          }
          const balance = walletConnectWeb3.utils.fromWei(result, 'ether');
          resolve(balance);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export async function getERCType(contractAddress, connectProvider = null) {
  try {
    let walletConnectWeb3;
    if (connectProvider) walletConnectWeb3 = new Web3(connectProvider);
    else if (Web3.givenProvider || Web3.currentProvider || window.ethereum)
      walletConnectWeb3 = new Web3(Web3.givenProvider || Web3.currentProvider || window.ethereum);
    else walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

    const ercContract = new walletConnectWeb3.eth.Contract(COMMON_CONTRACT_ABI, contractAddress);
    const is721 = await ercContract.methods.supportsInterface('0x80ac58cd').call();
    if (is721) return 0;
    return 1;
  } catch (e) {
    return 1;
  }
}

export async function checkWhetherGeneralCollection(chainId, contractAddress, connectProvider = null) {
  try {
    let walletConnectWeb3;
    if (connectProvider) walletConnectWeb3 = new Web3(connectProvider);
    else if (Web3.givenProvider || Web3.currentProvider || window.ethereum)
      walletConnectWeb3 = new Web3(Web3.givenProvider || Web3.currentProvider || window.ethereum);
    else walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

    const RegContractAddress = getContractAddressInCurrentNetwork(chainId, 'register');
    const registerContract = new walletConnectWeb3.eth.Contract(REGISTER_CONTRACT_ABI, RegContractAddress);
    const _isGeneralToken = await registerContract.methods.isGeneralToken(contractAddress).call();
    return _isGeneralToken;
  } catch (e) {
    return false;
  }
}

export function removeLeadingZero(value) {
  return value.replace(/-/g, '').replace(/^0+(?!\.|$)/, '');
}

export function isValidLimitPrice(value) {
  return /^[0-9]{0,8}((\.[0-9]{0,3})|)$/.test(value);
}

export function isNumberString(value) {
  return /^\d+\.?\d*$/.test(value);
}

export function getShortUrl(url) {
  return new Promise((resolve) => {
    fetch(
      `${process.env.REACT_APP_SHORTEN_SERVICE_URL}/api/v2/action/shorten?key=d306f2eda6b16d9ecf8a40c74e9e91&url=${url}&is_secret=false`
    )
      .then((resShorternUrl) => {
        resolve(resShorternUrl.text());
      })
      .catch((e) => {
        console.error(e);
        resolve(url);
      });
  });
}

export function callContractMethod(type, coinType, chainId, paramObj) {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2') {
      reject(new Error());
      return;
    }

    const MarketContractAddress = getContractAddressInCurrentNetwork(chainId, 'market');
    const walletConnectWeb3 = new Web3(
      isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider()
    );
    walletConnectWeb3.eth
      .getAccounts()
      .then((accounts) => {
        const marketContract = new walletConnectWeb3.eth.Contract(PASAR_CONTRACT_ABI, MarketContractAddress);
        walletConnectWeb3.eth
          .getGasPrice()
          .then((gasPrice) => {
            console.log('Gas price:', gasPrice);
            console.log('Sending transaction with account address:', accounts[0]);
            let method = null;
            if (type === 'createOrderForSale') {
              console.log('createOrderForSale');
              const { _id, _amount, _price, _didUri, _baseAddress } = paramObj;
              console.log(
                _baseAddress,
                _id,
                _amount,
                pricingContract[coinType],
                _price,
                (new Date().getTime() / 1000).toFixed(),
                _didUri
              );
              method = marketContract.methods.createOrderForSale(
                _baseAddress,
                _id,
                _amount,
                pricingContract[coinType],
                _price,
                (new Date().getTime() / 1000).toFixed(),
                _didUri
              );
            } else if (type === 'createOrderForSaleBatch') {
              console.log('createOrderForSaleBatch');
              const { _ids, _amounts, _price, _didUri, _baseAddress } = paramObj;
              const _prices = Array(_ids.length).fill(_price);
              const _startTimes = Array(_ids.length).fill((new Date().getTime() / 1000).toFixed());
              console.log(_baseAddress, _ids, _amounts, pricingContract[coinType], _prices, _startTimes, _didUri);
              method = marketContract.methods.createOrderForSaleBatch(
                _baseAddress,
                _ids,
                _amounts,
                pricingContract[coinType],
                _prices,
                _startTimes,
                _didUri
              );
            } else if (type === 'createOrderForAuction') {
              console.log('createOrderForAuction');
              const { _id, _amount, _minPrice, _reservePrice, _buyoutPrice, _endTime, _didUri, _baseAddress } =
                paramObj;
              console.log(
                _baseAddress,
                _id,
                _amount,
                pricingContract[coinType],
                _minPrice,
                _reservePrice,
                _buyoutPrice,
                (new Date().getTime() / 1000).toFixed(),
                _endTime,
                _didUri
              );
              method = marketContract.methods.createOrderForAuction(
                _baseAddress,
                _id,
                _amount,
                pricingContract[coinType],
                _minPrice,
                _reservePrice,
                _buyoutPrice,
                (new Date().getTime() / 1000).toFixed(),
                _endTime,
                _didUri
              );
            } else if (type === 'buyOrder') {
              console.log('buyOrder');
              const { _orderId, _didUri } = paramObj;
              method = marketContract.methods.buyOrder(_orderId, _didUri);
            } else if (type === 'settleAuctionOrder') {
              console.log('settleAuctionOrder');
              const { _orderId } = paramObj;
              method = marketContract.methods.settleAuctionOrder(_orderId);
            } else if (type === 'changeAuctionOrderPrice') {
              console.log('changeAuctionOrderPrice');
              const { _orderId, _price, _reservePrice, _buyoutPrice } = paramObj;
              method = marketContract.methods.changeAuctionOrderPrice(
                _orderId,
                _price,
                _reservePrice,
                _buyoutPrice,
                pricingContract[coinType]
              );
            } else if (type === 'changeSaleOrderPrice') {
              console.log('changeSaleOrderPrice');
              const { _orderId, _price, v1State = false } = paramObj;
              if (!v1State)
                method = marketContract.methods.changeSaleOrderPrice(_orderId, _price, pricingContract[coinType]);
              else {
                const v1MarketContract = new walletConnectWeb3.eth.Contract(
                  V1_PASAR_CONTRACT_ABI,
                  V1_MARKET_CONTRACT_ADDRESS
                );
                method = v1MarketContract.methods.changeOrderPrice(_orderId, _price);
              }
            } else {
              reject(new Error());
              return;
            }
            const { beforeSendFunc, afterSendFunc } = paramObj;
            if (beforeSendFunc) beforeSendFunc();
            const _gasLimit = 8000000;
            console.log({ _gasLimit });
            const transactionParams = {
              from: accounts[0],
              gasPrice,
              gas: _gasLimit,
              value: 0
            };
            method
              .send(transactionParams)
              .on('receipt', (receipt) => {
                if (afterSendFunc) afterSendFunc();
                console.log('receipt', receipt);
                resolve(true);
              })
              .on('error', (error) => {
                console.error('error', error);
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const callTokenContractMethod = (param) =>
  new Promise((resolve, reject) => {
    const linkType = sessionStorage.getItem('PASAR_LINK_ADDRESS');
    let walletConnectProvider;
    if (linkType === '2')
      walletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    else if (linkType === '1' && (Web3.givenProvider || window.ethereum))
      walletConnectProvider = Web3.givenProvider || window.ethereum;
    else walletConnectProvider = new Web3.providers.HttpProvider(rpcURL);
    const walletConnectWeb3 = new Web3(walletConnectProvider);

    let contractABI;
    let contractAddress;
    let contractMethod = null;
    let accounts = [];
    const gasPrice = '';
    switch (param.contractType) {
      case 'token':
        contractABI = TOKEN_ERC20_ABI;
        contractAddress = PASAR_TOKEN_ADDRESS;
        break;
      case 'vesting':
        contractABI = TOKEN_VESTING_ABI;
        contractAddress = VESTING_CONTRACT_ADDRESS;
        break;
      case 'staking':
        contractABI = TOKEN_STAKING_ABI;
        contractAddress = STAKING_CONTRACT_ADDRESS;
        break;
      case 'mining':
        contractABI = TOKEN_MINING_ABI;
        contractAddress = MINING_CONTRACT_ADDRESS;
        break;
      default:
        contractABI = undefined;
        contractAddress = undefined;
        break;
    }
    if (!contractABI || !contractAddress) return;
    const smartContract = new walletConnectWeb3.eth.Contract(contractABI, contractAddress);
    switch (param.methodName) {
      case 'balanceOf':
        contractMethod = smartContract.methods.balanceOf(param.account);
        break;
      case 'allowance':
        contractMethod = smartContract.methods.allowance(param.owner, param.spender);
        break;
      case 'approve':
        contractMethod = smartContract.methods.approve(param.spender, param.amount);
        break;
      case 'getUserInfo':
        contractMethod = smartContract.methods.getUserInfo(param.account);
        break;
      case 'getCurrentTime':
        contractMethod = smartContract.methods.getCurrentTime();
        break;
      case 'totalRewardAtTime':
        contractMethod = smartContract.methods.totalRewardAtTime(param.timestamp);
        break;
      case 'stake':
        contractMethod = smartContract.methods.stake(param.amount);
        break;
      case 'withdraw':
        contractMethod = smartContract.methods.withdraw();
        break;
      case 'config':
        contractMethod = smartContract.methods.config();
        break;
      case 'accountRewards':
        contractMethod = smartContract.methods.accountRewards(param.account);
        break;
      case 'getCurrentRatios':
        contractMethod = smartContract.methods.getCurrentRatios();
        break;
      case 'pendingRewards':
        contractMethod = smartContract.methods.pendingRewards();
        break;
      case 'withdrawRewardByName':
        contractMethod = smartContract.methods.withdrawRewardByName(param.name);
        break;
      default:
        contractMethod = undefined;
        break;
    }
    if (!contractMethod) return;

    const handleTxEvent = (hash) => {
      console.log('transactionHash', hash);
    };
    const handleReceiptEvent = (receipt) => {
      console.log('receipt', receipt);
      resolve();
    };
    const handleErrorEvent = (error) => {
      console.error('error', error);
      reject(error);
    };

    if (param.callType === 'call') {
      contractMethod.call().then((res) => resolve(res));
    } else if (param.callType === 'send') {
      walletConnectWeb3.eth
        .getAccounts()
        .then((_accounts) => {
          accounts = _accounts;
          return walletConnectWeb3.eth.getGasPrice();
        })
        .then(async (_gasPrice) => getFilteredGasPrice(_gasPrice))
        .then((_estimatedGas) => {
          const transactionParams = {
            from: accounts[0],
            gasPrice,
            gas: _estimatedGas > 8000000 ? 8000000 : _estimatedGas,
            value: 0
          };
          contractMethod
            .send(transactionParams)
            .once('transactionHash', handleTxEvent)
            .once('receipt', handleReceiptEvent)
            .on('error', handleErrorEvent);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

export const getWalletAccounts = async () => {
  const linkType = sessionStorage.getItem('PASAR_LINK_ADDRESS');
  let walletConnectProvider;
  if (linkType === '2')
    walletConnectProvider = isInAppBrowser()
      ? window.elastos.getWeb3Provider()
      : essentialsConnector.getWalletConnectProvider();
  else if (linkType === '1' && (Web3.givenProvider || window.ethereum))
    walletConnectProvider = Web3.givenProvider || window.ethereum;
  else walletConnectProvider = new Web3.providers.HttpProvider(rpcURL);
  const walletConnectWeb3 = new Web3(walletConnectProvider);

  const accounts = await walletConnectWeb3.eth.getAccounts();
  return accounts;
};

export const addTokenToMM = async (address, symbol, decimals, image) => {
  if (!address || !symbol || !decimals) return;
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const { ethereum } = window;
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address, // The address that the token is at.
          symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals, // The number of decimals in the token
          image // A string url of the token logo
        }
      }
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
};

export function getContractInfo(connectProvider, strAddress) {
  return new Promise((resolve, reject) => {
    try {
      let walletConnectWeb3;
      if (connectProvider) walletConnectWeb3 = new Web3(connectProvider);
      else if (Web3.givenProvider || Web3.currentProvider || window.ethereum)
        walletConnectWeb3 = new Web3(Web3.givenProvider || Web3.currentProvider || window.ethereum);
      else walletConnectWeb3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

      const tokenContract = new walletConnectWeb3.eth.Contract(COMMON_CONTRACT_ABI, strAddress);
      tokenContract.methods
        .name()
        .call()
        .then((resultName) => {
          tokenContract.methods
            .symbol()
            .call()
            .then((resultSymbol) => {
              tokenContract.methods
                .owner()
                .call()
                .then((resultOwner) => {
                  resolve({ name: resultName, symbol: resultSymbol, owner: resultOwner });
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const isPasarOrFeeds = (contract) =>
  MAIN_CONTRACT.ESC.sticker === contract ||
  MAIN_CONTRACT.ETH.sticker === contract ||
  MAIN_CONTRACT.FSN.sticker === contract ||
  feedsContract === contract;

export const MethodList = [
  {
    method: 'Mint',
    color: '#C4C4C4',
    icon: 'hammer',
    detail: [
      { description: 'Collectible created from mint address', field: 'from', copyable: true, ellipsis: true },
      { description: 'By', field: 'to', copyable: true, ellipsis: true }
    ],
    verb: { description: 'Minted', withPrice: false, subject: 'to' }
  },
  {
    method: 'SafeTransferFromWithMemo',
    color: '#2B86DA',
    icon: 'exchange',
    detail: [
      { description: 'Collectible transferred to', field: 'to', copyable: true, ellipsis: true },
      { description: 'By', field: 'from', copyable: true, ellipsis: true }
    ],
    verb: { description: 'Transferred', withPrice: false, subject: 'to' }
  },
  {
    method: 'SafeTransferFrom',
    color: '#789AB9',
    icon: 'exchange',
    detail: [
      { description: 'Collectible transferred to', field: 'to', copyable: true, ellipsis: true },
      { description: 'By', field: 'from', copyable: true, ellipsis: true }
    ],
    verb: { description: 'Transferred', withPrice: false, subject: 'to' }
  },
  {
    method: 'SetApprovalForAll',
    color: '#17E9C3',
    icon: 'stamp',
    detail: [
      { description: 'Marketplace contract approved →', field: 'to', copyable: true, ellipsis: true },
      { description: 'By', field: 'from', copyable: true, ellipsis: true }
    ]
  },
  {
    method: 'Burn',
    color: '#E96317',
    icon: 'trashcan',
    detail: [
      { description: 'Collectible sent to burn address', field: 'to', copyable: true, ellipsis: true },
      { description: 'By', field: 'from', copyable: true, ellipsis: true }
    ],
    verb: { description: 'Burnt', withPrice: false, subject: 'from' }
  },
  {
    method: 'CreateOrderForSale',
    color: '#5B25CD',
    icon: 'marketplace',
    detail: [
      { description: 'Collectible listed on marketplace →', field: 'marketplace', copyable: true, ellipsis: true },
      { description: 'By', field: 'seller', copyable: true, ellipsis: true },
      { description: 'For a value of', field: 'price', copyable: false }
    ],
    verb: { description: 'Listed for', withPrice: true, subject: 'sellerAddr' }
  },
  {
    method: 'BuyOrder',
    color: '#25CD7C',
    icon: 'basket',
    detail: [
      { description: 'Collectible purchased from', field: 'seller', copyable: true, ellipsis: true },
      { description: 'By', field: 'buyer', copyable: true, ellipsis: true },
      { description: 'For a value of', field: 'price', copyable: false }
    ],
    verb: { description: 'Purchased for', withPrice: true, subject: 'buyerAddr' }
  },
  {
    method: 'CancelOrder',
    color: '#D60000',
    icon: 'remove',
    detail: [
      { description: 'Collectible removed from marketplace →', field: 'marketplace', copyable: true, ellipsis: true },
      { description: 'By', field: 'seller', copyable: true, ellipsis: true }
    ],
    verb: { description: 'Removed', withPrice: false, subject: 'sellerAddr' }
  },
  {
    method: 'ChangeOrderPrice',
    color: '#CD6B25',
    icon: 'tag',
    detail: [
      { description: 'Collectible value updated to', field: 'data.newPrice', copyable: false },
      { description: 'By', field: 'from', copyable: true, ellipsis: true },
      { description: 'From initial value of', field: 'data.oldPrice', copyable: false }
    ],
    verb: { description: 'Updated to', withPrice: true, subject: 'sellerAddr' }
  },
  {
    method: 'OrderBid',
    color: '#CD25BC',
    icon: 'auction',
    detail: [
      { description: 'Bid placed on collectible →', field: 'marketplace', copyable: true, ellipsis: true },
      { description: 'By', field: 'buyer', copyable: true, ellipsis: true },
      { description: 'For a value of', field: 'price', copyable: false }
    ],
    verb: { description: 'Bid', withPrice: true, subject: 'buyerAddr' }
  },
  {
    method: 'OrderForAuction',
    color: '#25CDCD',
    icon: 'marketplace-auction',
    detail: [
      { description: 'Collectible put up for auction →', field: 'marketplace', copyable: true, ellipsis: true },
      { description: 'By', field: 'sellerAddr', copyable: true, ellipsis: true },
      { description: 'For a starting price of', field: 'price', copyable: false }
    ],
    verb: { description: 'Put up for auction for a starting price of', withPrice: true, subject: 'sellerAddr' }
  }
];
// new
export const convertMethodName = (name) => {
  if (name === 'OrderBid') return 'BidForOrder';
  if (name === 'OrderForAuction') return 'CreateOrderForAuction';
  return name;
};
export const collectionTypes = [
  {
    symbol: 'PSRC',
    name: 'Pasar Collection',
    avatar: '/static/logo-icon-white.svg',
    shortDescription: 'Pasar default collection',
    description: 'A collection of all items minted using the Pasar Collection Contract',
    token: 2,
    chainIndex: 1
  },
  {
    symbol: 'FSTK',
    name: 'Feeds NFT Sticker',
    avatar: '/static/feeds-sticker.svg',
    shortDescription: 'Feeds default collection',
    description: 'A collection of all items minted using the Feeds NFT Stickers Contract',
    token: 1,
    chainIndex: 1
  }
  // {
  //   symbol: 'Bunny',
  //   name: 'Bunny Punk',
  //   avatar: 'https://ipfs-test.trinity-feeds.app/ipfs/QmVGaCENQCFKm1cJhRWBJ6Wj41LWh1Ev4gjkTBTZCyH7YC',
  //   background: 'https://lh3.googleusercontent.com/fItcL7Th5tjT-54xPOMDWOWWxlAUvROhpH6SiJigUihUa0BusEPFJKI8UkkLyvFEh9Oxl1OBRrv0mZHgPndNf7QocVnqwLxECKlr=h600',
  //   shortDescription: 'Bunny Punk collection',
  //   description: 'Bunny Punk is a collection of 1,000 unique 3D well-designed Bunnies united together to get on the Elastos Smart chain Each Bunny Punk is unique and exclusive based on a hundred traits. The objective is to build the strongest Elastos NFT community and project.'
  // }
];
const coinTypes = [
  {
    icon: 'elastos.svg',
    name: 'ELA',
    address: blankAddress
  },
  {
    icon: 'badges/diamond.svg',
    name: 'DIA',
    address: DIA_CONTRACT_ADDRESS
  },
  {
    icon: 'logo-icon.svg',
    name: 'PASAR',
    address: PASAR_TOKEN_ADDRESS
  },
  {
    icon: 'erc20/WELA.png',
    name: 'WELA',
    address: WELA_CONTRACT_ADDRESS
  },
  {
    icon: 'erc20/Glide.svg',
    name: 'GLIDE',
    address: GLIDE_CONTRACT_ADDRESS
  },
  {
    icon: 'erc20/Elk.svg',
    name: 'ELK',
    address: ELK_CONTRACT_ADDRESS
  },
  {
    icon: 'erc20/EUSDC.svg',
    name: 'ethUSDC',
    address: EUSDC_CONTRACT_ADDRESS
  },
  {
    icon: 'erc20/Bunny.svg',
    name: 'BUNNY',
    address: BUNNY_CONTRACT_ADDRESS
  },
  {
    icon: 'erc20/BUSD.svg',
    name: 'bnbBUSD',
    address: BUSD_CONTRACT_ADDRESS
  }
];
const coinTypesForEthereum = [
  {
    icon: 'erc20/ETH.svg',
    name: 'ETH',
    address: blankAddress
  },
  {
    icon: 'erc20/ELAonETH.svg',
    name: 'ELA on ETH',
    address: ELA_ON_ETH_CONTRACT_ADDRESS
  }
];
export const coinTypesGroup = {
  ESC: coinTypes,
  ETH: coinTypesForEthereum,
  FSN: [
    {
      icon: 'erc20/FSN.svg',
      name: 'FSN',
      address: blankAddress
    }
  ]
};
export const socialTypes = ['Website', 'Profile', 'Feeds', 'Twitter', 'Discord', 'Telegram', 'Medium'];
export const chainTypes = [
  {
    icon: 'badges/ELA-network.svg',
    name: 'Elastos Smart Chain',
    symbol: 'ESC',
    token: 'ELA',
    color: (theme) => theme.palette.origin.main
  },
  {
    icon: 'badges/ETH-network.svg',
    name: 'Ethereum',
    symbol: 'ETH',
    token: 'ETH',
    color: '#6A70FA'
  },
  {
    icon: 'badges/FSN-network.svg',
    name: 'Fusion',
    symbol: 'FSN',
    token: 'FSN',
    color: '#1e9ada'
  }
];
// new
export const getChainIndexFromChain = (chain) => {
  if (chain === 'v1') return 1;
  if (chain === 'ela') return 1;
  if (chain === 'eth') return 2;
  if (chain === 'fsn') return 3;
  return 0;
};
export const checkValidChain = (chainId) => {
  if (
    chainId &&
    ((process.env.REACT_APP_ENV === 'production' && chainId !== 20 && chainId !== 1 && chainId !== 32659) ||
      (process.env.REACT_APP_ENV !== 'production' && chainId !== 21 && chainId !== 5 && chainId !== 46688))
  )
    return false;
  return true;
};
export const getChainTypeFromId = (chainId) => {
  if (chainId === 20 || chainId === 21) return 'ESC';
  if (chainId === 1 || chainId === 5) return 'ETH';
  if (chainId === 32659 || chainId === 46688) return 'FSN';
  return '';
};
export const getStartPosOfCoinTypeByChainType = (chainType) => {
  const coinClassIndex = Math.max(Object.keys(coinTypesGroup).indexOf(chainType), 0);
  return Object.values(coinTypesGroup)
    .splice(0, coinClassIndex)
    .reduce((sum, item) => sum + item.length, 0);
};

export const getExplorerSrvByNetwork = (chainIndex) => {
  const chainType = chainTypes[chainIndex - 1];
  if (chainType) return ExplorerServer[chainType.symbol];
  return ExplorerServer.ESC;
};
export const getContractAddressInCurrentNetwork = (chainId, type) => {
  const currentChain = getChainTypeFromId(chainId);
  let contractObj = MAIN_CONTRACT.ESC;
  if (currentChain) contractObj = MAIN_CONTRACT[currentChain];
  return contractObj[type];
};
export const getCoinTypesGroup4Filter = () => {
  const coinTypesArr = [[]];
  Object.entries(coinTypesGroup).forEach((coinTypes, _i) => {
    const tempCoinTypes = coinTypes[1].map((coinType) => ({ ...coinType, address: `${_i + 1}-${coinType.address}` }));
    coinTypesArr.push(tempCoinTypes);
    coinTypesArr[0] = [...coinTypesArr[0], ...tempCoinTypes];
  });
  return coinTypesArr;
};
export const getTotalCountOfCoinTypes = () =>
  Object.entries(coinTypesGroup).reduce((total, item) => total + item[1].length, 0);

export const getCoinTypesInCurrentNetwork = (chainId) => {
  const currentChain = getChainTypeFromId(chainId);
  let tempCoinTypes = coinTypesGroup.ESC;
  if (currentChain) tempCoinTypes = coinTypesGroup[currentChain];
  return tempCoinTypes;
};
export const getMarketAddressByMarketplaceType = (type) => {
  const marketAddresses = Object.values(MAIN_CONTRACT).map((item) => item.market);
  if (type > 0 && type <= marketAddresses.length) return marketAddresses[type - 1];
  return marketAddresses[0];
};

// new
export const getCoinTypeFromToken = (item) => {
  let coinTypeIndex = 0;
  if (item) {
    const { quoteToken = blankAddress, chain = 'ela' } = item;
    let tempCoinTypes = [];
    let tempChainType = '';
    const chainIndex = getChainIndexFromChain(chain);
    if (chainIndex > 0 && chainIndex <= Object.keys(coinTypesGroup).length) {
      tempCoinTypes = Object.values(coinTypesGroup)[chainIndex - 1];
      tempChainType = Object.keys(coinTypesGroup)[chainIndex - 1];
    } else {
      tempCoinTypes = coinTypesGroup.ESC;
      tempChainType = 'ESC';
    }
    const startPos = getStartPosOfCoinTypeByChainType(tempChainType);
    coinTypeIndex = Math.max(
      tempCoinTypes.findIndex((el) => el.address === quoteToken),
      0
    );
    return { index: coinTypeIndex + startPos, ...tempCoinTypes[coinTypeIndex] };
  }
  return { index: coinTypeIndex, ...coinTypesGroup.ESC[coinTypeIndex] };
};

export const sendIpfsDidJson = async () => {
  const client = create(`${PasarIpfs}/`);
  // create the metadata object we'll be storing
  const did = sessionStorage.getItem('PASAR_DID') || '';
  const token = sessionStorage.getItem('PASAR_TOKEN');
  const user = jwtDecode(token);
  const { name, bio } = user;
  const proof = sessionStorage.getItem('KYCedProof') || '';
  const didObj = {
    version: '2',
    did: `did:elastos:${did}`,
    name: name || '',
    description: bio || ''
  };
  if (proof.length) {
    didObj.KYCedProof = proof;
  }
  const jsonDidObj = JSON.stringify(didObj);
  console.log(jsonDidObj);
  // add the metadata itself as well
  const didUri = await client.add(jsonDidObj);
  return `pasar:json:${didUri.path}`;
};

export const emptyCache = () => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      // Delete all the cache files
      names.forEach((name) => {
        caches.delete(name);
      });
    });

    // Makes sure the page reloads. Changes are only visible after you refresh.
    window.location.reload();
  }
};

export const getInfoFromDID = (did) =>
  new Promise((resolve, reject) => {
    if (!DIDBackend.isInitialized()) DIDBackend.initialize(new DefaultDIDAdapter('https://api.elastos.io/eid'));
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

export const getDidInfoFromAddress = (address) =>
  new Promise((resolve, reject) => {
    fetchAPIFrom(`api/v1/getDidByAddress?address=${address}`, {})
      .then((res) => {
        res
          .json()
          .then((json) => {
            if (json.data && json.data.did)
              getInfoFromDID(json.data.did).then((info) => {
                resolve({ ...info, did: json.data.did });
              });
            else resolve({});
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDIDInfoFromAddress = async (address) => {
  try {
    const res = await fetchAPIFrom(`api/v1/getDidByAddress?address=${address}`, {});
    const json = await res.json();
    if (json?.data?.did) {
      try {
        const info = await getInfoFromDID(json.data.did);
        return { ...info, did: json.data.did, address: json.data?.address || address };
      } catch (e) {
        console.error(e);
        return { ...json.data };
      }
    } else return { ...json.data };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const getFilteredGasPrice = (_gasPrice) => (_gasPrice * 1 > 20 * 1e9 ? (20 * 1e9).toString() : _gasPrice);

export const getFullUrl = (url) => `${window.location.protocol}//${window.location.host}/${url}`;

export const checkIsMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isInAppBrowser = () => window.elastos !== undefined && window.elastos.name === 'essentialsiab';

export const clearCacheData = () => {
  caches.keys().then((names) => {
    names.forEach((name) => {
      caches.delete(name);
    });
  });
};
