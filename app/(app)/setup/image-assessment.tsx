import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ImageBackground, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSetup } from '@/context/setup-provider';
import { SafeAreaView } from '@/components/safe-area-view';
import { LinearGradient } from 'expo-linear-gradient';
import { H1, Body } from '@/components/ui/typography';

const { width } = Dimensions.get('window');
const progress = 70;

export default function ImageAssessmentScreen() {
  const router = useRouter();
  const { updateProfile } = useSetup();

  // Launch camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets.length > 0) {
      updateProfile('photo_uri', result.assets[0].uri);
      router.push('/(app)/setup/routine-preferences');
    }
  };

  // Launch image picker for gallery upload
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      updateProfile('photo_uri', result.assets[0].uri);
      router.push('/(app)/setup/routine-preferences');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground source={require('@/assets/setup-bg.png')} style={{ flex: 1 }} resizeMode="cover">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={[ 'rgba(34,34,34,0.3)', 'rgba(34,34,34,0.9)' ]} style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View entering={FadeInUp.duration(500)} style={[ styles.progressFill, { width: `${progress}%` } ]} />
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
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.contentContainer}>
            <H1 style={styles.title}>To analyze your hair</H1>
            <Body style={styles.subtitle}>Please choose one of the following to upload your selfie.</Body>

            <TouchableOpacity style={styles.optionCard} onPress={takePhoto} activeOpacity={0.8}>
              <Feather name="camera" size={28} color="#AA8AD2" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Take a photo</Text>
                <Text style={styles.optionDesc}>Take a photo directly with your camera.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard} onPress={pickImage} activeOpacity={0.8}>
              <Feather name="image" size={28} color="#AA8AD2" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Upload a photo</Text>
                <Text style={styles.optionDesc}>Choose a photo from your camera's gallery.</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  progressContainer: { paddingTop: 16, paddingHorizontal: 20 },
  progressBackground: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#AA8AD2', borderRadius: 3 },
  header: { paddingTop: 16, paddingHorizontal: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FFFFFF', marginLeft: 8 },
  contentContainer: { flex: 1, justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subtitle: { color: '#E0E0E0', fontSize: 16, marginBottom: 24, textAlign: 'center' },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', marginBottom: 12 },
  optionTextContainer: { flex: 1, marginLeft: 12 },
  optionLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  optionDesc: { color: '#CCCCCC', fontSize: 14 },
}); 