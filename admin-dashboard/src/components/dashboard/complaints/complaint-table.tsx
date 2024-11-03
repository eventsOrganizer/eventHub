import React from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import { useSelection } from '@/hooks/use-selection';

interface Complaint {
  id: number;
  created_at: string;
  status: string;
  category: string;
  title: string;
}

interface ComplaintTableProps {
  complaints: Complaint[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectionChange?: (selected: Set<number>) => void;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange = () => {},
}) => {
  const rowIds = React.useMemo(() => complaints.map((complaint) => complaint.id), [complaints]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  React.useEffect(() => {
    onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < complaints.length;
  const selectedAll = complaints.length > 0 && selected?.size === complaints.length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'in_review':
        return { backgroundColor: 'rgba(211, 211, 211, 0.2)' }; // Light grey
      case 'pending':
        return { backgroundColor: 'rgba(255, 255, 0, 0.3)' }; // Light yellow
      case 'resolved':
        return { backgroundColor: 'rgba(144, 238, 144, 0.3)' }; // Light green
      default:
        return {};
    }
  };

  const formatStatus = (status: string) => {
    if (status === 'in_review') {
      return 'In Review';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card>
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
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint) => {
            const isSelected = selected?.has(complaint.id);

            return (
              <TableRow
                hover
                key={complaint.id}
                selected={isSelected}
                onClick={() => (isSelected ? deselectOne(complaint.id) : selectOne(complaint.id))}
                sx={{
                  cursor: 'pointer',
                  ...getStatusStyle(complaint.status),
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.12)',
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
                        selectOne(complaint.id);
                      } else {
                        deselectOne(complaint.id);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.title}</TableCell>
                <TableCell>{new Date(complaint.created_at).toLocaleString()}</TableCell>
                <TableCell>{formatStatus(complaint.status)}</TableCell>
                <TableCell>{complaint.category}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
};

export default ComplaintTable;