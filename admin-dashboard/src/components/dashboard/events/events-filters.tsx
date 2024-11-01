import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

interface EventsFiltersProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDeleteEnabled: boolean;
  selectedEvents: any[];
  onEnableDisable: (disable: boolean) => void;
  onDelete: () => void;
  typeFilter: string;
  onTypeFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  privacyFilter: string;
  onPrivacyFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  subcategoryFilter: string;
  onSubcategoryFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  subcategories: { id: string; name: string }[];
  statusFilter: string;
  onStatusFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

export function EventsFilters({
  searchQuery,
  onSearchChange,
  isDeleteEnabled,
  selectedEvents,
  onEnableDisable,
  onDelete,
  typeFilter,
  onTypeFilterChange,
  privacyFilter,
  onPrivacyFilterChange,
  subcategoryFilter,
  onSubcategoryFilterChange,
  subcategories,
  statusFilter,
  onStatusFilterChange,
}: EventsFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <OutlinedInput
          value={searchQuery}
          onChange={onSearchChange}
          fullWidth
          placeholder="Search event"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
        <FormControl sx={{ minWidth: 100,  mt: 1 }} margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={onTypeFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="outdoor">Outdoor</MenuItem>
            <MenuItem value="indoor">Indoor</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 100,  mt: 1 }} margin="normal">
          <InputLabel>Privacy</InputLabel>
          <Select
            value={privacyFilter}
            onChange={onPrivacyFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Private</MenuItem>
            <MenuItem value="false">Public</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 100,  mt: 1 , mr: 40 }} margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={subcategoryFilter}
            onChange={onSubcategoryFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.name}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 100, mt: 1 }} margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="enabled">Enabled</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            disabled={!isDeleteEnabled}
            onClick={() => onEnableDisable(false)}
          >
            Enable
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!isDeleteEnabled}
            onClick={() => onEnableDisable(true)}
          >
            Disable
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={!isDeleteEnabled}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}