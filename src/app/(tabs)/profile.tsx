import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Award, BookOpen, Bookmark, ChevronRight, Clock, LogOut, Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

const { width: screenWidth } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { bookmarks, enrolledCourses, completedCourses } = useCourseStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  const avatarUrl = typeof user?.avatar === 'string' ? user.avatar : user?.avatar?.url;
  const [profileImage, setProfileImage] = useState(avatarUrl || null);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setProfileImage(newUri);

      if (user) {
        useAuthStore.getState().updateUser({ avatar: newUri });
      }
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View
        style={{ position: 'absolute', top: 0, left: 0, width: screenWidth, height: 256, overflow: 'hidden' }}
        pointerEvents="none"
      >
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['#312e81', '#1e1b4b', '#0f172a'] 
            : ['#818cf8', '#c084fc', '#f0abfc']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View className="px-5 z-10" style={{ paddingTop: Math.max(insets.top, 20) + 16 }}>
        <Animated.View entering={FadeInDown.delay(100).springify()} className="items-center mb-6">
          <View className="relative mb-3">
            <Avatar
              source={profileImage}
              fallback={user?.username || 'U'}
              size="xl"
              className="border-4 border-white shadow-md bg-white"
            />
            <TouchableOpacity
              className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg"
              onPress={pickImage}
            >
              <Pencil color={Colors.primary} size={16} />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold text-white mb-1 shadow-sm">
            {user?.username || 'User Profile'}
          </Text>
          <Text className="text-sm font-medium text-white opacity-90">
            {user?.email || 'user@example.com'}
          </Text>
        </Animated.View>

        {/* Overlapping Stats Cards */}
        <Animated.View entering={FadeInDown.delay(200).springify()} className="flex-row justify-between mb-8 mt-2 px-1">
          <TouchableOpacity
            className="flex-1 mr-2"
            activeOpacity={0.7}
            onPress={() => router.push('/profile/enrolled')}
          >
            <Card className="items-center p-4 bg-white dark:bg-slate-800 border-0 shadow-soft dark:shadow-none rounded-2xl">
              <View className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-2">
                <BookOpen color={Colors.primary} size={22} />
              </View>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">{enrolledCourses.length}</Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-widest">Enrolled</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 mx-2"
            activeOpacity={0.7}
            onPress={() => router.push('/profile/completed')}
          >
            <Card className="items-center p-4 bg-white dark:bg-slate-800 border-0 shadow-soft dark:shadow-none rounded-2xl">
              <View className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full items-center justify-center mb-2">
                <Award color="#f59e0b" size={22} />
              </View>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">{completedCourses.length}</Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-widest">Completed</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-2"
            activeOpacity={0.7}
            onPress={() => router.push('/profile/bookmarks')}
          >
            <Card className="items-center p-4 bg-white dark:bg-slate-800 border-0 shadow-soft dark:shadow-none rounded-2xl">
              <View className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full items-center justify-center mb-2">
                <Bookmark color="#6366f1" size={22} />
              </View>
              <Text className="text-xl font-bold text-slate-900 dark:text-white">{bookmarks.length}</Text>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-widest">Bookmarks</Text>
            </Card>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-2">Settings</Text>

          <Card className="bg-white dark:bg-slate-800 border-0 shadow-sm overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-slate-100 dark:border-slate-700/50"
              onPress={() => router.push('/profile/history')}
            >
              <View className="w-10 h-10 bg-slate-50 dark:bg-slate-700/50 rounded-xl items-center justify-center mr-4">
                <Clock color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-slate-900 dark:text-white">Learning History</Text>
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">View your past activity</Text>
              </View>
              <ChevronRight color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={handleLogout}
            >
              <View className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl items-center justify-center mr-4">
                <LogOut color={Colors.danger} size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-red-600 dark:text-red-400">Logout</Text>
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">Sign out of your account</Text>
              </View>
              <ChevronRight color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={20} />
            </TouchableOpacity>
          </Card>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
