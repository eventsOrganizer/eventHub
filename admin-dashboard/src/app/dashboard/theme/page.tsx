// import React , {useState , useEffect} from 'react';
// import { Button, Stack, Typography } from '@mui/material';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
// import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
// import { CustomersTable } from '@/components/dashboard/customer/customers-table';
// import { CreateUserModal } from '@/components/dashboard/customer/CreateUserModal';
// import { useThemeContext  , CustomThemeProvider } from '@/components/dashboard/context/ThemeContext';
// import { supabase } from '../../../lib/supabase-client';

// export default function Page(): React.JSX.Element {
//   const { toggleTheme, isDarkMode } = useThemeContext();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleCreateUser = (newUser) => {
//     setCustomers((prev) => [...prev, newUser]);
//   };

//   return (
//     <Stack spacing={3}>
//       <Stack direction="row" spacing={3}>
//         <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
//           <Typography variant="h4">Users</Typography>
//         </Stack>
//         <Button
//           startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
//           variant="contained"
//           onClick={handleOpen}
//         >
//           Add User
//         </Button>
//         <Button variant="contained" onClick={toggleTheme}>
//           {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//         </Button>
//       </Stack>
//       <CreateUserModal open={open} onClose={handleClose} onCreate={handleCreateUser} />
//       <CustomersFilters
//         searchQuery={searchQuery}
//         onSearchChange={handleSearchChange}
//         isDeleteEnabled={selected.size > 0}
//       />
//       <CustomersTable
//         count={filteredCustomers.length}
//         page={page}
//         rows={paginatedCustomers}
//         rowsPerPage={rowsPerPage}
//         onPageChange={handlePageChange}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         onSelectionChange={handleSelectionChange}
//       />
//     </Stack>
//   );
// }