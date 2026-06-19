import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderOpacity = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderOpacity.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderOpacity.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
    borderColor: error ? Colors.danger : Colors.primary,
  }));

  const baseBorderColor = error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700';

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
          {label}
        </Text>
      )}
      
      <View className="relative">
        <View className={`flex-row items-center border ${baseBorderColor} rounded-xl bg-slate-50 dark:bg-slate-900 px-4 h-14 overflow-hidden`}>
          {leftIcon && <View className="mr-3">{leftIcon}</View>}
          
          <TextInput
            ref={ref}
            className={`flex-1 text-base text-slate-900 dark:text-white h-full ${className}`}
            placeholderTextColor={Colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {rightIcon && <View className="ml-3">{rightIcon}</View>}
        </View>

        {/* Animated focus border overlay */}
        <Animated.View
          pointerEvents="none"
          style={[{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: 2,
            borderRadius: 12, // xl
          }, animatedBorderStyle]}
        />
      </View>

      {error && (
        <Text className="text-sm text-red-500 mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
