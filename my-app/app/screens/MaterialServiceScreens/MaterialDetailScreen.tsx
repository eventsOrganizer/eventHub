import React, { useState } from 'react';
import { View, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Material, RootStackParamList } from '../../navigation/types';
import Header from '../../components/MaterialDetail/Header';
import ImageCarousel from '../../components/MaterialDetail/ImageCarousel';
import MaterialDetailContent from '../../components/MaterialDetail/MaterialDetailContent';
import ActionButtons from '../../components/MaterialDetail/ActionButtons';
import { ConfirmRentalModal } from '../../components/basket/ConfirmRentalModal';
import { AuthRequiredModal } from '../../components/Auth/AuthRequiredModal';
import { useBasket } from '../../components/basket/BasketContext';
import { useWishlist } from '../../hooks/useWishlist';
import { useUser } from '../../UserContext';
import { themeColors } from '../../utils/themeColors';
import { useToast } from '../../hooks/use-toast';
import { createRentalRequest } from '../../services/rentalRequestService';

type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, 'MaterialDetail'>;

const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route, navigation }) => {
  const { material } = route.params as { material: Material };
  const { addToBasket, basketItems } = useBasket();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated, userId } = useUser();
  const { toast } = useToast();
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const theme = material.sell_or_rent === 'rent' ? themeColors.rent : themeColors.sale;

  const handleReviewPress = () => {
    navigation.navigate('ReviewScreen', { 
      materialId: material.id,
      sellOrRent: material.sell_or_rent
    });
  };

  const handleCommentPress = () => {
    navigation.navigate('CommentScreen', { materialId: material.id });
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleAddToBasket = () => {
    if (material.sell_or_rent === 'rent') {
      if (!isAuthenticated || !userId) {
        setShowAuthModal(true);
      } else {
        setShowRentalModal(true);
      }
    } else {
      addToBasket(material);
      toast({
        title: "Added to basket",
        description: `${material.name} has been added to your basket`
      });
    }
  };

  const handleConfirmRental = async () => {
    try {
      if (!isAuthenticated || !userId) {
        setShowAuthModal(true);
        return;
      }

      await createRentalRequest(Number(material.id), userId);
      
      setShowRentalModal(false);
      toast({
        title: "Success",
        description: "Rental request sent successfully"
      });
    } catch (error) {
      console.error('Error creating rental request:', error);
      toast({
        title: "Error",
        description: "Failed to send rental request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    navigation.navigate('Signin' as never);
  };

  const handleSignUp = () => {
    setShowAuthModal(false);
    navigation.navigate('Signup' as never);
  };
  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header 
          navigation={navigation} 
          basketCount={basketItems.length} 
          material={material}
        />
        
        <ImageCarousel media={material.media} />

        <MaterialDetailContent
          material={material}
          theme={theme}
          onReviewPress={handleReviewPress}
          onCommentPress={handleCommentPress}
        />
      </ScrollView>

      <ActionButtons 
        material={material}
        onAddToBasket={handleAddToBasket}
        onToggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted(material.id)}
        theme={theme}
      />

      <ConfirmRentalModal
        visible={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        onConfirm={handleConfirmRental}
        materialName={material.name}
      />

      <AuthRequiredModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Please sign in to send rental requests"
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default MaterialDetailScreen;
