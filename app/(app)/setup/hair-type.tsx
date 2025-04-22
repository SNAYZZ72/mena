import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useSetup } from '@/context/setup-provider';
import { GridOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1, Body } from '@/components/ui/typography';

// Hair type options
const hairTypeOptions = [
  { 
    id: '1', 
    label: 'Straight', 
    value: 'straight', 
    icon: 'align-center',
    description: 'Hair that falls flat from roots to ends'
  },
  { 
    id: '2', 
    label: 'Wavy', 
    value: 'wavy', 
    icon: 'trending-up',
    description: 'Hair with gentle S-shaped waves'
  },
  { 
    id: '3', 
    label: 'Curly', 
    value: 'curly', 
    icon: 'refresh-cw',
    description: 'Hair with defined spiral or ringlet patterns'
  },
  { 
    id: '4', 
    label: 'Coily/Kinky', 
    value: 'coily', 
    icon: 'rotate-cw',
    description: 'Hair with tight curls or zig-zag patterns'
  },
  { 
    id: '5', 
    label: 'Not Sure', 
    value: 'not_sure', 
    icon: 'help-circle',
    description: 'We\'ll help you determine your type later'
  }
];

export default function HairTypeScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useSetup();
  const [selectedType, setSelectedType] = useState<string | undefined>(profile?.hair_type);

  // For progress indication (estimate 20% complete at this step)
  const progress = 20;

  // Handle selection and immediate navigation
  const handleSelect = (value: string) => {
    setSelectedType(value);
    // Save and navigate immediately
    updateProfile('hair_type', value);
    console.log('Hair type selected:', value, '- navigating to next screen');
    router.push('/(app)/setup/hair-concerns');
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
                <H1 style={styles.title}>What's Your Hair Type?</H1>
                <Text style={styles.subtitle}>
                  Select the option that best describes your natural hair pattern
                </Text>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(200).duration(800)}
                style={styles.gridContainer}
              >
                {hairTypeOptions.map((option, index) => (
                  <Animated.View 
                    key={option.id} 
                    style={styles.gridItem}
                    entering={FadeInUp.delay(300 + (index * 100)).duration(800)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedType === option.value && styles.selectedCard
                      ]}
                      onPress={() => handleSelect(option.value)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.iconContainer,
                        selectedType === option.value && styles.selectedIconContainer
                      ]}>
                        <Feather 
                          name={option.icon as any} 
                          size={32} 
                          color={selectedType === option.value ? "#FFFFFF" : "#AA8AD2"} 
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={[
                          styles.optionLabel,
                          selectedType === option.value && styles.selectedLabel
                        ]}>
                          {option.label}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(800).duration(800)}
                style={styles.helpContainer}
              >
                <View style={styles.iconInfoContainer}>
                  <Feather name="info" size={18} color="#AA8AD2" />
                </View>
                <Text style={styles.helpText}>
                  Your hair type influences which products and routines will work best for you.
                </Text>
              </Animated.View>
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
  gridContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  gridItem: {
    width: '100%',
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: 'rgba(170, 138, 210, 0.2)',
    borderColor: '#AA8AD2',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: '#AA8AD2',
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedLabel: {
    color: '#AA8AD2',
  },
  optionDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    flexWrap: 'wrap',
  },
  helpContainer: {
    backgroundColor: 'rgba(170, 138, 210, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 30,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(170, 138, 210, 0.3)',
  },
  iconInfoContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  helpText: {
    color: '#E0E0E0',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  }
});