import { useState } from 'react';
// material
import CheckIcon from '@mui/icons-material/Check';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
//
import { Block } from '../../Block';

// ----------------------------------------------------------------------

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { m: '8px !important' }
};

export default function ToggleButtons() {
  const [alignment, setAlignment] = useState('left');
  const [formats, setFormats] = useState(() => ['bold', 'italic']);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(false);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };
  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Block title="Exclusive selection" sx={style}>
          <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment}>
            <ToggleButton value="left">
              <FormatAlignLeftIcon />
            </ToggleButton>
            <ToggleButton value="center">
              <FormatAlignCenterIcon />
            </ToggleButton>
            <ToggleButton value="right">
              <FormatAlignRightIcon />
            </ToggleButton>
            <ToggleButton value="justify" disabled>
              <FormatAlignJustifyIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Multiple selection" sx={style}>
          <ToggleButtonGroup value={formats} onChange={handleFormat}>
            <ToggleButton value="bold">
              <FormatBoldIcon />
            </ToggleButton>
            <ToggleButton value="italic">
              <FormatItalicIcon />
            </ToggleButton>
            <ToggleButton value="underlined">
              <FormatUnderlinedIcon />
            </ToggleButton>
            <ToggleButton value="color" disabled>
              <FormatColorFillIcon />
              <ArrowDropDownIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Exclusive selection" sx={style}>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <ToggleButtonGroup size="small" value={alignment} exclusive onChange={handleAlignment}>
                <ToggleButton value="left">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRightIcon />
                </ToggleButton>
                <ToggleButton value="justify" disabled>
                  <FormatAlignJustifyIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item>
              <ToggleButtonGroup size="medium" value={alignment} exclusive onChange={handleAlignment}>
                <ToggleButton value="left">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRightIcon />
                </ToggleButton>
                <ToggleButton value="justify" disabled>
                  <FormatAlignJustifyIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item>
              <ToggleButtonGroup size="large" value={alignment} exclusive onChange={handleAlignment}>
                <ToggleButton value="left">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRightIcon />
                </ToggleButton>
                <ToggleButton value="justify" disabled>
                  <FormatAlignJustifyIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Vertical & Standalone buttons" sx={style}>
          <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={handleChange}>
            <ToggleButton value="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButton
            value="check"
            selected={selected}
            onChange={() => {
              setSelected(!selected);
            }}
          >
            <CheckIcon />
          </ToggleButton>
        </Block>
      </Grid>
    </Grid>
  );
}
