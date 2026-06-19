import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.backgroundDark : Colors.background,
          borderTopColor: colorScheme === 'dark' ? Colors.borderDark : Colors.border,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.backgroundDark : Colors.background,
        },
        headerTintColor: colorScheme === 'dark' ? Colors.textDark : Colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courses',
          headerShown: false,
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
