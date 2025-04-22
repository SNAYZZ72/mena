import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'outline' | 'elevated';

interface CardProps extends React.ComponentPropsWithoutRef<typeof View> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const cardVariants = cva('rounded-lg bg-card text-card-foreground', {
  variants: {
    variant: {
      default: 'bg-card',
      outline: 'border border-border bg-transparent',
      elevated: 'bg-card shadow-md',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  onPress,
  disabled,
  className,
  children,
  style,
  ...props
}) => {
  const CardComponent = onPress ? Pressable : View;
  
  return (
    <CardComponent
      className={cn(
        cardVariants({ variant, padding, className }),
        disabled && 'opacity-60'
      )}
      style={style as ViewStyle}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole={onPress ? 'button' : undefined}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

interface CardHeaderProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <View
      className={cn('flex flex-col space-y-1.5 p-6 pb-2', className)}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <View
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <View
      className={cn('flex flex-row items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </View>
  );
}; 