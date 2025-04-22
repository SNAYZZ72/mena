import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useSetup } from '@/context/setup-provider';
import { RadioOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

// Routine preference options
const routineOptions = [
  { id: '1', label: 'Quick & Simple (5-10 mins daily)', value: 'quick', icon: 'clock' },
  { id: '2', label: 'Balanced (10-15 mins daily)', value: 'balanced', icon: 'sunrise' },
  { id: '3', label: 'Thorough (15-20 mins daily)', value: 'thorough', icon: 'sun' },
  { id: '4', label: 'Intensive (20+ mins daily, with weekly treatments)', value: 'intensive', icon: 'award' }
];

// Product preference options
const productOptions = [
  { id: '1', label: 'All Natural & Organic', value: 'natural', icon: 'heart' },
  { id: '2', label: 'Mix of Natural & Regular Products', value: 'mixed', icon: 'shuffle' },
  { id: '3', label: 'Professional Products', value: 'professional', icon: 'briefcase' },
  { id: '4', label: 'Budget-Friendly Options', value: 'budget', icon: 'dollar-sign' },
  { id: '5', label: 'DIY & Homemade Solutions', value: 'diy', icon: 'tool' }
];

export default function RoutinePreferencesScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useSetup();
  const [routinePreference, setRoutinePreference] = useState<string>('balanced');
  const [productPreference, setProductPreference] = useState<string>('mixed');

  // For progress indication (estimate 80% complete at this step)
  const progress = 80;

  // Handle routine selection
  const handleRoutineSelect = (value: string) => {
    setRoutinePreference(value);
    // Store in local state only as this isn't part of the HairProfile type
  };

  // Handle product selection
  const handleProductSelect = (value: string) => {
    setProductPreference(value);
    // Store in local state only as this isn't part of the HairProfile type
  };

  // Handle continue button press
  const handleContinue = () => {
    console.log('Routine preferences selected:', routinePreference, productPreference, '- persisting to profile and navigating to complete screen');
    updateProfile('routine_preference', routinePreference);
    updateProfile('product_preference', productPreference);
    router.push('/(app)/setup/complete');
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
                <H1 style={styles.title}>Your Preferences</H1>
                <Text style={styles.subtitle}>Tell us about your ideal hair care routine and product preferences</Text>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(300).duration(800)}
                style={styles.sectionContainer}
              >
                <Text style={styles.sectionTitle}>How much time can you dedicate to hair care?</Text>
                <View style={styles.optionsContainer}>
                  {routineOptions.map((option, index) => (
                    <Animated.View
                      key={option.id}
                      entering={FadeInUp.delay(400 + (index * 100)).duration(600)}
                      style={styles.optionWrapper}
                    >
                      <TouchableOpacity
                        style={[
                          styles.optionCard,
                          routinePreference === option.value && styles.selectedOptionCard
                        ]}
                        onPress={() => handleRoutineSelect(option.value)}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.radioOuter,
                          routinePreference === option.value && styles.selectedRadioOuter
                        ]}>
                          {routinePreference === option.value && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        
                        <View style={styles.optionContent}>
                          <View style={[
                            styles.iconContainer,
                            routinePreference === option.value && styles.selectedIconContainer
                          ]}>
                            <Feather 
                              name={option.icon as any} 
                              size={18} 
                              color={routinePreference === option.value ? "#FFFFFF" : "#AA8AD2"} 
                            />
                          </View>
                          
                          <Text style={[
                            styles.optionLabel,
                            routinePreference === option.value && styles.selectedOptionLabel
                          ]}>
                            {option.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(800).duration(800)}
                style={styles.sectionContainer}
              >
                <Text style={styles.sectionTitle}>What types of products do you prefer?</Text>
                <View style={styles.optionsContainer}>
                  {productOptions.map((option, index) => (
                    <Animated.View
                      key={option.id}
                      entering={FadeInUp.delay(900 + (index * 100)).duration(600)}
                      style={styles.optionWrapper}
                    >
                      <TouchableOpacity
                        style={[
                          styles.optionCard,
                          productPreference === option.value && styles.selectedOptionCard
                        ]}
                        onPress={() => handleProductSelect(option.value)}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.radioOuter,
                          productPreference === option.value && styles.selectedRadioOuter
                        ]}>
                          {productPreference === option.value && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        
                        <View style={styles.optionContent}>
                          <View style={[
                            styles.iconContainer,
                            productPreference === option.value && styles.selectedIconContainer
                          ]}>
                            <Feather 
                              name={option.icon as any} 
                              size={18} 
                              color={productPreference === option.value ? "#FFFFFF" : "#AA8AD2"} 
                            />
                          </View>
                          
                          <Text style={[
                            styles.optionLabel,
                            productPreference === option.value && styles.selectedOptionLabel
                          ]}>
                            {option.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
              
              {routinePreference && productPreference && (
                <Animated.View
                  entering={FadeInUp.delay(1400).duration(800)}
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
                  
                  <Text style={styles.buttonHint}>Final step before your personalized plan!</Text>
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
  selectedOptionCard: {
    backgroundColor: 'rgba(170, 138, 210, 0.2)',
    borderColor: '#AA8AD2',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioOuter: {
    borderColor: '#AA8AD2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#AA8AD2',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedIconContainer: {
    backgroundColor: '#AA8AD2',
  },
  optionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
  },
  selectedOptionLabel: {
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  buttonHint: {
    color: '#CCCCCC',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});