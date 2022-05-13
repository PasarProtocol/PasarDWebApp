import React, { useRef } from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import { Link as RouterLink, useParams } from 'react-router-dom';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Typography, Link, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Icon } from '@iconify/react';
import checkCircleFillIcon from '@iconify-icons/akar-icons/circle-check-fill';
import checkCircleOutlineIcon from '@iconify-icons/akar-icons/circle-check';
import crossCircleFillIcon from '@iconify-icons/akar-icons/circle-x-fill';
import crossCircleOutlineIcon from '@iconify-icons/akar-icons/circle-x';
//
import DIABadge from '../DIABadge';
import { CarouselControlsPaging2 } from './controls';
import { getTime, reduceHexAddress } from '../../utils/common';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
  }
}));

const CheckIcon = ({isSupported, selected=false})=>{
  if (typeof isSupported === 'string') {
    return <Typography variant='body2' align="center" sx={{px: 2}} color={selected?'origin.main':'text.primary'}>{isSupported}</Typography>
  }
  if(isSupported)
   return <Box sx={{color: 'origin.main', textAlign: 'center'}}><Icon icon={selected?checkCircleFillIcon:checkCircleOutlineIcon} width={24}/></Box>
  return <Box sx={{color: 'text.secondary', textAlign: 'center'}}><Icon icon={selected?crossCircleFillIcon:crossCircleOutlineIcon} width={24}/></Box>
}

// ----------------------------------------------------------------------
const DiaBadgeTypes = [
  {name: 'BASIC', range: 'Hold 0 DIA (no badge) or less than 0.01 DIA'},
  {name: 'BRONZE', range: 'Hold more than 0.01 DIA but less than 0.1 DIA'},
  {name: 'SILVER', range: 'Hold more than 0.1 DIA but less than 1 DIA'},
  {name: 'GOLD', range: 'Hold more than 1 DIA'}
]

CarouselItem.propTypes = {
  page: PropTypes.array
};

function CarouselItem({ index, headerRef, body }) {
  const {name, range} = DiaBadgeTypes[index]
  return (
    <Stack sx={{overflow: 'hidden'}}>
      <Box sx={{width: '100%', border: '1px solid grey', p: 1}} ref={headerRef[index]}>
        <Stack sx={{alignItems: 'center', mt: 1}} spacing={2}>
          <DIABadge degree={index} disableTooltip={Boolean(true)} zoomRate={1.4}/>
          <Typography variant="h3" align="center">{name}</Typography>
          <Typography variant="body2" align="center">{range}</Typography>
        </Stack>
      </Box>
      <Table border={1} style={{marginLeft: '-170px', width: 'inherit'}}>
        <TableBody>
          {body}
        </TableBody>
      </Table>
    </Stack>
  )
}

export default function CarouselFeatures(props) {
  const { featureArray } = props
  const theme = useTheme();
  const carouselRef = useRef();
  const caseRef = useRef();
  const bottomTitleRef = useRef();
  const headerRef = [useRef(), useRef(), useRef(), useRef()]
  const bottomRef = [useRef(), useRef(), useRef(), useRef()]

  const settings = {
    dots: true,
    arrows: false,
    autoplay: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        }
      }
    ],
    ...CarouselControlsPaging2({
      sx: { mt: 3 }
    })
  };
  
  const matchCasebarGap = ()=>{
    if(!caseRef.current)
      return
    headerRef.forEach((item)=>{
      item.current.style.height = 'initial'
    })
    const maxHeaderCellHeight = Math.max(...(headerRef.map((item)=>item.current.clientHeight)))
    caseRef.current.style.top = `${maxHeaderCellHeight+1}px`
    headerRef.forEach((item)=>{
      item.current.style.height = `${maxHeaderCellHeight+1}px`
    })
    console.log(maxHeaderCellHeight, headerRef, headerRef.map((item)=>item.current.clientHeight))
  }

  const matchBottomHeight = ()=>{
    if(!bottomTitleRef.current)
      return
    bottomRef.forEach((item)=>{
      item.current.style.height = 'initial'
    })
    const maxBottomCellHeight = Math.max(...(bottomRef.map((item)=>item.current.clientHeight)))
    bottomTitleRef.current.style.height = `${maxBottomCellHeight+1}px`
    bottomRef.forEach((item)=>{
      item.current.style.height = `${maxBottomCellHeight+1}px`
    })
    console.log(maxBottomCellHeight, bottomRef, bottomRef.map((item)=>item.current.clientHeight))
  }
  React.useEffect(()=>{
    matchCasebarGap()
    matchBottomHeight()
  }, [])
  window.addEventListener('resize', ()=>{
    matchCasebarGap()
    matchBottomHeight()
  })

  const titleWidth = 170
  const bodyTRs = featureArray.reduce((trs, feature, _i)=>{
    const isLastItem = _i===(featureArray.length-1)
    trs.caseBar.push(
      <TableRow key={_i}>
        <TableCell ref={isLastItem?bottomTitleRef:null}>{feature.title}</TableCell>
      </TableRow>
    )
    trs.content0.push(
      <TableRow key={_i}>
        <TableCell sx={{opacity: 0, width: titleWidth, px: 3}}>{feature.title}</TableCell>
        <TableCell ref={isLastItem?bottomRef[0]:null}>
          <CheckIcon isSupported={feature.allow[0]}/>
        </TableCell>
      </TableRow>
    )
    trs.content1.push(
      <TableRow key={_i}>
        <TableCell sx={{opacity: 0, width: titleWidth, px: 3}}>{feature.title}</TableCell>
        <TableCell ref={isLastItem?bottomRef[1]:null}>
          <CheckIcon isSupported={feature.allow[1]}/>
        </TableCell>
      </TableRow>
    )
    trs.content2.push(
      <TableRow key={_i}>
        <TableCell sx={{opacity: 0, width: titleWidth, px: 3}}>{feature.title}</TableCell>
        <TableCell ref={isLastItem?bottomRef[2]:null}>
          <CheckIcon isSupported={feature.allow[2]}/>
        </TableCell>
      </TableRow>
    )
    trs.content3.push(
      <TableRow key={_i}>
        <TableCell sx={{opacity: 0, width: titleWidth, px: 3}}>{feature.title}</TableCell>
        <TableCell ref={isLastItem?bottomRef[3]:null}>
          <CheckIcon isSupported={feature.allow[3]}/>
        </TableCell>
      </TableRow>
    )
    return trs
  }, {caseBar: [], content0: [], content1: [], content2: [], content3: []})
  
  return (
    <RootStyle>
        <Table ref={caseRef} border={1} style={{width: 170, position: 'absolute'}}>
          <TableBody>
            {bodyTRs.caseBar}
          </TableBody>
        </Table>
        <Box sx={{pl: '170px'}}>
          <Slider ref={carouselRef} {...settings}>
            {Array(4).fill(0).map((_, _i) => (
              <CarouselItem key={_i} index={_i} headerRef={headerRef} body={bodyTRs[`content${_i}`]}/>
            ))}
          </Slider>
        </Box>
    </RootStyle>
  );
}