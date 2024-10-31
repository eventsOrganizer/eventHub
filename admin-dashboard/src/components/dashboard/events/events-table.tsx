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

import { useSelection } from '@/hooks/use-selection';

export interface Event {
  id: string;
  name: string;
  type: string;
  privacy: boolean;
  details: string;
  subcategory_id: number;
  user_id: string;
  group_id: number;
}

interface EventsTableProps {
  count: number;
  page: number;
  rows: Event[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectionChange: (selected: Set<string>) => void;
  onDelete: (id: string) => void; // Add this prop
}

export function EventsTable({
  count,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
  onDelete, // Add this prop
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
    console.log(`Row clicked with id: ${id}`);
    onDelete(id); // Call the delete function
  };
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
              <TableCell>Type</TableCell>
              <TableCell>Privacy</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Subcategory ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Group ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isSelected}
                  onClick={() => handleRowClick(row.id)}
                  sx={{ cursor: 'pointer' }}
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
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.privacy ? 'Private' : 'Public'}</TableCell>
                  <TableCell>{row.details}</TableCell>
                  <TableCell>{row.subcategory_id}</TableCell>
                  <TableCell>{row.user_id}</TableCell>
                  <TableCell>{row.group_id}</TableCell>
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