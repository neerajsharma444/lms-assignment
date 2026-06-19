import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = React.memo(({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(500).springify()}
      className={`flex-1 items-center justify-center p-8 ${className}`}
    >
      <View className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
        {icon}
      </View>
      <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {title}
      </Text>
      <Text className="text-base text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
        {description}
      </Text>
      {action && (
        <View className="w-full max-w-[200px]">
          {action}
        </View>
      )}
    </Animated.View>
  );
});
