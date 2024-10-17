import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
          <Text style={styles.monthTitle}>{format(monthStart, 'MMMM yyyy')}</Text>
          {renderDaysOfWeek(monthStart)}
          {renderMonth(monthStart, monthEnd)}
        </View>
      );
      currentDate = addDays(monthEnd, 1);
    }
    return <ScrollView>{months}</ScrollView>;
  };

  const renderMonthlyCalendar = () => {
    const currentMonthStart = startOfMonth(startDate);
    const nextMonthEnd = endOfMonth(addMonths(currentMonthStart, 1));
    
    return (
      <View style={styles.month}>
        <Text style={styles.monthTitle}>{format(startDate, 'MMMM yyyy')}</Text>
        {renderDaysOfWeek(startDate)}
        {renderMonth(startDate, endOfMonth(startDate))}
        <Text style={styles.monthTitle}>{format(addMonths(startDate, 1), 'MMMM yyyy')}</Text>
        {renderDaysOfWeek(addMonths(startDate, 1))}
        {renderMonth(startOfMonth(addMonths(startDate, 1)), nextMonthEnd)}
      </View>
    );
  };

  const renderWeeklyCalendar = () => {
    const weekEnd = addDays(startDate, 6);
    return (
      <View style={styles.weekContainer}>
        <Text style={styles.weekTitle}>Semaine du {format(startDate, 'd MMMM yyyy', { locale: fr })}</Text>
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
          <Text>{format(day, 'd')}</Text>
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
    <View style={styles.calendar}>
      {renderCalendar()}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
  },
  month: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weekContainer: {
    marginBottom: 20,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  dayOfWeek: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  day: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 10,
  },
  dayName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dayNumber: {
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