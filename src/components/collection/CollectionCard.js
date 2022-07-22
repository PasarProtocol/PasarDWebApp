import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import * as math from 'mathjs';
import Imgix from "react-imgix";
import jwtDecode from 'jwt-decode';
import { motion } from "framer-motion";
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/akar-icons/edit';
import { alpha, styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Grid, Button, Link, IconButton, Menu, MenuItem, Typography, Stack, Tooltip, Popper, Fade } from '@mui/material';

import PaperRecord from '../PaperRecord';
import UpdateRoyaltiesDlg from '../dialog/UpdateRoyalties';
import Badge from '../Badge';
import DIABadge from '../DIABadge';
import useSingin from '../../hooks/useSignin';
import { getDidInfoFromAddress, reduceHexAddress, getIpfsUrl, getDiaTokenInfo, getCredentialInfo, fetchFrom, getInfoFromDID, getAssetImage, 
  checkWhetherGeneralCollection, chainTypes } from '../../utils/common';

// ----------------------------------------------------------------------
const avatarStyle = {
  border: '1px solid',
  width: 56,
  height: 56,
  borderRadius: '100%',
  backgroundColor: 'black',
  display: 'flex',
  position: 'absolute',
  left:0,
  right: 0,
  bottom: -29,
  margin: 'auto'
}
const paperStyle = {
  height: '100%',
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  transform: 'translateY(0px)',
  '.cover-image': {
    OTransition: 'all .5s',
    transition: 'all .5s'
  },
  '&:hover': {
    boxShadow: '0 4px 8px 0px rgb(0 0 0 / 30%)',
    transform: 'translateY(-4px)'
  },
  '&:hover .cover-image': {
    OTransform: 'scale(1.2)',
    transform: 'scale(1.2)'
  },
  '&:hover .network': {
    display: 'block'
  }
}
const forceHoverStyle = {
  boxShadow: '0 4px 8px 0px rgb(0 0 0 / 30%)',
  transform: 'translateY(-4px)',
  '& .cover-image': {
    OTransform: 'scale(1.2)',
    transform: 'scale(1.2)'
  },
}
const MarkBoxStyle = styled(Box)(({ theme }) => ({
  ...avatarStyle,
  borderColor: theme.palette.background.paper,
  padding: '10px'
}));
const AvatarBoxStyle = styled(Box)(({ theme }) => ({
  ...avatarStyle,
  borderColor: theme.palette.background.paper,
}));
const TypographyStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 'normal',
  whiteSpace: 'pre-wrap',
  // whiteSpace: '-moz-pre-wrap',
  // whiteSpace: '-pre-wrap',
  // whiteSpace: '-o-pre-wrap',
  wordWrap: 'break-word'
}));

const CollectionImgBox = (props) => {
  const { name, background: backgroundImg, avatar, totalCount, realData, collectibles, token, marketPlace } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openGroupBox, setOpenGroupBox] = React.useState(false);
  const imageStyle = {
    // borderRadius: 1,
    // boxShadow: (theme)=>theme.customShadows.z16,
    // maxHeight: '100%',
    display: 'inline-flex',
    height: '100%',
  }
  const handlePopoverOpen = (event) => {
    if (isMobile && event.type === 'mouseenter') return;
    setAnchorEl(event.currentTarget)
    setOpenGroupBox(true);
  };
  const handlePopoverClose = () => {
    setOpenGroupBox(false);
  };
  const avatarAction = {
    onClick: handlePopoverOpen,
    onMouseEnter: handlePopoverOpen,
    onMouseLeave: handlePopoverClose
  }
  return (
    <Stack sx={{position: 'relative', height: '120px', mb: '25px'}}>
      <Stack sx={{height: '100%', overflow: 'hidden'}}>
        {
          backgroundImg?
          <Box className='cover-image' sx={{...imageStyle, background: `url(${backgroundImg}) no-repeat center`, backgroundSize: 'cover'}} onError={(e) => e.target.src = '/static/broken-image.svg'}/>:
          // <Box className='cover-image' draggable = {false} component="img" src={backgroundImg} sx={imageStyle} onError={(e) => e.target.src = '/static/broken-image.svg'}/>:
          <Box
            className='cover-image'
            sx={{
              background: 'linear-gradient(90deg, #a951f4, #FF5082)',
              width: '100%',
              height: '100%'
            }}
          />
        }
      </Stack>
      {
        !!marketPlace && 
        <Tooltip title={chainTypes[marketPlace-1].name} arrow enterTouchDelay={0}>
          <Box className='network' sx={{borderRadius: '100%', overflow: 'hidden', position: 'absolute', left: 8, top: 8, display: 'none'}}>
            <Box 
              component="img" 
              src={`/static/${chainTypes[marketPlace-1].icon}`} 
              draggable = {false}
              sx={{ background: chainTypes[marketPlace-1].color, width: 30, height: 30, p: '7px' }}
            />
          </Box>
        </Tooltip>
      }
      {
        !avatar || avatar.startsWith('/static')?
        <MarkBoxStyle {...avatarAction}>
          <Box draggable = {false} component="img" src={avatar} />
        </MarkBoxStyle>:
        <AvatarBoxStyle draggable = {false} component="img" src={avatar} {...avatarAction}/>
      }
      <Popper
        open={openGroupBox}
        anchorEl={anchorEl}
        onMouseEnter={()=>{setOpenGroupBox(true)}}
        onMouseLeave={()=>{setOpenGroupBox(false)}}
        onClick={(e)=>{e.stopPropagation()}}
        placement="bottom"
        transition
      >
        {
          ({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Stack sx={{minWidth: 300, maxWidth: 400, p: 2, alignItems: 'center', borderRadius: 1, boxShadow: (theme) => theme.customShadows.z12, background: (theme) => theme.palette.background.paper}}>
                <Typography variant="h5" align='center' sx={{width: '100%'}} noWrap>{name}</Typography>
                <TypographyStyle variant="subtitle2" color="text.secondary" noWrap>{totalCount} items</TypographyStyle>
                <Grid container sx={{pt: 2}}>
                  <Grid item sm={4} textAlign="center">
                    <Typography variant="h6" noWrap>{realData[0].toLocaleString("en-US")}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'inline-flex' }}>
                      <Box component="img" src="/static/elastos.svg" sx={{ width: 14, mr: .5, display: 'inline', verticalAlign: 'middle', filter: (theme)=>theme.palette.mode==='dark'?'invert(1)':'none' }} />
                      {' '}Volume
                    </Typography>
                  </Grid>
                  <Grid item sm={4} textAlign="center">
                    <Typography variant="h6" noWrap>{realData[1]}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'inline-flex' }}>
                      <span role="img" aria-label="">🔻</span> Floor Price
                    </Typography>
                  </Grid>
                  <Grid item sm={4} textAlign="center">
                    <Typography variant="h6" noWrap>{realData[2]}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'inline-flex' }}>
                      <span role="img" aria-label="">💪</span> Owners
                    </Typography>
                  </Grid>
                </Grid>
                {
                  collectibles.length>5 &&
                  <Grid container sx={{py: 2, mx: -2, width: 'calc(100% + 32px)'}}>
                    {
                      collectibles.map((item, _i)=>{
                        const thumbnail = getAssetImage(item, false)
                        return <Grid item sm={4} key={_i} sx={{height: 80}}>
                          {
                            _i===5?
                            <Link
                              component={RouterLink}
                              to={`detail/${token}`}
                              alt=""
                              color="origin.main"
                            >
                              <Box sx={{position: 'relative', background: '#161c24', height: '100%'}}>
                                <Box sx={{...imageStyle, width: '100%', background: `url(${thumbnail}) no-repeat center`, backgroundSize: 'cover', opacity: .5, filter: 'blur(2px)'}} onError={(e) => e.target.src = '/static/broken-image.svg'}/>
                                {/* <Box component="img" src={thumbnail} sx={{height: "100%", maxHeight: 100, opacity: .5, filter: 'blur(2px)'}}/> */}
                                <Typography variant="h6" align='center' sx={{width: '100%', top: '50%', color: 'white', position: 'absolute', transform: 'translateY(-50%)'}}>+ more</Typography>
                              </Box>
                            </Link>:
                            <Box sx={{...imageStyle, width: '100%', background: `url(${thumbnail}) no-repeat center`, backgroundSize: 'cover'}} onError={(e) => e.target.src = '/static/broken-image.svg'}/>
                            // <Box component="img" src={thumbnail} sx={{height: "100%", maxHeight: 100}}/>
                          }
                        </Grid>
                      })
                    }
                  </Grid>
                }
              </Stack>
            </Fade>
          )
        }
      </Popper>
    </Stack>
  );
};

const CollectionCardPaper = (props) => {
  const { info, isPreview, isOnSlider, isOwned=false, openRoyaltiesDlg } = props
  const { name, uri='', owner='', token, totalCount=0, floorPrice=0, totalOwner=0, totalPrice=0, marketPlace=1, collectibles=[], tokenJson={} } = info
  let { description='', avatar='', background='' } = info
  const realData = [totalPrice, floorPrice, totalOwner]

  const [didName, setDidName] = React.useState('');
  const [metaObj, setMetaObj] = React.useState({});
  // const [realData, setRealData] = React.useState([0, 0, 0]);
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [isGeneralCollection, setIsGeneralCollection] = React.useState(false);
  const [badge, setBadge] = React.useState({dia: 0, kyc: false});
  const { setOpenDownloadEssentialDlg, pasarLinkChain } = useSingin()
  const navigate = useNavigate();
  // const apikey = [
  //   {api: 'getTotalPriceCollectibles', field: 'total'},
  //   {api: 'getFloorPriceCollectibles', field: 'price'},
  //   {api: 'getOwnersOfCollection', field: 'total'}
  // ]

  // React.useEffect(() => {
  //   if(token) {
  //     apikey.forEach((item, _i)=>{
  //       fetchFrom(`api/v2/sticker/${item.api}/${token}`)
  //         .then((response) => {
  //           response.json().then((jsonData) => {
  //             setRealData((prevState)=>{
  //               const tempData = [...prevState]
  //               tempData[_i] = jsonData.data[item.field] || 0
  //               return tempData
  //             })
  //           }).catch((e) => {
  //           });
  //         })
  //         .catch((e) => {
  //         });
  //     })
  //   }
  // }, [token]);
  React.useEffect(() => {
    checkWhetherGeneralCollection(pasarLinkChain, token).then(setIsGeneralCollection)
  }, [token, pasarLinkChain]);
  React.useEffect(() => {
    const metaUri = getIpfsUrl(uri)
    if(metaUri) {
      fetch(metaUri)
        .then(response => response.json())
        .then(data => {
          setMetaObj(data)
          if(data.creator) {
            if(data.creator.name)
              setDidName(data.creator.name)
            else if(data.creator.did) {
              getInfoFromDID(data.creator.did)
                .then((info) => {
                  if(info.name)
                    setDidName(info.name)
                })
                .catch((e) => {})
            }
          }
        })
        .catch(console.log);
    }
  }, [uri]);

  if(metaObj.data) {
    description = metaObj.data.description
    avatar = getIpfsUrl(metaObj.data.avatar)
    background = getIpfsUrl(metaObj.data.background)
  }

  React.useEffect(() => {
    if(isPreview) {
      const token = sessionStorage.getItem("PASAR_TOKEN");
      if(token) {
        const user = jwtDecode(token);
        const {name} = user;
        setDidName(name)
      }
    }      
    else if(owner) {
      // if(!didName)
      //   getInfoFromDID(creatorDid)
      //     .then((info) => {
      //       if(info.name)
      //         setDidName(info.name)
      //     })
      //     .catch((e) => {})
      
      getDiaTokenInfo(owner).then(dia=>{
        if(dia!=='0')
          setBadgeFlag('dia', dia)
        else setBadgeFlag('dia', 0)
      })
      getCredentialInfo(owner).then(proofData=>{
        if(proofData)
          setBadgeFlag('kyc', true)
      })
    }
  }, [owner]);
  
  const setBadgeFlag = (type, value) => {
    setBadge((prevState) => {
      const tempFlag = {...prevState}
      tempFlag[type] = value
      return tempFlag
    })
  }

  const openPopupMenu = (event) => {
    event.stopPropagation()
    setOpenPopup(event.currentTarget);
  };

  const handleClosePopup = (event) => {
    event.stopPropagation()
    const type = event.target.getAttribute("value")
    switch(type){
      case 'create':
        navigate(`/create`, {state: {token}});
        break;
      case 'edit':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        navigate(`/collections/edit`, {state: {token, marketPlace}});
        break;
      case 'royalties':
        if(sessionStorage.getItem('PASAR_LINK_ADDRESS') === '1' || sessionStorage.getItem('PASAR_LINK_ADDRESS') === '3'){
          setOpenDownloadEssentialDlg(true)
          return
        }
        if(openRoyaltiesDlg)
          openRoyaltiesDlg(true)
        break;
      default:
        break;
    }
    setOpenPopup(null);
  };

  const imgBoxProps = {avatar, background, name, totalCount, realData, collectibles, token, marketPlace}
  return (
      <PaperRecord sx={isPreview?{ overflow: 'hidden' } : { overflow: 'hidden', ...paperStyle, ...(isOpenPopup?forceHoverStyle:{}) }}>
        <Box>
          <CollectionImgBox {...imgBoxProps}/>
          {
            isOwned&&
            <Box sx={{position: 'absolute', right: 10, top: 10}}>
              <IconButton
                color="inherit"
                size="small"
                sx={{background: '#ffffff80'}}
                onClick={openPopupMenu}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu 
                keepMounted
                id="simple-menu"
                anchorEl={isOpenPopup}
                onClick={(e)=>{e.stopPropagation()}}
                onClose={handleClosePopup}
                open={Boolean(isOpenPopup)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem value='create' onClick={handleClosePopup}>
                  <AddCircleOutlineIcon/>&nbsp;Create Item
                </MenuItem>
                <MenuItem value='edit' onClick={handleClosePopup}>
                  <Icon icon={editIcon} width={24}/>&nbsp;Edit Collection
                </MenuItem>
                <MenuItem value='royalties' onClick={handleClosePopup} disabled={isGeneralCollection}>
                  <Icon icon="fluent:money-hand-20-filled" width={24}/>&nbsp;Royalties
                </MenuItem>
              </Menu>
            </Box>
          }
        </Box>
        <Box sx={{p:2}}>
          <Stack direction="column" sx={{justifyContent: 'center', textAlign: 'center'}}>
            <Typography variant="h5" noWrap sx={{fontWeight: 'normal'}}>{name}</Typography>
            <Typography variant="subtitle2" component='div' sx={{fontWeight: 'normal'}}>
              by{' '}
              {
                owner?
                <Link
                  component={RouterLink}
                  to={`/profile/others/${owner}`}
                  alt=""
                  color="origin.main"
                  onClick={(e)=>{e.stopPropagation()}}
                >
                  {didName || reduceHexAddress(owner)}
                </Link>:

                <Typography variant="subtitle2" sx={{fontWeight: 'normal', color: 'origin.main', display: 'inline-flex'}}>
                  Anonym
                </Typography>
              }
            </Typography>
            {
              isOnSlider?
              <TypographyStyle 
                variant="subtitle2"
                color='text.secondary'
                sx={{ 
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'normal',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  display: '-webkit-box !important'
                }}
              >
                {description}
              </TypographyStyle>:
              <TypographyStyle variant="subtitle2" color='text.secondary'>
                {description.length>100?`${description.substring(0, 100)}...`:description}
              </TypographyStyle>
            }
            <Stack sx={{justifyContent: 'center', pt: 1}} spacing={1} direction="row">
            {
              badge.dia>0 && <DIABadge balance={badge.dia}/>
            }
            {
              badge.kyc&&
              <Tooltip title="KYC-ed via kyc-me.io" arrow enterTouchDelay={0}>
                <Box sx={{display: 'inline-flex'}}><Badge name="kyc"/></Box>
              </Tooltip>
            }
          </Stack>
          </Stack>
        </Box>
      </PaperRecord>
  );
};

export default function CollectionCard(props) {
  const { info, isPreview=false, isDragging=false } = props
  const { token, marketPlace=1} = info
  const [isOpenUpdateRoyalties, setUpdateRoyaltiesOpen] = React.useState(false);
  const navigate = useNavigate();

  const route2Detail = () => {
    if(!isDragging)
      navigate(`/collections/detail/${marketPlace}${token}`);
  }

  return (
    isPreview?
    <CollectionCardPaper {...props}/>:
    
    <>
      <Box onClick={route2Detail} sx={{display: 'contents', cursor: 'pointer'}}>
        <CollectionCardPaper {...props} openRoyaltiesDlg = {setUpdateRoyaltiesOpen}/>
      </Box>
      <UpdateRoyaltiesDlg isOpen={isOpenUpdateRoyalties} setOpen={setUpdateRoyaltiesOpen} {...info}/>
    </>
  );
};