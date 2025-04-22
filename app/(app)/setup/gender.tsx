import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useSetup } from '@/context/setup-provider';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/image';

// Gender options with enhanced icons and descriptions
const genderOptions = [
  { 
    id: '1', 
    label: 'Male', 
    value: 'male', 
    icon: 'user', 
    description: 'Typically shorter hairstyles and specific scalp needs'
  },
  { 
    id: '2', 
    label: 'Female', 
    value: 'female', 
    icon: 'user', 
    description: 'Various hair lengths and unique styling considerations'
  },
  { 
    id: '3', 
    label: 'Non-binary', 
    value: 'non_binary', 
    icon: 'users', 
    description: 'Personalized approach beyond traditional categories'
  },
  { 
    id: '4', 
    label: 'Prefer not to say', 
    value: 'not_specified', 
    icon: 'user-x', 
    description: "We'll still provide great recommendations"
  }
];

export default function GenderScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useSetup();
  const [selectedGender, setSelectedGender] = useState<string | undefined>(profile?.gender);
  // For the progress bar - calculated based on current step
  const progress = 16.67; // Represents first step of 6 steps (100/6)

  // Handle gender selection and immediate navigation
  const handleSelect = (value: string) => {
    setSelectedGender(value);
    // Store gender in its own field
    updateProfile('gender', value);
    console.log('Gender selected:', value, '- navigating to next screen');
    router.push('/(app)/setup/age');
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  const title = "What's Your Gender?";
  const subtitle = "This helps us personalize your hair care recommendations";

  return (
    <ImageBackground
      source={require('@/assets/setup-bg.png')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.7)', 'rgba(34, 34, 34, 0.95)']}
        style={styles.gradient}
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
              {handleBack && (
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Feather name="chevron-left" size={24} color="#FFFFFF" />
                  <Text className="text-white ml-1">Back</Text>
                </TouchableOpacity>
              )}
              
              <Animated.View
                entering={FadeIn.duration(800)}
                style={styles.decorativeElement}
              >
                <Image
                  source={require('@/assets/hair-decoration.png')}
                  style={styles.decorImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
            
            {/* Content */}
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View 
                entering={FadeInUp.duration(600)}
                style={styles.titleContainer}
              >
                <Text className="text-white font-bold text-2xl mb-3">{title}</Text>
                <Text className="text-gray-300 text-base leading-6">{subtitle}</Text>
              </Animated.View>
              
              <View style={styles.optionsContainer}>
                {genderOptions.map((option, index) => (
                  <Animated.View 
                    key={option.id}
                    entering={FadeInUp.delay(300 + index * 100).duration(600)}
                    style={styles.optionWrapper}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedGender === option.value && styles.optionCardSelected
                      ]}
                      onPress={() => handleSelect(option.value)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.optionIconContainer}>
                        <Feather 
                          name={option.icon as any} 
                          size={24} 
                          color={selectedGender === option.value ? "#FFFFFF" : "#AA8AD2"} 
                        />
                      </View>
                      <View style={styles.optionTextContainer}>
                        <Text className="text-white text-lg font-semibold mb-1">
                          {option.label}
                        </Text>
                        <Text className={selectedGender === option.value ? "text-white opacity-90 text-sm" : "text-gray-400 text-sm"}>
                          {option.description}
                        </Text>
                      </View>
                      {selectedGender === option.value && (
                        <View style={styles.checkMarkContainer}>
                          <Feather name="check" size={20} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
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
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeElement: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  decorImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionWrapper: {
    marginBottom: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionCardSelected: {
    backgroundColor: '#AA8AD2',
    borderColor: '#AA8AD2',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  checkMarkContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});