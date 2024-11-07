import React, { useState } from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface ComplaintFiltersProps {
  onFilterChange: (filters: { status: string; category: string; search: string }) => void;
}

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newStatus = event.target.value as string;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, category, search });
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newCategory = event.target.value as string;
    setCategory(newCategory);
    onFilterChange({ status, category: newCategory, search });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    onFilterChange({ status, category, search: newSearch });
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <OutlinedInput
          value={search}
          onChange={handleSearchChange}
          fullWidth
          placeholder="Search complaints"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
        <Select
          value={status}
          onChange={handleStatusChange}
          displayEmpty
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_review">In Review</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </Select>
        <Select
          value={category}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="event">Event</MenuItem>
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="material">Material</MenuItem>
          <MenuItem value="local">Local</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </Stack>
    </Card>
  );
};

export default ComplaintFilters;