import React from 'react';
import { View, Pressable, ViewProps, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
}

export const Card = React.memo(({
  children,
  className = '',
  onPress,
  disabled,
  style,
  ...props
}: CardProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const baseClasses = "bg-white dark:bg-slate-800 rounded-2xl shadow-soft dark:shadow-soft-dark border border-slate-100 dark:border-slate-800 overflow-hidden";

  if (onPress) {
    return (
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        style={[animatedStyle, style]}
        className={`${baseClasses} ${className}`}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={style} className={`${baseClasses} ${className}`} {...props}>
      {children}
    </View>
  );
});
