import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useSetup } from '@/context/setup-provider';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { ChemicalProcess } from '@/types/profile';

// Define valid Feather icon names to use
type FeatherIconName = 'droplet' | 'zap' | 'scissors' | 'alert-triangle' | 'x-circle' | 'info' | 'arrow-right' | 'arrow-left' | 'check';

// Hair concern options using valid Feather icon names
const hairConcernOptions = [
  { id: '1', label: 'Color Treated', value: 'color' as ChemicalProcess, icon: 'droplet' as FeatherIconName },
  { id: '2', label: 'Relaxed Hair', value: 'relaxer' as ChemicalProcess, icon: 'zap' as FeatherIconName },
  { id: '3', label: 'Permed Hair', value: 'perm' as ChemicalProcess, icon: 'scissors' as FeatherIconName },
  { id: '4', label: 'Bleached Hair', value: 'bleach' as ChemicalProcess, icon: 'alert-triangle' as FeatherIconName },
  { id: '5', label: 'No Chemical Treatments', value: 'none' as ChemicalProcess, icon: 'x-circle' as FeatherIconName },
];

export default function HairConcernsScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useSetup();
  const [selectedConcerns, setSelectedConcerns] = useState<ChemicalProcess[]>(profile?.hair_concerns || []);

  // For progress indication (estimate 40% complete at this step)
  const progress = 40;

  // Handle toggle selection
  const handleToggle = (value: ChemicalProcess) => {
    setSelectedConcerns(prev => {
      let newSelection;
      if (prev.includes(value)) {
        newSelection = prev.filter(item => item !== value);
      } else {
        newSelection = [...prev, value];
      }
      
      // Save selection (but only navigate when at least one is selected and Continue is pressed)
      updateProfile('hair_concerns', newSelection);
      return newSelection;
    });
  };

  // Handle continue button press
  const handleContinue = () => {
    console.log('Hair concerns selected:', selectedConcerns, '- navigating to next screen');
    router.push('/(app)/setup/hair-goals');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={require('@/assets/setup-bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.3)', 'rgba(34, 34, 34, 0.9)']}
        style={{ flex: 1 }}
      >
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
                entering={FadeInUp.duration(800)}
                style={styles.titleContainer}
              >
                <H1 style={styles.title}>What Chemical Treatments Have You Used?</H1>
                <Text style={styles.subtitle}>Select all that apply to your hair (select at least one)</Text>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(300).duration(800)}
                style={styles.optionsContainer}
              >
                {hairConcernOptions.map((option, index) => (
                  <Animated.View
                    key={option.id}
                    entering={FadeInUp.delay(400 + (index * 50)).duration(600)}
                    style={styles.optionWrapper}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedConcerns.includes(option.value) && styles.selectedCard
                      ]}
                      onPress={() => handleToggle(option.value)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.checkboxContainer,
                        selectedConcerns.includes(option.value) && styles.selectedCheckbox
                      ]}>
                        {selectedConcerns.includes(option.value) && (
                          <Feather name="check" size={16} color="#FFFFFF" />
                        )}
                      </View>
                      
                      <View style={styles.iconContainer}>
                        <Feather 
                          name={option.icon} 
                          size={18} 
                          color={selectedConcerns.includes(option.value) ? "#AA8AD2" : "#FFFFFF"} 
                        />
                      </View>
                      
                      <Text style={[
                        styles.optionLabel,
                        selectedConcerns.includes(option.value) && styles.selectedLabel
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(1000).duration(800)}
                style={styles.selectionSummary}
              >
                <View style={styles.iconInfoContainer}>
                  <Feather name="info" size={18} color="#AA8AD2" />
                </View>
                <Text style={styles.summaryText}>
                  {selectedConcerns.length === 0 
                    ? 'Select at least one option to proceed' 
                    : `You've selected ${selectedConcerns.length} option${selectedConcerns.length > 1 ? 's' : ''}`}
                </Text>
              </Animated.View>
              
              {selectedConcerns.length > 0 && (
                <Animated.View
                  entering={FadeInUp.delay(1200).duration(800)}
                  style={styles.buttonContainer}
                >
                  <Button 
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon="arrow-right"
                    onPress={handleContinue}
                    className="h-14 rounded-xl shadow-lg shadow-primary/40"
                  >
                    Continue
                  </Button>
                </Animated.View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#AA8AD2',
    borderRadius: 4,
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
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionWrapper: {
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectedCard: {
    backgroundColor: 'rgba(170, 138, 210, 0.2)',
    borderColor: '#AA8AD2',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: '#AA8AD2',
    borderColor: '#AA8AD2',
  },
  iconContainer: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
  optionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectionSummary: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginVertical: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(170, 138, 210, 0.3)',
  },
  iconInfoContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  summaryText: {
    color: '#E0E0E0',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
});