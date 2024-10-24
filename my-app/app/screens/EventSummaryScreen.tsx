   // File: eventHub/my-app/app/screens/EventSummaryScreen.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { RouteProp } from '@react-navigation/native';

   type EventSummaryScreenRouteProp = RouteProp<{ params: { eventName: string; eventDescription: string; eventType: string; selectedCategory: string; selectedSubcategory: string; timeline: any; } }, 'params'>;
   const EventSummaryScreen = ({ route }: { route: EventSummaryScreenRouteProp }) => {
       const { eventName, eventDescription, eventType, selectedCategory, selectedSubcategory, timeline } = route.params;

       return (
           <View style={styles.container}>
               <Text style={styles.title}>Event Summary</Text>
               <Text>Event Name: {eventName}</Text>
               <Text>Description: {eventDescription}</Text>
               <Text>Type: {eventType}</Text>
               <Text>Category: {selectedCategory}</Text>
               <Text>Subcategory: {selectedSubcategory}</Text>
               <Text>Timeline: {timeline}</Text>
           </View>
       );
   };

   const styles = StyleSheet.create({
       container: {
           flex: 1,
           justifyContent: 'center',
           alignItems: 'center',
           padding: 16,
       },
       title: {
           fontSize: 24,
           fontWeight: 'bold',
           marginBottom: 16,
       },
   });

   export default EventSummaryScreen;