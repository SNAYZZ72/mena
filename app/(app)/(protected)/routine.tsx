import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { supabase } from "@/config/supabase";
import { SafeAreaView } from "@/components/safe-area-view";
import { H1, H2, H3 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supabase-provider";

// Types for a routine item
type RoutineItem = {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  days?: string[]; // For weekly items, which days they apply
  dueDate?: Date;
  completed: boolean;
  icon: string;
};

// Sample routine items
const sampleRoutineItems: RoutineItem[] = [
  {
    id: '1',
    title: 'Morning Hair Brushing',
    description: 'Gently brush your hair to detangle and distribute natural oils',
    frequency: 'daily',
    completed: false,
    icon: 'sunrise'
  },
  {
    id: '2',
    title: 'Evening Scalp Massage',
    description: 'Massage your scalp for 5 minutes to stimulate blood flow',
    frequency: 'daily',
    completed: false,
    icon: 'moon'
  },
  {
    id: '3',
    title: 'Deep Conditioning Treatment',
    description: 'Apply deep conditioner and leave for 30 minutes',
    frequency: 'weekly',
    days: ['Sunday'],
    completed: false,
    icon: 'droplet'
  },
  {
    id: '4',
    title: 'Hair Mask',
    description: 'Apply natural hair mask to nourish and strengthen',
    frequency: 'weekly',
    days: ['Wednesday'],
    completed: false,
    icon: 'shield'
  },
  {
    id: '5',
    title: 'Protein Treatment',
    description: 'Apply protein treatment to strengthen hair strands',
    frequency: 'monthly',
    completed: false,
    icon: 'battery-charging'
  }
];

// Format day name
const formatDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

// Check if item is due today
const isDueToday = (item: RoutineItem): boolean => {
  const today = new Date();
  const dayName = formatDay(today).toLowerCase();
  
  if (item.frequency === 'daily') {
    return true;
  } else if (item.frequency === 'weekly' && item.days) {
    return item.days.some(day => day.toLowerCase() === dayName);
  } else if (item.frequency === 'monthly') {
    // For this example, assuming monthly items are due on the 1st
    return today.getDate() === 1;
  }
  
  return false;
};

// Routine Item Card component
const RoutineItemCard = ({ 
  item, 
  onToggle 
}: { 
  item: RoutineItem, 
  onToggle: () => void 
}) => {
  const dueToday = isDueToday(item);
  
  return (
    <TouchableOpacity 
      style={[
        styles.routineCard, 
        item.completed && styles.completedCard,
        !dueToday && styles.notDueCard
      ]} 
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={[
          styles.iconContainer,
          item.completed && styles.completedIconContainer
        ]}>
          <Feather name={item.icon as any} size={20} color="#FFFFFF" />
        </View>
        
        <View style={styles.frequencyTag}>
          <Text style={styles.frequencyText}>{item.frequency}</Text>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      
      <View style={styles.cardFooter}>
        {item.completed ? (
          <View style={styles.completedBadge}>
            <Feather name="check" size={12} color="#FFFFFF" />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        ) : dueToday ? (
          <View style={styles.dueTodayBadge}>
            <Feather name="clock" size={12} color="#FFFFFF" />
            <Text style={styles.dueTodayText}>Due Today</Text>
          </View>
        ) : (
          <Text style={styles.upcomingText}>
            {item.frequency === 'weekly' && item.days ? 
              `Due on ${item.days[0]}` : 
              'Upcoming'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function RoutineScreen() {
  const { user } = useSupabase();
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(sampleRoutineItems);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  const today = new Date();
  
  // Toggle completion status
  const toggleCompletion = (id: string) => {
    setRoutineItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Filter items based on active tab
  const filteredItems = routineItems.filter(item => 
    activeTab === 'today' ? isDueToday(item) : true
  );
  
  // Calculate completion stats
  const todayItems = routineItems.filter(item => isDueToday(item));
  const completedToday = todayItems.filter(item => item.completed).length;
  const completionPercentage = todayItems.length > 0 
    ? Math.round((completedToday / todayItems.length) * 100) 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <H1 style={styles.headerTitle}>Your Routine</H1>
          <Text style={styles.headerDate}>{formatDate(today)}</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Today's Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <View>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressSubtitle}>
                {completedToday} of {todayItems.length} tasks completed
              </Text>
            </View>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${completionPercentage}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'today' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'today' && styles.activeTabText
          ]}>
            Today
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'all' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'all' && styles.activeTabText
          ]}>
            All Tasks
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Routine Items List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <RoutineItemCard 
              key={item.id} 
              item={item} 
              onToggle={() => toggleCompletion(item.id)} 
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={50} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              {activeTab === 'today' 
                ? 'No tasks scheduled for today' 
                : 'No routine tasks added yet'}
            </Text>
            <Button style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Add Task</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerDate: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#AA8AD2',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(170, 138, 210, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#AA8AD2',
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#AA8AD2',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  routineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#AA8AD2',
  },
  notDueCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIconContainer: {
    backgroundColor: '#4CAF50',
  },
  frequencyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
  },
  frequencyText: {
    fontSize: 12,
    color: '#AA8AD2',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  completedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  dueTodayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#AA8AD2',
  },
  dueTodayText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  upcomingText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#AA8AD2',
    paddingHorizontal: 20,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});