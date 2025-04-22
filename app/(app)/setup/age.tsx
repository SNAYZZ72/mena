import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useSetup } from '@/context/setup-provider';
import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { H1 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AgeScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useSetup();
  const [ageValue, setAgeValue] = useState<string>(profile?.age ? String(profile.age) : '');
  const [error, setError] = useState<string | null>(null);

  // Estimate progress (inserted between gender (16.67) and hair type (20))
  const progress = 30;

  const handleContinue = () => {
    const ageNum = parseInt(ageValue, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setError('Please enter a valid age');
      return;
    }
    updateProfile('age', ageNum);
    router.push('/(app)/setup/hair-type');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={require('@/assets/setup-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['rgba(34, 34, 34, 0.3)', 'rgba(34, 34, 34, 0.9)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.screenContainer}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                  entering={FadeInUp.duration(800)}
                />
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Feather name="chevron-left" size={24} color="#FFFFFF" />
                <Text className="text-white ml-1">Back</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.contentContainer}>
              <H1 style={styles.title}>How Old Are You?</H1>
              <Text className="text-gray-300 mb-4">
                This helps us tailor recommendations to your age group
              </Text>

              <Input
                label="Age"
                placeholder="Enter your age"
                keyboardType="numeric"
                value={ageValue}
                onChangeText={text => {
                  setAgeValue(text);
                  setError(null);
                }}
                error={error || undefined}
                fullWidth
                darkMode
              />

              <View style={styles.buttonContainer}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={handleContinue}
                  disabled={!ageValue}
                >
                  Continue
                </Button>
              </View>
            </Animated.View>
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
    paddingHorizontal: 20,
  },
  progressContainer: {
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
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 24,
  },
}); 