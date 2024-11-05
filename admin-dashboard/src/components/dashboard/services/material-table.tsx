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
import Button from '@mui/material/Button';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useSelection } from '../../../hooks/use-selection';
import { useRouter } from 'next/navigation';

interface Material {
  id: string;
  name: string;
  sell_or_rent: string;
  price: number;
  price_per_hour: number;
  image?: string;
  disabled: boolean;
  subcategoryName: string;
}

interface MaterialTableProps {
  count: number;
  page: number;
  rows: Material[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectionChange: (selected: Set<string>) => void;
}

export function MaterialTable({
  count,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
}: MaterialTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((material) => material.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;

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
              <TableCell>Sell/Rent</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Price per Hour</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((material) => (
              <TableRow
                hover
                key={material.id}
                selected={selected?.has(material.id)}
                onClick={() => handleRowClick(material.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selected?.has(material.id)} />
                </TableCell>
                <TableCell>
                  <Avatar src={material.image} alt={material.name} />
                </TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.sell_or_rent}</TableCell>
                <TableCell>{material.price}</TableCell>
                <TableCell>{material.price_per_hour}</TableCell>
                <TableCell>{material.subcategoryName}</TableCell>
                <TableCell>{material.id}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/material-details?id=${material.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Card>
  );
}