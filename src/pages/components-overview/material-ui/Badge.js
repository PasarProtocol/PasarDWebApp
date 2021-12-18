// material
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';
import { Box, Grid, Container, Typography, Badge } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
//
import { Block } from '../Block';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export default function BadgeComponent() {
  return (
    <RootStyle title="Components: Badge | Minimal-UI">
      <Box
        sx={{
          pt: 6,
          pb: 1,
          mb: 10,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
        }}
      >
        <Container maxWidth="lg">
          <HeaderBreadcrumbs
            heading="Badge"
            links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Badge' }]}
            moreLink="https://mui.com/components/badges"
          />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Block
              title="Basic"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& > *': { mx: 1 } }}
            >
              <Badge badgeContent={4}>
                <MailIcon />
              </Badge>
              <Badge badgeContent={4} color="primary">
                <MailIcon />
              </Badge>
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
              <Badge badgeContent={4} color="info">
                <MailIcon />
              </Badge>
              <Badge badgeContent={4} color="success">
                <MailIcon />
              </Badge>
              <Badge badgeContent={4} color="warning">
                <MailIcon />
              </Badge>
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block
              title="Maximum value"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& > *': { mx: 1 } }}
            >
              <Badge badgeContent={99} color="error" children={<MailIcon />} />
              <Badge badgeContent={100} color="error" children={<MailIcon />} />
              <Badge badgeContent={1000} max={999} color="error" children={<MailIcon />} />
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block
              title="Dot badge"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& > *': { mx: 1 } }}
            >
              <Badge color="info" variant="dot">
                <MailIcon />
              </Badge>
              <Badge color="info" variant="dot">
                <Typography>Typography</Typography>
              </Badge>
            </Block>
          </Grid>

          <Grid item xs={12} md={6}>
            <Block
              title="Badge overlap"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& > *': { mx: 1 } }}
            >
              <Badge color="info" badgeContent=" ">
                <Box sx={{ width: 40, height: 40, bgcolor: 'warning.main' }} />
              </Badge>
              <Badge color="info" badgeContent=" " variant="dot">
                <Box sx={{ width: 40, height: 40, bgcolor: 'warning.main' }} />
              </Badge>
              <Badge color="info" overlap="circular" badgeContent=" ">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'warning.main'
                  }}
                />
              </Badge>
              <Badge color="info" overlap="circular" badgeContent=" " variant="dot">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'warning.main'
                  }}
                />
              </Badge>
            </Block>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
