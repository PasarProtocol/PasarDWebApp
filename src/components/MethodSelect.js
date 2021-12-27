import React, { useState } from "react";
import { Checkbox, ListItemIcon, ListItemText, MenuItem, FormControl, Select } from '@mui/material';

const options = [
    "Burn",
    "BuyOrder",
    "CancelOrder",
    "ChangeOrderPrice",
    "CreateOrderForSale",
    "Mint",
    "SafeTransferFrom",
    "SafeTransferFromWithMemo",
    "SetApprovalForAll"
];
const MenuProps = {
    anchorOrigin: {
      vertical: "bottom",
    },
    transformOrigin: {
      vertical: "top",
    },
    variant: "menu"
};
export default function MethodSelect() {
  const [selected, setSelected] = useState([]);
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  const handleChange = (event) => {
    const value = [...event.target.value];
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
  };

  return (
    <FormControl sx={{ml: (theme)=>theme.spacing(1)}}>
      <Select
        labelId="mutiple-select-label"
        multiple
        value={selected}
        onChange={handleChange}
        displayEmpty={1&&true}
        renderValue={(selected) => "method"}
        size="small"
        MenuProps={MenuProps}
      >
        <MenuItem
          value="all"
        >
          <ListItemIcon>
            <Checkbox
              checked={isAllSelected}
              indeterminate={
                selected.length > 0 && selected.length < options.length
              }
              sx={{py:0}}
            />
          </ListItemIcon>
          <ListItemText
            primary="Select All"
          />
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option) > -1} sx={{py:0}} />
            </ListItemIcon>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}