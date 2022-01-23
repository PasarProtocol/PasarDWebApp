import React from 'react';
import Imgix from "react-imgix";
import { SizeMe } from "react-sizeme";
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";
// material
import { Icon } from '@iconify/react';
import { Box, Grid, Card, Link, IconButton, Menu, MenuItem, Typography, Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import Badge from '../Badge';
import PaperRecord from '../PaperRecord';

// ----------------------------------------------------------------------

const Thumbnail = (props) => {
  const { src } = props;
  const imageStyle = {
    borderRadius: 1,
    boxShadow: (theme)=>theme.customShadows.z16,
    position: 'relative',
    alignItems: 'center',
    height: 'auto',
    maxHeight: '100%',
    maxWidth: '100%'
  }
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        aspectRatio: '1 / 1',
        width: '100%',
      }}>
      <Box sx={{mt: .5, alignItems: 'center', display: 'flex'}}>
        <Box draggable = {false} component="img" src={src} sx={imageStyle}/>
      </Box>
    </Box>
  );
};

export default function AssetCard(props) {
  const {title="???", description, quantity=1, price=0, isLink, tokenId} = props
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };

  return (
      <motion.div
        animate={{ scale: 1 }}
      >
        <PaperRecord sx={{p:2}}>
          <Grid container>
            <Grid item xs={6}>
              <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black' }} />
            </Grid>
            <Grid item xs={6} align="right">
              <IconButton color="inherit" size="small" sx={{p: 0}} onClick={isLink ? openPopupMenu : ()=>{}}>
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
                <MenuItem onClick={handleClosePopup}>
                  <ThumbDownOffAltIcon/>&nbsp;Report Creator
                </MenuItem>
                <MenuItem onClick={handleClosePopup}>
                  <ThumbDownOffAltIcon/>&nbsp;Report Owner
                </MenuItem>
                <MenuItem onClick={handleClosePopup}>
                  <ShareOutlinedIcon/>&nbsp;Share
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
          {
            isLink?(
              <Link
                component={RouterLink}
                to={`/marketplace/detail/${tokenId}`}
                alt=""
                underline="none"
              >
                <Thumbnail
                  src={props.thumbnail}
                  {...props}
                />
              </Link>
            ):(
              <Thumbnail
                src={props.thumbnail}
                {...props}
              />
            )
          }
          <Typography variant="h4" noWrap>{title}</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1.3}} noWrap>{description}</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1.3, color: 'text.secondary'}}>Quantity: 1/{quantity}</Typography>
          <Typography variant="h4" sx={{color: "origin.main"}}>
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
            &nbsp;{price} ELA
          </Typography>
          {/* <Stack direction="row">
            <Badge name="diamond"/>
            <Badge name="user"/>
          </Stack> */}
        </PaperRecord>
      </motion.div>
    // </Link>
  );
};
