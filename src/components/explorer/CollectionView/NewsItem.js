import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Box, Stack, Link, Typography } from '@mui/material';

NewsItem.propTypes = {
    news: PropTypes.object.isRequired
};
  
export default function NewsItem({ news }) {
    const { image, title, description, postedAt } = news;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box
                component="img"
                alt={title}
                src={image}
                sx={{ width: 48, height: 48, borderRadius: 1.5 }}
            />
            <Box sx={{ minWidth: 240 }}>
                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                <Typography variant="subtitle2" noWrap>
                    {title}
                </Typography>
                </Link>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {description}
                </Typography>
            </Box>
            <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
                {/* {formatDistance(postedAt, new Date())} */}
                {postedAt}
            </Typography>
        </Stack>
    );
}