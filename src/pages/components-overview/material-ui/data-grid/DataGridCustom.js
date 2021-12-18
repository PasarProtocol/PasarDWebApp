import PropTypes from 'prop-types';
import { sample } from 'lodash';
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
// material
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Rating, Pagination, LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar, useGridSlotComponentProps, getGridNumericColumnOperators } from '@mui/x-data-grid';
// utils
import createAvatar from '../../../../utils/createAvatar';
import { fPercent } from '../../../../utils/formatNumber';
import mockData from '../../../../utils/mock-data';
// components
import Label from '../../../../components/Label';
import { MIconButton, MAvatar } from '../../../../components/@material-extend';

// ----------------------------------------------------------------------

function RenderStatus(getStatus) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'ghost' : 'filled'}
      color={(getStatus === 'busy' && 'error') || (getStatus === 'away' && 'warning') || 'success'}
      sx={{ textTransform: 'capitalize', mx: 'auto' }}
    >
      {getStatus}
    </Label>
  );
}

const columns = [
  // OPTIONS
  // https://material-ui.com/api/data-grid/grid-col-def/#main-content
  // - hide: false (default)
  // - editable: false (default)
  // - filterable: true (default)
  // - sortable: true (default)
  // - disableColumnMenu: false (default)

  // FIELD TYPES
  // --------------------
  // 'string' (default)
  // 'number'
  // 'date'
  // 'dateTime'
  // 'boolean'
  // 'singleSelect'

  {
    field: 'id',
    hide: true
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    width: 64,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    renderCell: (params) => {
      const getAvatar = params.getValue(params.id, 'name');
      return (
        <MAvatar color={createAvatar(getAvatar).color} sx={{ width: 36, height: 36 }}>
          {createAvatar(getAvatar).name}
        </MAvatar>
      );
    }
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    renderCell: (params) => {
      const getEmail = params.getValue(params.id, 'email');
      return (
        <Typography variant="body2" sx={{ textDecoration: 'underline' }} noWrap>
          {getEmail}
        </Typography>
      );
    }
  },
  {
    field: 'lastLogin',
    type: 'dateTime',
    headerName: 'Last login',
    width: 200,
    align: 'right',
    headerAlign: 'right'
  },
  {
    field: 'rating',
    type: 'number',
    headerName: 'Rating',
    width: 160,
    disableColumnMenu: true,
    renderCell: (params) => {
      const getRating = params.getValue(params.id, 'rating');
      return <Rating size="small" value={getRating} precision={0.5} readOnly />;
    }
  },
  {
    field: 'status',
    type: 'singleSelect',
    headerName: 'Status',
    width: 120,
    valueOptions: ['online', 'away', 'busy'],
    renderCell: (params) => {
      const getStatus = params.getValue(params.id, 'status');
      return RenderStatus(getStatus);
    }
  },
  {
    field: 'isAdmin',
    type: 'boolean',
    width: 120,
    renderCell: (params) => {
      const getAdmin = params.getValue(params.id, 'isAdmin');
      return (
        <Stack alignItems="center" sx={{ width: 1, textAlign: 'center' }}>
          {getAdmin ? (
            <Box component={Icon} icon={checkmarkCircle2Fill} sx={{ width: 20, height: 20, color: 'primary.main' }} />
          ) : (
            '-'
          )}
        </Stack>
      );
    }
  },
  {
    field: 'performance',
    type: 'number',
    headerName: 'Performance',
    width: 160,
    renderCell: (params) => {
      const value = params.getValue(params.id, 'performance');
      return (
        <Stack direction="row" alignItems="center" sx={{ px: 2, width: 1, height: 1 }}>
          <LinearProgress
            value={value}
            variant="determinate"
            color={(value < 30 && 'error') || (value > 30 && value < 70 && 'warning') || 'primary'}
            sx={{ width: 1, height: 6 }}
          />
          <Typography variant="caption" sx={{ width: 90 }}>
            {fPercent(value)}
          </Typography>
        </Stack>
      );
    }
  },
  {
    field: 'action',
    headerName: ' ',
    width: 80,
    align: 'right',
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const selectedID = params.row.id;

      const handleClick = () => {
        console.log('selectedID', selectedID);
      };

      return (
        <MIconButton onClick={handleClick}>
          <Box component={Icon} icon={moreVerticalFill} sx={{ width: 20, height: 20 }} />
        </MIconButton>
      );
    }
  }
];

const rows = [...Array(36)].map((_, index) => ({
  id: mockData.id(index),
  name: mockData.name.fullName(index),
  email: mockData.email(index),
  lastLogin: mockData.time(index),
  performance: mockData.number.percent(index),
  rating: mockData.number.rating(index),
  status: sample(['online', 'away', 'busy']),
  isAdmin: mockData.boolean(index)
}));

// ----------------------------------------------------------------------

function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

RatingInputValue.propTypes = {
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any
  }).isRequired
};

function RatingInputValue({ item, applyValue }) {
  return (
    <Box sx={{ p: 1, height: 1, alignItems: 'flex-end', display: 'flex' }}>
      <Rating
        size="small"
        precision={0.5}
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={(event, newValue) => {
          applyValue({ ...item, value: newValue });
        }}
      />
    </Box>
  );
}

export default function DataGridCustom() {
  if (columns.length > 0) {
    const ratingColumn = columns.find((column) => column.field === 'rating');
    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericColumnOperators().map((operator) => ({
      ...operator,
      InputComponent: RatingInputValue
    }));

    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators
    };
  }

  return (
    <DataGrid
      checkboxSelection
      disableSelectionOnClick
      rows={rows}
      columns={columns}
      pagination
      pageSize={10}
      components={{
        Toolbar: GridToolbar,
        Pagination: CustomPagination
      }}
    />
  );
}
