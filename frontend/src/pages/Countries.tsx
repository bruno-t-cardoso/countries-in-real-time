import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  TablePagination
} from '@mui/material';
import axios from 'axios';

interface Country {
  rank: string;
  name: string;
  population: string;
  yearlyChange: string;
  netChange: string;
  density: string;
  landArea: string;
  migrants: string;
  fertilityRate: string;
  medianAge: string;
  urbanPop: string;
  worldShare: string;
}

const Countries: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    // Set page title
    document.title = '📊 Countries - World Population';
    
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/v1/countries');
        setCountries(response.data.data);
        setFilteredCountries(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch countries data.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchCountries();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCountries();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
    setPage(0);
  }, [searchTerm, countries]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        Countries
      </Typography>
      
      <TextField
        fullWidth
        label="Search countries..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="right">Population</TableCell>
              <TableCell align="right">Yearly Change</TableCell>
              <TableCell align="right">Net Change</TableCell>
              <TableCell align="right">Density</TableCell>
              <TableCell align="right">Land Area</TableCell>
              <TableCell align="right">World Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCountries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((country) => (
                <TableRow key={country.rank} hover>
                  <TableCell>{country.rank}</TableCell>
                  <TableCell>{country.name}</TableCell>
                  <TableCell align="right">{country.population}</TableCell>
                  <TableCell align="right">{country.yearlyChange}</TableCell>
                  <TableCell align="right">{country.netChange}</TableCell>
                  <TableCell align="right">{country.density}</TableCell>
                  <TableCell align="right">{country.landArea}</TableCell>
                  <TableCell align="right">{country.worldShare}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredCountries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Countries; 