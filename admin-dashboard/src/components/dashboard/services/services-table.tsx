import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface ServicesTableProps {
  services: any[];
}

export function ServicesTable({ services }: ServicesTableProps): React.JSX.Element {
  const router = useRouter();

  return (
    <Table>
      <TableHead> 
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Details</TableCell>
          <TableCell>Price Per Hour</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.details}</TableCell>
            <TableCell>{service.priceperhour}</TableCell>
            <TableCell>{service.startdate}</TableCell>
            <TableCell>{service.enddate}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                onClick={() => router.push(`/services-details?id=${service.id}`)}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}