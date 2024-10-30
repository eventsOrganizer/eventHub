import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';

interface CustomersFiltersProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDeleteEnabled: boolean;
}

export function CustomersFilters({ searchQuery, onSearchChange, isDeleteEnabled }: CustomersFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
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
      <Button
        variant="contained"
        color="error"
        disabled={!isDeleteEnabled}
        sx={{ mt: 0, ml: 70 }}
      >
        Delete
      </Button>
    </Card>
  );
}
