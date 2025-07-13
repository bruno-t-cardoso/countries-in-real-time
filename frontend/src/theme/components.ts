import { Components, Theme } from '@mui/material/styles';

export const getComponents = (theme: Theme): Components => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[100]}`,
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: 4,
          backgroundColor: theme.palette.grey[400],
          minHeight: 24,
          border: `2px solid ${theme.palette.background.paper}`,
        },
        '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.grey[100],
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: theme.palette.mode === 'light' 
          ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
          : '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            : '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 4px 8px 0 rgb(0 0 0 / 0.12)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${theme.palette.divider}`,
      },
      elevation1: {
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      elevation2: {
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        border: 'none',
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(15, 23, 42, 0.8)',
        color: theme.palette.text.primary,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.mode === 'light' 
          ? theme.palette.grey[50]
          : theme.palette.grey[800],
        '& .MuiTableCell-head': {
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : theme.palette.grey[800],
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        border: `1px solid`,
      },
    },
  },
});