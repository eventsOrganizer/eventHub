import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Image, Dimensions } from 'react-native';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Material, RootStackParamList } from '../../navigation/types';
import Header from '../../components/MaterialDetail/Header';
import MaterialOverview from '../../components/MaterialDetail/MaterialOverview';
import AvailabilityCalendar from '../../components/MaterialDetail/AvailabilityCalendar';
import ReviewSection from '../../components/MaterialService/ReviewSection';
import ActionButtons from '../../components/MaterialDetail/ActionButtons';
import { useBasket } from '../../hooks/useBasket';
import { useWishlist } from '../../hooks/useWishlist';

type MaterialDetailScreenProps = MaterialTopTabScreenProps<RootStackParamList, 'MaterialDetail'>;

const { width } = Dimensions.get('window');

const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({ route, navigation }) => {
  const { material } = route.params as { material: Material };
  const { addToBasket, basketCount } = useBasket();
  const { toggleWishlist, isWishlisted } = useWishlist();

  return (
    <LinearGradient
      colors={['#F0F4F8', '#E1E8ED', '#D2DCE5', '#C3D0D9']}
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
          <ReviewSection materialId={material.id} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

export default MaterialDetailScreen;