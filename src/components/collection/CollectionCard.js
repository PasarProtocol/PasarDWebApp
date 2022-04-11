import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as math from 'mathjs';
import Imgix from "react-imgix";
import jwtDecode from 'jwt-decode';
import { motion } from "framer-motion";
import { Icon } from '@iconify/react';
import editIcon from '@iconify-icons/akar-icons/edit';
import { alpha, styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Grid, Button, Link, IconButton, Menu, MenuItem, Typography, Stack, Tooltip } from '@mui/material';

import PaperRecord from '../PaperRecord';
// import Badge from '../Badge';
// import BadgeProfile from './BadgeProfile'
// import useSingin from '../../hooks/useSignin';
import { getDidInfoFromAddress, reduceHexAddress, getIpfsUrl, getDiaTokenInfo, getCredentialInfo, coinTypes } from '../../utils/common';

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
  const { backgroundImg, avatar } = props;
  const imageStyle = {
    // borderRadius: 1,
    // boxShadow: (theme)=>theme.customShadows.z16,
    // maxHeight: '100%',
    display: 'inline-flex',
    height: '100%',
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
        !avatar || avatar.startsWith('/static')?
        <MarkBoxStyle>
          <Box draggable = {false} component="img" src={avatar} />
        </MarkBoxStyle>:
        <AvatarBoxStyle draggable = {false} component="img" src={avatar} />
      }
    </Stack>
  );
};

const CollectionCardPaper = (props) => {
  const { info, isPreview, isOnSlider, isOwned=false } = props
  const { name, uri='', owner='', token } = info
  let { description='', avatar='', background='' } = info

  const [didName, setDidName] = React.useState('');
  const [metaObj, setMetaObj] = React.useState({});
  const [isOpenPopup, setOpenPopup] = React.useState(null);
  const [badge, setBadge] = React.useState({dia: false, kyc: false});
  const navigate = useNavigate();

  React.useEffect(() => {
    // if(holder) {
    //   getDiaTokenInfo(holder).then(dia=>{
    //     if(dia!=='0')
    //       setBadgeFlag('dia', true)
    //   })
    //   getCredentialInfo(holder).then(proofData=>{
    //     if(proofData)
    //       setBadgeFlag('kyc', true)
    //   })
    // }
    
    const metaUri = getIpfsUrl(uri)
    if(metaUri) {
      fetch(metaUri)
        .then(response => response.json())
        .then(data => {
          setMetaObj(data)
        });
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
    else if(owner)
      getDidInfoFromAddress(owner)
        .then((info) => {
          if(info.name)
            setDidName(info.name)
        })
        .catch((e) => {})
  }, [owner]);
  
  const openPopupMenu = (event) => {
    event.preventDefault()
    setOpenPopup(event.currentTarget);
  };

  const handleClosePopup = (event) => {
    event.preventDefault()
    const type = event.target.getAttribute("value")
    switch(type){
      case 'create':
        navigate(`/create`, {state: {token}});
        break;
      case 'edit':
        break;
      default:
        break;
    }
    setOpenPopup(null);
  };

  return (
      <PaperRecord sx={isPreview?{ overflow: 'hidden' } : { overflow: 'hidden', ...paperStyle, ...(isOpenPopup?forceHoverStyle:{}) }}>
        <Box>
          <CollectionImgBox avatar={avatar} backgroundImg={background}/>
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
              </Menu>
            </Box>
          }
        </Box>
        <Box sx={{p:2}}>
          <Stack direction="column" sx={{justifyContent: 'center', textAlign: 'center'}}>
            <TypographyStyle variant="h5" noWrap>{name}</TypographyStyle>
            <Typography variant="subtitle2" component='div' sx={{fontWeight: 'normal'}}>
              by{' '}<Typography variant="subtitle2" sx={{fontWeight: 'normal', color: 'origin.main', display: 'inline-flex'}}>{didName || reduceHexAddress(owner) || 'Anonym'}</Typography>
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
                {description.length>200?`${description.substring(0, 200)}...`:description}
              </TypographyStyle>
            }
          </Stack>
        </Box>
      </PaperRecord>
  );
};

export default function CollectionCard(props) {
  const { info, isPreview=false, isDragging } = props
  return (
    isPreview?
    <CollectionCardPaper {...props}/>:
    <Link
      component={RouterLink}
      to={`/collection/detail/${info.token}`}
      alt=""
      underline="none"
      onClick={(e)=>{if(isDragging) e.preventDefault()}}
    >
      <CollectionCardPaper {...props}/>
    </Link>
  );
};