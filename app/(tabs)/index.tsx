import { StyleSheet, View, TextInput, FlatList, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface TodoItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  status: 'done' | 'in-progress' | 'to-do';
  icon: string;
  date: Date;
}

function generateDates(centerDate: Date, daysBeforeAfter: number = 15): Array<{
  date: Date;
  isActive: boolean;
  isSelected: boolean;
  unfinishedTasks: number;
}> {
  const dates = [];
  const today = new Date();
  
  for (let i = -daysBeforeAfter; i <= daysBeforeAfter; i++) {
    const date = addDays(centerDate, i);
    dates.push({
      date,
      isActive: isSameDay(date, today),
      isSelected: isSameDay(date, centerDate),
      unfinishedTasks: 0,
    });
  }
  return dates;
}

const TABS = ['All', 'To do', 'In Progress', 'Completed'];

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState('All');
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [todos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Market Research',
      subtitle: 'Grocery shopping app design',
      time: '10:00 AM',
      status: 'done',
      icon: '🛒',
      date: new Date(),
    },
    {
      id: '2',
      title: 'Competitive Analysis',
      subtitle: 'Grocery shopping app design',
      time: '12:00 PM',
      status: 'in-progress',
      icon: '🛒',
      date: new Date(),
    },
    {
      id: '3',
      title: 'Create Low-fidelity Wireframe',
      subtitle: 'Uber Eats redesign challenge',
      time: '07:00 PM',
      status: 'to-do',
      icon: '🎨',
      date: new Date(),
    },
    {
      id: '4',
      title: 'How to pitch a Design Sprint',
      subtitle: 'About design sprint',
      time: '09:00 PM',
      status: 'to-do',
      icon: '📊',
      date: new Date(),
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        const itemWidth = 80;
        const centerPosition = itemWidth * 15;
        scrollViewRef.current.scrollTo({ 
          x: centerPosition - (itemWidth / 2), 
          animated: false 
        });
      }
    }, 100);
  }, []);

  const handleDateSelect = useCallback((date: Date, index: number) => {
    setSelectedDate(date);
    if (scrollViewRef.current) {
      const itemWidth = 80;
      const centerPosition = itemWidth * (index - 2);
      scrollViewRef.current.scrollTo({ 
        x: centerPosition - (itemWidth / 2), 
        animated: true 
      });
    }
  }, []);

  const calendarDates = useMemo(() => {
    const dates = generateDates(selectedDate);
    return dates.map(dateInfo => ({
      ...dateInfo,
      unfinishedTasks: todos.filter(todo => 
        isSameDay(todo.date, dateInfo.date) && 
        todo.status !== 'done'
      ).length
    }));
  }, [selectedDate, todos]);

  const filteredTodos = useMemo(() => 
    todos.filter(todo => isSameDay(todo.date, selectedDate)),
    [todos, selectedDate]
  );

  const renderTodoItem = useCallback(({ item }: { item: TodoItem }) => (
    <Pressable style={styles.todoCard}>
      <View style={styles.todoHeader}>
        <View style={styles.todoTitleContainer}>
          <ThemedText style={styles.todoSubtitle}>{item.subtitle}</ThemedText>
          <ThemedText style={styles.todoTitle}>{item.title}</ThemedText>
        </View>
        <View style={styles.todoIcon}>
          <Text style={styles.todoIconText}>{item.icon}</Text>
        </View>
      </View>
      <View style={styles.todoFooter}>
        <View style={styles.todoTime}>
          <IconSymbol name="clock" size={16} color="#6B7280" />
          <ThemedText style={styles.todoTimeText}>{item.time}</ThemedText>
        </View>
        <View style={[styles.todoStatus, styles[`status${item.status}`]]}>
          <ThemedText style={styles.todoStatusText}>
            {item.status === 'done' ? 'Done' : 
             item.status === 'in-progress' ? 'In Progress' : 'To-do'}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
          <ThemedText style={styles.headerTitle}>Today's Tasks</ThemedText>
          <IconSymbol name="bell" size={24} color="#000" />
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.calendar}
          contentContainerStyle={styles.calendarContent}
          decelerationRate="fast"
          snapToInterval={80}
          snapToAlignment="center">
          {calendarDates.map((dateInfo, index) => (
            <Pressable
              key={index}
              onPress={() => handleDateSelect(dateInfo.date, index)}
              style={[
                styles.calendarDay,
                dateInfo.isActive && styles.calendarDayActive,
                dateInfo.isSelected && !dateInfo.isActive && styles.calendarDaySelected
              ]}>
              {dateInfo.unfinishedTasks > 0 && (
                <View style={styles.taskBadge}>
                  <ThemedText style={styles.taskBadgeText}>
                    {dateInfo.unfinishedTasks}
                  </ThemedText>
                </View>
              )}
              <ThemedText style={[
                styles.calendarDate,
                dateInfo.isActive && styles.calendarTextActive,
                dateInfo.isSelected && !dateInfo.isActive && styles.calendarTextSelected
              ]}>
                {format(dateInfo.date, 'd')}
              </ThemedText>
              <ThemedText style={[
                styles.calendarDayText,
                dateInfo.isActive && styles.calendarTextActive,
                dateInfo.isSelected && !dateInfo.isActive && styles.calendarTextSelected
              ]}>
                {format(dateInfo.date, 'EEE')}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}>
          {TABS.map((tab, index) => (
            <Pressable
              key={index}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive
              ]}>
              <ThemedText style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}>{tab}</ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <BlurView intensity={10} style={styles.bottomNav}>
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.9)']}
          style={styles.bottomNavGradient}>
          <View style={styles.bottomNavContent}>
            <IconSymbol name="home" size={24} color="#6B7280" />
            <IconSymbol name="calendar" size={24} color="#6B7280" />
            <View style={styles.fabContainer}>
              <LinearGradient
                colors={['#7C3AED', '#6D28D9']}
                style={styles.fab}>
                <IconSymbol name="plus" size={24} color="#fff" />
              </LinearGradient>
            </View>
            <IconSymbol name="list" size={24} color="#6B7280" />
            <IconSymbol name="person" size={24} color="#6B7280" />
          </View>
        </LinearGradient>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  calendar: {
    marginBottom: 24,
    paddingTop: 8,
  },
  calendarContent: {
    paddingHorizontal: 20,
  },
  calendarDay: {
    width: 70,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    marginTop: 12,
    paddingTop: 8,
  },
  calendarDayActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  calendarDate: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#6B7280',
  },
  calendarTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#7C3AED',
  },
  tabText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  todoTitleContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  todoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  todoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  todoIconText: {
    fontSize: 20,
  },
  todoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoTimeText: {
    marginLeft: 4,
    color: '#6B7280',
    fontSize: 14,
  },
  todoStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusdone: {
    backgroundColor: '#D1FAE5',
  },
  'statusin-progress': {
    backgroundColor: '#FEF3C7',
  },
  'statusto-do': {
    backgroundColor: '#E0E7FF',
  },
  todoStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  bottomNavGradient: {
    flex: 1,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  fabContainer: {
    width: 56,
    height: 56,
    marginBottom: 40,
  },
  fab: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  taskBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1,
  },
  taskBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  calendarDaySelected: {
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarTextSelected: {
    color: '#4B5563',
  },
});
