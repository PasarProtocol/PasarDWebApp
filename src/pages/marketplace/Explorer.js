// material
import React from 'react';
import { SizeMe } from "react-sizeme";
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from "framer-motion";
import Imgix from "react-imgix";

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Paper, Typography, Link, Card, Button, Box, ToggleButtonGroup, ToggleButton, IconButton, Menu, MenuItem } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem'
import ShowSelect from '../../components/pagination/ShowSelect';
import AssetSortSelect from '../../components/AssetSortSelect';
import Pagination from '../../components/pagination';
import PaperRecord from '../../components/PaperRecord';
import Badge from '../../components/Badge';
import LoadingWrapper from '../../components/LoadingWrapper';
import DateOrderSelect from '../../components/DateOrderSelect';
import { getThumbnail } from '../../utils/common';
// ----------------------------------------------------------------------

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

const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const StackedGrid = ({
  gridItemWidth = "280px",
  children,
  ...props
}) => (
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={1.5}>
    {children}
  </Box>
);
const GridItems = (props) => (
    <AnimatePresence>
      {props.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GridItem
            ratio={props.ratio}
            key={index}
            id={item}
            index={index}
            mb={props.rowGap}
            thumbnail={getThumbnail(item.asset)}
            title={item.name && item.name}
            url={props.url}
            {...props}
          />
        </motion.div>
      ))}
    </AnimatePresence>
);

const GridItem = (props) => {
  const [isOpenPopup, setOpenPopup] = React.useState(null);

  const openPopupMenu = (event) => {
    setOpenPopup(event.currentTarget);
  };
  const handleClosePopup = () => {
    setOpenPopup(null);
  };

  return (
    <Link
      component={RouterLink}
      to="#"
      alt={props.title}
      underline="none"
    >
      <motion.div
        animate={{ scale: 1 }}
      >
        <PaperRecord sx={{p:1}}>
          <Grid container>
            <Grid item xs="6">
              <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black' }} />
            </Grid>
            <Grid item xs="6" align="right">
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
          <Typography variant="h5">Ph-1157</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1}}>Phantz</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1, color: 'text.secondary'}}>Quantity: 1/2</Typography>
          <Typography variant="h5" sx={{color: "origin.main"}}>
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
            &nbsp;28.22 ELA
          </Typography>
          <Stack direction = "row">
          <Badge name="diamond"/>
          <Badge name="user"/>
          </Stack>
        </PaperRecord>
      </motion.div>
    </Link>
  );
};

const Thumbnail = (props) => {
  const { width, src, ratio } = props;

  return (
    <Grid as={Card} sx={{mt: .5}}>
      <Imgix
        src={src}
        width={width}
        height={width}
        imgixParams={{
          fit: "crop",
          crop: "edges, entropy, faces, center",
          ar: `${ratio}`
        }}
      />
    </Grid>
  );
};
// ----------------------------------------------------------------------
export default function Collectible() {
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [dispmode, setDispmode] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);
  React.useEffect(async () => {
    controller.abort(); // cancel the previous request
    const newController = new AbortController();
    const {signal} = newController;
    setAbortController(newController);

    setLoadingAssets(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=${page}&pageSize=${showCount}&timeOrder=${timeOrder}`, { signal }).then(response => {
      response.json().then(jsonAssets => {
        setTotalCount(jsonAssets.data.total)
        setPages(Math.ceil(jsonAssets.data.total/showCount));
        setAssets(jsonAssets.data.result);
        setLoadingAssets(false);
      })
    }).catch(e => {
      if(e.code !== e.ABORT_ERR)
        setLoadingAssets(false);
    });
  }, [page, showCount, timeOrder]);
  
  const handleDispmode = (event, mode) => {
    setDispmode(mode)
    // setShowCount(event.target.value)
  };
  const handleDateOrder = (selected)=>{
    setTimeOrder(selected)
  }
  const link2Detail = (tokenId)=>{
    navigate(`/explorer/collectible/detail/${tokenId}`);
  }
  return (
    <RootStyle title="Marketplace | PASAR">
      <Container maxWidth="lg">
        <StackStyle sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{flex:1}}>
            <Button variant="contained" color="origin">
              Filters
            </Button>
            <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>{totalCount.toLocaleString('en')} items</Typography>
          </Typography>
          <Box sx={{display: 'flex'}}>
            <AssetSortSelect/>
            <ToggleButtonGroup value={dispmode} exclusive onChange={handleDispmode} size="small">
              <ToggleButton value={0}>
                <GridViewSharpIcon />
              </ToggleButton>
              <ToggleButton value={1}>
                <AppsIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </StackStyle>
        {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
        <Scrollbar>
          <StackedGrid>
            <GridItems items={assets} ratio="3:2" />
          </StackedGrid>
        </Scrollbar>
      </Container>
    </RootStyle>
  );
}
