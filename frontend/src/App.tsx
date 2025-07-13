import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, Container } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import EnhancedNavbar from './components/layout/EnhancedNavbar';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Countries = React.lazy(() => import('./pages/Countries'));
const Regions = React.lazy(() => import('./pages/Regions'));

// Loading fallback component
const PageLoader = () => (
  <LoadingSpinner 
    message="Loading page..." 
    fullHeight={true}
  />
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <CssBaseline />
          <Router>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                background: (theme) => theme.palette.background.default,
              }}
            >
              <EnhancedNavbar />
              
              <Container 
                maxWidth="xl" 
                sx={{ 
                  mt: 3, 
                  mb: 4, 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ErrorBoundary>
                          <Dashboard />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/countries" 
                      element={
                        <ErrorBoundary>
                          <Countries />
                        </ErrorBoundary>
                      } 
                    />
                    <Route 
                      path="/regions" 
                      element={
                        <ErrorBoundary>
                          <Regions />
                        </ErrorBoundary>
                      } 
                    />
                    {/* 404 Route */}
                    <Route 
                      path="*" 
                      element={
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          minHeight="400px"
                          textAlign="center"
                        >
                          <h1>404 - Page Not Found</h1>
                          <p>The page you're looking for doesn't exist.</p>
                        </Box>
                      } 
                    />
                  </Routes>
                </Suspense>
              </Container>

              {/* Footer */}
              <Box
                component="footer"
                sx={{
                  py: 2,
                  px: 3,
                  mt: 'auto',
                  borderTop: 1,
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                © 2025 Countries Live - Real-time population data dashboard
                {' • '}
                <a 
                  href="https://github.com/bruno-t-cardoso/countries-in-real-time"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  View on GitHub
                </a>
              </Box>
            </Box>
          </Router>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;