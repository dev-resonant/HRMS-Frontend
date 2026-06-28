import React from 'react';
import { Box, Typography, Button, Paper, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export const AddRole = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button 
          startIcon={<ArrowLeft size={18} />} 
          onClick={() => navigate('/roles/list')}
          color="inherit"
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Add New Role</Typography>
      </Box>

      <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }} elevation={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Role Name" variant="outlined" placeholder="e.g. HR Admin" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Data Scope" variant="outlined" placeholder="e.g. Entire company" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Capabilities Description" variant="outlined" multiline rows={4} />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/roles/list')}>Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: '#3F4B8D', '&:hover': { backgroundColor: '#2d3770' } }}>
              Save Role
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
