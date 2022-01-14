import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Box, Stack, Select, MenuItem, Grid, Typography, TextField } from '@mui/material';

const MenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left"
  },
  variant: "menu"
};

const TypographyStyle = styled(Typography)(({ theme }) => ({
  height: 36,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '15px',
  paddingBottom: '10px'
}));

export default function MintBatchName(props) {
  const {handleNameGroup, uploadedCount} = props
  const [padNum, setPadNum] = useState(1);
  const [nameResult, setNameResult] = useState("");
  const [namePrefix, setNamePrefix] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  
  React.useEffect(async () => {
    const fnum = fromNumber!==""?parseInt(fromNumber, 10):0
    const nameArr = [...Array(uploadedCount)].map((el, id)=>`${namePrefix}${(fnum+id).toString().padStart(padNum, "0")}`)
    handleNameGroup([...nameArr])
    if(nameArr.length>3){
      nameArr.splice(2, nameArr.length-3, "...")
    }
    setNameResult(nameArr.join(", "))
  }, [namePrefix, padNum, fromNumber, uploadedCount]);

  return (
    <>
      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={6}>
          <Stack direction="row">
            <Box sx={{flex: 1}}>
              <TypographyStyle variant="caption">Fixed Name Variable</TypographyStyle>
              <TextField label="Example: Pasar #" size="small" fullWidth onChange={(e)=>{setNamePrefix(e.target.value)}}/>
            </Box>
            <Box>
              <TypographyStyle variant="caption">“0” Padding</TypographyStyle>
              <Select
                defaultValue={0}
                value={padNum}
                onChange={(e)=>{setPadNum(e.target.value)}}
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
                sx={{ml: 1}}
                MenuProps={MenuProps}
              >
                <MenuItem value={1}>No “0” padding</MenuItem>
                <MenuItem value={2}>00 padding</MenuItem>
                <MenuItem value={3}>000 padding</MenuItem>
                <MenuItem value={4}>0000 padding</MenuItem>
                <MenuItem value={5}>00000 padding</MenuItem>
              </Select>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TypographyStyle variant="caption">From (Number)<br/>Leave blank if not needed</TypographyStyle>
          <TextField type="number" label="Example: 1" size="small" fullWidth onChange={(e)=>{setFromNumber(e.target.value)}}/>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TypographyStyle variant="caption">Total Uploaded Items</TypographyStyle>
          <TextField type="number" size="small" fullWidth disabled value={uploadedCount}/>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{fontWeight: 'normal', color: 'origin.main', pt: 1}}>Result: {nameResult}</Typography>
    </>
  );
}