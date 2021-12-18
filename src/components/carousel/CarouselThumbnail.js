import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
// material
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// utils
import mockData from '../../utils/mock-data';
//
import { CarouselControlsArrowsIndex } from './controls';

// ----------------------------------------------------------------------

const MOCK_CAROUSELS = [...Array(5)].map((_, index) => ({
  id: mockData.id(index),
  title: mockData.text.title(index),
  image: mockData.image.feed(index),
  description: mockData.text.description(index)
}));

const THUMB_SIZE = 64;

const RootStyle = styled('div')(({ theme }) => {
  const isRTL = theme.direction === 'rtl';

  return {
    root: {
      '& .slick-slide': {
        float: isRTL ? 'right' : 'left'
      }
    }
  };
});

const LargeImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const ThumbImgStyle = styled('img')(({ theme }) => ({
  opacity: 0.48,
  width: THUMB_SIZE,
  cursor: 'pointer',
  height: THUMB_SIZE,
  margin: theme.spacing(0, 1),
  borderRadius: theme.shape.borderRadiusSm,
  '&:hover': {
    opacity: 0.72,
    transition: theme.transitions.create('opacity')
  }
}));

// ----------------------------------------------------------------------

LargeItem.propTypes = {
  item: PropTypes.object
};

function LargeItem({ item }) {
  const { image, title } = item;

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: {
          xs: '100%',
          md: '50%'
        }
      }}
    >
      <LargeImgStyle alt={title} src={image} />
    </Box>
  );
}

ThumbnailItem.propTypes = {
  item: PropTypes.object
};

function ThumbnailItem({ item }) {
  const { image, title } = item;

  return <ThumbImgStyle alt={title} src={image} />;
}

export default function CarouselThumbnail() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  const settings1 = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    draggable: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (current, next) => setCurrentIndex(next)
  };

  const settings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: MOCK_CAROUSELS.length > 3 ? 3 : MOCK_CAROUSELS.length
  };

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  const handlePrevious = () => {
    slider2.current.slickPrev();
  };

  const handleNext = () => {
    slider2.current.slickNext();
  };

  return (
    <RootStyle>
      <Box
        sx={{
          zIndex: 0,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Slider {...settings1} asNavFor={nav2} ref={slider1}>
          {MOCK_CAROUSELS.map((item) => (
            <LargeItem key={item} item={item} />
          ))}
        </Slider>
        <CarouselControlsArrowsIndex
          index={currentIndex}
          total={MOCK_CAROUSELS.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </Box>

      <Box
        sx={{
          mt: 3,
          mx: 'auto',
          ...(MOCK_CAROUSELS.length === 1 && { maxWidth: THUMB_SIZE * 1 + 16 }),
          ...(MOCK_CAROUSELS.length === 2 && { maxWidth: THUMB_SIZE * 2 + 32 }),
          ...(MOCK_CAROUSELS.length === 3 && { maxWidth: THUMB_SIZE * 3 + 48 }),
          ...(MOCK_CAROUSELS.length === 4 && { maxWidth: THUMB_SIZE * 3 + 48 }),
          ...(MOCK_CAROUSELS.length === 5 && { maxWidth: THUMB_SIZE * 6 }),
          '& .slick-current img': {
            opacity: 1,
            border: (theme) => `solid 3px ${theme.palette.primary.main}`
          }
        }}
      >
        <Slider {...settings2} asNavFor={nav1} ref={slider2}>
          {MOCK_CAROUSELS.map((item) => (
            <ThumbnailItem key={item} item={item} />
          ))}
        </Slider>
      </Box>
    </RootStyle>
  );
}
