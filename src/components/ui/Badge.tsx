import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
}

export const Badge = React.memo(({
  label,
  variant = 'primary',
  className = '',
}: BadgeProps) => {
  let containerStyle = 'px-2.5 py-0.5 rounded-full ';
  let textStyle = 'text-xs font-semibold ';

  switch (variant) {
    case 'primary':
      containerStyle += 'bg-blue-100 dark:bg-blue-900/30 ';
      textStyle += 'text-blue-700 dark:text-blue-300 ';
      break;
    case 'secondary':
      containerStyle += 'bg-slate-100 dark:bg-slate-800 ';
      textStyle += 'text-slate-700 dark:text-slate-300 ';
      break;
    case 'success':
      containerStyle += 'bg-green-100 dark:bg-green-900/30 ';
      textStyle += 'text-green-700 dark:text-green-300 ';
      break;
    case 'danger':
      containerStyle += 'bg-red-100 dark:bg-red-900/30 ';
      textStyle += 'text-red-700 dark:text-red-300 ';
      break;
    case 'warning':
      containerStyle += 'bg-amber-100 dark:bg-amber-900/30 ';
      textStyle += 'text-amber-700 dark:text-amber-300 ';
      break;
  }

  return (
    <View className={`${containerStyle} ${className}`}>
      <Text className={textStyle}>{label}</Text>
    </View>
  );
});
