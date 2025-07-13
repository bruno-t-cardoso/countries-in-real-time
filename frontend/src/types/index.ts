// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  limit?: number;
  error?: string;
}

// Country Data Types
export interface Country {
  rank: string;
  name: string;
  population: string;
  yearlyChange: string;
  netChange: string;
  density: string;
  landArea: string;
  migrants: string;
  fertilityRate: string;
  medianAge: string;
  urbanPop: string;
  worldShare: string;
}

// Region Data Types
export interface Region {
  name: string;
  countryCount: number;
  totalPopulation: string;
  worldShare: string;
}

// World Statistics Types
export interface WorldStats {
  totalCountries: number;
  totalPopulation: string;
  averagePopulation: string;
  averageDensity: number;
  averageMedianAge: number;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

// Filter and Sort Types
export interface FilterOptions {
  searchTerm: string;
  sortBy: 'name' | 'population' | 'density' | 'area';
  sortOrder: 'asc' | 'desc';
  region?: string;
}

// Loading States
export interface LoadingState {
  countries: boolean;
  regions: boolean;
  worldStats: boolean;
}

// Error Types
export interface ErrorState {
  countries: string | null;
  regions: string | null;
  worldStats: string | null;
}

// Pagination Types
export interface PaginationState {
  page: number;
  rowsPerPage: number;
  total: number;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

// Navigation Types
export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType;
}