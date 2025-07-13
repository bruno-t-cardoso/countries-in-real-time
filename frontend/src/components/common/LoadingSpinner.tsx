import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40,
  fullHeight = true 
}) => {
  return (
    <Fade in timeout={300}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight={fullHeight ? '400px' : 'auto'}
        gap={2}
        py={fullHeight ? 0 : 4}
      >
        <CircularProgress 
          size={size} 
          sx={{
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {message && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              opacity: 0.8,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default LoadingSpinner;