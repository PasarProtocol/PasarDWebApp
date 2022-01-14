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
  const { width, src, ratio } = props;

  return (
    <Grid as={Card} sx={{mt: .5}}>
      <Box draggable = {false} component="img" src={src} width={width} height={width}/>
      {/* <Imgix
        src={src}
        width={width}
        height={width}
        imgixParams={{
          fit: "crop",
          crop: "edges, entropy, faces, center",
          ar: `${ratio}`
        }}
      /> */}
    </Grid>
  );
};

export default function AssetCard(props) {
  const {title="???", description, quantity=1, price=0} = props
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };

  return (
    // <Link
    //   component={RouterLink}
    //   to="#"
    //   alt={props.title}
    //   underline="none"
    // >
      <motion.div
        animate={{ scale: 1 }}
      >
        <PaperRecord sx={{p:1}}>
          <Grid container>
            <Grid item md={6}>
              <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black' }} />
            </Grid>
            <Grid item md={6} align="right">
              <IconButton color="inherit" size="small" sx={{p: 0}} onClick={openPopupMenu}>
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
          <SizeMe>
            {({ size }) => (
              <Thumbnail
                src={props.thumbnail}
                width={size.width}
                // hovered={isHovered}
                {...props}
              />
            )}
          </SizeMe>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1}}>{description}</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1, color: 'text.secondary'}}>Quantity: 1/{quantity}</Typography>
          <Typography variant="h4" sx={{color: "origin.main"}}>
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
            &nbsp;{price} ELA
          </Typography>
          <Stack direction="row">
            <Badge name="diamond"/>
            <Badge name="user"/>
          </Stack>
        </PaperRecord>
      </motion.div>
    // </Link>
  );
};
