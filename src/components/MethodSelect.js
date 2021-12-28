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
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    variant: "menu"
};
export default function MethodSelect({onChange}) {
  const [selected, setSelected] = useState([]);
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  const handleChange = (event) => {
    const value = [...event.target.value];
    if (value[value.length - 1] === "all") {
      const selectedOptions = selected.length === options.length ? [] : options;
      setSelected(selectedOptions);
      onChange(selectedOptions.join(','));
      return;
    }
    setSelected(value);
    onChange(value.join(','));
  };

  return (
    <FormControl>
      <Select
        labelId="mutiple-select-label"
        multiple
        value={selected}
        onChange={handleChange}
        displayEmpty={1&&true}
        renderValue={(selected) => "Method"}
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