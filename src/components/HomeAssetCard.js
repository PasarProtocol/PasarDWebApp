import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Paper, Box, Stack, Typography, Button, Tooltip, Link } from '@mui/material';
import { reduceHexAddress, getThumbnail } from '../utils/common';
import Jazzicon from './Jazzicon';
import CardImgBox from './CardImgBox';

const PaperStyle = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(35px)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 80px rgb(0 0 0 / 25%)',
    padding: theme.spacing(2)
}));


export default function HomeAssetCard() {
    const [asset, setAsset] = React.useState(null);
    const [isAssetLoading, setAssetLoading] = React.useState(true);

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getLatestPurchasedToken`).then(response => {
            response.json().then(jsonAsset => {
                if(jsonAsset.data)
                    setAsset(jsonAsset.data);
                setAssetLoading(false);
            }).catch(e => {
                setAssetLoading(false);
            });
        }).catch(e => {
            setAssetLoading(false);
        });
    }, []);
    
    return (
        <PaperStyle sx={!isAssetLoading&&!asset&&{display: 'none'}}>
            {
                isAssetLoading?<Box draggable = {false} component="img" src="/static/circle-loading.svg" sx={{ width: '100%', borderRadius: 1 }} />:
                asset!=null&&
                <>
                    <Link to={`/marketplace/others/${asset.royaltyOwner}`} component={RouterLink}>
                        <CardImgBox src={getThumbnail(asset.asset)}/>
                    </Link>
                    <Stack direction="row" sx={{py: 2}}>
                        <Link to={`/marketplace/others/${asset.royaltyOwner}`} component={RouterLink} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'inherit' }}>
                            <Jazzicon address='0x123' sx={{mr: 0}}/>
                            <Box sx={{ minWidth: 0, flexGrow: 1, ml: 1 }}>
                                <Typography color="inherit" variant="subtitle2" noWrap>
                                    {asset.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                    {reduceHexAddress(asset.royaltyOwner)}
                                </Typography>
                            </Box>
                        </Link>
                        <Box component="div" sx={{m:'auto !important', minWidth: '120px', textAlign: 'right'}}>
                            <Tooltip title="Coming Soon" arrow>
                            <div>
                                <Button variant="contained" href="#" disabled={1&&true}>
                                    Get featured
                                </Button>
                            </div>
                            </Tooltip>
                        </Box>
                    </Stack>
                </>
            }
        </PaperStyle>
    )
}