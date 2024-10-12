import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchPersonalDetail, addComment, toggleLike, Service } from '../../services/personalService';
import { Ionicons } from '@expo/vector-icons';

const PersonalDetail: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { personalId } = route.params as { personalId: number };
  const [personalData, setPersonalData] = useState<Service | null>(null);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPersonalDetail(personalId);
      setPersonalData(data);
      // Vérifiez si l'utilisateur actuel a aimé ce service
      // Cela nécessiterait de connaître l'ID de l'utilisateur actuel
      // setIsLiked(data?.likes.some(like => like.user_id === currentUserId));
    };
    fetchData();
  }, [personalId]);

  const handleAddComment = async () => {
    if (comment.trim() && personalData) {
      // Cela nécessiterait de connaître l'ID de l'utilisateur actuel
      // const result = await addComment(personalData.id, currentUserId, comment);
      // if (result) {
      //   setPersonalData(prevData => ({
      //     ...prevData!,
      //     comments: [...(prevData?.comments || []), { details: comment, user_id: currentUserId }]
      //   }));
      //   setComment('');
      // }
    }
  };

  const handleToggleLike = async () => {
    if (personalData) {
      // Cela nécessiterait de connaître l'ID de l'utilisateur actuel
      // const result = await toggleLike(personalData.id, currentUserId);
      // if (result !== null) {
      //   setIsLiked(result);
      //   setPersonalData(prevData => ({
      //     ...prevData!,
      //     likes: result
      //       ? [...(prevData?.likes || []), { user_id: currentUserId }]
      //       : (prevData?.likes || []).filter(like => like.user_id !== currentUserId)
      //   }));
      // }
    }
  };

  if (!personalData) {
    return <Text>Chargement...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: personalData.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{personalData.name}</Text>
        <Text style={styles.price}>${personalData.priceperhour}/hr</Text>
        <Text style={styles.details}>{personalData.details}</Text>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={handleToggleLike} style={styles.likeButton}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? "red" : "black"} />
            <Text>{personalData.likes?.length || 0} Likes</Text>
          </TouchableOpacity>
          <View style={styles.reviewsContainer}>
            <Ionicons name="star" size={24} color="gold" />
            <Text>{personalData.review?.length || 0} Reviews</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Disponibilité</Text>
        {personalData.availability?.map((slot, index) => (
          <Text key={index}>{`${slot.date}: ${slot.start} - ${slot.end}`}</Text>
        )) || <Text>Aucune disponibilité</Text>}

        <Text style={styles.sectionTitle}>Commentaires</Text>
        {personalData.comments?.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentUser}>Utilisateur {comment.user_id}</Text>
            <Text>{comment.details}</Text>
          </View>
        )) || <Text>Aucun commentaire</Text>}

        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Ajouter un commentaire..."
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
            <Text>Poster</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addCommentButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PersonalDetail;