import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { Text } from './text';
import { H1 } from './typography';
import { Button } from './button';

// Types
export type OptionType = {
  id: string;
  label: string;
  value: string;
  icon?: string;
  description?: string;
};

// Basic props shared by multiple components
interface BaseComponentProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

// Progress bar component
interface ProgressBarProps {
  progress: number;
  stepNumber?: number;
  stepTitle?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  stepNumber,
  stepTitle
}) => {
  return (
    <View style={styles.progressContainer}>
      {stepNumber && stepTitle && (
        <View style={styles.stepInfo}>
          <Text style={styles.stepNumber}>{stepNumber}</Text>
          <Text style={styles.stepTitle}>{stepTitle}</Text>
        </View>
      )}
      
      <View style={styles.progressBackground}>
        <Animated.View 
          style={[
            styles.progressFill, 
            { width: `${progress}%` }
          ]}
        />
      </View>
    </View>
  );
};

// Setup screen wrapper
interface SetupScreenProps extends BaseComponentProps {
  children: React.ReactNode;
  progress: number;
  stepNumber?: number;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  title,
  subtitle,
  children,
  progress,
  stepNumber,
  onBack,
  showBack = true,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  isLoading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <ProgressBar 
        progress={progress} 
        stepNumber={stepNumber} 
        stepTitle={title}
      />
      
      {/* Header */}
      <View style={styles.header}>
        {showBack && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Content Container */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={styles.titleContainer}
        >
          <H1 style={styles.title}>{title}</H1>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Animated.View>
        
        <Animated.View 
          entering={FadeInRight.duration(400).delay(200)}
          style={styles.contentWrapper}
        >
          {children}
        </Animated.View>
      </ScrollView>
      
      {/* Footer with Next Button */}
      <View style={styles.footer}>
        <Button
          onPress={onNext}
          disabled={nextDisabled || isLoading}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>{nextLabel}</Text>
        </Button>
      </View>
    </View>
  );
};

// Option Card (for single select)
interface OptionCardProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        isSelected && styles.optionCardSelected,
      ]}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.7}
    >
      {option.icon && (
        <Feather name={option.icon as any} size={24} color={isSelected ? "#FFFFFF" : "#AA8AD2"} />
      )}
      <Text style={[
        styles.optionLabel,
        isSelected && styles.optionLabelSelected,
      ]}>
        {option.label}
      </Text>
      {isSelected && (
        <Feather name="check" size={20} color="#FFFFFF" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );
};

// Radio Option (for radio button lists)
interface RadioOptionProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const RadioOption: React.FC<RadioOptionProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.radioCircle,
        isSelected && styles.radioCircleSelected,
      ]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{option.label}</Text>
    </TouchableOpacity>
  );
};

// Checkbox Option (for multi-select)
interface CheckboxOptionProps {
  option: OptionType;
  isSelected: boolean;
  onToggle: (value: string) => void;
}

export const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  option,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={styles.checkboxOption}
      onPress={() => onToggle(option.value)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox,
        isSelected && styles.checkboxSelected,
      ]}>
        {isSelected && <Feather name="check" size={16} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxLabel}>{option.label}</Text>
    </TouchableOpacity>
  );
};

// Button Option (for highlighted options with borders)
interface ButtonOptionProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const ButtonOption: React.FC<ButtonOptionProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonOption,
        isSelected && styles.buttonOptionSelected,
      ]}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.buttonOptionLabel,
        isSelected && styles.buttonOptionLabelSelected,
      ]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

// Grid Option (for visually appealing grid layout)
interface GridOptionProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const GridOption: React.FC<GridOptionProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.gridOption,
        isSelected && styles.gridOptionSelected,
      ]}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.7}
    >
      {option.icon && (
        <Feather name={option.icon as any} size={28} color={isSelected ? "#FFFFFF" : "#AA8AD2"} style={styles.gridIcon} />
      )}
      <Text style={[
        styles.gridLabel,
        isSelected && styles.gridLabelSelected,
      ]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  stepInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    color: '#AA8AD2',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stepTitle: {
    color: '#FFFFFF',
    opacity: 0.8,
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
    paddingBottom: 100, // Extra space at bottom for button
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
  contentWrapper: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
  },
  nextButton: {
    backgroundColor: '#AA8AD2',
    borderRadius: 12,
    paddingVertical: 14,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Option Card Styles
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#AA8AD2',
    borderColor: '#FFFFFF',
  },
  optionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  optionLabelSelected: {
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 8,
  },
  // Radio Option Styles
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#AA8AD2',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#AA8AD2',
  },
  radioLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Checkbox Option Styles
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#AA8AD2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#AA8AD2',
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Button Option Styles
  buttonOption: {
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonOptionSelected: {
    backgroundColor: '#AA8AD2',
    borderColor: '#FFFFFF',
  },
  buttonOptionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonOptionLabelSelected: {
    fontWeight: 'bold',
  },
  // Grid Option Styles
  gridOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridOptionSelected: {
    backgroundColor: '#AA8AD2',
    borderColor: '#FFFFFF',
  },
  gridIcon: {
    marginBottom: 12,
  },
  gridLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  gridLabelSelected: {
    fontWeight: 'bold',
  },
});