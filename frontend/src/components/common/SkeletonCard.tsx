import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface SkeletonCardProps {
  height?: number;
  lines?: number;
  showHeader?: boolean;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  height = 120, 
  lines = 3, 
  showHeader = true 
}) => {
  return (
    <Card>
      <CardContent>
        {showHeader && (
          <Skeleton 
            variant="text" 
            width="60%" 
            height={32} 
            sx={{ mb: 2 }}
          />
        )}
        <Box>
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              width={index === lines - 1 ? "40%" : "100%"}
              height={20}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={height} 
          sx={{ 
            mt: 2, 
            borderRadius: 1,
            backgroundColor: 'action.hover'
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;