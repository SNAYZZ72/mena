import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { RadioOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

// Routine preference options
const routineOptions = [
  { id: '1', label: 'Quick & Simple (5-10 mins daily)', value: 'quick' },
  { id: '2', label: 'Balanced (10-15 mins daily)', value: 'balanced' },
  { id: '3', label: 'Thorough (15-20 mins daily)', value: 'thorough' },
  { id: '4', label: 'Intensive (20+ mins daily, with weekly treatments)', value: 'intensive' }
];

// Product preference options
const productOptions = [
  { id: '1', label: 'All Natural & Organic', value: 'natural' },
  { id: '2', label: 'Mix of Natural & Regular Products', value: 'mixed' },
  { id: '3', label: 'Professional Products', value: 'professional' },
  { id: '4', label: 'Budget-Friendly Options', value: 'budget' },
  { id: '5', label: 'DIY & Homemade Solutions', value: 'diy' }
];

export default function RoutinePreferencesScreen() {
  const router = useRouter();
  const { hairProfile, updateProfile, progress, currentStep, nextStep } = useSetup();
  const [routinePreference, setRoutinePreference] = useState<string | undefined>(hairProfile.routinePreference);
  const [productPreference, setProductPreference] = useState<string | undefined>(hairProfile.productPreference);

  // Handle routine selection
  const handleRoutineSelect = (value: string) => {
    setRoutinePreference(value);
    updateProfile('routinePreference', value);
  };

  // Handle product selection
  const handleProductSelect = (value: string) => {
    setProductPreference(value);
    updateProfile('productPreference', value);
  };

  // Handle continue button press
  const handleContinue = () => {
    // Increment the step counter before navigating
    nextStep();
    console.log('Routine preferences selected:', routinePreference, productPreference, '- navigating to complete screen');
    router.push('/(app)/setup/complete');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
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
          <View style={styles.titleContainer}>
            <H1 style={styles.title}>Your Preferences</H1>
            <Text style={styles.subtitle}>Tell us about your ideal hair care routine and product preferences</Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>How much time can you dedicate to hair care?</Text>
            <View style={styles.optionsContainer}>
              {routineOptions.map((option) => (
                <RadioOption
                  key={option.id}
                  option={option}
                  isSelected={routinePreference === option.value}
                  onSelect={handleRoutineSelect}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What types of products do you prefer?</Text>
            <View style={styles.optionsContainer}>
              {productOptions.map((option) => (
                <RadioOption
                  key={option.id}
                  option={option}
                  isSelected={productPreference === option.value}
                  onSelect={handleProductSelect}
                />
              ))}
            </View>
          </View>
          
          {routinePreference && productPreference && (
            <Button 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Button>
          )}
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
    marginTop: 24,
    marginBottom: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#AA8AD2',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 30,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});