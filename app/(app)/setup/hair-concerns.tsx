import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { CheckboxOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

// Hair concern options
const hairConcernOptions = [
  { id: '1', label: 'Dryness', value: 'dryness' },
  { id: '2', label: 'Frizz', value: 'frizz' },
  { id: '3', label: 'Split Ends', value: 'split_ends' },
  { id: '4', label: 'Breakage', value: 'breakage' },
  { id: '5', label: 'Hair Loss', value: 'hair_loss' },
  { id: '6', label: 'Dandruff', value: 'dandruff' },
  { id: '7', label: 'Oily Scalp', value: 'oily_scalp' },
  { id: '8', label: 'Lack of Volume', value: 'lack_of_volume' },
  { id: '9', label: 'Color Damage', value: 'color_damage' },
  { id: '10', label: 'Heat Damage', value: 'heat_damage' },
  { id: '11', label: 'Slow Growth', value: 'slow_growth' },
];

export default function HairConcernsScreen() {
  const router = useRouter();
  const { hairProfile, updateProfile, progress, currentStep, nextStep } = useSetup();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(hairProfile.hairConcerns || []);

  // Handle toggle selection
  const handleToggle = (value: string) => {
    setSelectedConcerns(prev => {
      let newSelection;
      if (prev.includes(value)) {
        newSelection = prev.filter(item => item !== value);
      } else {
        newSelection = [...prev, value];
      }
      
      // Save selection (but only navigate when at least one is selected and Continue is pressed)
      updateProfile('hairConcerns', newSelection);
      return newSelection;
    });
  };

  // Handle continue button press
  const handleContinue = () => {
    // Increment the step counter before navigating
    nextStep();
    console.log('Hair concerns selected:', selectedConcerns, '- navigating to next screen');
    router.push('/(app)/setup/hair-goals');
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
            <H1 style={styles.title}>What are Your Hair Concerns?</H1>
            <Text style={styles.subtitle}>Select all that apply to your hair (select at least one)</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {hairConcernOptions.map((option) => (
              <CheckboxOption
                key={option.id}
                option={option}
                isSelected={selectedConcerns.includes(option.value)}
                onToggle={handleToggle}
              />
            ))}
          </View>
          
          <View style={styles.selectionSummary}>
            <Text style={styles.summaryText}>
              {selectedConcerns.length === 0 
                ? 'Select at least one concern' 
                : `You've selected ${selectedConcerns.length} concern${selectedConcerns.length > 1 ? 's' : ''}`}
            </Text>
          </View>
          
          {selectedConcerns.length > 0 && (
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
  optionsContainer: {
    marginBottom: 20,
  },
  selectionSummary: {
    backgroundColor: 'rgba(170, 138, 210, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  summaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#AA8AD2',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 30,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});