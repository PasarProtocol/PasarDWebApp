// ----------------------------------------------------------------------

export default function ToggleButton(theme) {
  return {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[500],
          border: `solid 1px ${theme.palette.grey[500_32]}`,
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected
          },
          '&.Mui-disabled': {
            color: theme.palette.grey[500_48]
          }
        }
      }
    }
  };
}
