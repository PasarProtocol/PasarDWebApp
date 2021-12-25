import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CopyButton from '../../CopyButton';

CollectibleListItem.propTypes = {
    item: PropTypes.object.isRequired
};
const TypographyStyle = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        textAlign: "right"
    }
}));
export default function CollectibleListItem({ item }) {
    const { image, name, createTime, holder, tokenIdHex } = item;
    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{p:2}}>
            <Box
                component="img"
                alt={name}
                src={image}
                onError={(e) => e.target.src = '/static/broken-image.svg'}
                sx={{ width: 48, height: 48, borderRadius: 1 }}
            />
            <Grid container sx={{ width: (theme) => `calc(100% - ${theme.spacing(2)} - 48px)` }}>
                <Grid item xs={6}>
                    <Typography color="inherit" variant="subtitle2" align="left" noWrap>
                        {name}
                    </Typography>
                    <Stack sx={{flexDirection: 'row'}}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: "auto" }} align="left" noWrap>
                            Creator : {holder}
                        </Typography>
                        <CopyButton/>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} align="right" noWrap>
                        {formatDistance(createTime*1000, new Date(), { addSuffix: true }).replace("about","").trim()}
                    </TypographyStyle>
                    <TypographyStyle variant="body2" sx={{ color: 'text.secondary' }} align="right" noWrap>
                        Token ID : {tokenIdHex}
                    </TypographyStyle>
                </Grid>
            </Grid>
        </Stack>
    );
}