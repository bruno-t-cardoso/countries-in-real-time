import { createTheme, ThemeOptions } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { getComponents } from './components';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
    };
  }

  interface PaletteOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
    };
  }

  interface TypeBackground {
    secondary: string;
  }
}

const createCustomTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  
  const baseTheme = createTheme({
    palette: {
      mode,
      ...palette,
      gradient: {
        primary: mode === 'light' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: mode === 'light'
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
    },
    typography,
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
  } as ThemeOptions);

  return createTheme({
    ...baseTheme,
    components: getComponents(baseTheme),
  });
};

export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

export type CustomTheme = typeof lightTheme;