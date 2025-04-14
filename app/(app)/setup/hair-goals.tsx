import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { ButtonOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

// Hair goals options
const hairGoalOptions = [
  { id: '1', label: 'Moisture & Hydration', value: 'hydration' },
  { id: '2', label: 'Hair Growth', value: 'growth' },
  { id: '3', label: 'Reduce Breakage', value: 'reduce_breakage' },
  { id: '4', label: 'Curl Definition', value: 'curl_definition' },
  { id: '5', label: 'Repair Damage', value: 'repair_damage' },
  { id: '6', label: 'Add Volume', value: 'volume' },
  { id: '7', label: 'Scalp Health', value: 'scalp_health' },
  { id: '8', label: 'Reduce Frizz', value: 'reduce_frizz' },
  { id: '9', label: 'Color Protection', value: 'color_protection' },
  { id: '10', label: 'Shine & Luster', value: 'shine' },
];

export default function HairGoalsScreen() {
  const router = useRouter();
  const { hairProfile, updateProfile, progress, currentStep, nextStep } = useSetup();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(hairProfile.hairGoals || []);

  // Handle selection
  const handleToggle = (value: string) => {
    setSelectedGoals(prev => {
      let newSelection;
      if (prev.includes(value)) {
        newSelection = prev.filter(item => item !== value);
      } else {
        // Limit selection to maximum 3 goals
        if (prev.length < 3) {
          newSelection = [...prev, value];
        } else {
          newSelection = prev;
        }
      }
      
      // Save selection
      updateProfile('hairGoals', newSelection);
      return newSelection;
    });
  };


  // Handle continue button press
  const handleContinue = () => {
    // Increment the step counter before navigating
    nextStep();
    console.log('Hair goals selected:', selectedGoals, '- navigating to next screen');
    router.push('/(app)/setup/routine-preferences');
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
            <H1 style={styles.title}>What Is Your Goal?</H1>
            <Text style={styles.subtitle}>Select up to 3 hair goals that are most important to you</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {hairGoalOptions.map((option) => (
              <View key={option.id} style={styles.buttonOptionWrapper}>
                <ButtonOption
                  option={option}
                  isSelected={selectedGoals.includes(option.value)}
                  onSelect={handleToggle}
                />
              </View>
            ))}
          </View>
          
          <View style={styles.selectionSummary}>
            <Text style={styles.summaryText}>
              {selectedGoals.length === 0 
                ? 'Select at least one goal (max 3)' 
                : `You've selected ${selectedGoals.length}/3 goals`}
            </Text>
          </View>
          
          {selectedGoals.length > 0 && (
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  buttonOptionWrapper: {
    marginBottom: 10,
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