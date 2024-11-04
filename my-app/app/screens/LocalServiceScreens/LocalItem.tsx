import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { LocalService } from '../../services/serviceTypes';
import { styles } from './styles';

interface LocalItemProps {
  item: LocalService;
  onPress: (id: number) => void;
}

const LocalItem: React.FC<LocalItemProps> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.localItem}
    onPress={() => onPress(item.id)}
  >
    <Image source={{ uri: item.media?.[0]?.url || 'https://via.placeholder.com/150' }} style={styles.localImage} />
    <View style={styles.localInfo}>
      <Text style={styles.localName}>{item.name}</Text>
      <Text style={styles.localPrice}>{item.priceperhour}€/hour</Text>
      <Text style={styles.localDetails}>{item.details}</Text>
      <View style={styles.localStats}>
        <Text style={styles.localLikes}>❤️ {item.like?.length || 0}</Text>
        <Text style={styles.localReviews}>⭐ {item.reviews?.length || 0}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default LocalItem;
