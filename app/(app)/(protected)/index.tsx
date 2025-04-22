import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { supabase } from "@/config/supabase";
import { SafeAreaView } from "@/components/safe-area-view";
import { H1, H2, H3 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supabase-provider";

// Types for the hair profile
type HairProfile = {
  gender?: string;
  hair_type?: string;
  hair_concerns?: string[];
  hair_goals?: string[];
  routine_preference?: string;
  product_preference?: string;
};

// Types for a care task
type CareTask = {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  icon: string;
  completed: boolean;
};

// Sample routine tasks based on user profile
const getRoutineTasks = (profile: HairProfile | null): CareTask[] => {
  if (!profile) return [];
  
  // Default tasks everyone gets
  const tasks: CareTask[] = [
    {
      id: '1',
      title: 'Daily Hair Brushing',
      description: 'Brush your hair to distribute natural oils and stimulate the scalp',
      type: 'daily',
      icon: 'scissors',
      completed: false
    }
  ];
  
  // Add tasks based on hair type
  if (profile.hair_type === 'curly' || profile.hair_type === 'coily') {
    tasks.push({
      id: '2',
      title: 'Weekly Deep Conditioning',
      description: 'Apply deep conditioner for extra hydration',
      type: 'weekly',
      icon: 'droplet',
      completed: false
    });
  }
  
  // Add tasks based on hair concerns
  if (profile.hair_concerns?.includes('dryness')) {
    tasks.push({
      id: '3',
      title: 'Hydrating Hair Mask',
      description: 'Use a hydrating mask to combat dryness',
      type: 'weekly',
      icon: 'thermometer',
      completed: false
    });
  }
  
  if (profile.hair_concerns?.includes('frizz')) {
    tasks.push({
      id: '4',
      title: 'Anti-Frizz Treatment',
      description: 'Apply anti-frizz serum or oil',
      type: 'daily',
      icon: 'wind',
      completed: false
    });
  }
  
  return tasks;
};

// Sample tips based on user profile
const getTips = (profile: HairProfile | null): string[] => {
  if (!profile) return [];
  
  const tips: string[] = [
    'Drink plenty of water for healthier hair growth',
    'Avoid tight hairstyles that pull on your roots'
  ];
  
  if (profile.hair_type === 'straight') {
    tips.push('Use a lightweight conditioner to avoid weighing down your hair');
  } else if (profile.hair_type === 'curly') {
    tips.push('Try the "plopping" technique to enhance your natural curls');
  }
  
  return tips;
};

// Card component for tasks
const TaskCard = ({ task, onToggle }: { task: CareTask, onToggle: () => void }) => (
  <TouchableOpacity 
    style={[styles.card, task.completed && styles.cardCompleted]} 
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={styles.cardHeader}>
      <View style={styles.cardIconContainer}>
        <Feather name={task.icon as any} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{task.type}</Text>
      </View>
    </View>
    
    <Text style={styles.cardTitle}>{task.title}</Text>
    <Text style={styles.cardDescription}>{task.description}</Text>
    
    <View style={styles.cardFooter}>
      {task.completed ? (
        <Text style={styles.completedText}>Completed <Feather name="check" size={14} /></Text>
      ) : (
        <Text style={styles.pendingText}>Tap to complete</Text>
      )}
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { user } = useSupabase();
  // Prepare calendar strip data for next 7 days
  const calendarData = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({ day: d.getDate(), weekday: d.toLocaleDateString(undefined, { weekday: 'short' }), isToday: i === 0 });
    }
    return days;
  }, []);
  // Placeholder streak count
  const streakCount = 1;
  const [profile, setProfile] = useState<HairProfile | null>(null);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // Fetch user profile and set greeting based on time of day
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hair_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
          const routineTasks = getRoutineTasks(data);
          setTasks(routineTasks);
          setTips(getTips(data));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Set greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning');
    } else if (hours < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
    
    fetchProfile();
  }, [user]);
  
  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Format hair type name
  const formatHairType = (type?: string) => {
    if (!type) return 'Unknown';
    
    switch (type) {
      case 'straight': return 'Straight';
      case 'wavy': return 'Wavy';
      case 'curly': return 'Curly';
      case 'coily': return 'Coily/Kinky';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Calculate completion percentage
  const completionPercentage = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Build profile summary cards for carousel
  const summaryData = React.useMemo(() => {
    if (!profile) return [];
    const items: { label: string; value: string }[] = [];
    if (profile.hair_type) items.push({ label: 'Hair Type', value: formatHairType(profile.hair_type) });
    if (profile.hair_concerns?.length) items.push({ label: 'Top Concern', value: profile.hair_concerns[0].charAt(0).toUpperCase() + profile.hair_concerns[0].slice(1).replace('_', ' ') });
    if (profile.hair_goals?.length) items.push({ label: 'Goals', value: profile.hair_goals.join(', ') });
    if (profile.routine_preference) items.push({ label: 'Routine', value: profile.routine_preference.charAt(0).toUpperCase() + profile.routine_preference.slice(1) });
    if (profile.product_preference) items.push({ label: 'Product Pref', value: profile.product_preference.charAt(0).toUpperCase() + profile.product_preference.slice(1) });
    return items;
  }, [profile]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <H1 style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</H1>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <Feather name="user" size={24} color="#AA8AD2" />
          </TouchableOpacity>
        </View>
        
        {/* MyHair Tips Carousel */}
        <Animated.View entering={FadeIn.delay(400).duration(600)} style={styles.carouselSection}>
          <H2 style={styles.carouselTitle}>Myhair Tips for you</H2>
          <FlatList
            horizontal
            data={tips}
            keyExtractor={(_, idx) => idx.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Text style={styles.carouselItemText}>{item}</Text>
              </View>
            )}
          />
        </Animated.View>
        
        {/* Calendar Strip */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.calendarSection}>
          <FlatList
            horizontal
            data={calendarData}
            keyExtractor={item => item.weekday + item.day}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContent}
            renderItem={({ item }) => (
              <View style={[styles.calendarItem, item.isToday && styles.calendarItemToday]}>
                <Text style={[styles.calendarWeekday, item.isToday && styles.calendarWeekdayToday]}>{item.weekday}</Text>
                <Text style={[styles.calendarDay, item.isToday && styles.calendarDayToday]}>{item.day}</Text>
              </View>
            )}
          />
        </Animated.View>
        
        {/* Streak Card */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.streakCard}>
          <H2 style={styles.streakLabel}>MyHair Streak</H2>
          <View style={styles.streakCountContainer}>
            <Text style={styles.streakCount}>{streakCount}</Text>
          </View>
          <Text style={styles.streakNote}>Next scan tomorrow</Text>
        </Animated.View>
        
        {/* Profile Summary Carousel */}
        <Animated.View entering={FadeInDown.delay(1000).duration(600)} style={styles.summarySection}>
          <H2 style={styles.sectionTitle}>Profile Summary</H2>
          <FlatList
            horizontal
            data={summaryData}
            keyExtractor={item => item.label}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.summaryContent}
            renderItem={({ item }) => (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            )}
          />
        </Animated.View>
        
        {/* Daily Insights Timeline */}
        <Animated.View entering={FadeInDown.delay(1200).duration(600)} style={styles.timelineSection}>
          <H2 style={styles.sectionTitle}>Daily Insights</H2>
          <View style={styles.timelineContainer}>
            {tasks.map(task => (
              <View key={task.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{task.title}</Text>
                  <Text style={styles.timelineStatus}>{task.completed ? 'Completed' : 'Pending'}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
        
        {/* Hair Profile Summary */}
        <Animated.View 
          entering={FadeIn.duration(600)}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <H3 style={styles.profileTitle}>Your Hair Profile</H3>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={16} color="#AA8AD2" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileDetails}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Hair Type</Text>
              <Text style={styles.profileValue}>{formatHairType(profile?.hair_type)}</Text>
            </View>
            
            {profile?.hair_concerns && profile.hair_concerns.length > 0 && (
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Top Concern</Text>
                <Text style={styles.profileValue}>
                  {profile.hair_concerns[0].charAt(0).toUpperCase() + 
                   profile.hair_concerns[0].slice(1).replace('_', ' ')}
                </Text>
              </View>
            )}
            
            {profile?.routine_preference && (
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Routine</Text>
                <Text style={styles.profileValue}>
                  {profile.routine_preference.charAt(0).toUpperCase() + 
                   profile.routine_preference.slice(1)}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
        
        {/* Today's Progress */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.progressSection}
        >
          <H2 style={styles.sectionTitle}>Today's Progress</H2>
          
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>Daily Tasks</Text>
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
        </Animated.View>
        
        {/* Hair Care Tasks */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.tasksSection}
        >
          <View style={styles.sectionHeader}>
            <H2 style={styles.sectionTitle}>Your Hair Care Tasks</H2>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tasksList}>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={() => toggleTask(task.id)} 
              />
            ))}
            
            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="calendar" size={40} color="#999999" />
                <Text style={styles.emptyStateText}>No tasks scheduled</Text>
              </View>
            )}
          </View>
        </Animated.View>
        
        {/* Hair Care Tips */}
        <Animated.View 
          entering={FadeInDown.delay(900).duration(600)}
          style={styles.tipsSection}
        >
          <H2 style={styles.sectionTitle}>Hair Care Tips</H2>
          
          <View style={styles.tipsList}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipIconContainer}>
                  <Feather name="info" size={18} color="#AA8AD2" />
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        
        {/* Community Section */}
        <Animated.View 
          entering={FadeInDown.delay(1200).duration(600)}
          style={styles.communitySection}
        >
          <H2 style={styles.sectionTitle}>Join The Community</H2>
          <View style={styles.communityCard}>
            <Text style={styles.communityText}>
              Connect with others on their hair care journey. Share tips, 
              get inspired, and track your progress together.
            </Text>
            <Button 
              style={styles.communityButton}
              onPress={() => {}} // Navigate to community page in the future
            >
              <Text style={styles.communityButtonText}>Explore Community</Text>
            </Button>
          </View>
        </Animated.View>
        
        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  carouselSection: {
    marginTop: 20,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    backgroundColor: '#AA8AD2',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: 200,
  },
  carouselItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  editButton: {
    padding: 4,
  },
  profileDetails: {
    marginTop: 8,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  profileLabel: {
    fontSize: 14,
    color: '#666666',
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  progressSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
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
  progressText: {
    fontSize: 14,
    color: '#666666',
  },
  progressPercentage: {
    fontSize: 16,
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
  tasksSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#AA8AD2',
    fontWeight: '500',
  },
  tasksList: {
    marginBottom: 16,
  },
  card: {
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
  cardCompleted: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#AA8AD2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
  },
  tagText: {
    fontSize: 12,
    color: '#AA8AD2',
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
    marginBottom: 8,
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  pendingText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  tipsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  tipsList: {
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  communitySection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  communityCard: {
    padding: 20,
    backgroundColor: '#AA8AD2',
    borderRadius: 16,
    marginBottom: 16,
  },
  communityText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
  },
  communityButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  communityButtonText: {
    color: '#AA8AD2',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
  calendarSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  calendarContent: {
    paddingVertical: 8,
  },
  calendarItem: {
    width: 60,
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  calendarItemToday: {
    backgroundColor: '#AA8AD2',
  },
  calendarWeekday: {
    fontSize: 12,
    color: '#666666',
  },
  calendarWeekdayToday: {
    color: '#FFFFFF',
  },
  calendarDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  calendarDayToday: {
    color: '#FFFFFF',
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  streakCountContainer: {
    backgroundColor: '#AA8AD2',
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  streakCount: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  streakNote: {
    fontSize: 12,
    color: '#666666',
  },
  // Profile summary carousel
  summarySection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  summaryContent: {
    paddingVertical: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  // Daily insights timeline
  timelineSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#AA8AD2',
    marginTop: 6,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  timelineStatus: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
});