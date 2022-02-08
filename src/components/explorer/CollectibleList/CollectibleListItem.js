import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CopyButton from '../../CopyButton';
import { getAssetImage } from '../../../utils/common';

CollectibleListItem.propTypes = {
    item: PropTypes.object.isRequired
};
const TypographyStyle = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        textAlign: "right"
    }
}));
export default function CollectibleListItem({ item }) {
    const { thumbnail, name, createTime, royaltyOwner, tokenIdHex } = item;
    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{p:2}}>
            <Box
                draggable = {false}
                component="img"
                alt={name}
                src={getAssetImage(item, true)}
                onError={(e) => e.target.src = '/static/broken-image.svg'}
                sx={{ width: 48, height: 48, borderRadius: 1 }}
            />
            <Grid container sx={{ width: (theme) => `calc(100% - ${theme.spacing(2)} - 48px)` }}>
                <Grid item xs={8}>
                    <Typography color="inherit" variant="subtitle2" align="left" noWrap>
                        {name}
                    </Typography>
                    <Stack sx={{flexDirection: 'row'}}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: "auto", pt: '2px' }} align="left" noWrap>
                            Creator : <Link to={`/explorer/transaction/detail/${royaltyOwner}`} component={RouterLink} sx={{ color: 'text.secondary'}} onClick={(e)=>{e.stopPropagation()}}>{royaltyOwner}</Link>
                        </Typography>
                        <CopyButton text={royaltyOwner}/>
                    </Stack>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} align="left" noWrap>
                        Token ID : {tokenIdHex}
                    </TypographyStyle>
                </Grid>
                <Grid item xs={4}>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} align="right" noWrap>
                        {formatDistance(createTime*1000, new Date(), { addSuffix: true }).replace("about","").trim()}
                    </TypographyStyle>
                </Grid>
            </Grid>
        </Stack>
    );
}