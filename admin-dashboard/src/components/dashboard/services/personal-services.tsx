import * as React from 'react';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

  useEffect(() => {
    fetchPersonalServices();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategory')
        .select('id, name')
        .eq('category_id', 41); // Fetch only subcategories with category_id 41

      if (error) {
        console.error('Error fetching subcategories:', error);
      } else {
        setSubcategories(data || []);
      }
    };

    fetchSubcategories();
  }, []);

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
        .eq('subcategory.category_id', 41); // Filter for category ID 41

      if (error) {
        console.error('Error fetching personal services:', error);
        return;
      }

      console.log('Fetched data:', data); // Debugging: Log fetched data

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

        console.log('Service subcategory:', service.subcategory); // Debugging: Log subcategory

        return {
          id: service.id ?? 'N/A',
          name: service.name ?? 'N/A',
          price: service.priceperhour ?? 0,
          subcategoryId: service.subcategory.id ?? 'N/A', // Store subcategory ID
          subcategoryName: service.subcategory.name ?? 'N/A', // Store subcategory name
          owner: `${service.user.firstname ?? 'N/A'} ${service.user.lastname ?? 'N/A'}`,
          image: imageUrl,
          disabled: service.disabled ?? false,
        };
      }));

      console.log('Formatted data:', formattedData); // Debugging: Log formatted data

      setPersonalServices(formattedData);
    } catch (error) {
      console.error('Unexpected error fetching personal services:', error);
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
    </Stack>
  );
}

function applyPagination(rows: PersonalService[], page: number, rowsPerPage: number): PersonalService[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}