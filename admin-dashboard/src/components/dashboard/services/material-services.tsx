import * as React from 'react';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MaterialTable } from './material-table';
import { MaterialFilter } from './material-filter';
import { supabase } from '../../../lib/supabase-client';

interface Material {
  id: string;
  name: string;
  sell_or_rent: string;
  price: number;
  price_per_hour: number;
  image?: string;
  disabled: boolean;
}

export default function MaterialServices(): React.JSX.Element {
  const [materials, setMaterials] = useState<Material[]>([]);
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
  const [sellOrRentFilter, setSellOrRentFilter] = useState<string>('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategory')
        .select('id, name');

      if (error) {
        console.error('Error fetching subcategories:', error);
      } else {
        setSubcategories(data || []);
      }
    };

    fetchSubcategories();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('material')
        .select(`
          id,
          name,
          sell_or_rent,
          price,
          price_per_hour,
          disabled,
          media (url)
        `);

      if (error) {
        console.error('Error fetching materials:', error);
        return;
      }

      const formattedData = await Promise.all(data.map(async material => {
        let imageUrl = null;

        if (material.media && material.media.length > 0) {
          imageUrl = material.media[0].url;
        } else {
          const { data: albumData, error: albumError } = await supabase
            .from('album')
            .select('media (url)')
            .eq('material_id', material.id)
            .limit(1);

          if (albumError) {
            console.error('Error fetching album image:', albumError);
          } else if (albumData && albumData.length > 0) {
            imageUrl = albumData[0].media[0].url;
          }
        }

        return {
          id: material.id,
          name: material.name ?? 'N/A',
          sell_or_rent: material.sell_or_rent ?? 'N/A',
          price: material.price ?? 0,
          price_per_hour: material.price_per_hour ?? 0,
          image: imageUrl,
          disabled: material.disabled ?? false,
        };
      }));

      setMaterials(formattedData);
    } catch (error) {
      console.error('Unexpected error fetching materials:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleEnable = async () => {
    const toEnable = Array.from(selected).filter(id => {
      const material = materials.find(m => m.id === id);
      return material && material.disabled;
    });

    if (toEnable.length > 0) {
      await Promise.all(toEnable.map(async (id) => {
        const { error } = await supabase
          .from('material')
          .update({ disabled: false })
          .eq('id', id);

        if (error) {
          console.error('Error enabling material:', error);
        }
      }));
      fetchMaterials();
    }
  };

  const handleDisable = async () => {
    const toDisable = Array.from(selected).filter(id => {
      const material = materials.find(m => m.id === id);
      return material && !material.disabled;
    });

    if (toDisable.length > 0) {
      await Promise.all(toDisable.map(async (id) => {
        const { error } = await supabase
          .from('material')
          .update({ disabled: true })
          .eq('id', id);

        if (error) {
          console.error('Error disabling material:', error);
        }
      }));
      fetchMaterials();
    }
  };

  const handleDelete = async () => {
    console.log('Delete button clicked');

    const toDelete = Array.from(selected).filter(id => {
      const material = materials.find(m => m.id === id);
      return material;
    });

    if (toDelete.length > 0) {
      try {
        await Promise.all(toDelete.map(async (id) => {
          // First, delete related comments
          const { error: commentError } = await supabase
            .from('comment')
            .delete()
            .eq('material_id', id);

          if (commentError) {
            console.error(`Error deleting comments for material ID ${id}:`, commentError);
            return; // Skip deleting the material if comments can't be deleted
          }

          // Then, delete related reviews
          const { error: reviewError } = await supabase
            .from('review')
            .delete()
            .eq('material_id', id);

          if (reviewError) {
            console.error(`Error deleting reviews for material ID ${id}:`, reviewError);
            return; // Skip deleting the material if reviews can't be deleted
          }

          // Finally, delete the material
          const { error: materialError } = await supabase
            .from('material')
            .delete()
            .eq('id', id);

          if (materialError) {
            console.error(`Error deleting material with ID ${id}:`, materialError);
          } else {
            console.log(`Material with ID ${id} deleted successfully`);
          }
        }));
        fetchMaterials(); // Refresh materials after deletion
      } catch (error) {
        console.error('Unexpected error during deletion process:', error);
      }
    } else {
      console.log('No materials selected for deletion');
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectionChange = (selectedItems: Set<string>) => {
    setSelected(selectedItems);
  };

  const handlePriceFilter = (minPrice: number | null, maxPrice: number | null, sortOrder: string) => {
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setSortOrder(sortOrder);
  };

  const handleSellOrRentFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSellOrRentFilter(event.target.value as string);
    setPage(0);
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSubcategory = subcategoryFilter === '' || material.subcategoryId === subcategoryFilter;
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || (statusFilter === 'enabled' ? !material.disabled : material.disabled);
    const matchesPrice = (minPrice === null || material.price >= minPrice) &&
                         (maxPrice === null || material.price <= maxPrice);
    const matchesSellOrRent = sellOrRentFilter === '' || material.sell_or_rent === sellOrRentFilter;

    return matchesSubcategory && matchesSearch && matchesStatus && matchesPrice && matchesSellOrRent;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortOrder === 'cheapest') return a.price - b.price;
    if (sortOrder === 'expensive') return b.price - a.price;
    return 0;
  });

  const paginatedMaterials = applyPagination(sortedMaterials, page, rowsPerPage);

  const isEnableDisabled = !Array.from(selected).some(id => {
    const material = materials.find(m => m.id === id);
    return material && material.disabled;
  });

  const isDisableEnabled = !Array.from(selected).some(id => {
    const material = materials.find(m => m.id === id);
    return material && !material.disabled;
  });

  const isDeleteEnabled = selected.size > 0;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Material Services</Typography>
      <MaterialFilter
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
        sellOrRentFilter={sellOrRentFilter}
        onSellOrRentFilterChange={handleSellOrRentFilterChange}
      />
      <MaterialTable
        count={filteredMaterials.length}
        page={page}
        rows={paginatedMaterials}    
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectionChange={handleSelectionChange}
      />
    </Stack>
  );
}

function applyPagination(rows: Material[], page: number, rowsPerPage: number): Material[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}