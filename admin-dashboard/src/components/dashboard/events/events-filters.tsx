import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';

interface EventsFiltersProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDeleteEnabled: boolean;
  onDelete: () => void; // Add this prop
}

export function EventsFilters({ searchQuery, onSearchChange, isDeleteEnabled, onDelete }: EventsFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
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
      <Button
        variant="contained"
        color="error"
        disabled={!isDeleteEnabled}
        sx={{ mt: 0, ml: 70 }}
        onClick={onDelete} // Call the delete handler
      >
        Delete
      </Button>
    </Card>
  );
}