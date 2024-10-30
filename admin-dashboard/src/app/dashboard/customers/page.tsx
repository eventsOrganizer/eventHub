"use client";

import { useEffect, useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

// Import the supabase client from the supabase-client.tsx file
import { supabase } from '../../../lib/supabase-client';

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('user')
        .select(`
          id, 
          firstname, 
          lastname, 
          username, 
          email, 
          details,
          media:media(url)
        `);

      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        const formattedData = data.map(user => ({
          id: user.id ?? 'N/A',
          avatar: user.media?.[0]?.url ?? '',
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          username: user.username ?? 'N/A',
          details: user.details ?? 'N/A',
          signedUp: new Date(),
        }));

        setCustomers(formattedData);
      }
    };

    fetchCustomers();
  }, []);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleSelectionChange = (newSelected: Set<string>) => {
    setSelected(newSelected);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = applyPagination(filteredCustomers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isDeleteEnabled={selected.size > 0} // Pass the selection state
      />
      <CustomersTable
        count={filteredCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectionChange={handleSelectionChange} // Handle selection change
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}