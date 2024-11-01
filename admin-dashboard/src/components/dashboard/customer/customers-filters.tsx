import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { supabase } from '@/lib/supabase-client';

interface CustomersFiltersProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDeleteEnabled: boolean;
  selectedCustomers: any[];
  statusFilter: string;
  onStatusFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  onDelete: () => void;
}

export function CustomersFilters({
  searchQuery,
  onSearchChange,
  isDeleteEnabled,
  selectedCustomers,
  statusFilter,
  onStatusFilterChange,
  onDelete,
}: CustomersFiltersProps): React.JSX.Element {
  const allDisabledSelected = selectedCustomers.every(customer => customer.disabled);
  const allEnabledSelected = selectedCustomers.every(customer => !customer.disabled);

  const handleToggleDisable = async (disable: boolean) => {
    try {
      const updates = selectedCustomers.map(async (customer) => {
        const { error } = await supabase
          .from('user')
          .update({ disabled: disable })
          .eq('email', customer.email);

        if (error) {
          console.error('Error updating user status:', error);
        }
      });

      await Promise.all(updates);
    } catch (error) {
      console.error('Unexpected error updating user status:', error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <OutlinedInput
          value={searchQuery}
          onChange={onSearchChange}
          fullWidth
          placeholder="Search user"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
        <Select
          value={statusFilter}
          onChange={onStatusFilterChange}
          displayEmpty
          sx={{ minWidth: 120, mr: 60 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="enabled">Enabled</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            disabled={!isDeleteEnabled || !allDisabledSelected}
            onClick={() => handleToggleDisable(false)}
          >
            Enable
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!isDeleteEnabled || !allEnabledSelected}
            onClick={() => handleToggleDisable(true)}
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
