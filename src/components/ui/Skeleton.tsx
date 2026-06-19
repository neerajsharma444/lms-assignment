import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export interface SkeletonProps extends ViewProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export const Skeleton = React.memo(({
  className = '',
  width,
  height,
  borderRadius = 8,
  style,
  ...props
}: SkeletonProps) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={`bg-slate-200 dark:bg-slate-700 ${className}`}
      style={[
        { width: width as any, height: height as any, borderRadius },
        animatedStyle,
        style,
      ]}
      {...props}
    />
  );
});
