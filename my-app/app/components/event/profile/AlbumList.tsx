import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { supabase } from '../../../services/supabaseClient';

interface Album {
  id: number;
  name: string;
  cover_url: string;
}

const AlbumsList: React.FC<{ userId: string }> = ({ userId }) => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetchAlbums();
  }, [userId]);

  const fetchAlbums = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('album_id, url')
      .eq('user_id', userId)
      .not('album_id', 'is', null);

    if (error) {
      console.error('Error fetching albums:', error);
    } else if (data) {
      const albumsMap = new Map<number, Album>();
      data.forEach(item => {
        if (!albumsMap.has(item.album_id)) {
          albumsMap.set(item.album_id, {
            id: item.album_id,
            name: `Album ${item.album_id}`,
            cover_url: item.url,
          });
        }
      });
      setAlbums(Array.from(albumsMap.values()));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Albums</Text>
      <FlatList
        data={albums}
        renderItem={({ item }) => (
          <View style={styles.albumItem}>
            <Image source={{ uri: item.cover_url }} style={styles.albumCover} />
            <Text style={styles.albumName}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  albumItem: {
    marginRight: 15,
  },
  albumCover: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  albumName: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default AlbumsList;