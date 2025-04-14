import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { useSetup } from '@/context/setup-provider';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from '@/components/safe-area-view';

export default function CompleteScreen() {
  const router = useRouter();
  const { hairProfile, saveProfile, isLoading } = useSetup();

  // Handle finish button press
  const handleFinish = async () => {
    await saveProfile();
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
      <View style={styles.content}>
        <Animated.View 
          entering={FadeIn.duration(800)}
          style={styles.header}
        >
          <View style={styles.checkmarkContainer}>
            <Feather name="check-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.title}>Profile Complete!</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkmarkContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
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
    marginTop: 'auto',
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