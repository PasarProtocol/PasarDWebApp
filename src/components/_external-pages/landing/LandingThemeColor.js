import { capitalCase } from 'change-case';
import { motion } from 'framer-motion';
// material
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  Radio,
  Tooltip,
  Container,
  Typography,
  RadioGroup,
  CardActionArea,
  FormControlLabel
} from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
//
import { MotionInView, varFadeInUp, varFadeInDown } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(15, 0),
  backgroundImage:
    theme.palette.mode === 'light'
      ? `linear-gradient(180deg, ${theme.palette.grey[300]} 0%, ${alpha(theme.palette.grey[300], 0)} 100%)`
      : 'none'
}));

// ----------------------------------------------------------------------

export default function LandingThemeColor() {
  const { themeColor, onChangeColor, colorOption } = useSettings();

  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center' }}>
        <MotionInView variants={varFadeInUp}>
          <Typography component="p" variant="overline" sx={{ mb: 2, color: 'text.disabled', display: 'block' }}>
            choose your style
          </Typography>
        </MotionInView>

        <MotionInView variants={varFadeInUp}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Theme color
          </Typography>
        </MotionInView>

        <MotionInView variants={varFadeInUp}>
          <Typography
            sx={{
              color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'text.primary')
            }}
          >
            Express your own style with just one click.
          </Typography>
        </MotionInView>

        <RadioGroup name="themeColor" value={themeColor} onChange={onChangeColor} sx={{ my: 5 }}>
          <Stack
            direction={{ xs: 'row', lg: 'column' }}
            justifyContent="center"
            spacing={1}
            sx={{
              position: { lg: 'absolute' },
              right: { lg: 0 }
            }}
          >
            {colorOption.map((color) => {
              const colorName = color.name;
              const colorValue = color.value;
              const isSelected = themeColor === colorName;

              return (
                <Tooltip key={colorName} title={capitalCase(colorName)} placement="right">
                  <CardActionArea sx={{ color: colorValue, borderRadius: '50%', width: 32, height: 32 }}>
                    <Box
                      sx={{
                        width: 1,
                        height: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        ...(isSelected && {
                          borderStyle: 'solid',
                          borderWidth: 4,
                          borderColor: alpha(colorValue, 0.24)
                        })
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: colorValue,
                          ...(isSelected && {
                            width: 14,
                            height: 14,
                            transition: (theme) =>
                              theme.transitions.create('all', {
                                easing: theme.transitions.easing.easeInOut,
                                duration: theme.transitions.duration.shorter
                              })
                          })
                        }}
                      />
                      <FormControlLabel
                        label=""
                        value={colorName}
                        control={<Radio sx={{ display: 'none' }} />}
                        sx={{ top: 0, left: 0, margin: 0, width: 1, height: 1, position: 'absolute' }}
                      />
                    </Box>
                  </CardActionArea>
                </Tooltip>
              );
            })}
          </Stack>
        </RadioGroup>

        <Box sx={{ position: 'relative' }}>
          <Box component="img" src="/static/home/theme-color/grid.png" />

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFadeInUp}>
              <img alt="screen" src={`/static/home/theme-color/screen-${themeColor}.png`} />
            </MotionInView>
          </Box>

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFadeInDown}>
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}>
                <img alt="sidebar" src={`/static/home/theme-color/block1-${themeColor}.png`} />
              </motion.div>
            </MotionInView>
          </Box>

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFadeInDown}>
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity }}>
                <img alt="sidebar" src={`/static/home/theme-color/block2-${themeColor}.png`} />
              </motion.div>
            </MotionInView>
          </Box>

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFadeInDown}>
              <motion.div animate={{ y: [-25, 5, -25] }} transition={{ duration: 10, repeat: Infinity }}>
                <img alt="sidebar" src={`/static/home/theme-color/sidebar-${themeColor}.png`} />
              </motion.div>
            </MotionInView>
          </Box>
        </Box>
      </Container>
    </RootStyle>
  );
}
