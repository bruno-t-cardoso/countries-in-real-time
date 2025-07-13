import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { Country } from '../../types';
import { parseNumber, formatCompactNumber } from '../../utils';

interface OptimizedTableProps {
  countries: Country[];
  loading?: boolean;
  onRowClick?: (country: Country) => void;
}

interface Column {
  id: keyof Country;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string | React.ReactNode;
  sortable?: boolean;
}

const OptimizedTable: React.FC<OptimizedTableProps> = memo(({
  countries,
  loading = false,
  onRowClick,
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState<keyof Country>('rank');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const columns: Column[] = useMemo(() => [
    {
      id: 'rank',
      label: 'Rank',
      minWidth: 60,
      align: 'center',
      sortable: true,
      format: (value: string) => (
        <Chip
          label={value}
          size="small"
          sx={{
            background: theme.palette.gradient?.primary,
            color: 'white',
            fontWeight: 600,
            minWidth: 40,
          }}
        />
      ),
    },
    {
      id: 'name',
      label: 'Country',
      minWidth: 150,
      sortable: true,
      format: (value: string) => (
        <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
          {value}
        </Box>
      ),
    },
    {
      id: 'population',
      label: 'Population',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value: string) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatCompactNumber(parseNumber(value))}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'yearlyChange',
      label: 'Yearly Change',
      minWidth: 100,
      align: 'center',
      sortable: true,
      format: (value: string) => {
        const numValue = parseFloat(value.replace('%', ''));
        const isPositive = numValue >= 0;
        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            {isPositive ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'density',
      label: 'Density',
      minWidth: 100,
      align: 'right',
      sortable: true,
      format: (value: string) => `${value}/km²`,
    },
    {
      id: 'landArea',
      label: 'Land Area',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value: string) => `${value} km²`,
    },
    {
      id: 'medianAge',
      label: 'Median Age',
      minWidth: 80,
      align: 'center',
      sortable: true,
      format: (value: string) => `${value} years`,
    },
    {
      id: 'worldShare',
      label: 'World Share',
      minWidth: 100,
      align: 'center',
      sortable: true,
      format: (value: string) => (
        <Chip
          label={value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ], [theme]);

  const sortedCountries = useMemo(() => {
    if (!countries.length) return [];

    return [...countries].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      // Handle numeric fields
      if (['rank', 'population', 'density', 'landArea'].includes(orderBy)) {
        aValue = parseNumber(aValue);
        bValue = parseNumber(bValue);
      }

      if (typeof aValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [countries, order, orderBy]);

  const paginatedCountries = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedCountries.slice(start, start + rowsPerPage);
  }, [sortedCountries, page, rowsPerPage]);

  const handleRequestSort = useCallback((property: keyof Country) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleRowClick = useCallback((country: Country) => {
    onRowClick?.(country);
  }, [onRowClick]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                      sx={{ fontWeight: 600 }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {column.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
              <TableCell align="center" style={{ minWidth: 80 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCountries.map((country) => (
              <TableRow
                hover
                key={country.name}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => handleRowClick(country)}
              >
                {columns.map((column) => {
                  const value = country[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  );
                })}
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(country);
                      }}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={sortedCountries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            paddingLeft: 2,
            paddingRight: 2,
          },
        }}
      />
    </Paper>
  );
});

OptimizedTable.displayName = 'OptimizedTable';

export default OptimizedTable;