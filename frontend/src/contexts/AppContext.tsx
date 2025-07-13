import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Country, Region, WorldStats, LoadingState, ErrorState, FilterOptions } from '../types';

// State interface
interface AppState {
  countries: Country[];
  regions: Region[];
  worldStats: WorldStats | null;
  loading: LoadingState;
  errors: ErrorState;
  filters: FilterOptions;
  lastUpdated: Date | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: { key: keyof LoadingState; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof ErrorState; value: string | null } }
  | { type: 'SET_COUNTRIES'; payload: Country[] }
  | { type: 'SET_REGIONS'; payload: Region[] }
  | { type: 'SET_WORLD_STATS'; payload: WorldStats }
  | { type: 'SET_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_LAST_UPDATED'; payload: Date };

// Initial state
const initialState: AppState = {
  countries: [],
  regions: [],
  worldStats: null,
  loading: {
    countries: false,
    regions: false,
    worldStats: false,
  },
  errors: {
    countries: null,
    regions: null,
    worldStats: null,
  },
  filters: {
    searchTerm: '',
    sortBy: 'population',
    sortOrder: 'desc',
    region: undefined,
  },
  lastUpdated: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_COUNTRIES':
      return {
        ...state,
        countries: action.payload,
        errors: {
          ...state.errors,
          countries: null,
        },
      };

    case 'SET_REGIONS':
      return {
        ...state,
        regions: action.payload,
        errors: {
          ...state.errors,
          regions: null,
        },
      };

    case 'SET_WORLD_STATS':
      return {
        ...state,
        worldStats: action.payload,
        errors: {
          ...state.errors,
          worldStats: null,
        },
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };

    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: action.payload,
      };

    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setLoading: (key: keyof LoadingState, value: boolean) => void;
    setError: (key: keyof ErrorState, value: string | null) => void;
    setCountries: (countries: Country[]) => void;
    setRegions: (regions: Region[]) => void;
    setWorldStats: (stats: WorldStats) => void;
    setFilters: (filters: Partial<FilterOptions>) => void;
    resetFilters: () => void;
    setLastUpdated: (date: Date) => void;
  };
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (key: keyof LoadingState, value: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: { key, value } }),

    setError: (key: keyof ErrorState, value: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: { key, value } }),

    setCountries: (countries: Country[]) =>
      dispatch({ type: 'SET_COUNTRIES', payload: countries }),

    setRegions: (regions: Region[]) =>
      dispatch({ type: 'SET_REGIONS', payload: regions }),

    setWorldStats: (stats: WorldStats) =>
      dispatch({ type: 'SET_WORLD_STATS', payload: stats }),

    setFilters: (filters: Partial<FilterOptions>) =>
      dispatch({ type: 'SET_FILTERS', payload: filters }),

    resetFilters: () =>
      dispatch({ type: 'RESET_FILTERS' }),

    setLastUpdated: (date: Date) =>
      dispatch({ type: 'SET_LAST_UPDATED', payload: date }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};