import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MaterialCard from './MaterialCard';
import { Material } from '../../navigation/types';

interface MaterialListProps {
  materials: Material[];
  addToBasket: (material: Material) => void;
  navigation: any;
}

const MaterialList: React.FC<MaterialListProps> = ({ materials, addToBasket, navigation }) => {
  const renderMaterialItem = ({ item, index }: { item: Material; index: number }) => (
    <MaterialCard
      item={item}
      index={index}
      onPress={() => navigation.navigate('MaterialDetail', { material: item })}
      onAddToBasket={() => addToBasket(item)}
    />
  );

  return (
    <FlatList
      data={materials}
      renderItem={renderMaterialItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default MaterialList;