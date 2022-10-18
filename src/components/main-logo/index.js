import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Container } from '@mui/material';
// components
import { varWrapEnter, varFadeIn } from '../animate';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 0, 1)
}));

export default function MainLogo() {
  const theme = useTheme();

  return (
    <RootStyle>
      <motion.div initial="initial" animate="animate" variants={varWrapEnter}>
        <Container
          maxWidth="lg"
          sx={{
            display: { md: 'flex' },
            justifyContent: { md: 'space-between' }
          }}
        >
          <motion.div variants={varFadeIn} style={{ margin: 'auto', display: 'table' }}>
            <Link to="/" component={RouterLink}>
              <Box
                draggable={false}
                component="img"
                src={`/static/logo-gif-${theme.palette.mode}.gif`}
                sx={{ width: 220 }}
              />
            </Link>
          </motion.div>
        </Container>
      </motion.div>
    </RootStyle>
  );
}
