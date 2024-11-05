import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useSelection } from '../../../hooks/use-selection';
import { useRouter } from 'next/navigation';

interface PersonalService {
  id: string;
  name: string;
  price: number;
  subcategoryName: string;
  owner: string;
  image?: string;
  disabled: boolean;
}

interface PersonalTableProps {
  count: number;
  page: number;
  rows: PersonalService[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectionChange: (selected: Set<string>) => void;
}

export function PersonalTable({
  count,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
}: PersonalTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((service) => service.id);
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

  const router = useRouter();

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
              <TableCell>Price</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
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
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.subcategoryName}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/personal-details?id=${row.id}`);
                      }}
                    >
                      View Details
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