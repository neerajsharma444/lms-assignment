import React from 'react';
import { Text, ActivityIndicator, Pressable, PressableProps, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = React.memo(({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    onPressOut?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: any) => {
    if (!disabled && !isLoading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    }
  };

  // Base styles
  let containerStyles = 'flex-row items-center justify-center rounded-2xl overflow-hidden shadow-sm ';
  let textStyles = 'font-bold text-center z-10 ';
  let isGradient = variant === 'primary' || variant === 'gradient';

  // Size styles
  switch (size) {
    case 'sm':
      containerStyles += 'py-2 px-4 min-h-[40px] ';
      textStyles += 'text-sm ';
      break;
    case 'md':
      containerStyles += 'py-3.5 px-6 min-h-[52px] ';
      textStyles += 'text-base ';
      break;
    case 'lg':
      containerStyles += 'py-4 px-8 min-h-[60px] ';
      textStyles += 'text-lg ';
      break;
  }

  // Variant styles
  switch (variant) {
    case 'primary':
    case 'gradient':
      containerStyles += 'border-0 ';
      textStyles += 'text-white ';
      break;
    case 'secondary':
      containerStyles += 'bg-slate-100 dark:bg-slate-800 border-0 ';
      textStyles += 'text-slate-900 dark:text-white ';
      break;
    case 'outline':
      containerStyles += 'border-2 border-slate-200 dark:border-slate-700 bg-transparent ';
      textStyles += 'text-slate-900 dark:text-white ';
      break;
    case 'ghost':
      containerStyles += 'bg-transparent shadow-none ';
      textStyles += 'text-indigo-600 dark:text-indigo-400 ';
      break;
  }

  if (disabled) {
    containerStyles += 'opacity-50 ';
  }

  return (
    <AnimatedPressable
      style={animatedStyle}
      disabled={disabled || isLoading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      className={`${containerStyles} ${className}`}
      {...props}
    >
      {isGradient && (
        <LinearGradient
          colors={Colors.gradients.primary as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {isLoading ? (
        <ActivityIndicator color={isGradient ? 'white' : Colors.primary} className="z-10" />
      ) : (
        <View className="flex-row items-center justify-center z-10">
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text className={textStyles}>
            {label}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
});
