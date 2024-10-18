import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { format, eachDayOfInterval, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UnifiedCalendarProps {
  startDate: Date;
  endDate: Date;
  selectedDates: Date[];
  onSelectDate: (date: Date) => void;
  interval: 'Yearly' | 'Monthly' | 'Weekly';
}

type WeekDay = React.ReactNode;

export const UnifiedCalendar: React.FC<UnifiedCalendarProps> = ({
  startDate,
  endDate,
  selectedDates,
  onSelectDate,
  interval,
}) => {
  const renderCalendar = () => {
    switch (interval) {
      case 'Yearly':
        return renderYearlyCalendar();
      case 'Monthly':
        return renderMonthlyCalendar();
      case 'Weekly':
        return renderWeeklyCalendar();
      default:
        return null;
    }
  };

  const renderYearlyCalendar = () => {
    const months = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      months.push(
        <View key={currentDate.getTime()} style={styles.month}>
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{format(monthStart, 'MMMM yyyy')}</Text>
          </View>
          {renderDaysOfWeek(monthStart)}
          {renderMonth(monthStart, monthEnd)}
        </View>
      );
      currentDate = addDays(monthEnd, 1);
    }
    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{months}</ScrollView>;
  };

  const renderMonthlyCalendar = () => {
    const currentMonthStart = startOfMonth(startDate);
    const nextMonthEnd = endOfMonth(addMonths(currentMonthStart, 1));
    
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.month}>
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{format(startDate, 'MMMM yyyy')}</Text>
          </View>
          {renderDaysOfWeek(startDate)}
          {renderMonth(startDate, endOfMonth(startDate))}
        </View>
        <View style={styles.month}>
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{format(addMonths(startDate, 1), 'MMMM yyyy')}</Text>
          </View>
          {renderDaysOfWeek(addMonths(startDate, 1))}
          {renderMonth(startOfMonth(addMonths(startDate, 1)), nextMonthEnd)}
        </View>
      </ScrollView>
    );
  };

  const renderWeeklyCalendar = () => {
    const weekEnd = addDays(startDate, 6);
    return (
      <View style={styles.weekContainer}>
        <View style={styles.monthTitleContainer}>
          <Text style={styles.weekTitle}>Semaine du {format(startDate, 'd MMMM yyyy', { locale: fr })}</Text>
        </View>
        {renderDaysOfWeek(startDate)}
        {renderWeek(startDate, weekEnd)}
      </View>
    );
  };

  const renderDaysOfWeek = (date: Date) => {
    return (
      <View style={styles.daysOfWeek}>
        {[...Array(7)].map((_, i) => (
          <Text key={i} style={styles.dayOfWeek}>
            {format(addDays(date, i), 'EEE', { locale: fr })}
          </Text>
        ))}
      </View>
    );
  };

  const renderMonth = (start: Date, end: Date) => {
    const days = eachDayOfInterval({ start: startOfWeek(start), end: endOfWeek(end) });
    const weeks: WeekDay[][] = [];
    let week: WeekDay[] = [];

    days.forEach((day, index) => {
      if (index % 7 === 0 && week.length > 0) {
        weeks.push(week);
        week = [];
      }
      week.push(
        <TouchableOpacity
          key={day.getTime()}
          style={[
            styles.day,
            !isSameMonth(day, start) && styles.outsideMonth,
            selectedDates.some(d => isSameDay(d, day)) && styles.selectedDay
          ]}
          onPress={() => onSelectDate(day)}
          disabled={day < startDate || day > endDate}
        >
          <Text style={styles.dayText}>{format(day, 'd')}</Text>
        </TouchableOpacity>
      );
    });

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks.map((weekDays, index) => (
      <View key={index} style={styles.week}>
        {weekDays}
      </View>
    ));
  };

  const renderWeek = (start: Date, end: Date) => {
    const days = eachDayOfInterval({ start, end });
    return (
      <View style={styles.week}>
        {days.map(day => (
          <TouchableOpacity
            key={day.getTime()}
            style={[
              styles.day,
              selectedDates.some(d => isSameDay(d, day)) && styles.selectedDay
            ]}
            onPress={() => onSelectDate(day)}
          >
            <Text style={styles.dayName}>{format(day, 'EEE', { locale: fr })}</Text>
            <Text style={styles.dayNumber}>{format(day, 'd')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      <ScrollView 
        horizontal={interval !== 'Weekly'}
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollViewContent}
      >
        {renderCalendar()}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CALENDAR_WIDTH = width * 0.90; // 90% of screen width

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center', // Center the calendar horizontally
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  month: {
    width: CALENDAR_WIDTH,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  monthTitleContainer: {
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekContainer: {
    width: CALENDAR_WIDTH,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 5,
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  day: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  dayName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
  },
  dayText: {
    fontSize: 16,
  },
  outsideMonth: {
    opacity: 0.3,
  },
  selectedDay: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red for selected dates
  },
});

export default UnifiedCalendar;