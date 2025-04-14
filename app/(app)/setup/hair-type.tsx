import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { GridOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';

// Hair type options
const hairTypeOptions = [
  { id: '1', label: 'Straight', value: 'straight', icon: 'align-center' },
  { id: '2', label: 'Wavy', value: 'wavy', icon: 'trending-up' },
  { id: '3', label: 'Curly', value: 'curly', icon: 'refresh-cw' },
  { id: '4', label: 'Coily/Kinky', value: 'coily', icon: 'rotate-cw' },
  { id: '5', label: 'Not Sure', value: 'not_sure', icon: 'help-circle' }
];

export default function HairTypeScreen() {
  const router = useRouter();
  const { hairProfile, updateProfile, progress, currentStep, nextStep } = useSetup();
  const [selectedType, setSelectedType] = useState<string | undefined>(hairProfile.hairType);


  // Handle selection and immediate navigation
  const handleSelect = (value: string) => {
    setSelectedType(value);
    // Save and navigate immediately
    updateProfile('hairType', value);
    // Increment the step counter before navigating
    nextStep();
    console.log('Hair type selected:', value, '- navigating to next screen');
    router.push('/(app)/setup/hair-concerns');
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
            <H1 style={styles.title}>What's Your Hair Type?</H1>
            <Text style={styles.subtitle}>Select the option that best describes your natural hair</Text>
          </View>
          
          <View style={styles.gridContainer}>
            {hairTypeOptions.map((option) => (
              <View key={option.id} style={styles.gridItem}>
                <GridOption
                  option={option}
                  isSelected={selectedType === option.value}
                  onSelect={handleSelect}
                />
              </View>
            ))}
          </View>
          
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Not sure about your hair type? Select "Not Sure" and we'll help you figure it out later!
            </Text>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  gridItem: {
    width: '50%',
    padding: 6,
  },
  helpContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  helpText: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
  }
});