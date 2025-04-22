import React from 'react';
import { SafeAreaView } from '@/components/safe-area-view';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { H1, H2 } from '@/components/ui/typography';

const trendingTopics = [
  'What can I do to maintain my high hair density?',
  'How can I best manage medium frizziness?',
  'What products are best for maintaining healthy hair ends?',
];

const chatHistory = [
  { id: '1', text: '"What can I do to maintain my high hair density?"' },
];

export default function AdvisorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <H1>MyAdvisor</H1>
        </View>

        {/* Chat with advisor button */}
        <TouchableOpacity style={styles.chatCard} activeOpacity={0.8}>
          <Text style={styles.chatCardText}>Chat with My Advisor</Text>
          <Feather name="arrow-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Trending Topics */}
        <View style={styles.section}>
          <H2 style={styles.sectionTitle}>Trending Topics</H2>
          {trendingTopics.map((topic, idx) => (
            <View key={idx} style={styles.topicCard}>
              <Feather name="message-circle" size={20} color="#3B82F6" />
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>

        {/* Chat History */}
        <View style={styles.section}>
          <H2 style={styles.sectionTitle}>Chat History</H2>
          {chatHistory.map(item => (
            <View key={item.id} style={styles.historyCard}>
              <Feather name="message-square" size={20} color="#000000" />
              <Text style={styles.historyText}>{item.text}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  chatCard: {
    margin: 20,
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatCardText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 12 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  topicText: { marginLeft: 12, fontSize: 14, color: '#333333', flex: 1 },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyText: { marginLeft: 12, fontSize: 14, color: '#333333', flex: 1 },
}); 