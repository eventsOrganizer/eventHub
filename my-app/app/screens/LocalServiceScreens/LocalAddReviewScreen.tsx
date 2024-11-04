import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { addLocalReview } from '../../services/localService';
import { useUser } from '../../UserContext';
import { useToast } from '../../hooks/useToast';
import Icon from 'react-native-vector-icons/FontAwesome';

const LocalAddReviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { localId } = route.params as { localId: number };
  const { userId } = useUser();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour soumettre un avis.",
        variant: "default",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Note invalide",
        description: "Veuillez sélectionner au moins une étoile.",
        variant: "destructive",
      });
      return;
    }

    const success = await addLocalReview(localId, userId, rating);
    if (success) {
      toast({
        title: "Succès",
        description: "Votre avis a été soumis avec succès.",
        variant: "default",
      });
      navigation.goBack();
    } else {
      toast({
        title: "Erreur",
        description: "Échec de la soumission de l'avis. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <LinearGradient
      colors={['#F0F4F8', '#E1E8ED', '#D2DCE5', '#C3D0D9']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Donner un avis</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Icon
                  name={star <= rating ? 'star' : 'star-o'}
                  size={40}
                  color={star <= rating ? '#FFD700' : '#C0C0C0'}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
            <Text style={styles.submitButtonText}>Soumettre l'avis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4A90E2',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LocalAddReviewScreen;

