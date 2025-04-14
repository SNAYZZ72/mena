import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

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

// Stats type
type UserStats = {
  daysStreak: number;
  tasksCompleted: number;
  challengesJoined: number;
  postsShared: number;
};

// Achievement type
type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
};

// Sample achievements
const sampleAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Routine Master',
    description: 'Complete 30 days of hair care routine',
    icon: 'award',
    unlocked: true
  },
  {
    id: '2',
    title: 'Community Star',
    description: 'Share 10 posts with the community',
    icon: 'star',
    unlocked: false,
    progress: 4,
    total: 10
  },
  {
    id: '3',
    title: 'Challenge Champion',
    description: 'Successfully complete 5 challenges',
    icon: 'trophy',
    unlocked: false,
    progress: 2,
    total: 5
  }
];

// Achievement Card component
const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  return (
    <View style={[
      styles.achievementCard,
      achievement.unlocked ? styles.unlockedAchievement : styles.lockedAchievement
    ]}>
      <View style={styles.achievementIconContainer}>
        <Feather 
          name={achievement.icon as any} 
          size={24} 
          color={achievement.unlocked ? '#AA8AD2' : '#CCCCCC'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle,
          achievement.unlocked ? styles.unlockedTitle : styles.lockedTitle
        ]}>
          {achievement.title}
        </Text>
        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>
        
        {!achievement.unlocked && achievement.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(achievement.progress / achievement.total!) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.total}
            </Text>
          </View>
        )}
      </View>
      
      {achievement.unlocked && (
        <View style={styles.unlockedBadge}>
          <Feather name="check" size={16} color="#FFFFFF" />
        </View>
      )}
    </View>
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

export default function ProfileScreen() {
  const { user, signOut } = useSupabase();
  const [profile, setProfile] = useState<HairProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements'>('profile');
  
  // Sample user stats
  const stats: UserStats = {
    daysStreak: 7,
    tasksCompleted: 42,
    challengesJoined: 3,
    postsShared: 8
  };

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hair_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <H1 style={styles.headerTitle}>Profile</H1>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Feather name="settings" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.email?.split('@')[0] || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.daysStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.challengesJoined}</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
        </View>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'profile' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'profile' && styles.activeTabText
          ]}>
            Hair Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'achievements' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'achievements' && styles.activeTabText
          ]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' ? (
          <>
            {/* Hair Profile */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <H2 style={styles.sectionTitle}>Hair Details</H2>
                <TouchableOpacity style={styles.editButton}>
                  <Feather name="edit-2" size={16} color="#AA8AD2" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.hairDetailsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hair Type</Text>
                  <Text style={styles.detailValue}>{formatHairType(profile?.hair_type)}</Text>
                </View>
                
                <View style={styles.detailDivider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Top Concerns</Text>
                  <View style={styles.tagsContainer}>
                    {profile?.hair_concerns && profile.hair_concerns.length > 0 ? (
                      profile.hair_concerns.slice(0, 2).map((concern, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>
                            {concern.charAt(0).toUpperCase() + concern.slice(1).replace('_', ' ')}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.detailValue}>None specified</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.detailDivider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hair Goals</Text>
                  <View style={styles.tagsContainer}>
                    {profile?.hair_goals && profile.hair_goals.length > 0 ? (
                      profile.hair_goals.slice(0, 2).map((goal, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>
                            {goal.charAt(0).toUpperCase() + goal.slice(1).replace('_', ' ')}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.detailValue}>None specified</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.detailDivider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Routine Preference</Text>
                  <Text style={styles.detailValue}>
                    {profile?.routine_preference 
                      ? profile.routine_preference.charAt(0).toUpperCase() + profile.routine_preference.slice(1)
                      : 'Not specified'}
                  </Text>
                </View>
                
                <View style={styles.detailDivider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Product Preference</Text>
                  <Text style={styles.detailValue}>
                    {profile?.product_preference 
                      ? profile.product_preference.charAt(0).toUpperCase() + profile.product_preference.slice(1)
                      : 'Not specified'}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Account Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="lock" size={20} color="#333333" style={{ marginRight: 12 }} />
                <Text style={styles.actionText}>Change Password</Text>
                <Feather name="chevron-right" size={20} color="#CCCCCC" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="help-circle" size={20} color="#333333" style={{ marginRight: 12 }} />
                <Text style={styles.actionText}>Help & Support</Text>
                <Feather name="chevron-right" size={20} color="#CCCCCC" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="info" size={20} color="#333333" style={{ marginRight: 12 }} />
                <Text style={styles.actionText}>About MENA</Text>
                <Feather name="chevron-right" size={20} color="#CCCCCC" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <Feather name="log-out" size={20} color="#E91E63" style={{ marginRight: 12 }} />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Achievements */}
            <View style={styles.achievementsContainer}>
              <Text style={styles.achievementsIntro}>
                Complete tasks and challenges to earn achievements and track your progress
              </Text>
              
              {achievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </>
        )}
        
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  editProfileButton: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 12,
    color: '#AA8AD2',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
  sectionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  editButton: {
    padding: 4,
  },
  hairDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#AA8AD2',
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 4,
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#333333',
  },
  signOutButton: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  signOutText: {
    fontSize: 16,
    color: '#E91E63',
  },
  achievementsContainer: {
    marginTop: 10,
  },
  achievementsIntro: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
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
  unlockedAchievement: {
    borderLeftWidth: 4,
    borderLeftColor: '#AA8AD2',
  },
  lockedAchievement: {
    opacity: 0.8,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unlockedTitle: {
    color: '#333333',
  },
  lockedTitle: {
    color: '#666666',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(170, 138, 210, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#AA8AD2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 80,
  },
});