import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { supabase } from '../../../lib/supabase-client';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose, onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    subcategories: [''],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSubcategoryChange = (index: number, value: string) => {
    const updatedSubcategories = [...newCategory.subcategories];
    updatedSubcategories[index] = value;
    setNewCategory((prev) => ({ ...prev, subcategories: updatedSubcategories }));
  };

  const addSubcategoryInput = () => {
    setNewCategory((prev) => ({ ...prev, subcategories: [...prev.subcategories, ''] }));
  };

  const handleSubmit = async () => {
    try {
      // Insert the new category
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .insert([{ name: newCategory.name, type: 'event' }])
        .select();

      if (categoryError) throw categoryError;

      const categoryId = categoryData[0].id;

      // Prepare and insert subcategories
      const subcategories = newCategory.subcategories.map((name) => ({
        name,
        category_id: categoryId,
      }));

      const { error: subcategoryError } = await supabase
        .from('subcategory')
        .insert(subcategories);

      if (subcategoryError) throw subcategoryError;

      // Success notification
      setSnackbar({
        open: true,
        message: 'Category and subcategories added successfully',
        severity: 'success',
      });
      onCategoryAdded();
      onClose();
    } catch (error) {
      console.error('Error adding category and subcategories:', error);
      // Error notification
      setSnackbar({
        open: true,
        message: 'Error adding category and subcategories',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 500, mt: '10%' }}>
          <Typography variant="h6">Add New Category</Typography>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={newCategory.name}
            onChange={handleCategoryChange}
          />
          {newCategory.subcategories.map((subcategory, index) => (
            <TextField
              key={index}
              label={`Subcategory ${index + 1}`}
              fullWidth
              margin="normal"
              value={subcategory}
              onChange={(e) => handleSubcategoryChange(index, e.target.value)}
            />
          ))}
          <Button onClick={addSubcategoryInput} variant="outlined" color="primary">
            Add Subcategory
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddCategoryModal;
