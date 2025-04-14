import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from "@/components/safe-area-view";
import { H1, H2 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supabase-provider";

// Post type definition
type Post = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: Date;
  liked: boolean;
  tags?: string[];
};

// Sample community posts
const samplePosts: Post[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    content: 'Just tried a new deep conditioning mask with avocado and honey, and my curls are loving it! Has anyone else tried DIY masks with good results? #CurlyHair #NaturalHairCare',
    images: ['https://images.unsplash.com/photo-1609357603884-0bbe9bd9c551?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpciUyMG1hc2t8ZW58MHx8MHx8fDA%3D'],
    likes: 24,
    comments: 7,
    timestamp: new Date(2025, 3, 14, 9, 30),
    liked: false,
    tags: ['CurlyHair', 'NaturalHairCare']
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    content: 'Week 3 of my hair growth journey: Starting to see some real progress! Consistent scalp massages and better nutrition are making a difference. Anyone else on a growth journey?',
    likes: 18,
    comments: 5,
    timestamp: new Date(2025, 3, 13, 15, 45),
    liked: true
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Aisha Williams',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    content: 'Before and after using protein treatments for my damaged hair. Cannot believe the difference after just 3 weeks of consistent care!',
    images: ['https://images.unsplash.com/photo-1626954079673-a0b68d10ab77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhaXIlMjB0cmVhdG1lbnR8ZW58MHx8MHx8fDA%3D'],
    likes: 42,
    comments: 12,
    timestamp: new Date(2025, 3, 12, 11, 20),
    liked: false,
    tags: ['HairTransformation', 'ProteinTreatment']
  }
];

// Challenge type definition
type Challenge = {
  id: string;
  title: string;
  description: string;
  participants: number;
  duration: string;
  active: boolean;
  startDate: Date;
  endDate: Date;
  image?: string;
};

// Sample challenges
const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Hair Growth Challenge',
    description: 'Daily scalp massages and nutrition tracking for maximum growth',
    participants: 528,
    duration: '30 days',
    active: true,
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 3, 30),
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhhaXIlMjBncm93dGh8ZW58MHx8MHx8fDA%3D'
  },
  {
    id: '2',
    title: 'Curly Hair Hydration Week',
    description: 'Deep conditioning challenges to revive your curls',
    participants: 314,
    duration: '7 days',
    active: true,
    startDate: new Date(2025, 3, 10),
    endDate: new Date(2025, 3, 17),
    image: 'https://images.unsplash.com/photo-1605497787472-fa99572378ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhhaXIlMjBncm93dGh8ZW58MHx8MHx8fDA%3D'
  }
];

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
};

// Post component
const PostCard = ({ post, onLike }: { post: Post, onLike: (id: string) => void }) => {
  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: post.user.avatar }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.userName}>{post.user.name}</Text>
            <Text style={styles.postTime}>{formatRelativeTime(post.timestamp)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-horizontal" size={20} color="#666666" />
        </TouchableOpacity>
      </View>
      
      {/* Post Content */}
      <Text style={styles.postText}>{post.content}</Text>
      
      {/* Post Image (if available) */}
      {post.images && post.images.length > 0 && (
        <Image 
          source={{ uri: post.images[0] }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      )}
      
      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
        >
          <Feather 
            name={post.liked ? "heart" : "heart"} 
            size={20} 
            color={post.liked ? "#E91E63" : "#666666"} 
            style={{ marginRight: 6 }}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={20} color="#666666" style={{ marginRight: 6 }} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Challenge Card component
const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  return (
    <View style={styles.challengeCard}>
      <Image 
        source={{ uri: challenge.image }} 
        style={styles.challengeImage} 
        resizeMode="cover"
      />
      <View style={styles.challengeContent}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        <View style={styles.challengeDetails}>
          <View style={styles.challengeDetailItem}>
            <Feather name="users" size={14} color="#AA8AD2" style={{ marginRight: 4 }} />
            <Text style={styles.challengeDetailText}>{challenge.participants} joined</Text>
          </View>
          <View style={styles.challengeDetailItem}>
            <Feather name="calendar" size={14} color="#AA8AD2" style={{ marginRight: 4 }} />
            <Text style={styles.challengeDetailText}>{challenge.duration}</Text>
          </View>
        </View>
        <Button style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Challenge</Text>
        </Button>
      </View>
    </View>
  );
};

export default function CommunityScreen() {
  const { user } = useSupabase();
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges'>('feed');
  
  // Like/unlike a post
  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newLikedState = !post.liked;
          const likeDelta = newLikedState ? 1 : -1;
          return {
            ...post,
            liked: newLikedState,
            likes: post.likes + likeDelta
          };
        }
        return post;
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <H1 style={styles.headerTitle}>Community</H1>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color="#333333" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts and challenges..."
            placeholderTextColor="#999999"
          />
        </View>
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'feed' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'feed' && styles.activeTabText
          ]}>
            Feed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'challenges' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'challenges' && styles.activeTabText
          ]}>
            Challenges
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'feed' ? (
          <>
            {/* Create Post Card */}
            <View style={styles.createPostCard}>
              <View style={styles.createPostHeader}>
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                  style={styles.userAvatar} 
                />
                <TextInput
                  style={styles.createPostInput}
                  placeholder="Share your hair care journey..."
                  placeholderTextColor="#999999"
                  multiline
                />
              </View>
              <View style={styles.createPostActions}>
                <TouchableOpacity style={styles.createPostButton}>
                  <Feather name="image" size={20} color="#AA8AD2" />
                  <Text style={styles.createPostButtonText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createPostButton}>
                  <Feather name="hash" size={20} color="#AA8AD2" />
                  <Text style={styles.createPostButtonText}>Tag</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postButton}>
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Feed Posts */}
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike} 
              />
            ))}
          </>
        ) : (
          <>
            {/* Challenges */}
            <View style={styles.challengesHeader}>
              <H2 style={styles.challengesTitle}>Active Challenges</H2>
              <Text style={styles.challengesSubtitle}>
                Join a challenge to boost your hair care routine
              </Text>
            </View>
            
            {challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
            
            <Button style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse All Challenges</Text>
            </Button>
          </>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Floating Action Button */}
      {activeTab === 'feed' && (
        <TouchableOpacity style={styles.fab}>
          <Feather name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
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
  createPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333333',
  },
  createPostActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
  },
  createPostButtonText: {
    fontSize: 14,
    color: '#AA8AD2',
    marginLeft: 6,
  },
  postButton: {
    marginLeft: 'auto',
    backgroundColor: '#AA8AD2',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  postTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#AA8AD2',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
  challengesHeader: {
    marginBottom: 16,
  },
  challengesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  challengesSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeImage: {
    width: '100%',
    height: 150,
  },
  challengeContent: {
    padding: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  challengeDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  challengeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  challengeDetailText: {
    fontSize: 12,
    color: '#666666',
  },
  joinButton: {
    backgroundColor: '#AA8AD2',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  browseButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#AA8AD2',
    marginTop: 8,
  },
  browseButtonText: {
    color: '#AA8AD2',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});