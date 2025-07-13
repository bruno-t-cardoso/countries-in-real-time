import React, { memo, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Circle as CircleIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { formatTimeAgo } from '../../utils';

interface LiveDataIndicatorProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const LiveDataIndicator: React.FC<LiveDataIndicatorProps> = memo(({
  lastUpdated,
  isLoading,
  onRefresh,
  autoRefresh = true,
  refreshInterval = 30000,
}) => {
  const theme = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(0);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Countdown timer for next refresh
  useEffect(() => {
    if (!autoRefresh || !lastUpdated || isLoading) {
      setNextRefreshIn(0);
      return;
    }

    const interval = setInterval(() => {
      const timeSinceUpdate = Date.now() - lastUpdated.getTime();
      const timeUntilNext = Math.max(0, refreshInterval - timeSinceUpdate);
      setNextRefreshIn(Math.ceil(timeUntilNext / 1000));

      if (timeUntilNext <= 0) {
        setNextRefreshIn(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated, autoRefresh, refreshInterval, isLoading]);

  const getStatusColor = () => {
    if (!isOnline) return theme.palette.error.main;
    if (isLoading) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (isLoading) return 'Updating...';
    return 'Live';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOffIcon fontSize="small" />;
    if (isLoading) return <RefreshIcon fontSize="small" className="spinning" />;
    return <WifiIcon fontSize="small" />;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        '& .spinning': {
          animation: 'spin 1s linear infinite',
        },
        '@keyframes spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      {/* Status Indicator */}
      <Chip
        icon={getStatusIcon()}
        label={getStatusText()}
        size="small"
        sx={{
          backgroundColor: getStatusColor(),
          color: 'white',
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: 'white',
          },
        }}
      />

      {/* Last Updated */}
      {lastUpdated && (
        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Updated {formatTimeAgo(lastUpdated)}
          </Typography>
        </Box>
      )}

      {/* Next Refresh Countdown */}
      {autoRefresh && nextRefreshIn > 0 && !isLoading && isOnline && (
        <Fade in>
          <Typography variant="body2" color="text.secondary">
            Next update in {nextRefreshIn}s
          </Typography>
        </Fade>
      )}

      {/* Connection Status */}
      <Box display="flex" alignItems="center" gap={0.5}>
        <CircleIcon 
          sx={{ 
            fontSize: 8, 
            color: isOnline ? 'success.main' : 'error.main' 
          }} 
        />
        <Typography variant="caption" color="text.secondary">
          {isOnline ? 'Connected' : 'Disconnected'}
        </Typography>
      </Box>

      {/* Manual Refresh Button */}
      <Tooltip title="Refresh now">
        <IconButton
          size="small"
          onClick={onRefresh}
          disabled={isLoading || !isOnline}
          sx={{
            ml: 'auto',
            backgroundColor: 'action.hover',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
            },
          }}
        >
          <RefreshIcon 
            fontSize="small" 
            className={isLoading ? 'spinning' : ''}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
});

LiveDataIndicator.displayName = 'LiveDataIndicator';

export default LiveDataIndicator;