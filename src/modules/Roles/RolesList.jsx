import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { ListFilterBar } from '../../components/application/ListFilterBar';

export const RolesList = () => {
  const navigate = useNavigate();

  const roleFilters = [
    { label: 'Author', options: [{ label: 'Admin User' }, { label: 'System' }] },
    { label: 'Label', options: [{ label: 'Admin', color: '#d73a4a' }, { label: 'Management', color: '#0075ca' }] },
    { label: 'Projects', options: [{ label: 'Core HR' }] },
    { label: 'Sort', options: [{ label: 'Newest' }, { label: 'Oldest' }, { label: 'Recently updated' }] }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Roles</Typography>

      <ListFilterBar 
        searchPlaceholder="Search roles..."
        filters={roleFilters}
        showSecondaryButtons={false}
        actionButton={
          <Button 
            variant="contained" 
            startIcon={<Plus size={16} />} 
            onClick={() => navigate('/roles/add')}
            sx={{ backgroundColor: '#2da44e', '&:hover': { backgroundColor: '#2c974b' }, textTransform: 'none', boxShadow: 'none', fontWeight: 600 }}
          >
            New role
          </Button>
        }
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Data Scope</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Capabilities</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Super Admin</TableCell>
              <TableCell>Entire platform (all companies)</TableCell>
              <TableCell>Creates companies, manages all admins, configures system-level settings.</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>HR Admin</TableCell>
              <TableCell>Entire company</TableCell>
              <TableCell>Manages all employees, runs payroll, configures leave types, approves escalated requests.</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Manager</TableCell>
              <TableCell>Own team only</TableCell>
              <TableCell>Approves leave and mispunch for direct reports, views team attendance.</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Own data only</TableCell>
              <TableCell>Self-service: punch in/out, apply leave, fill timesheet, view own payslip.</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
