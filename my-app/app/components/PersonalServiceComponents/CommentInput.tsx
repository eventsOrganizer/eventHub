import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { theme } from '../../../lib/theme';

interface CommentInputProps {
  personalId: number;
  userId: string | null;
  toast: (props: { title: string; description: string; variant: "default" | "destructive" }) => void;
  onCommentAdded: (newComment: any) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ personalId, userId, toast, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAddComment = useCallback(async () => {
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

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comment')
        .insert({
          personal_id: personalId,
          user_id: userId,
          details: newComment.trim()
        })
        .select('*, user:user_id (username)')
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre commentaire a été ajouté avec succès.",
        variant: "default",
      });
      setNewComment('');
      onCommentAdded(data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du commentaire. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, personalId, userId, toast, onCommentAdded]);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Ajouter un commentaire..."
        value={newComment}
        onChangeText={setNewComment}
        multiline
        editable={!isSubmitting}
      />
      <TouchableOpacity 
        style={[styles.addButton, isSubmitting && styles.disabledButton]}
        onPress={handleAddComment}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting ? 'Envoi...' : 'Ajouter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.personalDetailBorder,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    maxHeight: 100,
    backgroundColor: theme.colors.gradientEnd,
    ...theme.typography.body,
    color: theme.colors.personalDetailText,
  },
  addButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    shadowColor: theme.colors.personalDetailShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: theme.colors.cardDescription,
    opacity: 0.7,
  },
  addButtonText: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
  },
});

export default CommentInput;