import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { ListFilterBar } from '../../components/application/ListFilterBar';

export const PermissionsList = () => {
  const navigate = useNavigate();

  const permissionFilters = [
    { label: 'Module', options: [{ label: 'Attendance' }, { label: 'Leave' }, { label: 'Employees' }] },
    { label: 'Sort', options: [{ label: 'Module A-Z' }, { label: 'Action A-Z' }] }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Permissions Matrix</Typography>
      
      <ListFilterBar 
        searchPlaceholder="Filter permissions..."
        filters={permissionFilters}
        actionButton={
          <Button 
            variant="contained" 
            startIcon={<Plus size={16} />} 
            onClick={() => navigate('/permissions/add')}
            sx={{ backgroundColor: '#2da44e', '&:hover': { backgroundColor: '#2c974b' }, textTransform: 'none', boxShadow: 'none', fontWeight: 600 }}
          >
            New permission
          </Button>
        }
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Module</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Manager</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>HR Admin</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Super Admin</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Attendance</TableCell>
              <TableCell>View own logs</TableCell>
              <TableCell>Y</TableCell>
              <TableCell>Y</TableCell>
              <TableCell>Y</TableCell>
              <TableCell>Y</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Attendance</TableCell>
              <TableCell>View team attendance</TableCell>
              <TableCell>-</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>All</TableCell>
              <TableCell>All</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Leave</TableCell>
              <TableCell>Approve team leave</TableCell>
              <TableCell>-</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>All</TableCell>
              <TableCell>All</TableCell>
              <TableCell align="right">
                <Button size="small" color="primary">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employees</TableCell>
              <TableCell>Create / deactivate</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>Y</TableCell>
              <TableCell>Y</TableCell>
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
