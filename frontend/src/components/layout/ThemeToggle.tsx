import React from 'react';
import {
  IconButton,
  Tooltip,
  useTheme as useMUITheme,
  Zoom,
  Box,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMUITheme();

  return (
    <Tooltip 
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      TransitionComponent={Zoom}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'inherit',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.05)',
            boxShadow: muiTheme.shadows[4],
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: 24,
            height: 24,
          }}
        >
          <LightModeIcon
            sx={{
              position: 'absolute',
              fontSize: 20,
              opacity: mode === 'light' ? 1 : 0,
              transform: mode === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0.8)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <DarkModeIcon
            sx={{
              position: 'absolute',
              fontSize: 20,
              opacity: mode === 'dark' ? 1 : 0,
              transform: mode === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.8)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;