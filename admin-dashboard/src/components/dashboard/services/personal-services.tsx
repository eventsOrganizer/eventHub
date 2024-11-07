import * as React from 'react';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PersonalTable } from './personal-table';
import { PersonalFilter } from './personal-filter';
import { supabase } from '../../../lib/supabase-client';

interface PersonalService {
  id: string;
  name: string;
  price: number;
  subcategoryId: string;
  subcategoryName: string;
  owner: string;
  image?: string;
  disabled: boolean;
}

export default function PersonalServices(): React.JSX.Element {
  const [personalServices, setPersonalServices] = useState<PersonalService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchPersonalServices();
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .eq('category_id', 41);

    if (error) {
      console.error('Error fetching subcategories:', error);
    } else {
      setSubcategories(data || []);
    }
  };

  const fetchPersonalServices = async () => {
    try {
      const { data, error } = await supabase
        .from('personal')
        .select(`
          id,
          name,
          priceperhour,
          subcategory: subcategory_id (id, name),
          user: user_id (firstname, lastname),
          media: media (url),
          disabled
        `)
        .eq('subcategory.category_id', 41);

      if (error) {
        console.error('Error fetching personal services:', error);
        return;
      }

      const formattedData = await Promise.all(data.map(async service => {
        let imageUrl = null;

        if (service.media && service.media.length > 0) {
          imageUrl = service.media[0].url;
        } else {
          const { data: albumData, error: albumError } = await supabase
            .from('album')
            .select('media (url)')
            .eq('personal_id', service.id)
            .limit(1);

          if (albumError) {
            console.error('Error fetching album image:', albumError);
          } else if (albumData && albumData.length > 0) {
            imageUrl = albumData[0].media[0].url;
          }
        }

        return {
          id: service.id ?? 'N/A',
          name: service.name ?? 'N/A',
          price: service.priceperhour ?? 0,
          subcategoryId: service.subcategory.id ?? 'N/A',
          subcategoryName: service.subcategory.name ?? 'N/A',
          owner: `${service.user.firstname ?? 'N/A'} ${service.user.lastname ?? 'N/A'}`,
          image: imageUrl,
          disabled: service.disabled ?? false,
        };
      }));

      setPersonalServices(formattedData);
    } catch (error) {
      console.error('Unexpected error fetching personal services:', error);
    }
  };

  const handleAddSubcategory = async () => {
    const { error } = await supabase
      .from('subcategory')
      .insert([{ name: newSubcategoryName, category_id: 41 }]);

    if (error) {
      console.error('Error adding subcategory:', error);
    } else {
      setSnackbarMessage('Subcategory added successfully!');
      setSnackbarOpen(true);
      setOpen(false);
      setNewSubcategoryName('');
      fetchSubcategories();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleEnable = async () => {
    const toEnable = Array.from(selected).filter(id => {
      const service = personalServices.find(s => s.id === id);
      return service && service.disabled;
    });

    if (toEnable.length > 0) {
      await Promise.all(toEnable.map(async (id) => {
        const { error } = await supabase
          .from('personal')
          .update({ disabled: false })
          .eq('id', id);

        if (error) {
          console.error('Error enabling service:', error);
        }
      }));
      fetchPersonalServices();
    }
  };

  const handleDisable = async () => {
    const toDisable = Array.from(selected).filter(id => {
      const service = personalServices.find(s => s.id === id);
      return service && !service.disabled;
    });

    if (toDisable.length > 0) {
      await Promise.all(toDisable.map(async (id) => {
        const { error } = await supabase
          .from('personal')
          .update({ disabled: true })
          .eq('id', id);

        if (error) {
          console.error('Error disabling service:', error);
        }
      }));
      fetchPersonalServices();
    }
  };

  const handleDelete = async () => {
    const toDelete = Array.from(selected).filter(id => {
      const service = personalServices.find(s => s.id === id);
      return service;
    });

    if (toDelete.length > 0) {
      await Promise.all(toDelete.map(async (id) => {
        const { error } = await supabase
          .from('personal')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting service:', error);
        }
      }));
      fetchPersonalServices();
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectionChange = (newSelected: Set<string>) => {
    setSelected(newSelected);
  };

  const handlePriceFilter = (min: number, max: number, order: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setSortOrder(order);
  };

  const filteredServices = personalServices.filter(service => {
    const matchesSubcategory = subcategoryFilter === '' || service.subcategoryId === subcategoryFilter;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || (statusFilter === 'enabled' ? !service.disabled : service.disabled);
    const matchesPrice = (minPrice === null || service.price >= minPrice) &&
                         (maxPrice === null || service.price <= maxPrice);

    return matchesSubcategory && matchesSearch && matchesStatus && matchesPrice;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortOrder === 'cheapest') return a.price - b.price;
    if (sortOrder === 'expensive') return b.price - a.price;
    return 0;
  });

  const paginatedServices = applyPagination(sortedServices, page, rowsPerPage);

  const isEnableDisabled = !Array.from(selected).some(id => {
    const service = personalServices.find(s => s.id === id);
    return service && service.disabled;
  });

  const isDisableEnabled = !Array.from(selected).some(id => {
    const service = personalServices.find(s => s.id === id);
    return service && !service.disabled;
  });

  const isDeleteEnabled = selected.size > 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Personal Services</Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        style={{ alignSelf: 'flex-end' }}
        onClick={() => setOpen(true)}
      >
        Add New Subcategory
      </Button>
      <PersonalFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isEnableDisabled={isEnableDisabled}
        isDisableEnabled={isDisableEnabled}
        isDeleteEnabled={isDeleteEnabled}
        onEnable={handleEnable}
        onDisable={handleDisable}
        onDelete={handleDelete}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value as string)}
        subcategoryFilter={subcategoryFilter}
        onSubcategoryFilterChange={(e) => setSubcategoryFilter(e.target.value as string)}
        onPriceFilter={handlePriceFilter}
        subcategories={subcategories}
      />
      <PersonalTable
        count={filteredServices.length}
        page={page}
        rows={paginatedServices}    
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectionChange={handleSelectionChange}
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', margin: 'auto', maxWidth: '500px', top: '20%', position: 'absolute', left: '50%', transform: 'translate(-50%, -20%)' }}>
          <Typography variant="h6">Add New Subcategory</Typography>
          <TextField
            label="Subcategory Name"
            fullWidth
            margin="normal"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
          />
          <Button onClick={handleAddSubcategory} variant="contained" color="primary" style={{ marginTop: '10px' }}>Submit</Button>
        </div>
      </Modal>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function applyPagination(rows: PersonalService[], page: number, rowsPerPage: number): PersonalService[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}