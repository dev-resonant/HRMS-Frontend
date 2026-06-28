import React from 'react';
import { Box, Typography, Button, Paper, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export const AddPermission = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button 
          startIcon={<ArrowLeft size={18} />} 
          onClick={() => navigate('/permissions/list')}
          color="inherit"
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Configure Permission</Typography>
      </Box>

      <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }} elevation={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Module</InputLabel>
              <Select label="Module" defaultValue="">
                <MenuItem value="Attendance">Attendance</MenuItem>
                <MenuItem value="Leave">Leave</MenuItem>
                <MenuItem value="Mispunch">Mispunch</MenuItem>
                <MenuItem value="Timesheet">Timesheet</MenuItem>
                <MenuItem value="Employees">Employees</MenuItem>
                <MenuItem value="Payroll">Payroll</MenuItem>
                <MenuItem value="System">System</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Action Name" variant="outlined" placeholder="e.g. Approve team leave" />
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>Role Access Levels</Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Employee Scope</InputLabel>
              <Select label="Employee Scope" defaultValue="-">
                <MenuItem value="-">None (-)</MenuItem>
                <MenuItem value="Y">Allowed (Y)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Manager Scope</InputLabel>
              <Select label="Manager Scope" defaultValue="-">
                <MenuItem value="-">None (-)</MenuItem>
                <MenuItem value="Team">Team</MenuItem>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Y">Allowed (Y)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>HR Admin Scope</InputLabel>
              <Select label="HR Admin Scope" defaultValue="-">
                <MenuItem value="-">None (-)</MenuItem>
                <MenuItem value="Team">Team</MenuItem>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Y">Allowed (Y)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Super Admin Scope</InputLabel>
              <Select label="Super Admin Scope" defaultValue="-">
                <MenuItem value="-">None (-)</MenuItem>
                <MenuItem value="Team">Team</MenuItem>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Y">Allowed (Y)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/permissions/list')}>Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: '#3F4B8D', '&:hover': { backgroundColor: '#2d3770' } }}>
              Save Permission
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
