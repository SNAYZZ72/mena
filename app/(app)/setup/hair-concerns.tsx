import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useSetup } from '@/context/setup-provider';
import { SetupScreen, CheckboxOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';

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
  const { hairProfile, updateProfile, progress, currentStep } = useSetup();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(hairProfile.hairConcerns || []);

  // Handle toggle selection
  const handleToggle = (value: string) => {
    setSelectedConcerns(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Handle next button press
  const handleNext = () => {
    updateProfile('hairConcerns', selectedConcerns);
    router.push('/setup/hair-goals');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SetupScreen
        title="What are Your Hair Concerns?"
        subtitle="Select all that apply to your hair (select at least one)"
        progress={progress}
        stepNumber={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={selectedConcerns.length === 0}
      >
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
    marginBottom: 20,
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