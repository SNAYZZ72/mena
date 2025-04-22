import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useSetup } from '@/context/setup-provider';
import { ButtonOption } from '@/components/ui/setup-components';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { HairGoal } from '@/types/profile';

// Hair goals options with mapping to HairGoal type values
const hairGoalOptions = [
  { id: '1', label: 'Moisture & Hydration', value: 'moisture' as HairGoal, icon: 'droplet' },
  { id: '2', label: 'Hair Growth', value: 'growth' as HairGoal, icon: 'trending-up' },
  { id: '3', label: 'Reduce Breakage', value: 'strength' as HairGoal, icon: 'shield' },
  { id: '4', label: 'Curl Definition', value: 'definition' as HairGoal, icon: 'circle' },
  { id: '5', label: 'Repair Damage', value: 'repair' as HairGoal, icon: 'tool' },
  { id: '6', label: 'Add Volume', value: 'volume' as HairGoal, icon: 'layers' },
  { id: '7', label: 'Scalp Health', value: 'scalp' as HairGoal, icon: 'heart' },
  { id: '8', label: 'Reduce Frizz', value: 'frizz' as HairGoal, icon: 'wind' },
  { id: '9', label: 'Color Protection', value: 'color' as HairGoal, icon: 'shield' },
  { id: '10', label: 'Shine & Luster', value: 'shine' as HairGoal, icon: 'sun' },
];

export default function HairGoalsScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useSetup();
  const [selectedGoals, setSelectedGoals] = useState<HairGoal[]>(profile?.hair_goals || []);

  // For progress indication (estimate 60% complete at this step)
  const progress = 60;

  // Handle selection
  const handleToggle = (value: HairGoal) => {
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
      updateProfile('hair_goals', newSelection);
      return newSelection;
    });
  };


  // Handle continue button press
  const handleContinue = () => {
    console.log('Hair goals selected:', selectedGoals, '- navigating to next screen');
    router.push('/(app)/setup/image-assessment');
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
                <H1 style={styles.title}>What Is Your Goal?</H1>
                <Text style={styles.subtitle}>Select up to 3 hair goals that are most important to you</Text>
              </Animated.View>
              
              <Animated.View 
                entering={FadeInUp.delay(300).duration(800)}
                style={styles.optionsContainer}
              >
                {hairGoalOptions.map((option, index) => (
                  <Animated.View
                    key={option.id}
                    entering={FadeInUp.delay(400 + (index * 70)).duration(600)}
                    style={styles.goalItem}
                  >
                    <TouchableOpacity
                      style={[
                        styles.goalCard,
                        selectedGoals.includes(option.value) && styles.selectedGoalCard
                      ]}
                      onPress={() => handleToggle(option.value)}
                      activeOpacity={0.7}
                      disabled={!selectedGoals.includes(option.value) && selectedGoals.length >= 3}
                    >
                      <View style={[
                        styles.iconContainer,
                        selectedGoals.includes(option.value) && styles.selectedIconContainer
                      ]}>
                        <Feather 
                          name={option.icon as any} 
                          size={20} 
                          color={selectedGoals.includes(option.value) ? "#FFFFFF" : "#AA8AD2"} 
                        />
                      </View>
                      
                      <Text style={[
                        styles.goalLabel,
                        selectedGoals.includes(option.value) && styles.selectedGoalLabel,
                        !selectedGoals.includes(option.value) && selectedGoals.length >= 3 && styles.disabledLabel
                      ]}>
                        {option.label}
                      </Text>
                      
                      {selectedGoals.includes(option.value) && (
                        <View style={styles.checkIndicator}>
                          <Feather name="check" size={16} color="#FFFFFF" />
                        </View>
                      )}
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
                  {selectedGoals.length === 0 
                    ? 'Select at least one goal (max 3)' 
                    : `You've selected ${selectedGoals.length}/3 goals`}
                </Text>
              </Animated.View>
              
              {selectedGoals.length > 0 && (
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  goalItem: {
    width: '50%',
    padding: 6,
    marginBottom: 4,
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  selectedGoalCard: {
    backgroundColor: 'rgba(170, 138, 210, 0.25)',
    borderColor: '#AA8AD2',
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
  goalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  selectedGoalLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  checkIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
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