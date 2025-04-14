import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function CompleteScreen() {
  const router = useRouter();
  const { hairProfile, saveProfile, isLoading, progress } = useSetup();

  // Handle finish button press
  const handleFinish = async () => {
    console.log('Saving profile and completing setup');
    await saveProfile();
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Summarize selected preferences in a user-friendly way
  const getHairTypeLabel = () => {
    switch (hairProfile.hairType) {
      case 'straight': return 'Straight';
      case 'wavy': return 'Wavy';
      case 'curly': return 'Curly';
      case 'coily': return 'Coily/Kinky';
      case 'not_sure': return 'To be determined';
      default: return 'Not specified';
    }
  };

  const getRoutineLabel = () => {
    switch (hairProfile.routinePreference) {
      case 'quick': return 'Quick & Simple';
      case 'balanced': return 'Balanced';
      case 'thorough': return 'Thorough';
      case 'intensive': return 'Intensive';
      default: return 'Not specified';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]}
            />
          </View>
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeIn.duration(800)}
            style={styles.titleContainer}
          >
            <View style={styles.checkmarkContainer}>
              <Feather name="check-circle" size={60} color="#4CAF50" />
            </View>
            <H1 style={styles.title}>Profile Complete!</H1>
            <Text style={styles.subtitle}>
              We've created your personalized hair profile. Here's a summary of your information.
            </Text>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.summaryContainer}
          >
            <Text style={styles.summaryTitle}>Your Hair Profile</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Hair Type:</Text>
              <Text style={styles.summaryValue}>{getHairTypeLabel()}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Top Concerns:</Text>
              <Text style={styles.summaryValue}>
                {hairProfile.hairConcerns && hairProfile.hairConcerns.length > 0 
                  ? hairProfile.hairConcerns.slice(0, 2).map((concern: string) => 
                      concern.charAt(0).toUpperCase() + concern.slice(1).replace('_', ' ')
                    ).join(', ')
                  : 'None specified'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Main Goals:</Text>
              <Text style={styles.summaryValue}>
                {hairProfile.hairGoals && hairProfile.hairGoals.length > 0 
                  ? hairProfile.hairGoals.slice(0, 2).map((goal: string) => 
                      goal.charAt(0).toUpperCase() + goal.slice(1).replace('_', ' ')
                    ).join(', ')
                  : 'None specified'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Routine Preference:</Text>
              <Text style={styles.summaryValue}>{getRoutineLabel()}</Text>
            </View>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(800).duration(800)}
            style={styles.inspirationalContainer}
          >
            <Text style={styles.inspirationalTitle}>
              Consistency Is The Key To Progress
            </Text>
            <Text style={styles.inspirationalText}>
              Your personalized hair care journey starts now. Don't give up!
            </Text>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.delay(1200).duration(800)}
            style={styles.buttonContainer}
          >
            <Button 
              style={styles.button}
              onPress={handleFinish}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Start My Journey</Text>
            </Button>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  screenContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#AA8AD2',
    borderRadius: 3,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#FFFF00',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  checkmarkContainer: {
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  inspirationalContainer: {
    backgroundColor: '#AA8AD2',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  inspirationalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  inspirationalText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});