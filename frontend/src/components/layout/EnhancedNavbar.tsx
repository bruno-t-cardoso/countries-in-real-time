import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Public as PublicIcon,
  Dashboard as DashboardIcon,
  Public as CountriesIcon,
  Map as RegionsIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const EnhancedNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon },
    { path: '/countries', label: 'Countries', icon: CountriesIcon },
    { path: '/regions', label: 'Regions', icon: RegionsIcon },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
          {/* Logo and Title */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                background: theme.palette.gradient?.primary,
                borderRadius: '50%',
                p: 1,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PublicIcon 
                sx={{ 
                  color: 'white',
                  fontSize: { xs: 20, sm: 24 }
                }} 
              />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  background: theme.palette.gradient?.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Countries Live
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Real-time population data
              </Typography>
            </Box>
          </Box>

          {/* Beta Badge */}
          <Chip
            label="BETA"
            size="small"
            sx={{
              ml: 2,
              background: theme.palette.gradient?.secondary,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              display: { xs: 'none', md: 'inline-flex' }
            }}
          />

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                onClick={() => navigate(path)}
                startIcon={<Icon fontSize="small" />}
                sx={{
                  color: 'text.primary',
                  backgroundColor: isActive(path) 
                    ? 'rgba(37, 99, 235, 0.1)' 
                    : 'transparent',
                  border: isActive(path) 
                    ? `1px solid ${theme.palette.primary.main}`
                    : '1px solid transparent',
                  borderRadius: 2,
                  px: 2,
                  py: 0.75,
                  fontWeight: isActive(path) ? 600 : 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive(path)
                      ? 'rgba(37, 99, 235, 0.15)'
                      : 'rgba(37, 99, 235, 0.05)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5 }}>
            {navItems.map(({ path, icon: Icon }) => (
              <IconButton
                key={path}
                onClick={() => navigate(path)}
                sx={{
                  color: isActive(path) ? 'primary.main' : 'text.primary',
                  backgroundColor: isActive(path) 
                    ? 'rgba(37, 99, 235, 0.1)' 
                    : 'transparent',
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>

          {/* Actions */}
          <Box display="flex" alignItems="center" gap={1} ml={2}>
            <Tooltip title="View on GitHub">
              <IconButton
                component="a"
                href="https://github.com/bruno-t-cardoso/countries-in-real-time"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : 'text.secondary',
                  '&:hover': {
                    color: theme.palette.mode === 'dark' ? '#374151' : 'text.primary',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(156, 163, 175, 0.2)' 
                      : 'rgba(0, 0, 0, 0.04)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default EnhancedNavbar;