import React from 'react';
import Web3 from 'web3';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { isString } from 'lodash';
import {isMobile} from 'react-device-detect';
import * as math from 'mathjs';
import CancelablePromise from 'cancelable-promise';
import { styled } from '@mui/material/styles';
import { Container, Stack, Grid, Typography, Link, FormControl, InputLabel, Input, Divider, FormControlLabel, TextField, Button, Tooltip, Box,
  Accordion, AccordionSummary, AccordionDetails, FormHelperText } from '@mui/material';
import { Icon } from '@iconify/react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { create, urlSource } from 'ipfs-http-client'
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { addDays } from 'date-fns';
import jwtDecode from 'jwt-decode';

// components
import { MHidden } from '../../components/@material-extend';
import Page from '../../components/Page';
import MintingTypeButton from '../../components/marketplace/MintingTypeButton';
import ItemTypeButton from '../../components/marketplace/ItemTypeButton';
import { UploadMultiFile, UploadSingleFile } from '../../components/upload';
import AssetCard from '../../components/marketplace/AssetCard';
import MultiMintGrid from '../../components/marketplace/MultiMintGrid';
import PaperRecord from '../../components/PaperRecord';
import CustomSwitch from '../../components/custom-switch';
import CoinSelect from '../../components/marketplace/CoinSelect';
import MintBatchName from '../../components/marketplace/MintBatchName';
import MintDlg from '../../components/dialog/Mint';
import AccessDlg from '../../components/dialog/Access';
import DisclaimerDlg from '../../components/dialog/Disclaimer';
import ChooseCollectionDlg from '../../components/dialog/ChooseCollection';
import NeedBuyDIADlg from '../../components/dialog/NeedBuyDIA';
import NeedMoreDIADlg from '../../components/dialog/NeedMoreDIA';
import { essentialsConnector } from '../../components/signin-dlg/EssentialConnectivity';
import ProgressBar from '../../components/ProgressBar'
import StartingDateSelect from '../../components/marketplace/StartingDateSelect'
import ExpirationDateSelect from '../../components/marketplace/ExpirationDateSelect'
import { InputStyle, InputLabelStyle, TextFieldStyle } from '../../components/CustomInput';
import CoinTypeLabel from '../../components/CoinTypeLabel';
import DIABadge from '../../components/DIABadge';

import {STICKER_CONTRACT_ABI} from '../../abi/stickerABI'
import {TOKEN_721_ABI} from '../../abi/token721ABI'
import {TOKEN_1155_ABI} from '../../abi/token1155ABI'
import {stickerContract as CONTRACT_ADDRESS, marketContract as MARKET_CONTRACT_ADDRESS, ipfsURL, auctionOrderType} from '../../config'
import {hash, removeLeadingZero, callContractMethod, isInAppBrowser, coinTypes, getCoinUSD, getDiaTokenPrice, getDiaBalanceDegree } from '../../utils/common';
import {requestSigndataOnTokenID} from '../../utils/elastosConnectivityService';
import convert from '../../utils/image-file-resize';
import useOffSetTop from '../../hooks/useOffSetTop';
import useMintDlg from '../../hooks/useMintDlg';
import useSingin from '../../hooks/useSignin';
import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

const client = create(`${ipfsURL}/`)
const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(13)
  },
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(3)
  }
}));
const LoadingButtonStyled = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.default,
  '&:hover': theme.palette.mode==='dark'?{
    backgroundColor: theme.palette.action.active
  }:{}
}));
const ercAbiArr = [TOKEN_721_ABI, TOKEN_1155_ABI]
// ----------------------------------------------------------------------

export default function CreateItem() {
  const location = useLocation();
  const { token: baseToken } = location.state || {}
  const [mintype, setMintType] = React.useState("Single");
  const [itemtype, setItemType] = React.useState("General");
  const [saletype, setSaleType] = React.useState("FixedPrice");
  const [collection, setCollection] = React.useState(baseToken?"Choose":"PSRC");
  const [selectedCollection, handleChooseCollection] = React.useState({token: "", name: "", symbol: "", avatar: ""});
  const [selectedERCtype, setSelectedERCtype] = React.useState(1);
  const [file, setFile] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [singleName, setSingleName] = React.useState("");
  const [multiNames, setMultiNames] = React.useState([]);
  const [previewFiles, setPreviewFiles] = React.useState([]);
  const [isPutOnSale, setPutOnSale] = React.useState(false);
  const [isBuynowForAuction, setBuynowForAuction] = React.useState(false);
  const [isReserveForAuction, setReserveForAuction] = React.useState(false);
  const [buyoutPrice, setBuyoutPrice] = React.useState('');
  const [reservePrice, setReservePrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [price, setPrice] = React.useState('');
  const [rcvprice, setRcvPrice] = React.useState(0);
  const [royalties, setRoyalties] = React.useState(10);
  const [uploadedCount, setUploadedCount] = React.useState(0);
  const [singleProperties, setSingleProperties] = React.useState([{type: '', name: ''}]);
  const [multiProperties, setMultiProperties] = React.useState([]);
  const [onProgress, setOnProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isOnValidation, setOnValidation] = React.useState(false);
  const [startingDate, setStartingDate] = React.useState(0);
  const [expirationDate, setExpirationDate] = React.useState(addDays(new Date(), 1));
  const [currentPromise, setCurrentPromise] = React.useState(null);
  const [coinType, setCoinType] = React.useState(0);
  const [coinUSD, setCoinUSD] = React.useState(0);
  const [chooseCollectionOpen, setChooseCollectionOpen] = React.useState(false);
  const [disclaimerOpen, setOpenDisclaimer] = React.useState(false);
  const [buyDIAOpen, setOpenBuyDIA] = React.useState(false);
  const [moreDIAOpen, setOpenMoreDIA] = React.useState(false);
  const { isOpenMint, setOpenMintDlg, setOpenAccessDlg, setReadySignForMint, setApprovalFunction, setCurrent, setTotalSteps } = useMintDlg()
  const { diaBalance } = useSingin()
  const { enqueueSnackbar } = useSnackbar();
  
  const isOffset = useOffSetTop(40);
  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 88;
  // const royaltiesRef = React.useRef();
  const explicitRef = React.useRef();
  const uploadRef = React.useRef();
  const nameRef = React.useRef();
  const descriptionRef = React.useRef();
  const priceRef = React.useRef();
  const reservePriceRef = React.useRef();
  const buyoutPriceRef = React.useRef();
  const navigate = useNavigate();
  
  React.useEffect(async () => {
    if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2')
      navigate('/marketplace')
    if(localStorage.getItem('pa-yes') === '1')
      return
    setOpenDisclaimer(true)
  }, []);

  React.useEffect(async () => {
    if(selectedCollection.token)
      setCollection("Choose")
  }, [selectedCollection.token]);

  React.useEffect(async () => {
    if(mintype!=="Multiple")
      setQuantity(1)
  }, [mintype]);

  React.useEffect(() => {
    if(progress===100)
      setTimeout(()=>{setProgress(0)}, 110)
  }, [progress]);
  
  React.useEffect(() => {
    if(!isOpenMint){
      if(currentPromise)
        currentPromise.cancel()
    }
  }, [isOpenMint]);

  React.useEffect(() => {
    switch(coinType){
      case 0:
        getCoinUSD().then((res) => {
          setCoinUSD(res);
        });
        break;
      case 1:
        getDiaTokenPrice()
          .then((res) => {
            setCoinUSD(res.token.derivedELA * res.bundle.elaPrice);
          })
          .catch((error) => {
            setCoinUSD(0);
          });
        break;
      default:
        break;
    }
  }, [coinType]);

  const cancelAction = () => {
    setProgress(100)
    setCurrent(1)
    setOnProgress(false)
  }

  React.useEffect(async () => {
    const tempArr = [...files]
    setPreviewFiles(tempArr.map((file, i)=>{
      const { name, size, preview } = file;
      return isString(file) ? file : preview
    }))
    setUploadedCount(files.length)
    if(files.length)
      setMultiProperties([...Array(files.length)].map(el=>([{type: '', name: ''}])))
  }, [files]);

  const handleDropSingleFile = React.useCallback((acceptedFiles) => {
    const accepted = acceptedFiles[0];
    if (accepted) {
      setFile(
        Object.assign(accepted, {
          preview: URL.createObjectURL(accepted)
        })
      )
    }
  }, []);

  const handleDropMultiFile = React.useCallback((acceptedFiles) => {
      acceptedFiles.splice(20)
      if(acceptedFiles.length<2){
        enqueueSnackbar('Allow at least 2 items!', { variant: 'warning' });
        return
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const handleSingleRemove = (file) => {
    setFile(null);
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    if(filteredItems.length<2){
      enqueueSnackbar('Allow at least 2 items!', { variant: 'warning' });
      return
    }
    setFiles(filteredItems);
  };

  const handlePutOnSale = (event) => {
    setPutOnSale(event.target.checked);
  };

  const handleBuynowForAuction = (event) => {
    if(!event.target.checked)
      setBuyoutPrice('')
    setBuynowForAuction(event.target.checked);
  };

  const handleReserveForAuction = (event) => {
    if(!event.target.checked)
      setReservePrice('')
    setReserveForAuction(event.target.checked);
  };

  const handleChangePrice = (event) => {
    let priceValue = event.target.value
    if(priceValue<0)
      return
    priceValue = removeLeadingZero(priceValue)
    setPrice(priceValue)
    setRcvPrice(math.round(priceValue*98/100, 3))
  };

  const handleChangeReservePrice = (event) => {
    let priceValue = event.target.value
    if(priceValue<0)
      return
    priceValue = removeLeadingZero(priceValue)
    setReservePrice(priceValue)
  };

  const handleChangeBuyoutPrice = (event) => {
    let priceValue = event.target.value
    if(priceValue<0)
      return
    priceValue = removeLeadingZero(priceValue)
    setBuyoutPrice(priceValue)
  };

  const handleChangeRoyalties = (event) => {
    if(event.target.value<0 || event.target.value>20)
      return
    setRoyalties(removeLeadingZero(event.target.value))
  };

  const handleProperties = (properties, key, index, e) => {
    const temp = [...properties]
    temp[index][key] = e.target.value
    if(!temp[index].type.length&&!temp[index].name.length){
      if(temp.length>1&&index<temp.length-1)
        temp.splice(index, 1)
      if(temp.findIndex((item)=>(!item.type.length||!item.name.length))<0)
        temp.push({type: '', name: ''})
    }
    else if(!temp[index].type.length||!temp[index].name.length){
      if(!temp[temp.length-1].type.length&&!temp[temp.length-1].name.length)
        temp.splice(temp.length-1, 1)
    }
    else if(temp[index].type.length&&temp[index].name.length){
      if(temp.findIndex((item)=>(!item.type.length||!item.name.length))<0)
        temp.push({type: '', name: ''})
    }
    return temp
  };
  const handleSingleProperties = (key, index, e) => {
    const tempSingleProperties = handleProperties(singleProperties, key, index, e)
    setSingleProperties(tempSingleProperties)
  }
  const handleMultiProperties = (key, multindex, index, e) => {
    const tempMultiProperties = [...multiProperties]
    tempMultiProperties[multindex] = handleProperties(multiProperties[multindex], key, index, e)
    setMultiProperties(tempMultiProperties)
  }
  const progressStep = (pos, index)=>{
    if(mintype!=="Batch")
      return pos
    return pos/files.length + 60*index/files.length
  }

  // const getCurrentWeb3Provider = async() => (
  //   new Promise((resolve, reject)=>{
  //     if(isInAppBrowser())
  //       .then((provider) => {
  //         if(provider)
  //           resolve(provider)
  //         else reject(new Error)
  //       }).catch(e=>{
  //         reject(e)
  //       })
  //     else
  //       resolve(new Web3(essentialsConnector.getWalletConnectProvider()))
  //   })
  // );

  const mint2net = (paramObj)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      const _tokenSupply = quantity
      const _royaltyFee = royalties*10000

      onCancel(() => {
        console.log("cancel mint2net")
        cancelAction()
      });
    
      if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2'){
        reject(new Error)
        return
      }
      const walletConnectWeb3 = new Web3(isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
      // getCurrentWeb3Provider().then((walletConnectWeb3) => {
        walletConnectWeb3.eth.getAccounts().then((accounts)=>{
          // console.log(accounts)
          let baseAddress = CONTRACT_ADDRESS
          let stickerContract = new walletConnectWeb3.eth.Contract(STICKER_CONTRACT_ABI, CONTRACT_ADDRESS)
          if(collection === 'Choose') {
            stickerContract = new walletConnectWeb3.eth.Contract(ercAbiArr[selectedERCtype], selectedCollection.token)
            baseAddress = selectedCollection.token
          }

          setProgress(50)
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
            setProgress(60)
            setReadySignForMint(true)

            let mintMethod
            if(collection === 'Choose') {
              if(selectedERCtype === 0) // ERC721
                mintMethod = stickerContract.methods.mint(paramObj._id, paramObj._uri)
              else // ERC1155
                mintMethod = stickerContract.methods.mint(paramObj._id, _tokenSupply, paramObj._uri)
            }
            else
              mintMethod = stickerContract.methods.mint(paramObj._id, _tokenSupply, paramObj._uri, _royaltyFee)
            const commonArgs = {
              '_baseAddress': baseAddress,
              '_amount': _tokenSupply,
              'beforeSendFunc': ()=>{setReadySignForMint(true)},
              'afterSendFunc': ()=>{setReadySignForMint(false)}
            }
            mintMethod.send(transactionParams)
              .on('receipt', (receipt) => {
                  setReadySignForMint(false)
                  console.log("receipt", receipt);
                  if(isPutOnSale){
                    setProgress(70)
                    setCurrent(2)
                    stickerContract.methods.isApprovedForAll(accounts[0], MARKET_CONTRACT_ADDRESS).call().then(isApproval=>{
                      console.log("isApprovalForAll=", isApproval);
                      if (!isApproval) {
                        // setOpenAccessDlg(true)
                        // setApprovalFunction(()=>{
                          stickerContract.methods.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true).send(transactionParams)
                            .on('receipt', (receipt) => {
                                setOpenAccessDlg(false)
                                setCurrent(3)
                                console.log("setApprovalForAll-receipt", receipt);
                                if(saletype === 'FixedPrice')
                                  callContractMethod('createOrderForSale', coinType, {
                                    ...paramObj,
                                    ...commonArgs,
                                    '_price': BigInt(price*1e18).toString()
                                  }).then((success) => {
                                    resolve(success)
                                  }).catch(error=>{
                                    reject(error)
                                  })
                                else
                                  callContractMethod('createOrderForAuction', coinType, {
                                    ...paramObj,
                                    ...commonArgs,
                                    '_minPrice': BigInt(price*1e18).toString(),
                                    '_reservePrice': BigInt(reservePrice*1e18).toString(),
                                    '_buyoutPrice': BigInt(buyoutPrice*1e18).toString(),
                                    '_endTime': (expirationDate.getTime()/1000).toFixed()
                                  }).then((success) => {
                                    resolve(success)
                                  }).catch(error=>{
                                    reject(error)
                                  })
                            })
                            .on('error', (error, receipt) => {
                                console.error("setApprovalForAll-error", error);
                                setOpenAccessDlg(false)
                                reject(error)
                            })
                        // })
                      }
                      else if(saletype === 'FixedPrice')
                          callContractMethod('createOrderForSale', coinType, {
                            ...paramObj,
                            ...commonArgs,
                            '_price': BigInt(price*1e18).toString()
                          }).then((success) => {
                            resolve(success)
                          }).catch(error=>{
                            reject(error)
                          })
                      else
                        callContractMethod('createOrderForAuction', coinType, {
                          ...paramObj,
                          ...commonArgs,
                          '_minPrice': BigInt(price*1e18).toString(),
                          '_reservePrice': BigInt(reservePrice*1e18).toString(),
                          '_buyoutPrice': BigInt(buyoutPrice*1e18).toString(),
                          '_endTime': (expirationDate.getTime()/1000).toFixed()
                        }).then((success) => {
                          resolve(success)
                        }).catch(error=>{
                          reject(error)
                        })
                    })
                  }
                  else
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
      // }) 
    })
  )
  const mint2netBatch = (paramObj)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log("cancel mint2net")
        cancelAction()
      });
    
      if(sessionStorage.getItem('PASAR_LINK_ADDRESS') !== '2'){
        reject(new Error)
        return
      }
      const walletConnectWeb3 = new Web3(isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
      // getCurrentWeb3Provider().then((walletConnectWeb3) => {
        walletConnectWeb3.eth.getAccounts().then((accounts)=>{
          // console.log(accounts)
          let baseAddress = CONTRACT_ADDRESS
          let stickerContract = new walletConnectWeb3.eth.Contract(STICKER_CONTRACT_ABI, CONTRACT_ADDRESS)
          if(collection === 'Choose') {
            stickerContract = new walletConnectWeb3.eth.Contract(ercAbiArr[selectedERCtype], selectedCollection.token)
            baseAddress = selectedCollection.token
          }

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
            setProgress(70)
            setReadySignForMint(true)

            const {_ids, _tokenSupplies, _uris, _royaltyFees} = paramObj
            let mintMethod
            if(collection === 'Choose') {
              if(selectedERCtype === 0) // ERC721
                mintMethod = stickerContract.methods.mintBatch(_ids, _uris)
              else // ERC1155
                mintMethod = stickerContract.methods.mintBatch(_ids, _tokenSupplies, _uris)
            }
            else
              mintMethod = stickerContract.methods.mintBatch(_ids, _tokenSupplies, _uris, _royaltyFees)
            const commonArgs = {
              '_baseAddress': baseAddress,
              '_amounts': _tokenSupplies,
              'beforeSendFunc': ()=>{setReadySignForMint(true)},
              'afterSendFunc': ()=>{setReadySignForMint(false)}
            }
            mintMethod.send(transactionParams)
              .on('receipt', (receipt) => {
                  setReadySignForMint(false)
                  console.log("receipt", receipt);
                  if(isPutOnSale){
                    setProgress(80)
                    setCurrent(2)
                    stickerContract.methods.isApprovedForAll(accounts[0], MARKET_CONTRACT_ADDRESS).call().then(isApproval=>{
                      console.log("isApprovalForAll=", isApproval);
                      if (!isApproval) {
                          stickerContract.methods.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true).send(transactionParams)
                            .on('receipt', (receipt) => {
                                setOpenAccessDlg(false)
                                setCurrent(3)
                                console.log("setApprovalForAll-receipt", receipt);
                                callContractMethod('createOrderForSaleBatch', coinType, {
                                  ...paramObj,
                                  ...commonArgs,
                                  '_price': BigInt(price*1e18).toString()
                                }).then((success) => {
                                  resolve(success)
                                }).catch(error=>{
                                  reject(error)
                                })
                            })
                            .on('error', (error, receipt) => {
                                console.error("setApprovalForAll-error", error);
                                setOpenAccessDlg(false)
                                reject(error)
                            })
                        // })
                      }
                      callContractMethod('createOrderForSaleBatch', coinType, {
                        ...paramObj,
                        ...commonArgs,
                        '_price': BigInt(price*1e18).toString()
                      }).then((success) => {
                        resolve(success)
                      }).catch(error=>{
                        reject(error)
                      })
                    })
                  }
                  else
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
      // }) 
    })
  )
  const sendIpfsImage = (f)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log("cancel ipfs")
        cancelAction()
      });
      
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(f);
      reader.onloadend = async() => {
        try {
          const fileContent = Buffer.from(reader.result)
          const thumbnail = await convert(f, 300, 300)
          const added = await client.add(fileContent)
          
          console.log(added)
          if(thumbnail.success === 0){
            const addedThumbnail = await client.add(thumbnail.fileContent)
            console.log(addedThumbnail)
            resolve({'origin': {...added}, 'thumbnail': {...addedThumbnail}, 'type':f.type})
          }
          resolve({'origin': {...added}, 'thumbnail': {...added}, 'type':f.type})
        } catch (error) {
          reject(error);
        }
      }
    })
  )
  const sendIpfsMetaJson = (added, index=0)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log("cancel meta")
        cancelAction()
      });
      
      let collectibleName = singleName;
      let propertiesObj = singleProperties.reduce((obj, item) => {
        if(item.type!=='' && item.name!=='')
          obj[item.type] = item.name
        return obj
      }, {})
      if(mintype==="Batch"){
        collectibleName = multiNames[index]
        propertiesObj = multiProperties[index].reduce((obj, item) => {
          if(item.type!=='' && item.name!=='')
            obj[item.type] = item.name
          return obj
        }, {})
      }

      // create the metadata object we'll be storing
      const did = sessionStorage.getItem('PASAR_DID') || ''
      const token = sessionStorage.getItem("PASAR_TOKEN");
      const user = jwtDecode(token);
      const {name, bio} = user;
      const proof = sessionStorage.getItem("KYCedProof") || ''
      const creatorObj = {
        "did": `did:elastos:${did}`,
        "name": name || '',
        "description": bio || '',
      }
      if(proof.length) {
        creatorObj.KYCedProof = proof
      }
      const tokenId = `0x${hash(added.origin.path)}`
      requestSigndataOnTokenID(tokenId).then(rsp=>{
        // create the metadata object we'll be storing
        const metaObj = {
          "version": "2",
          "type": itemtype==="General"?'image':itemtype.toLowerCase(),
          "name": collectibleName,
          "description": description,
          "creator": creatorObj,
          "data": {
            "image": `pasar:image:${added.origin.path}`,
            "kind": added.type.replace('image/', ''),
            "size": added.origin.size,
            "thumbnail": `pasar:image:${added.thumbnail.path}`,
            "signature": rsp.signature
          },
          "adult": explicitRef.current.checked,
          "properties": propertiesObj,
        }
        console.log(metaObj)
        try {
          const jsonMetaObj = JSON.stringify(metaObj);
          // add the metadata itself as well
          const metaRecv = Promise.resolve(client.add(jsonMetaObj))
          resolve(metaRecv)
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        reject(error);
      })
    })
  )
  const sendIpfsDidJson = ()=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      onCancel(() => {
        console.log("cancel did")
        cancelAction()
      });
      // create the metadata object we'll be storing
      const did = sessionStorage.getItem('PASAR_DID') || ''
      const token = sessionStorage.getItem("PASAR_TOKEN");
      const user = jwtDecode(token);
      const {name, bio} = user;
      const proof = sessionStorage.getItem("KYCedProof") || ''
      const didObj = {
        "version":"2",
        "did": `did:elastos:${did}`,
        "name": name || '',
        "description": bio || '',
      }
      if(proof.length) {
        didObj.KYCedProof = proof
      }
      try {
        const jsonDidObj = JSON.stringify(didObj);
        // console.log(jsonDidObj)
        // add the metadata itself as well
        const didRecv = Promise.resolve(client.add(jsonDidObj))
        resolve(didRecv)
      } catch (error) {
        reject(error);
      }
    })
  )
  const uploadData = ()=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      let _id = ''
      let _uri = ''
      let _didUri = ''
      if (!file)
        return;
      onCancel(() => {
        console.log("cancel upload")
        cancelAction()
      });

      setProgress(5)
      let temPromise = sendIpfsImage(file)
      setCurrentPromise(temPromise)
      temPromise.then((added) => {
        _id = `0x${hash(added.origin.path)}`
        setProgress(15)
        temPromise = sendIpfsMetaJson(added)
        setCurrentPromise(temPromise)
        return temPromise
      }).then((metaRecv) => {
        setProgress(30)
        _uri = `pasar:json:${metaRecv.path}`
        temPromise = sendIpfsDidJson()
        setCurrentPromise(temPromise)
        return temPromise
      }).then((didRecv) => {
        setProgress(45)
        _didUri = `pasar:json:${didRecv.path}`
        resolve({ _id, _uri, _didUri })
      }).catch((error) => {
        reject(error);
      })
    })
  )
  const uploadOneOfBatch = (f, index)=>(
    new CancelablePromise((resolve, reject, onCancel) => {
      let _id = ''
      let _uri = ''
      if (!f)
        return;
      onCancel(() => {
        console.log("cancel upload batch")
        cancelAction()
      });
      
      setProgress(progressStep(10, index))
      sendIpfsImage(f).then((added) => {
        _id = `0x${hash(added.origin.path)}`
        setProgress(progressStep(35, index))
        return sendIpfsMetaJson(added, index)
      }).then((metaRecv) => {
        setProgress(progressStep(60, index))
        _uri = `pasar:json:${metaRecv.path}`
        resolve({ _id, _uri })
      }).catch((error) => {
        setProgress(progressStep(60, index))
        reject(error);
      })
    })
  )
  const mintSingle = () => {
    if(!file)
      return
    setOnProgress(true)
    setOpenMintDlg(true)
    let temPromise = uploadData()
    setCurrentPromise(temPromise)
    temPromise.then((paramObj) => {
      temPromise = mint2net(paramObj)
      setCurrentPromise(temPromise)
      return temPromise
    }).then((success) => {
      setProgress(100)
      if(success){
        enqueueSnackbar('Mint token success!', { variant: 'success' });
        setTimeout(()=>{
          navigate('/marketplace')
        }, 3000)
      }
      else
        enqueueSnackbar('Mint token error!', { variant: 'warning' });
      setOnProgress(false)
      setOpenMintDlg(false)
      setCurrentPromise(null)
      setCurrent(1)
    }).catch((error) => {
      setProgress(100)
      enqueueSnackbar('Mint token error!', { variant: 'error' });
      setOnProgress(false)
      setOpenMintDlg(false)
      setCurrentPromise(null)
      setCurrent(1)
    });
  }

  const mintBatch = () => {
    if(!files.length)
      return
    setOnProgress(true)
    setOpenMintDlg(true)
    setProgress(3)
    sendIpfsDidJson().then((didRecv) => {
      setProgress(6)
      const _didUri = `pasar:json:${didRecv.path}`
      mintBatchMain(_didUri)
    }).catch((error) => {
      setProgress(100)
      enqueueSnackbar('Mint token error!', { variant: 'error' });
      setOnProgress(false)
      setOpenMintDlg(false)
    })
  }

  const mintBatchMain = (_didUri) => {
    const _royaltyFee = royalties*10000
    const mintedObjs = { _ids: [], _tokenSupplies: [], _uris: [], _royaltyFees: [], _didUri }
    files.reduce((p, f, i) => 
      p.then(() => {
        const temPromise = uploadOneOfBatch(f, i)
        setCurrentPromise(temPromise)
        return temPromise
      }).then((paramObj) => {
        mintedObjs._ids.push(paramObj._id)
        mintedObjs._tokenSupplies.push(quantity)
        mintedObjs._uris.push(paramObj._uri)
        mintedObjs._royaltyFees.push(_royaltyFee)
        
        if((i+1)===files.length)
          mint2netBatch(mintedObjs)
            .then((success) => {
              setProgress(100)
              if(success){
                enqueueSnackbar('Mint batch success!', { variant: 'success' });
                setTimeout(()=>{
                  navigate('/marketplace')
                }, 3000)
              }
              else
                enqueueSnackbar('Mint batch error!', { variant: 'warning' });
              setOnProgress(false)
              setOpenMintDlg(false)
              setCurrentPromise(null)
              setCurrent(1)
            })
            .catch((error) => {
              setProgress(100)
              enqueueSnackbar('Mint batch error!', { variant: 'error' });
              setOnProgress(false)
              setOpenMintDlg(false)
              setCurrentPromise(null)
              setCurrent(1)
            });
      }).catch((error) => {
        enqueueSnackbar(`Mint token_${(i+1)} error!`, { variant: 'error' });
        if((i+1)===files.length){
          setOnProgress(false)
          setOpenMintDlg(false)
        }
        setCurrent(1)
      })
    , Promise.resolve() );
  }
  
  const scrollToRef = (ref)=>{
    if(!ref.current)
      return
    let fixedHeight = isOffset?APP_BAR_DESKTOP-16:APP_BAR_DESKTOP
    fixedHeight = isMobile?APP_BAR_MOBILE:fixedHeight
    window.scrollTo({top: ref.current.offsetTop-fixedHeight, behavior: 'smooth'})
  }
  
  let duproperties = {};
  singleProperties.forEach((item,index) => {
    if(!item.type.length) return
    duproperties[item.type] = duproperties[item.type] || [];
    duproperties[item.type].push(index);
  });
  duproperties = Object.keys(duproperties)
    .filter(key => duproperties[key].length>1)
    .reduce((obj, key) => {
      obj.push(key)
      return obj
    }, []);

  const handleMintAction = (e) => {
    if(isPutOnSale) {
      const walletConnectWeb3 = new Web3(isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider());
      walletConnectWeb3.eth.getAccounts().then((accounts)=>{
        // console.log(accounts)
        let stickerContract = new walletConnectWeb3.eth.Contract(STICKER_CONTRACT_ABI, CONTRACT_ADDRESS)
        if(collection === 'Choose') {
          stickerContract = new walletConnectWeb3.eth.Contract(ercAbiArr[selectedERCtype], selectedCollection.token)
        }
        stickerContract.methods.isApprovedForAll(accounts[0], MARKET_CONTRACT_ADDRESS).call().then(isApproval=>{
          if(!isApproval)
            setTotalSteps(3)
          else
            setTotalSteps(2)
        })
      })
    } else {
      setTotalSteps(1)
    }
    setOnValidation(true)
    const degree = getDiaBalanceDegree(diaBalance)
    
    if(mintype!=="Batch"&&!file || mintype==="Batch"&&!files.length)
      scrollToRef(uploadRef)
    else if(mintype!=="Batch"&&!singleName.length)
      scrollToRef(nameRef)
    else if(!description.length)
      scrollToRef(descriptionRef)
    else if(isPutOnSale && !price)
      scrollToRef(priceRef)
    else if(isPutOnSale && isReserveForAuction && !reservePrice)
      scrollToRef(reservePriceRef)
    else if(isPutOnSale && isBuynowForAuction && !buyoutPrice)
      scrollToRef(buyoutPriceRef)  
    else if(isPutOnSale && reservePrice.length && price*1>reservePrice*1)
      enqueueSnackbar('Starting price must be less than Reserve price.', { variant: 'warning' });
    else if(isPutOnSale && buyoutPrice.length && price*1>=buyoutPrice*1)
      enqueueSnackbar('Starting price must be less than Buy Now price.', { variant: 'warning' });
    else if(isPutOnSale && reservePrice.length && buyoutPrice.length && reservePrice*1>=buyoutPrice*1)
      enqueueSnackbar('Reserve price must be less than Buy Now price.', { variant: 'warning' });
    else if(isPutOnSale && isReserveForAuction && degree===0)
      enqueueSnackbar('Reserve Price is not supported due to lack of DIA balance.', { variant: 'warning' });
    else if(isPutOnSale && isBuynowForAuction && degree===0)
      enqueueSnackbar('Buy Now Price is not supported due to lack of DIA balance.', { variant: 'warning' });
    else
      if(mintype!=="Batch"){
        if(duproperties.length || singleProperties.filter(el=>el.type.length>0&&!el.name.length).length)
          enqueueSnackbar('Properties are invalid.', { variant: 'warning' });
        else if(collection==='Choose' && degree===0)
          setOpenBuyDIA(true)
        else
          mintSingle()
      }
      else if(degree===0 || degree===1&&files.length>5 || degree===2&&files.length>10) {
        setOpenMoreDIA(true)
      }
      else
        mintBatch()
  }
  const DiaDegree = getDiaBalanceDegree(diaBalance)
  return (
    <RootStyle title="CreateItem | PASAR">
      <ProgressBar isFinished={(progress===0||progress===100||!onProgress)} progress={progress} />
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" align="center" sx={{mb: 3}}>
          <span role="img" aria-label="">🔨</span> Create Item 
        </Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Collection</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row">
              <MintingTypeButton type="PSRC" description="Pasar Collection" onClick={()=>{setCollection("PSRC")}} current={collection}/>
              <MintingTypeButton type="Choose" description="existing collection" onClick={()=>{setChooseCollectionOpen(true)}} current={collection} selectedCollection={selectedCollection}/>
              {/* <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
                <div>
                  <MintingTypeButton type="ERC-1155" description="Create own collection" onClick={()=>{setCollection("ERC-1155")}} current={collection} disabled={1&&true}/>
                </div>
              </Tooltip> */}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Minting Type</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row">
              <MintingTypeButton type="Single" description="Single item" onClick={()=>{setMintType("Single")}} current={mintype}/>
              {
                !(collection==="Choose" && selectedERCtype===0) && 
                <Tooltip title="Coming Soon" arrow enterTouchDelay={0}>
                  <div>
                    <MintingTypeButton type="Multiple" description="Multiple identical items" onClick={()=>{setMintType("Multiple")}} current={mintype} disabled={Boolean(true)}/>
                  </div>
                </Tooltip>
              }
              <MintingTypeButton type="Batch" description="Multiple non-identical items" onClick={()=>{setMintType("Batch")}} current={mintype}/>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{fontWeight: 'normal'}}>Item Type</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row">
              <ItemTypeButton type="General" onClick={()=>{setItemType("General")}} current={itemtype}/>
              <ItemTypeButton type="Avatar" onClick={()=>{setItemType("Avatar")}} current={itemtype}/>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12} ref={uploadRef}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Upload file</Typography>
              </Grid>
              <Grid item xs={12}>
                {
                  mintype!=="Batch"?
                  <>
                    <UploadSingleFile
                      file={file}
                      error={isOnValidation&&!file}
                      onDrop={handleDropSingleFile}
                      isAvatar={itemtype==="Avatar"}
                      onRemove={handleSingleRemove}
                      accept=".jpg, .png, .jpeg, .gif"/>
                    <FormHelperText error={isOnValidation&&!file} hidden={!isOnValidation||(isOnValidation&&file!==null)}>Image file is required</FormHelperText>
                  </>:
                  <>
                    <UploadMultiFile
                      showPreview={1&&true}
                      error={isOnValidation&&!files.length}
                      files={files}
                      onDrop={handleDropMultiFile}
                      isAvatar={itemtype==="Avatar"}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      accept=".jpg, .png, .jpeg, .gif"
                      sx={{pb:1}}/>
                    <FormHelperText error={isOnValidation&&!files.length} hidden={!isOnValidation||(isOnValidation&&files.length>0)}>Image files are required</FormHelperText>
                    {files.length>0&&<Divider/>}
                  </>
                }
              </Grid>
              <Grid item xs={12} ref={nameRef}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Name</Typography>
              </Grid>
              <Grid item xs={12}>
                {
                  mintype==="Batch"?(
                    <>
                      <MintBatchName uploadedCount={uploadedCount} handleNameGroup={setMultiNames}/>
                    </>
                  ):(
                    <FormControl error={isOnValidation&&!singleName.length} variant="standard" sx={{width: '100%'}}>
                      <InputLabelStyle htmlFor="input-with-name">
                        Add item name
                      </InputLabelStyle>
                      <InputStyle
                        id="input-with-name"
                        startAdornment={' '}
                        value={singleName}
                        onChange={(e)=>{setSingleName(e.target.value)}}
                        aria-describedby="name-error-text"
                      />
                      <FormHelperText id="name-error-text" hidden={!isOnValidation||(isOnValidation&&singleName.length>0)}>Item name is required</FormHelperText>
                    </FormControl>
                  )
                }
                <Divider/>
              </Grid>
              <Grid item xs={12} ref={descriptionRef}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Description</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl error={isOnValidation&&!description.length} variant="standard" sx={{width: '100%'}}>
                  <InputLabelStyle htmlFor="input-with-description" sx={{ whiteSpace: 'break-spaces', width: 'calc(100% / 0.75)', position: 'relative', transformOrigin: 'left' }}>
                    {
                      mintype!=="Batch"?
                      "Add item description":
                      "Fixed Description"
                    }
                  </InputLabelStyle>
                  <InputStyle
                    id="input-with-description"
                    startAdornment={' '}
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    aria-describedby="description-error-text"
                    sx={{mt: '-5px !important'}}
                    multiline={Boolean(true)}
                  />
                  <FormHelperText id="description-error-text" hidden={!isOnValidation||(isOnValidation&&description.length>0)}>Description is required</FormHelperText>
                </FormControl>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Explicit & Sensitive Content&nbsp;
                  <Tooltip title="Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing Pasar" arrow disableInteractive enterTouchDelay={0}>
                    <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <InputLabelStyle sx={{ fontSize: 12, flex: 1 }}>
                    Set this item as explicit and sensitive content
                  </InputLabelStyle>
                  <FormControlLabel
                    control={<CustomSwitch inputRef={explicitRef}/>}
                    sx={{mt:-1, mr: 0}}
                    label=""
                  />
                </Stack>
                <Divider/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Put on Sale</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row">
                  <InputLabelStyle sx={{ fontSize: 12, flex: 1 }}>
                    List on market directly after minting
                  </InputLabelStyle>
                  <FormControlLabel
                    control={<CustomSwitch onChange={handlePutOnSale}/>}
                    sx={{mt:-1, mr: 0}}
                    label=""
                  />
                </Stack>
                {
                  isPutOnSale&&
                  <Stack spacing={1} direction="row">
                    <ItemTypeButton type="FixedPrice" onClick={()=>{setSaleType("FixedPrice")}} current={saletype}/>
                    {
                      mintype!=="Batch"&&
                      <ItemTypeButton type="Auction" onClick={()=>{setSaleType("Auction")}} current={saletype}/>
                    }
                  </Stack>
                }
              </Grid>
              {
                isPutOnSale&&
                (
                  saletype==="FixedPrice"?
                  <>
                    <Grid item xs={12} ref={priceRef}>
                      <Typography variant="h4" sx={{fontWeight: 'normal'}}>Price</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl error={isOnValidation&&isPutOnSale&&!price} variant="standard" sx={{width: '100%'}}>
                        <InputLabelStyle htmlFor="input-with-price">
                          Enter a fixed price of each item
                        </InputLabelStyle>
                        <InputStyle
                          type="number"
                          id="input-with-price"
                          value={price}
                          onChange={handleChangePrice}
                          startAdornment={' '}
                          endAdornment={
                            <CoinSelect selected={coinType} onChange={setCoinType}/>
                          }
                          aria-describedby="price-error-text"
                        />
                        <FormHelperText id="price-error-text" hidden={!isOnValidation||(isOnValidation&&isPutOnSale&&price)}>Price is required</FormHelperText>
                      </FormControl>
                      <Divider/>
                      <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>Platform fee 2%&nbsp;
                        <Tooltip title="We take 2% of every transaction that happens on Pasar for providing the platform to users" arrow disableInteractive enterTouchDelay={0}>
                          <Icon icon="eva:info-outline" style={{marginBottom: -4, fontSize: 18}}/>
                        </Tooltip>
                      </Typography>
                      <Typography variant="body2" component="div" sx={{fontWeight: 'normal'}}>
                        You will receive
                        <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main', display: 'inline'}}>
                          {' '}{rcvprice} {coinTypes[coinType].name}{' '}
                        </Typography>
                        per item
                      </Typography>
                    </Grid>
                  </>:

                  <>
                    <Grid item xs={12} ref={priceRef}>
                      <Typography variant="h4" sx={{fontWeight: 'normal'}}>Starting Price</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl error={isOnValidation&&isPutOnSale&&!price} variant="standard" sx={{width: '100%'}}>
                        <InputLabelStyle htmlFor="input-with-price">
                          Enter starting price
                        </InputLabelStyle>
                        <InputStyle
                          type="number"
                          id="input-with-price"
                          value={price}
                          onChange={handleChangePrice}
                          startAdornment={' '}
                          endAdornment={
                            <CoinSelect selected={coinType} onChange={setCoinType}/>
                          }
                          aria-describedby="price-error-text"
                        />
                        <FormHelperText id="price-error-text" hidden={!isOnValidation||(isOnValidation&&isPutOnSale&&price)}>Price is required</FormHelperText>
                      </FormControl>
                      <Divider/>
                      <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>Bids below this amount won't be allowed</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="h4" sx={{fontWeight: 'normal', display: 'inline-flex'}}>Starting Date</Typography>
                          <StartingDateSelect selected={startingDate} onChange={setStartingDate}/>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h4" sx={{fontWeight: 'normal', display: 'inline-flex'}}>Expiration Date</Typography>
                          <ExpirationDateSelect onChangeDate={setExpirationDate}/>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{fontWeight: 'normal'}}>
                        Include Reserve Price
                        {
                          DiaDegree===0 &&
                          <Stack direction="row" spacing={1} sx={{display: 'inline-flex', pl: 2}}>
                            <DIABadge degree={1} isRequire={Boolean(true)}/>
                            <DIABadge degree={2} isRequire={Boolean(true)}/>
                            <DIABadge degree={3} isRequire={Boolean(true)}/>
                          </Stack>
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row">
                        <InputLabelStyle sx={{ fontSize: 12, flex: 1 }}>
                          Set a minimum price before auction can complete
                        </InputLabelStyle>
                        <FormControlLabel
                          control={<CustomSwitch onChange={handleReserveForAuction} disabled={DiaDegree===0}/>}
                          sx={{mt:-1, mr: 0}}
                          label=""
                        />
                      </Stack>
                      {
                        DiaDegree===0 &&
                        <>
                          <Divider/>
                          <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>
                            Only available for Bronze, Silver and Gold DIA (Diamond) token holders. More info{' '}
                            <Link underline="always" component={RouterLink} to={PATH_PAGE.features} color='origin.main'>
                              here
                            </Link>
                          </Typography>
                        </>
                      }
                    </Grid>
                    {
                      isReserveForAuction&&
                      <>
                        <Grid item xs={12} ref={reservePriceRef}>
                          <Typography variant="h4" sx={{fontWeight: 'normal'}}>Reserve Price</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl error={isOnValidation&&isPutOnSale&&!reservePrice} variant="standard" sx={{width: '100%'}}>
                            <InputLabelStyle htmlFor="input-reserve-price">
                              Enter reserve price
                            </InputLabelStyle>
                            <InputStyle
                              type="number"
                              id="input-reserve-price"
                              value={reservePrice}
                              onChange={handleChangeReservePrice}
                              startAdornment={' '}
                              endAdornment={
                                <CoinTypeLabel type={coinType}/>
                              }
                              aria-describedby="reserve-price-error-text"
                            />
                            <FormHelperText id="reserve-price-error-text" hidden={!(isOnValidation&&isPutOnSale&&!reservePrice)}>Please input Reserve Price</FormHelperText>
                          </FormControl>
                          <Divider/>
                        </Grid>
                      </>
                    }
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{fontWeight: 'normal'}}>
                        Include Buy Now Price
                        {
                          DiaDegree===0 &&
                          <Stack direction="row" spacing={1} sx={{display: 'inline-flex', pl: 2}}>
                            <DIABadge degree={1} isRequire={Boolean(true)}/>
                            <DIABadge degree={2} isRequire={Boolean(true)}/>
                            <DIABadge degree={3} isRequire={Boolean(true)}/>
                          </Stack>
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row">
                        <InputLabelStyle sx={{ fontSize: 12, flex: 1 }}>
                          Set instant purchase price (auction ends immediately after a sale)
                        </InputLabelStyle>
                        <FormControlLabel
                          control={<CustomSwitch onChange={handleBuynowForAuction} disabled={DiaDegree===0}/>}
                          sx={{mt:-1, mr: 0}}
                          label=""
                        />
                      </Stack>
                      {
                        DiaDegree===0 &&
                        <>
                          <Divider/>
                          <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>
                            Only available for Bronze, Silver and Gold DIA (Diamond) token holders. More info{' '}
                            <Link underline="always" component={RouterLink} to={PATH_PAGE.features} color='origin.main'>
                              here
                            </Link>
                          </Typography>
                        </>
                      }
                    </Grid>
                    {
                      isBuynowForAuction&&
                      <>
                        <Grid item xs={12} ref={buyoutPriceRef}>
                          <Typography variant="h4" sx={{fontWeight: 'normal'}}>Buy Now Price</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl error={isOnValidation&&isPutOnSale&&!buyoutPrice} variant="standard" sx={{width: '100%'}}>
                            <InputLabelStyle htmlFor="input-buynow-price">
                              Enter buy now price
                            </InputLabelStyle>
                            <InputStyle
                              type="number"
                              id="input-buynow-price"
                              value={buyoutPrice}
                              onChange={handleChangeBuyoutPrice}
                              startAdornment={' '}
                              endAdornment={
                                <CoinTypeLabel type={coinType}/>
                              }
                              aria-describedby="buyout-price-error-text"
                            />
                            <FormHelperText id="buyout-price-error-text" hidden={!(isOnValidation&&isPutOnSale&&!buyoutPrice)}>Please input Buy Now Price</FormHelperText>
                          </FormControl>
                          <Divider/>
                        </Grid>
                      </>
                    }
                  </>
                )
              }
              {
                collection !== 'Choose' &&
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{fontWeight: 'normal'}}>Royalties&nbsp;
                      <Tooltip title="Royalties are the percentage cut of the total value of item sold and will be paid to the original creator" arrow disableInteractive enterTouchDelay={0}>
                        <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                      </Tooltip>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl variant="standard" sx={{width: '100%'}}>
                      <InputLabelStyle htmlFor="input-with-royalties">
                        Enter royalties (Suggested: 10%, Maximum: 20%)
                      </InputLabelStyle>
                      <InputStyle
                        type="number"
                        id="input-with-royalties"
                        value={royalties}
                        onChange={handleChangeRoyalties}
                        startAdornment={' '}
                        endAdornment='%'
                      />
                    </FormControl>
                    <Divider/>
                    <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main'}}>You will receive royalties for every secondary sales on Pasar</Typography>
                  </Grid>
                </>
              }
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Quantity</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{width: '100%'}}>
                  <InputStyle
                    disabled={mintype!=="Multiple"}
                    type="number"
                    value={quantity}
                    onChange={(e)=>setQuantity(e.target.value)}
                  />
                </FormControl>
                <Divider/>
              </Grid>
              {
                mintype!=="Batch"?
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="div" sx={{fontWeight: 'normal'}}>
                      Properties&nbsp;
                      <Tooltip title="Attributes or traits to describe the item" arrow disableInteractive enterTouchDelay={0}>
                        <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                      </Tooltip>&nbsp;
                      <Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Type</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Name</Typography>
                      </Grid>
                    </Grid>
                    {
                      singleProperties.map((property, index)=>(
                        <Grid container spacing={1} key={index} sx={index?{mt: 1}:{}}>
                          <Grid item xs={6}>
                            <TextFieldStyle
                              label="Example: Size"
                              size="small"
                              fullWidth
                              value={property.type}
                              onChange={(e)=>{handleSingleProperties('type', index, e)}}
                              error={isOnValidation&&duproperties.includes(property.type)}
                              helperText={isOnValidation&&duproperties.includes(property.type)?'Duplicated type':''}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextFieldStyle
                              label="Example: Big"
                              size="small"
                              fullWidth
                              value={property.name}
                              onChange={(e)=>{handleSingleProperties('name', index, e)}}
                              error={isOnValidation&&property.type.length>0&&!property.name.length}
                              helperText={isOnValidation&&property.type.length>0&&!property.name.length?'Can not be empty.':''}
                            />
                          </Grid>
                        </Grid>
                      ))
                    }
                  </Grid>
                </>:
                <Grid item xs={12}>
                  <Accordion sx={{bgcolor: 'unset'}}>
                    <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{pl: 0}}>
                      <Typography variant="h4" component="div" sx={{fontWeight: 'normal'}}>
                        Properties&nbsp;
                        <Tooltip title="Attributes or traits to describe the item" arrow disableInteractive enterTouchDelay={0}>
                          <Icon icon="eva:info-outline" style={{marginBottom: -4}}/>
                        </Tooltip>&nbsp;
                        <Typography variant="caption" sx={{color: 'origin.main'}}>Optional</Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                      multiProperties.map((properties, multiIndex)=>(
                        <div key={multiIndex}>
                          <Typography variant="h5" sx={{display: 'block', color: 'origin.main'}}>{multiNames[multiIndex]}</Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Type</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" sx={{display: 'block', pl: '15px', pb: '10px'}}>Name</Typography>
                            </Grid>
                          </Grid>
                          {
                            properties.map((property, index)=>(
                              <Grid container spacing={1} key={index} sx={{pb:1}}>
                                <Grid item xs={6}>
                                  <TextFieldStyle label="Example: Size" size="small" fullWidth value={property.type} onChange={(e)=>{handleMultiProperties('type', multiIndex, index, e)}}/>
                                </Grid>
                                <Grid item xs={6}>
                                  <TextFieldStyle label="Example: Big" size="small" fullWidth value={property.name} onChange={(e)=>{handleMultiProperties('name', multiIndex, index, e)}}/>
                                </Grid>
                              </Grid>
                            ))
                          }
                        </div>
                      ))
                    }
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              }
              <MHidden width="smDown">
                <Grid item xs={12}>
                  <LoadingButton loading={onProgress} variant="contained" onClick={handleMintAction} fullWidth>
                    Create
                  </LoadingButton>
                </Grid>
              </MHidden>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" spacing={2} sx={{position: 'sticky', top: isOffset?APP_BAR_DESKTOP-16:APP_BAR_DESKTOP}}>
              <Grid item xs={12}>
                <Typography variant="h4" sx={{fontWeight: 'normal'}}>Preview</Typography>
              </Grid>
              <Grid item xs={12} sx={{width: '100%'}}>
                {
                  mintype!=="Batch"&&(
                    !file?(
                      <PaperRecord sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 500
                        }}
                      >
                        <Typography variant="body2" align="center">
                          Upload file<br/>to preview<br/>item
                        </Typography>
                      </PaperRecord>
                    ):(
                      <AssetCard
                        thumbnail={isString(file) ? file : file.preview}
                        name={singleName}
                        type={0}
                        defaultCollectionType={0}
                        baseToken={collection==="Choose"?selectedCollection.token:CONTRACT_ADDRESS}
                        orderType={saletype==='Auction'?auctionOrderType:1}
                        {...{description, price, coinType, quantity, coinUSD, reservePrice, buyoutPrice}}
                      />
                    )
                  )
                }
                {
                  mintype==="Batch"&&(
                    !files.length?(
                      <PaperRecord sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 500
                        }}
                      >
                        <Typography variant="body2" align="center">
                          Upload file<br/>to preview<br/>item
                        </Typography>
                      </PaperRecord>
                    ):(
                      <MultiMintGrid
                        assets={previewFiles}
                        baseToken={collection==="Choose"?selectedCollection.token:CONTRACT_ADDRESS}
                        orderType={saletype==='Auction'?auctionOrderType:1}
                        {...{multiNames, description, quantity, price, coinType, coinUSD, reservePrice, buyoutPrice}}
                      />
                    )
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          <MHidden width="smUp">
            <Grid item xs={12}>
              <LoadingButton loading={onProgress} variant="contained" onClick={handleMintAction} fullWidth>
                Create
              </LoadingButton>
            </Grid>
          </MHidden>
        </Grid>
      </Container>
      <MintDlg/>
      <AccessDlg/>
      <DisclaimerDlg isOpen={disclaimerOpen} setOpen={setOpenDisclaimer}/>
      <ChooseCollectionDlg 
        isOpen={chooseCollectionOpen}
        setOpen={setChooseCollectionOpen}
        handleChoose = {handleChooseCollection}
        setERCtype = {setSelectedERCtype}
      />
      <NeedBuyDIADlg isOpen={buyDIAOpen} setOpen={setOpenBuyDIA} balance={diaBalance} actionText="mint NFT from dedicated collection"/>
      <NeedMoreDIADlg isOpen={moreDIAOpen} setOpen={setOpenMoreDIA} balance={diaBalance} actionText="mint and sell more tokens in batch"/>
    </RootStyle>
  );
}