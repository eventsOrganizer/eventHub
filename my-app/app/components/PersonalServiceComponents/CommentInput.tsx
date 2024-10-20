import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';

interface CommentInputProps {
  personalId: number;
  userId: string | null;
  toast: (props: { title: string; description: string; variant: "default" | "destructive" }) => void;
  onCommentAdded: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ personalId, userId, toast, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!userId) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour ajouter un commentaire.",
        variant: "default",
      });
      return;
    }

    if (newComment.trim() === '') {
      toast({
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comment')
        .insert({
          personal_id: personalId,
          user_id: userId,
          details: newComment.trim()
        })
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre commentaire a été ajouté avec succès.",
        variant: "default",
      });
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du commentaire.",
        variant: "destructive",
      });
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Ajouter un commentaire..."
        value={newComment}
        onChangeText={setNewComment}
        multiline
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddComment}
      >
        <Text style={styles.addButtonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    maxHeight: 100,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommentInput;