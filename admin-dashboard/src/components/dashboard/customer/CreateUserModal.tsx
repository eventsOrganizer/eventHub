import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (user: { name: string; username: string; email: string; details: string }) => void;
}

// Styled components for more control over styles
const GradientDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
  padding: '1.5rem 0',
  borderRadius: '8px 8px 0 0',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
}));

const CustomTextField = styled(TextField)({
  backgroundColor: '#f7f9fc',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  '&:focus-within': {
    borderColor: '#1976d2', // Highlight on focus
    boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.3)',
  },
});

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    transform: 'scale(1.05)',
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    transform: 'scale(1.05)',
  },
}));

export function CreateUserModal({ open, onClose, onCreate }: CreateUserModalProps): React.JSX.Element {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    onCreate(userData);
    onClose();
  };

  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <GradientDialogTitle>
        <Typography variant="h5">Add New User</Typography>
      </GradientDialogTitle>
      <DialogContent sx={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '0 0 8px 8px' }}>
        <Stack spacing={3}>
          <CustomTextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={userData.name}
            onChange={handleChange}
            sx={{ marginTop: '1rem' }} // Adjusted margin for spacing
          />
          <CustomTextField
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            variant="outlined"
            value={userData.username}
            onChange={handleChange}
          />
          <CustomTextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            value={userData.email}
            onChange={handleChange}
          />
          <CustomTextField
            margin="dense"
            label="Details"
            name="details"
            fullWidth
            variant="outlined"
            value={userData.details}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '1rem', justifyContent: 'space-between' }}>
        <CancelButton variant="outlined" onClick={onClose}>
          Cancel
        </CancelButton>
        <CreateButton variant="contained" onClick={handleCreate}>
          Create
        </CreateButton>
      </DialogActions>
    </Dialog>
  );
}
