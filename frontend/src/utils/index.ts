// Number formatting utilities
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en', { 
    notation: 'compact',
    maximumFractionDigits: 1 
  }).format(num);
};

// String utilities
export const parseNumber = (str: string): number => {
  return parseInt(str.replace(/,/g, '')) || 0;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Sort utilities
export const sortCountries = (
  countries: any[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
) => {
  return [...countries].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'population':
        aValue = parseNumber(a.population);
        bValue = parseNumber(b.population);
        break;
      case 'density':
        aValue = parseNumber(a.density);
        bValue = parseNumber(b.density);
        break;
      case 'area':
        aValue = parseNumber(a.landArea);
        bValue = parseNumber(b.landArea);
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
};

// Filter utilities
export const filterCountries = (countries: any[], searchTerm: string) => {
  if (!searchTerm) return countries;
  
  const term = searchTerm.toLowerCase();
  return countries.filter(country =>
    country.name.toLowerCase().includes(term)
  );
};

// Chart color utilities
export const getChartColors = (count: number): string[] => {
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6366f1', // Indigo
  ];

  // Repeat colors if needed
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// Date utilities
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// Export utilities
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};