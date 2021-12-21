import { styled } from '@mui/material/styles'

const LoadingWrapper = styled('div')(({ theme }) => ({
    position: 'fixed',
    left: '50%',
    top: '50%',
    webkitTransform: 'translateX(-50%) translateY(-50%)',
    transform: 'translateX(-50%) translateY(-50%)',
    'z-index': 1
}));
export default LoadingWrapper;