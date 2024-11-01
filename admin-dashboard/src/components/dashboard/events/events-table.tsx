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
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import { useSelection } from '../../../hooks/use-selection';
import { supabase } from '../../../lib/supabase-client';

export interface Event {
  id: string;
  name: string;
  type: string;
  privacy: boolean;
  owner: string;
  subcategory: string;
  image?: string;
  ownerImage?: string;
  disabled: boolean;
}

interface EventsTableProps {
  count: number;
  page: number;
  rows: Event[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectionChange: (selected: Set<string>) => void;
}

export function EventsTable({
  count,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
}: EventsTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((event) => event.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const handleRowClick = (id: string) => {
    if (selected?.has(id)) {
      deselectOne(id);
    } else {
      selectOne(id);
    }
  };

  const handleToggleDisable = async (id: string, isDisabled: boolean) => {
    try {
      const { error } = await supabase
        .from('event')
        .update({ disabled: !isDisabled })
        .eq('id', id);

      if (error) {
        console.error('Error updating event status:', error);
      } else {
        // Update the local state to reflect the change
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === id ? { ...event, disabled: !isDisabled } : event
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error updating event status:', error);
    }
  };

  const [events, setEvents] = useState<Event[]>([]);

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
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Privacy</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Subcategory</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);
              const isDisabled = row.disabled;

              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isSelected}
                  onClick={() => handleRowClick(row.id)}
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
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {row.image ? (
                      <Avatar
                        src={row.image}
                        alt={row.name}
                        sx={{ width: 56, height: 56, borderRadius: '8px' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.privacy ? 'Private' : 'Public'}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      {row.ownerImage && (
                        <Avatar
                          src={row.ownerImage}
                          alt={row.owner}
                          sx={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                      )}
                      <Typography variant="subtitle2">{row.owner}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.subcategory}</TableCell>
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