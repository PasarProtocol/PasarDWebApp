import React from 'react';
import * as math from 'mathjs';
import Imgix from "react-imgix";
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";
import Countdown from "react-countdown";

// material
import { Icon } from '@iconify/react';
import { Box, Grid, Button, Link, IconButton, Menu, MenuItem, Typography, Stack, Tooltip } from '@mui/material';
// import Badge from '../Badge';
import PaperRecord from '../PaperRecord';
// import CardImgBox from '../CardImgBox';
// import useSingin from '../../hooks/useSignin';
// import BadgeProfile from './BadgeProfile'
import { getDiaTokenInfo, getCredentialInfo, coinTypes } from '../../utils/common';

// ----------------------------------------------------------------------
const MarkBoxStyle = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.background.paper,
  width: 56,
  height: 56,
  borderRadius: '100%',
  backgroundColor: 'black',
  display: 'flex',
  position: 'absolute',
  left:0,
  right: 0,
  bottom: -29,
  margin: 'auto',
  padding: '10px'
}));
const CollectionImgBox = (props) => {
  const { cover, avatar } = props;
  const imageStyle = {
    // borderRadius: 1,
    // boxShadow: (theme)=>theme.customShadows.z16,
    display: 'inline-flex',
    maxHeight: '100%',
  }
  return (
    <Stack sx={{position: 'relative', height: '120px', mb: '25px'}}>
      {
        cover?
        <Box draggable = {false} component="img" src={cover} sx={imageStyle} onError={(e) => e.target.src = '/static/broken-image.svg'}/>:
        <Box
          sx={{
            background: 'linear-gradient(90deg, #a951f4, #FF5082)',
            width: '100%',
            height: '100%'
          }} 
        />
      }
      <MarkBoxStyle>
        <Box draggable = {false} component="img" src={avatar} />
      </MarkBoxStyle>
    </Stack>
  );
};

export default function CollectionCard(props) {
  const { info } = props
  const {title, avatar, coverImage, detail} = info
  const [badge, setBadge] = React.useState({dia: false, kyc: false});
  

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
  }, []);

  return (
      <PaperRecord sx={{overflow: 'hidden'}}>
        <Box>
        {
          // isLink?(
          //   <Link
          //     component={RouterLink}
          //     to={`/collection/detail/${tokenId}`}
          //     alt=""
          //     underline="none"
          //   >
          //     <CardImgBox
          //       src={props.thumbnail}
          //       {...props}
          //     />
          //   </Link>
          // ):(
            <CollectionImgBox avatar={avatar} cover={coverImage}/>
          // )
        }
        </Box>
        <Box sx={{p:2}}>
          <Stack direction="column" sx={{justifyContent: 'center', textAlign: 'center'}}>
            <Typography variant="h5" noWrap>{title}</Typography>
            <Typography variant="subtitle2" component='div' sx={{fontWeight: 'normal'}}>
              by{' '}<Typography variant="subtitle2" sx={{fontWeight: 'normal', color: 'origin.main', display: 'inline-flex'}}>Various Creators</Typography>
            </Typography>
            <Typography variant="subtitle2" sx={{fontWeight: 'normal'}} color='text.secondary'>
              {detail}
            </Typography>
          </Stack>
        </Box>
      </PaperRecord>
  );
};