import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useSetup } from '@/context/setup-provider';
import { SetupScreen, ButtonOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';

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
  const { hairProfile, updateProfile, progress, currentStep } = useSetup();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(hairProfile.hairGoals || []);

  // Handle selection
  const handleToggle = (value: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        // Limit selection to maximum 3 goals
        if (prev.length < 3) {
          return [...prev, value];
        }
        return prev;
      }
    });
  };

  // Handle next button press
  const handleNext = () => {
    updateProfile('hairGoals', selectedGoals);
    router.push('/setup/routine-preferences');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SetupScreen
        title="What Is Your Goal?"
        subtitle="Select up to 3 hair goals that are most important to you"
        progress={progress}
        stepNumber={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={selectedGoals.length === 0}
      >
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
      </SetupScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
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
  },
  summaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  }
});