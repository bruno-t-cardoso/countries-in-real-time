import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  Grow
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: SvgIconComponent;
  gradient?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  gradient = false,
  delay = 0
}) => {
  const theme = useTheme();

  return (
    <Grow in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: '100%',
          background: gradient 
            ? theme.palette.gradient?.primary 
            : theme.palette.background.paper,
          color: gradient ? 'white' : 'inherit',
          position: 'relative',
          overflow: 'hidden',
          '&::before': gradient ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          } : {},
          '&:hover::before': gradient ? {
            opacity: 1,
          } : {},
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box flex={1}>
              <Typography 
                color={gradient ? 'inherit' : 'text.secondary'} 
                gutterBottom
                variant="subtitle2"
                sx={{ 
                  fontWeight: 600,
                  opacity: gradient ? 0.9 : 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  background: gradient ? 'transparent' : theme.palette.gradient?.primary,
                  backgroundClip: gradient ? 'unset' : 'text',
                  WebkitBackgroundClip: gradient ? 'unset' : 'text',
                  WebkitTextFillColor: gradient ? 'inherit' : 'transparent',
                }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color={gradient ? 'inherit' : 'text.secondary'}
                  sx={{ 
                    opacity: gradient ? 0.8 : 0.7,
                    fontWeight: 500 
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {Icon && (
              <Box
                sx={{
                  backgroundColor: gradient ? 'rgba(255, 255, 255, 0.2)' : theme.palette.primary.main,
                  borderRadius: '50%',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon 
                  sx={{ 
                    fontSize: 24,
                    color: gradient ? 'white' : 'white',
                  }} 
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default StatCard;