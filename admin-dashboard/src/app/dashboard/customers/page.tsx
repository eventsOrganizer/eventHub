"use client";

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'daylljs';
import { useRouter } from 'next/navigation';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { CreateUserModal } from '@/components/dashboard/customer/CreateUserModal';
import { supabase } from '../../../lib/supabase-client';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

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
          media:media(url),
          disabled
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
          disabled: user.disabled ?? false,
        }));

        setCustomers(formattedData);
      }
    };

    fetchCustomers();
  }, [selected]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateUser = (newUser) => {
    setCustomers((prev) => [...prev, newUser]);
  };

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

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };

  const handleDelete = async () => {
    try {
      const deletePromises = Array.from(selected).map(async (email) => {
        const { error } = await supabase
          .from('user')
          .delete()
          .eq('email', email);

        if (error) {
          console.error('Error deleting user:', error);
        }
      });

      await Promise.all(deletePromises);
      setCustomers((prevCustomers) => prevCustomers.filter(customer => !selected.has(customer.email)));
      setSelected(new Set());
    } catch (error) {
      console.error('Unexpected error deleting users:', error);
    }
  };

  const selectedCustomers = customers.filter(customer => selected.has(customer.email));

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          customer.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' ||
                          (statusFilter === 'enabled' && !customer.disabled) ||
                          (statusFilter === 'disabled' && customer.disabled);

    return matchesSearch && matchesStatus;
  });

  const paginatedCustomers = applyPagination(filteredCustomers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
        </Stack>
        <Button
          startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={handleOpen}
        >
          Add User
        </Button>
      </Stack>
      <CreateUserModal open={open} onClose={handleClose} onCreate={handleCreateUser} />
      <CustomersFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isDeleteEnabled={selected.size > 0}
        selectedCustomers={selectedCustomers}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onDelete={handleDelete}
      />
      <CustomersTable
        count={filteredCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectionChange={handleSelectionChange}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
