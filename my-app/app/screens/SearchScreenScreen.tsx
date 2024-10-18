// import React, { useState } from 'react';
// import { View, TextInput, Text, StyleSheet, FlatList } from 'react-native';
// import { useRoute } from '@react-navigation/native';

// const SearchResultsScreen: React.FC = () => {
//   const route = useRoute();
//   const { initialSearchTerm } = route.params as { initialSearchTerm: string };
//   const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
//   const [results, setResults] = useState<any[]>([]);

//   type RootStackParamList = {
//     Home: undefined;
//     PersonalsScreen: { category: string };
//     ChatList: undefined;
//     PersonalDetail: { personalId: number };
//     EventDetails: { eventId: number };
//     AllEvents: undefined;
//     LocalServicesScreen: undefined;
//     MaterialsAndFoodServicesScreen: undefined;
//     LocalServiceScreen: undefined;
//     MaterialServiceDetail: { materialId: number };
//     LocalServiceDetails: { localServiceId: number };
//     SearchResults: { initialSearchTerm: string }; // Add this line
//   };


//   const handleSearch = (searchTerm: string) => {
//     if (!searchTerm) {
//       setFilteredEvents(events);
//       setFilteredServices(staffServices);
//       return;
//     }

//     const normalizedSearchTerm = searchTerm.toLowerCase();

//     const newFilteredEvents = events.filter(event => {
//       const title = event.title?.toLowerCase() || '';
//       const description = event.description?.toLowerCase() || '';
//       return title.includes(normalizedSearchTerm) || description.includes(normalizedSearchTerm);
//     });

//     const newFilteredServices = staffServices.filter(service => {
//       const name = service.name?.toLowerCase() || '';
//       const details = service.details?.toLowerCase() || '';
//       return name.includes(normalizedSearchTerm) || details.includes(normalizedSearchTerm);
//     });

//     setFilteredEvents(newFilteredEvents);
//     setFilteredServices(newFilteredServices);
//   };




//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search..."
//         value={searchTerm}
//         onChangeText={setSearchTerm}
//         onSubmitEditing={() => handleSearch(searchTerm)}
//       />
//       <FlatList
//         data={results}
//         renderItem={({ item }) => <Text>{item.name}</Text>}
//         keyExtractor={(item) => item.id.toString()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
// });

// export default SearchResultsScreen;