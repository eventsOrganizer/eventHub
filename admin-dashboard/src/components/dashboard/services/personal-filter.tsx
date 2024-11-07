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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

interface PersonalFilterProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEnableDisabled: boolean;
  isDisableEnabled: boolean;
  isDeleteEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onDelete: () => void;
  statusFilter: string;
  onStatusFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  subcategoryFilter: string;
  onSubcategoryFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  subcategories: { id: string; name: string }[];
  onPriceFilter: (minPrice: number | null, maxPrice: number | null, sortOrder: string) => void;
}

export function PersonalFilter({
  searchQuery,
  onSearchChange,
  isEnableDisabled,
  isDisableEnabled,
  isDeleteEnabled,
  onEnable,
  onDisable,
  onDelete,
  statusFilter,
  onStatusFilterChange,
  subcategoryFilter,
  onSubcategoryFilterChange,
  subcategories,
  onPriceFilter,
}: PersonalFilterProps): React.JSX.Element {
  const [priceModalOpen, setPriceModalOpen] = React.useState(false);
  const [minPrice, setMinPrice] = React.useState<number | ''>('');
  const [maxPrice, setMaxPrice] = React.useState<number | ''>('');
  const [sortOrder, setSortOrder] = React.useState<string>('');

  const handlePriceFilterApply = () => {
    onPriceFilter(
      minPrice !== '' ? minPrice : null,
      maxPrice !== '' ? maxPrice : null,
      sortOrder
    );
    setPriceModalOpen(false);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <OutlinedInput
          value={searchQuery}
          onChange={onSearchChange}
          fullWidth
          placeholder="Search service"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
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
        <FormControl sx={{ minWidth: 100, mt: 1 }} margin="normal">
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={subcategoryFilter}
            onChange={onSubcategoryFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setPriceModalOpen(true)}>
          Price Filter
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            disabled={isEnableDisabled}
            onClick={onEnable}
          >
            Enable
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isDisableEnabled}
            onClick={onDisable}
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

      <Modal open={priceModalOpen} onClose={() => setPriceModalOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6">Price Filter</Typography>
          <TextField
            label="Min Price"
            type="number"
            fullWidth
            margin="normal"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value, 10) : '')}
          />
          <TextField
            label="Max Price"
            type="number"
            fullWidth
            margin="normal"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : '')}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as string)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="cheapest">Cheapest First</MenuItem>
              <MenuItem value="expensive">Most Expensive First</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handlePriceFilterApply}>
            Apply
          </Button>
        </Box>
      </Modal>
    </Card>
  );
}