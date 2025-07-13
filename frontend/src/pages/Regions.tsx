import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

interface Region {
  name: string;
  countryCount: number;
  totalPopulation: string;
  worldShare: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Regions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set page title
    document.title = '🗺️ Regions - World Population';
    
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/regions');
        setRegions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch regions data.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRegions();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchRegions();
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
        Regions
      </Typography>

      {/* Region Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {regions.map((region, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={region.name}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {region.name}
                </Typography>
                <Typography color="textSecondary">
                  Countries: {region.countryCount}
                </Typography>
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                  {region.totalPopulation}
                </Typography>
                <Typography color="textSecondary">
                  {region.worldShare} of world population
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Population Distribution by Region
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
                  <Tooltip formatter={(value, name) => [value + ' countries', 'Number of Countries']} />
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

export default Regions;