// app/components/CalendarComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface Event {
  id: string;
  title: string;
  description: string;
  color: string;
  date: string; // Date in 'yyyy-MM-dd' format
}

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split('T')[0]); // Set default to today's date

  // Example event data with multiple events on some days
  const events: Event[] = [
    { id: '1', title: 'Team Meeting', description: 'Discuss project updates.', color: 'red', date: '2024-10-01' },
    { id: '2', title: 'Client Call', description: 'Call with the client.', color: 'blue', date: '2024-10-01' },
    { id: '3', title: 'Doctor Appointment', description: 'Annual check-up.', color: 'green', date: '2024-10-02' },
    { id: '4', title: 'Project Presentation', description: 'Present project status.', color: 'purple', date: '2024-10-02' },
    { id: '5', title: 'Lunch with Client', description: 'Business lunch.', color: 'orange', date: '2024-10-02' },
    { id: '6', title: 'Yoga Class', description: 'Weekly yoga class.', color: 'pink', date: '2024-10-03' },
    { id: '7', title: 'Workshop', description: 'Attend workshop on React.', color: 'teal', date: '2024-10-03' },
  ];

  // Group events by date
  const groupedEvents = events.reduce((acc: { [key: string]: Event[] }, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const data = Object.entries(groupedEvents)
    .map(([date, events]) => ({ date, events }))
    .filter(item => item.events.length > 0);

  const renderEventItem = (event: Event) => (
    <View style={[styles.eventContainer, { borderLeftColor: event.color }]}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
  );

  const renderDateItem = ({ item }: { item: { date: string; events: Event[] } }) => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{item.date}</Text>
      {item.events.map(event => (
        <React.Fragment key={event.id}>
          {renderEventItem(event)}
        </React.Fragment>
      ))}
    </View>
  );

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const markedDates = Object.keys(groupedEvents).reduce((acc, date) => {
    const dots = groupedEvents[date].map(event => ({ key: event.id, color: event.color }));
    acc[date] = {
      marked: true,
      dots,
      selected: selectedDate === date,
      selectedColor: dots.length > 0 ? dots[0].color : 'blue', // Use the first dot's color for the selected date
    };
    return acc;
  }, {} as { [key: string]: { marked: boolean; dots: { key: string; color: string }[]; selected?: boolean; selectedColor?: string } });

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]} // Set to today's date
        onDayPress={onDayPress}
        markedDates={markedDates}
        hideExtraDays={true}
        firstDay={1}
        style={styles.calendar}
      />
      <FlatList
        data={data.filter(item => item.date === selectedDate)}
        keyExtractor={item => item.date}
        renderItem={renderDateItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No events for this date</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  calendar: {
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventContainer: {
    padding: 10,
    borderLeftWidth: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default CalendarComponent;
