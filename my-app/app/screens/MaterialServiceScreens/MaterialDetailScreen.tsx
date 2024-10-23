import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Material, RootStackParamList } from '../../navigation/types';
import Header from '../../components/MaterialDetail/Header';
import MaterialOverview from '../../components/MaterialDetail/MaterialOverview';
import AvailabilityCalendar from '../../components/MaterialDetail/AvailabilityCalendar';
import { MessageCircle, Star, MessageSquare } from 'lucide-react-native';
import ActionButtons from '../../components/MaterialDetail/ActionButtons';
import { useBasket } from '../../hooks/useBasket';
import { useWishlist } from '../../hooks/useWishlist';
import { Text } from 'react-native-paper';

type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, 'MaterialDetail'>;

const { width } = Dimensions.get('window');

const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route, navigation }) => {
  const { material } = route.params as { material: Material };
  const { addToBasket, basketCount } = useBasket();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleReviewPress = () => {
    navigation.navigate('ReviewScreen', { materialId: material.id });
  };

  const handleCommentPress = () => {
    navigation.navigate('CommentScreen', { materialId: material.id });
  };

  return (
    <LinearGradient
      colors={['#7E57C2', '#4A90E2']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <Header 
          navigation={navigation} 
          basketCount={basketCount} 
          material={material} 
        />
        {material.media && material.media.length > 0 && (
          <Image 
            source={{ uri: material.media[0].url }}
            style={styles.materialImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.contentContainer}>
          <MaterialOverview material={material} />
          {material.sell_or_rent === 'rent' && (
            <AvailabilityCalendar materialId={material.id} />
          )}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={handleReviewPress} style={styles.actionButton}>
              <LinearGradient
                colors={['#7E57C2', '#4A90E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionContent}>
                  <MessageCircle size={24} color="white" />
                  <Text style={styles.actionTitle}>Reviews</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCommentPress} style={styles.actionButton}>
              <LinearGradient
                colors={['#7E57C2', '#4A90E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionContent}>
                  <MessageSquare size={24} color="white" />
                  <Text style={styles.actionTitle}>Comments</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ActionButtons 
        material={material}
        onAddToBasket={addToBasket}
        onToggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted(material.id)}
      />
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
  materialImage: {
    width: width,
    height: width * 0.75,
    marginBottom: 16,
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  actionGradient: {
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MaterialDetailScreen;
