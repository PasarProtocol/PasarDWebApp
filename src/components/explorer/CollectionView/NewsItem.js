import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography } from '@mui/material';
import palette from '../../../theme/palette'

NewsItem.propTypes = {
    news: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired
};
  
export default function NewsItem({ news, isLast }) {
    const { image, title, description, postedAt, gasFee } = news;
    const sx = isLast?{}:{borderBottom: '1px solid', borderColor: palette.light.grey['300'], pb: 2};
    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={sx}>
            <Box
                component="img"
                alt={title}
                src={image}
                sx={{ width: 48, height: 48, borderRadius: 1.5 }}
            />
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography color="inherit" variant="subtitle2" noWrap>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {description}
                </Typography>
            </Box>
            <Box>
                <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                    {formatDistance(postedAt, new Date(), { addSuffix: true }).replace("about","").trim()}
                </Typography>
                <Typography variant="body2" sx={{ flexShrink: 0, color: 'text.secondary' }} align="right" noWrap>
                    Tx Fee : {gasFee} ELA
                </Typography>
            </Box>
        </Stack>
    );
}