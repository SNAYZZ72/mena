import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { OptionCard } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';

// Gender options
const genderOptions = [
  { id: '1', label: 'Male', value: 'male', icon: 'user' },
  { id: '2', label: 'Female', value: 'female', icon: 'user' },
  { id: '3', label: 'Non-binary', value: 'non_binary', icon: 'users' },
  { id: '4', label: 'Prefer not to say', value: 'not_specified', icon: 'user-x' }
];

export default function GenderScreen() {
  const router = useRouter();
  const { hairProfile, updateProfile, progress, currentStep, nextStep } = useSetup();
  const [selectedGender, setSelectedGender] = useState<string | undefined>(hairProfile.gender);

  // Handle gender selection and immediate navigation
  const handleSelect = (value: string) => {
    setSelectedGender(value);
    // Save and navigate immediately
    updateProfile('gender', value);
    // Increment the step counter before navigating
    nextStep();
    console.log('Gender selected:', value, '- navigating to next screen');
    router.push('/(app)/setup/hair-type');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  const title = "What's Your Gender?";
  const subtitle = "This helps us personalize your hair care recommendations";

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
          {handleBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Feather name="chevron-left" size={24} color="#FFFFFF" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Content */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <H1 style={styles.title}>{title}</H1>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedGender === option.value}
                onSelect={handleSelect}
              />
            ))}
          </View>
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
  }
});