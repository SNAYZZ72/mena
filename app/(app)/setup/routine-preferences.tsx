import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useSetup } from '@/context/setup-provider';
import { SetupScreen, RadioOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';

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
  const { hairProfile, updateProfile, progress, currentStep } = useSetup();
  const [routinePreference, setRoutinePreference] = useState<string | undefined>(hairProfile.routinePreference);
  const [productPreference, setProductPreference] = useState<string | undefined>(hairProfile.productPreference);

  // Handle routine selection
  const handleRoutineSelect = (value: string) => {
    setRoutinePreference(value);
  };

  // Handle product selection
  const handleProductSelect = (value: string) => {
    setProductPreference(value);
  };

  // Handle next button press
  const handleNext = () => {
    updateProfile('routinePreference', routinePreference);
    updateProfile('productPreference', productPreference);
    router.push('/setup/complete');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SetupScreen
        title="Your Preferences"
        subtitle="Tell us about your ideal hair care routine and product preferences"
        progress={progress}
        stepNumber={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!routinePreference || !productPreference}
      >
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
      </SetupScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
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
  }
});