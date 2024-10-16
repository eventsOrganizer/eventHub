import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import { Ionicons } from '@expo/vector-icons';

interface SaveButtonProps {
  itemId: number;
  itemType: 'event' | 'personal' | 'material' | 'local';
}

const SaveButton: React.FC<SaveButtonProps> = ({ itemId, itemType }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    checkSaveStatus();
  }, []);

  const checkSaveStatus = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('saved')
      .select()
      .eq('user_id', userId)
      .eq(`${itemType}_id`, itemId)
      .single();

    if (data) {
      setIsSaved(true);
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved')
          .delete()
          .eq('user_id', userId)
          .eq(`${itemType}_id`, itemId);

        if (error) throw error;
        setIsSaved(false);
        Alert.alert('Success', 'Item removed from saved items');
      } else {
        const { error } = await supabase
          .from('saved')
          .insert({ user_id: userId, [`${itemType}_id`]: itemId });

        if (error) throw error;
        setIsSaved(true);
        Alert.alert('Success', 'Item saved successfully');
      }
    } catch (error) {
      console.error('Error saving/unsaving item:', error);
      Alert.alert('Error', 'Failed to save/unsave item. Please try again.');
    }
  };

  return (
    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
      <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={24} color="#FF4500" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    padding: 10,
  },
});

export default SaveButton;