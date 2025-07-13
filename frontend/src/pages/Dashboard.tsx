import React, { useState, useEffect } from 'react';
import { 
  Grid,
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

interface WorldStats {
  totalCountries: number;
  totalPopulation: string;
  averagePopulation: string;
  averageDensity: number;
  averageMedianAge: number;
}

interface Region {
  name: string;
  countryCount: number;
  totalPopulation: string;
  worldShare: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const [worldStats, setWorldStats] = useState<WorldStats | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set page title
    document.title = '🌍 Dashboard - World Population';
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, regionsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/world-stats'),
          axios.get('http://localhost:5000/api/regions')
        ]);
        
        setWorldStats(statsResponse.data);
        setRegions(regionsResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        World Population Dashboard
      </Typography>
      
      {/* World Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Countries
              </Typography>
              <Typography variant="h4" component="div">
                {worldStats?.totalCountries.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                World Population
              </Typography>
              <Typography variant="h4" component="div">
                {worldStats?.totalPopulation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Population
              </Typography>
              <Typography variant="h4" component="div">
                {worldStats?.averagePopulation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Median Age
              </Typography>
              <Typography variant="h4" component="div">
                {worldStats?.averageMedianAge}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Population by Region
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, worldShare }) => `${name}: ${worldShare}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="countryCount"
                  >
                    {regions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value + ' countries', 'Number of Countries']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Countries by Region
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="countryCount" fill="#8884d8" name="Number of Countries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;