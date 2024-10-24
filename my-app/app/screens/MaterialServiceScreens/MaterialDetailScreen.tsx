import React from 'react';
import { View, ScrollView, StatusBar, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Material, RootStackParamList } from '../../navigation/types';
import Header from '../../components/MaterialDetail/Header';
import MaterialOverview from '../../components/MaterialDetail/MaterialOverview';
import AvailabilityCalendar from '../../components/MaterialDetail/AvailabilityCalendar';
import { MessageCircle, Star, MessageSquare, Share2 } from 'lucide-react-native';
import ActionButtons from '../../components/MaterialDetail/ActionButtons';
import { useBasket } from '../../hooks/useBasket';
import { useWishlist } from '../../hooks/useWishlist';
import { Text, Card } from 'react-native-paper';
import { themeColors } from '../../utils/themeColors';
import { BlurView } from 'expo-blur';

type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, 'MaterialDetail'>;

const { width } = Dimensions.get('window');

const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route, navigation }) => {
  const { material } = route.params as { material: Material };
  const { addToBasket, basketCount } = useBasket();
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const theme = material.sell_or_rent === 'rent' ? themeColors.rent : themeColors.sale;

  const handleReviewPress = () => {
    navigation.navigate('ReviewScreen', { materialId: material.id });
  };

  const handleCommentPress = () => {
    navigation.navigate('CommentScreen', { materialId: material.id });
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header 
          navigation={navigation} 
          basketCount={basketCount} 
          material={material}
        />
        
        {material.media && material.media.length > 0 && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: material.media[0].url }}
              style={styles.materialImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <BlurView intensity={80} tint="light" style={styles.blurButton}>
                <Share2 size={24} color={theme.primary} />
              </BlurView>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.contentContainer, { backgroundColor: theme.light }]}>
          <MaterialOverview material={material} theme={theme} />
          
          {material.sell_or_rent === 'rent' && (
            <Card style={[styles.calendarCard, { backgroundColor: theme.light }]}>
              <Card.Content>
                <AvailabilityCalendar materialId={material.id} theme={theme} />
              </Card.Content>
            </Card>
          )}

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              onPress={handleReviewPress} 
              style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
            >
              <View style={styles.actionContent}>
                <MessageCircle size={24} color={theme.primary} />
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: theme.primary }]}>Reviews</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={theme.primary} />
                    <Text style={styles.ratingText}>
                      {material.average_rating?.toFixed(1) || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleCommentPress} 
              style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
            >
              <View style={styles.actionContent}>
                <MessageSquare size={24} color={theme.primary} />
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: theme.primary }]}>Comments</Text>
                  <Text style={[styles.commentCount, { color: theme.primary }]}>View all comments</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ActionButtons 
        material={material}
        onAddToBasket={addToBasket}
        onToggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted(material.id)}
        theme={theme}
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
  imageContainer: {
    position: 'relative',
    width: width,
    height: width * 0.75,
    marginBottom: 16,
  },
  materialImage: {
    width: '100%',
    height: '100%',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurButton: {
    padding: 12,
    borderRadius: 20,
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  calendarCard: {
    marginVertical: 16,
    borderRadius: 15,
    elevation: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginVertical: 16,
  },
  actionButton: {
    borderRadius: 15,
    padding: 16,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: themeColors.common.gray,
  },
  commentCount: {
    fontSize: 14,
    color: themeColors.common.gray,
    marginTop: 4,
  },
});

export default MaterialDetailScreen;