// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { supabase } from '../../services/supabaseClient';
// import { useUser } from '../../UserContext';

// interface Request {
//   id: number;
//   status: string;
//   user: { id: string; email: string };
//   event?: { id: number; name: string };
//   personal?: { id: number; name: string };
//   local?: { id: number; name: string };
//   material?: { id: number; name: string };
// }

// const Requests: React.FC = () => {
//   const { userId } = useUser();
//   const [requests, setRequests] = useState<Request[]>([]);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     const { data, error } = await supabase
//       .from('request')
//       .select(`
//         id,
//         status,
//         user:user_id (id, email),
//         event:event_id (id, name),
//         personal:personal_id (id, name),
//         local:local_id (id, name),
//         material:material_id (id, name)
//       `)
//       .eq('status', 'pending');
  
//     if (error) {
//       console.error('Error fetching requests:', error);
//     } else if (data) {
//       const formattedRequests: Request[] = data.map((item: any) => ({
//         id: item.id,
//         status: item.status,
//         user: item.user[0],
//         event: item.event[0],
//         personal: item.personal[0],
//         local: item.local[0],
//         material: item.material[0],
//       }));
//       setRequests(formattedRequests);
//     }
//   };

//   const handleAccept = async (requestId: number) => {
//     const { error } = await supabase
//       .from('request')
//       .update({ status: 'accepted' })
//       .eq('id', requestId);

//     if (error) {
//       console.error('Error accepting request:', error);
//       Alert.alert('Error', 'Failed to accept request');
//     } else {
//       fetchRequests();
//     }
//   };

//   const handleReject = async (requestId: number) => {
//     const { error } = await supabase
//       .from('request')
//       .update({ status: 'rejected' })
//       .eq('id', requestId);

//     if (error) {
//       console.error('Error rejecting request:', error);
//       Alert.alert('Error', 'Failed to reject request');
//     } else {
//       fetchRequests();
//     }
//   };

//   const renderRequest = ({ item }: { item: Request }) => (
//     <View style={styles.requestItem}>
//       <Text style={styles.requestText}>
//         {item.user.email} requested to join {item.event?.name || item.personal?.name || item.local?.name || item.material?.name}
//       </Text>
//       <Text style={styles.statusText}>Status: {item.status}</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.acceptButton]}
//           onPress={() => handleAccept(item.id)}
//         >
//           <Text style={styles.buttonText}>Accept</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.rejectButton]}
//           onPress={() => handleReject(item.id)}
//         >
//           <Text style={styles.buttonText}>Reject</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pending Requests</Text>
//       {requests.length > 0 ? (
//         <FlatList
//           data={requests}
//           renderItem={renderRequest}
//           keyExtractor={(item) => item.id.toString()}
//         />
//       ) : (
//         <Text style={styles.emptyText}>No pending requests</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   requestItem: {
//     backgroundColor: '#f0f0f0',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   requestText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   button: {
//     padding: 10,
//     borderRadius: 5,
//     width: '48%',
//     alignItems: 'center',
//   },
//   acceptButton: {
//     backgroundColor: '#4CAF50',
//   },
//   rejectButton: {
//     backgroundColor: '#F44336',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default Requests;