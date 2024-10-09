// // screens/EventDetailScreen.tsx
// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const EventDetailScreen: React.FC = ({ route }) => {
//   const { title, description, imageUrl } = route.params;

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: imageUrl }} style={styles.image} />
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.price}>$299 USD</Text>
//         <View style={styles.locationContainer}>
//           <Ionicons name="location-outline" size={16} color="#666" />
//           <Text style={styles.location}>ABC Avenue, Dhaka</Text>
//         </View>
//         <View style={styles.dateContainer}>
//           <Ionicons name="calendar-outline" size={16} color="#666" />
//           <Text style={styles.date}>25-27 October, 22</Text>
//         </View>
//         <Text style={styles.members}>15.7k+ Members are joined</Text>
//         <View style={styles.organizerContainer}>
//           <Image
//             source={{ uri: 'https://example.com/organizer.jpg' }}
//             style={styles.organizerImage}
//           />
//           <Text style={styles.organizerName}>Tamim Ikram</Text>
//           <Text style={styles.organizerRole}>Event Organiser</Text>
//         </View>
//         <Text style={styles.description}>
//           Description: {description}
//         </Text>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>BUY A TICKET</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//   },
//   detailsContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   price: {
//     fontSize: 18,
//     color: '#FF6347',
//     marginVertical: 10,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   location: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 5,
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   date: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 5,
//   },
//   members: {
//     fontSize: 14,
//     color: '#666',
//     marginVertical: 10,
//   },
//   organizerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   organizerImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   organizerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   organizerRole: {
//     fontSize: 14,
//     color: '#666',
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//     marginVertical: 10,
//   },
//   button: {
//     backgroundColor: '#000',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default EventDetailScreen;