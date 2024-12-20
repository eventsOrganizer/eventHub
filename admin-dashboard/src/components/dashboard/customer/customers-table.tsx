'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useSelection } from '@/hooks/use-selection';
import { CustomPaginationActions } from './CustomPagination';
import { supabase } from '@/lib/supabase-client';

export interface Customer {
  avatar: string;
  name: string;
  username: string;
  email: string;
  details: string;
  signedUp: Date;
  disabled: boolean;
}

interface CustomersTableProps {
  count: number;
  page: number;
  rows: Customer[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectionChange: (selected: Set<string>) => void;
}

export function CustomersTable({
  count,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
}: CustomersTableProps): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Ensure this code only runs on the client side
    if (typeof window !== 'undefined') {
      // Your client-side logic here
    }
  }, []);

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.email); // Ensure email is unique
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    onSelectionChange(selected); // Notify parent about selection changes
  }, [selected, onSelectionChange]);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const handleRowClick = (email: string) => {
    if (selected?.has(email)) {
      deselectOne(email);
    } else {
      selectOne(email);
    }
  };

  const handleManageClick = (email: string) => {
    router.push(`/dashboard/user-details?email=${email}`);
  };

  const handleToggleDisable = async (email: string, isDisabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user')
        .update({ disabled: !isDisabled })
        .eq('email', email);

      if (error) {
        console.error('Error updating user status:', error);
      } else {
        // Update the local state to reflect the change
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.email === email ? { ...customer, disabled: !isDisabled } : customer
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error updating user status:', error);
    }
  };

  const [customers, setCustomers] = useState<Customer[]>([]);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Signed Up</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.email);
              const isDisabled = row.disabled;

              return (
                <TableRow
                  hover
                  key={row.email}
                  selected={isSelected}
                  onClick={() => handleRowClick(row.email)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: isDisabled ? 'rgba(255, 0, 0, 0.1)' : 'inherit',
                    opacity: isDisabled ? 0.5 : 1,
                    '&:hover': {
                      backgroundColor: isDisabled ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: isDisabled ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        backgroundColor: isDisabled ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.12)',
                      },
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        event.stopPropagation();
                        if (event.target.checked) {
                          selectOne(row.email);
                        } else {
                          deselectOne(row.email);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.details}</TableCell>
                  <TableCell>{dayjs(row.signedUp).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ opacity: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleManageClick(row.email);
                      }}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Rows per page"
      />
    </Card>
  );
}