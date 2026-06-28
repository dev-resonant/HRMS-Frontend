import React, { useState } from 'react';
import { Box, Button, InputBase, Paper, Menu, MenuItem, Typography, TextField } from '@mui/material';
import { Search, ChevronDown, Tag, Flag } from 'lucide-react';

export const ListFilterBar = ({ 
  searchPlaceholder = "Search...", 
  filters = [], 
  actionButton = null,
  showSecondaryButtons = false
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  const handleClick = (event, filter) => {
    setAnchorEl(event.currentTarget);
    setCurrentFilter(filter);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentFilter(null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Row: Search and Action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexGrow: 1, maxWidth: 800 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              border: '1px solid #d0d7de',
              backgroundColor: '#f6f8fa',
              borderRadius: 1,
              px: 2,
              py: 0.5
            }}
          >
            <Search size={18} color="#57606a" style={{ marginRight: 8 }} />
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
              placeholder={searchPlaceholder}
            />
          </Paper>
          {showSecondaryButtons && (
            <>
              <Button 
                variant="outlined" 
                sx={{ ml: 2, borderColor: '#d0d7de', color: '#24292f', textTransform: 'none', backgroundColor: '#f6f8fa' }}
                startIcon={<Tag size={16} />}
              >
                Labels
              </Button>
              <Button 
                variant="outlined" 
                sx={{ ml: 1, borderColor: '#d0d7de', color: '#24292f', textTransform: 'none', backgroundColor: '#f6f8fa' }}
                startIcon={<Flag size={16} />}
              >
                Milestones
              </Button>
            </>
          )}
        </Box>
        <Box>
          {actionButton}
        </Box>
      </Box>

      {/* Bottom Row: Filters */}
      {filters.length > 0 && (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', px: 1, borderTop: '1px solid #eaeef2', pt: 2 }}>
          {filters.map((filter, index) => (
            <Box key={index}>
              <Button
                sx={{ 
                  color: '#57606a', 
                  textTransform: 'none', 
                  fontSize: '0.875rem',
                  p: 0,
                  minWidth: 'auto',
                  fontWeight: 400,
                  '&:hover': { backgroundColor: 'transparent', color: '#0969da' }
                }}
                endIcon={<ChevronDown size={14} />}
                onClick={(e) => handleClick(e, filter)}
              >
                {filter.label}
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Filter Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { width: 300, mt: 1, borderRadius: 2, border: '1px solid #d0d7de', boxShadow: '0 8px 24px rgba(140,149,159,0.2)' }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #d0d7de' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
            Filter by {currentFilter?.label?.toLowerCase()}
          </Typography>
        </Box>
        <Box sx={{ p: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={`Filter ${currentFilter?.label?.toLowerCase()}`}
            variant="outlined"
            autoFocus
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': { 
                fontSize: '0.875rem',
                backgroundColor: '#f6f8fa',
                height: 32
              }
            }}
          />
          {currentFilter?.options?.map((option, idx) => (
            <MenuItem 
              key={idx} 
              onClick={handleClose}
              sx={{ fontSize: '0.875rem', borderRadius: 1, py: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {option.color && (
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: option.color }} />
                )}
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};
