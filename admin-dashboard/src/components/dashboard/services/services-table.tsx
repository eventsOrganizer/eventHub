import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface ServicesTableProps {
  services: any[];
}

export function ServicesTable({ services }: ServicesTableProps): React.JSX.Element {
  return (
    <Table>
      <TableHead> 
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Details</TableCell>
          <TableCell>Price Per Hour</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}