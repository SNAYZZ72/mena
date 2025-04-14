import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useSetup } from '@/context/setup-provider';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from '@/components/safe-area-view';

export default function SetupIndexScreen() {
  const router = useRouter();
  const { progress, goToStep } = useSetup();

  // Start the setup process
  const handleStart = () => {
    router.push('/setup/gender');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(800)}
        style={styles.content}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/icon.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Let's Set Up Your Hair Profile</Text>
          <Text style={styles.description}>
            Answer a few questions to help us customize your hair care experience.
            This will help us recommend the best routines and products for your unique hair.
          </Text>
        </View>
        
        <View style={styles.inspirationalContainer}>
          <Text style={styles.inspirationalTitle}>
            Healthy Hair Is A Journey
          </Text>
          <Text style={styles.inspirationalText}>
            Your personalized hair care journey starts now. Don't give up!
          </Text>
        </View>
        
        <Button 
          style={styles.button}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Start Setup</Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imageContainer: {
    marginBottom: 32,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  inspirationalContainer: {
    backgroundColor: '#AA8AD2',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 40,
    width: '100%',
  },
  inspirationalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  inspirationalText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#AA8AD2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});