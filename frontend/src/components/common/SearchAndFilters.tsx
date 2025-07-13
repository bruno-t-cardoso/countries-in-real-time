import React, { memo, useCallback } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Chip,
  InputAdornment,
  useTheme,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { FilterOptions } from '../../types';
import { useDebounce } from '../../hooks';

interface SearchAndFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  onExport?: () => void;
  onReset: () => void;
  showExport?: boolean;
  totalCount?: number;
  filteredCount?: number;
}

const regionOptions = [
  { value: '', label: 'All Regions' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Oceania', label: 'Oceania' },
];

const sortOptions = [
  { value: 'name', label: 'Country Name' },
  { value: 'population', label: 'Population' },
  { value: 'density', label: 'Density' },
  { value: 'area', label: 'Land Area' },
];

const SearchAndFilters: React.FC<SearchAndFiltersProps> = memo(({
  filters,
  onFiltersChange,
  onExport,
  onReset,
  showExport = true,
  totalCount,
  filteredCount,
}) => {
  const theme = useTheme();
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Update filters when debounced search term changes
  React.useEffect(() => {
    if (debouncedSearchTerm !== filters.searchTerm) {
      onFiltersChange({ searchTerm: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, filters.searchTerm, onFiltersChange]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchTerm: event.target.value });
  }, [onFiltersChange]);

  const handleSortByChange = useCallback((sortBy: FilterOptions['sortBy']) => {
    onFiltersChange({ sortBy });
  }, [onFiltersChange]);

  const handleSortOrderToggle = useCallback(() => {
    onFiltersChange({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  }, [filters.sortOrder, onFiltersChange]);

  const handleRegionChange = useCallback((event: any) => {
    const value = event.target.value;
    onFiltersChange({ region: value || undefined });
  }, [onFiltersChange]);

  const clearSearch = useCallback(() => {
    onFiltersChange({ searchTerm: '' });
  }, [onFiltersChange]);

  const hasActiveFilters = filters.searchTerm || filters.region;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3, 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        background: theme.palette.background.paper,
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Search Row */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Search countries..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            sx={{ 
              minWidth: 300,
              flex: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Region Filter */}
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Region</InputLabel>
            <Select
              value={filters.region || ''}
              label="Region"
              onChange={handleRegionChange}
              sx={{
                backgroundColor: theme.palette.background.default,
              }}
            >
              {regionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Actions */}
          <Box display="flex" gap={1}>
            {hasActiveFilters && (
              <Tooltip title="Reset all filters">
                <Button
                  variant="outlined"
                  onClick={onReset}
                  startIcon={<ClearIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Reset
                </Button>
              </Tooltip>
            )}

            {showExport && onExport && (
              <Tooltip title="Export data">
                <Button
                  variant="contained"
                  onClick={onExport}
                  startIcon={<ExportIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Export
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Sort Row */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <SortIcon color="action" fontSize="small" />
            <Box>Sort by:</Box>
          </Box>

          <ButtonGroup variant="outlined" size="small">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleSortByChange(option.value as FilterOptions['sortBy'])}
                variant={filters.sortBy === option.value ? 'contained' : 'outlined'}
                sx={{ textTransform: 'none' }}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>

          <Button
            variant="outlined"
            size="small"
            onClick={handleSortOrderToggle}
            sx={{ textTransform: 'none' }}
          >
            {filters.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </Button>

          {/* Results Count */}
          <Box sx={{ ml: 'auto' }}>
            {totalCount !== undefined && filteredCount !== undefined && (
              <Chip
                icon={<FilterIcon />}
                label={
                  filteredCount === totalCount
                    ? `${totalCount} countries`
                    : `${filteredCount} of ${totalCount} countries`
                }
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
        </Box>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Box fontSize="0.875rem" color="text.secondary">
              Active filters:
            </Box>
            {filters.searchTerm && (
              <Chip
                label={`Search: "${filters.searchTerm}"`}
                onDelete={() => onFiltersChange({ searchTerm: '' })}
                size="small"
                variant="outlined"
              />
            )}
            {filters.region && (
              <Chip
                label={`Region: ${filters.region}`}
                onDelete={() => onFiltersChange({ region: undefined })}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
});

SearchAndFilters.displayName = 'SearchAndFilters';

export default SearchAndFilters;