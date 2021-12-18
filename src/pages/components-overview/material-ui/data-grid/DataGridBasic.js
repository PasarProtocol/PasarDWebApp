import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
// utils
import mockData from '../../../../utils/mock-data';
// components
import { MIconButton } from '../../../../components/@material-extend';

// ----------------------------------------------------------------------

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 120
  },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 160,
    editable: true
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 160,
    editable: true
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 120,
    editable: true,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    flex: 1,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''}`
  },
  {
    field: 'action',
    headerName: ' ',
    width: 80,
    align: 'right',
    sortable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <MIconButton>
        <Box component={Icon} icon={moreVerticalFill} sx={{ width: 20, height: 20 }} />
      </MIconButton>
    )
  }
];

const rows = [...Array(30)].map((_, index) => ({
  id: mockData.id(index),
  lastName: mockData.name.lastName(index),
  firstName: mockData.name.firstName(index),
  age: mockData.number.age(index)
}));

export default function DataGridBasic() {
  return <DataGrid columns={columns} rows={rows} checkboxSelection disableSelectionOnClick />;
}
