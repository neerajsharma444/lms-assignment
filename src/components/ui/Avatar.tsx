import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

export interface AvatarProps {
  source?: string | null;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const getInitials = (name: string) => {
  if (!name) return 'U';
  const words = name.split(/[\s_]+/);
  if (words.length >= 2 && words[0] && words[1]) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const Avatar = React.memo(({
  source,
  fallback = 'U',
  size = 'md',
  className = '',
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [source]);

  let sizeClass = '';
  let fallbackTextClass = '';
  let pixelSize = 40;

  switch (size) {
    case 'sm':
      sizeClass = 'w-8 h-8';
      fallbackTextClass = 'text-xs';
      pixelSize = 32;
      break;
    case 'md':
      sizeClass = 'w-10 h-10';
      fallbackTextClass = 'text-sm';
      pixelSize = 40;
      break;
    case 'lg':
      sizeClass = 'w-14 h-14';
      fallbackTextClass = 'text-lg';
      pixelSize = 56;
      break;
    case 'xl':
      sizeClass = 'w-24 h-24';
      fallbackTextClass = 'text-3xl';
      pixelSize = 96;
      break;
  }

  return (
    <View className={`rounded-full overflow-hidden items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm ${sizeClass} ${className}`}>
      {source && !imageError ? (
        <Image
          source={{ uri: source }}
          style={{ width: pixelSize, height: pixelSize }}
          contentFit="cover"
          transition={200}
          onError={() => setImageError(true)}
        />
      ) : (
        <>
          <LinearGradient
            colors={Colors.gradients.primary as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text className={`font-bold text-white z-10 ${fallbackTextClass}`}>
            {getInitials(fallback)}
          </Text>
        </>
      )}
    </View>
  );
});
