// material
import React from 'react';
import { SizeMe } from "react-sizeme";
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from "framer-motion";
import Imgix from "react-imgix";

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Stack, Grid, Paper, Typography, Link, Card, Button, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';

// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Scrollbar from '../../components/Scrollbar';
import CollectibleListItem from '../../components/explorer/CollectibleList/CollectibleListItem'
import ShowSelect from '../../components/pagination/ShowSelect';
import AssetSortSelect from '../../components/AssetSortSelect';
import Pagination from '../../components/pagination';
import PaperRecord from '../../components/PaperRecord';
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
const GridItems = (props) => {
  const { items, ratio, rowGap, url } = props;

  return (
    <AnimatePresence>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GridItem
            ratio={ratio}
            key={index}
            id={item}
            index={index}
            mb={rowGap}
            thumbnail={getThumbnail(item.asset)}
            title={item.name && item.name}
            subheader={item.subheader && item.subheader}
            url={url}
            {...props}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

const GridItem = function ({
  variant,
  thumbnail,
  title,
  subheader,
  type,
  index,
  rowGap,
  url,
  ...props
})  {
  // const location = useLocation();
  // const [isHovered, setIsHovered] = React.useState(false);

  return (
    /*
    <RouterLink alt={title} to={url}>
    */
    <RouterLink
      to="#"
      alt={title}
    >
      <motion.div
        // onHoverStart={() => setIsHovered(true)}
        // onHoverEnd={() => setIsHovered(false)}
        animate={{ scale: 1 }}
      >
        <Grid
          as={Grid}
          alignItems="start"
          mb={rowGap}
          {...props}
        >
          <SizeMe>
            {({ size }) => (
              <Thumbnail
                src={thumbnail}
                width={size.width}
                variant={variant}
                // hovered={isHovered}
                {...props}
              />
            )}
          </SizeMe>
        </Grid>
      </motion.div>
    </RouterLink>
  );
};

const Thumbnail = (props) => {
  const {
    variant,
    width,
    src,
    ratio,
    hovered
  } = props;

  return (
    <Grid as={Card}>
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
