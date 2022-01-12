// material
import React from 'react';
import { SizeMe } from "react-sizeme";
import { Icon } from '@iconify/react';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from "framer-motion";
import Imgix from "react-imgix";

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Drawer, Divider, AppBar, Toolbar, TextField, FormControlLabel,
  Link, Card, Button, Box, ToggleButtonGroup, ToggleButton, IconButton, Menu, MenuItem, List, ListItemButton, ListItemIcon, ListItemText, Select } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';


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
import useOffSetTop from '../../hooks/useOffSetTop';
import CustomSwitch from '../../components/custom-switch';
import SearchBox from '../../components/SearchBox';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(19)
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
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={1.5}>
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
          <Typography variant="h4">Ph-1157</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1}}>Phantz</Typography>
          <Typography variant="body2" display="block" sx={{lineHeight: 1, color: 'text.secondary'}}>Quantity: 1/2</Typography>
          <Typography variant="h4" sx={{color: "origin.main"}}>
            <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
            &nbsp;28.22 ELA
          </Typography>
          <Stack direction="row">
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
const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;
const AppBarStyle = styled(AppBar)(({ theme }) => ({
  color: 'inherit',
  transition: theme.transitions.create(['top'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
}));
const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: '48px',
  minHeight: '48px !important',
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard
  }),
  // [theme.breakpoints.up('md')]: {
  //   height: APP_BAR_MOBILE
  // },
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
const DrawerStyle = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    transition: theme.transitions.create(['top'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard
    }),
  }
}));
const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8
}));
// ----------------------------------------------------------------------
export default function MarketExplorer() {
  const drawerWidth = 360;
  const isOffset = useOffSetTop(20);
  const navigate = useNavigate();
  const [assets, setAssets] = React.useState([]);
  const [dispmode, setDispmode] = React.useState(0);
  const [isFilterView, setFilterView] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timeOrder, setTimeOrder] = React.useState(-1);
  const [controller, setAbortController] = React.useState(new AbortController());
  const [isLoadingAssets, setLoadingAssets] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [showCount, setShowCount] = React.useState(10);
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
      <Stack direction="row">
        <Container maxWidth={false}>
          <AppBarStyle sx={{ boxShadow: 0, bgcolor: 'transparent', top: isOffset?APP_BAR_MOBILE:APP_BAR_DESKTOP }}>
            <ToolbarStyle
              sx={{
                ...(isOffset && {
                  bgcolor: 'background.default',
                })
              }}
            >
              <StackStyle width="100%">
                <Typography variant="h4" sx={{flex:1}}>
                  <Button
                    variant="contained"
                    color="origin"
                    startIcon={isFilterView?<Icon icon={arrowIosBackFill} />:''}
                    endIcon={isFilterView?'':<Icon icon={arrowIosForwardFill} />}
                    onClick={()=>{setFilterView(!isFilterView&&1)}}
                  >
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
            </ToolbarStyle>
            {isOffset && <ToolbarShadowStyle />}
          </AppBarStyle>
          {isLoadingAssets && <LoadingWrapper><LoadingScreen sx={{background: 'transparent'}}/></LoadingWrapper>}
          <Box sx={{ display: 'flex' }}>
            <Box
              component="nav"
              sx={{ width: drawerWidth*isFilterView, flexShrink: 0, display: {xs: 'none', sm: 'none', md: 'block'} }}
              aria-label="mailbox folders"
            >
              <DrawerStyle
                variant="persistent"
                open
                sx={{
                  pt: 3,
                  '& .MuiDrawer-paper': { width: drawerWidth*isFilterView, top: isOffset?APP_BAR_MOBILE+48:APP_BAR_DESKTOP+48 },
                }}
              >
                <Scrollbar sx={{maxHeight: `calc(100vh - ${isOffset?APP_BAR_MOBILE:APP_BAR_DESKTOP}px - 48px)`}}>
                  <Grid container width="100%">
                    <Grid item md={12}>
                      <Accordion
                        defaultExpanded={1&&true}
                      >
                        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                          <Typography variant="body2">Status</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Button variant="outlined" color="primary">
                            All
                          </Button>
                          <Button variant="outlined" color="primary">
                            Listed on Market
                          </Button>
                          <Button variant="outlined" color="primary">
                            On Auction
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Accordion
                        defaultExpanded={1&&true}
                      >
                        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                          <Typography variant="body2">Price Range</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={1}>
                            <Select
                              defaultValue={0}
                              // value={selected}
                              // onChange={handleChange}
                              inputProps={{ 'aria-label': 'Without label' }}
                              size="small"
                              sx={{
                                mr: 1,
                                width: '100%',
                                '& .MuiListItemText-root, & .MuiListItemText-root>span': {
                                  display: 'inline'
                                }
                              }}
                            >
                              <MenuItem value={0}>
                                <ListItemIcon>
                                  <Box component="img" src="/static/elastos.svg" sx={{ width: 18, display: 'inline' }} />
                                </ListItemIcon>
                                <ListItemText primary="Elastos (ELA)" />
                              </MenuItem>
                            </Select>
                            <Grid container>
                              <Grid item md={5}>
                                <TextField label="Min" size="small"/>
                              </Grid>
                              <Grid item md={2} align="center">
                                <Typography variant="body2" sx={{pt: 1}}>~</Typography>
                              </Grid>
                              <Grid item md={5}>
                                <TextField label="Max" size="small"/>
                              </Grid>
                            </Grid>
                            <Button variant="contained" color="primary" width="100%">
                              Apply
                            </Button>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Accordion
                        defaultExpanded={1&&true}
                      >
                        <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                          <Typography variant="body2">Collections</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <SearchBox sx={{width: '100%'}} rootsx={{px: '0 !important', mb: 1}} placeholder="Search collections"/>
                          <Scrollbar sx={{maxHeight: 200}}>
                            <List
                              sx={{ width: '100%', bgcolor: 'background.paper' }}
                              component="nav"
                              aria-labelledby="nested-list-subheader"
                            >
                              {
                                [...Array(10)].map((value, id)=>(
                                    <ListItemButton key={id}>
                                      <ListItemIcon>
                                        <Box draggable = {false} component="img" src="/static/feeds-sticker.svg" sx={{ width: 24, height: 24, borderRadius: 2, p: .5, backgroundColor: 'black' }} />
                                      </ListItemIcon>
                                      <ListItemText primary="Feeds NFT Sticker" />
                                    </ListItemButton>
                                ))
                              }
                            </List>
                          </Scrollbar>
                        </AccordionDetails>
                      </Accordion>
                      <Divider />
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <Accordion
                      defaultExpanded={1&&true}
                    >
                      <AccordionSummary expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20}/>} sx={{px: 4}}>
                        <Typography variant="body2">Explicit & Sensitive Content</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <FormControlLabel
                          control={<CustomSwitch onChange={()=>{}}/>}
                          label="Off"
                          labelPlacement="end"
                          sx={{ml:2, pr:2}}
                        />
                      </AccordionDetails>
                    </Accordion>
                    <Divider />
                  </Grid>
                </Scrollbar>
              </DrawerStyle>
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth*isFilterView}px)` } }}
            >
              <StackedGrid>
                <GridItems items={assets} ratio="3:2" />
              </StackedGrid>
            </Box>
          </Box>
        </Container>
      </Stack>
    </RootStyle>
  );
}
