import { fetchCourses, fetchInstructors } from '@/api/courses';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { LegendList } from '@legendapp/list/react-native';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, Bookmark, Search, SearchX } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Course, Instructor } from '@/types';

const CourseItem = React.memo(({ item, index }: { item: Course, index: number }) => {
  const { bookmarks, toggleBookmark } = useCourseStore();
  const isBookmarked = bookmarks.includes(item.id.toString());
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/course/${item.id}`);
  }, [item.id, router]);

  const handleBookmark = useCallback((e: any) => {
    e.stopPropagation();
    toggleBookmark(item.id.toString());
  }, [item.id, toggleBookmark]);

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card className="mb-5" onPress={handlePress}>
        <Animated.View className="w-full h-48 bg-slate-200 dark:bg-slate-700">
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={300}
          />
        </Animated.View>
        <View className="p-5">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-xl font-bold text-slate-900 dark:text-white flex-1 mr-3 leading-tight" numberOfLines={2}>
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={handleBookmark}
              className="p-2 -m-2 bg-slate-50 dark:bg-slate-800 rounded-full"
            >
              <Bookmark
                color={isBookmarked ? Colors.primary : Colors.textMuted}
                fill={isBookmarked ? Colors.primary : 'transparent'}
                size={22}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-4">
            <Avatar size="sm" fallback={item.instructorName} className="mr-2" />
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {item.instructorName}
            </Text>
          </View>

          <Text className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
});

export default function CourseListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { colorScheme } = useColorScheme();

  const { data: coursesData, isLoading: coursesLoading, refetch: refetchCourses, isRefetching: coursesRefetching } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchCourses(1),
  });

  const { data: instructorsData, isLoading: instructorsLoading, refetch: refetchInstructors } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => fetchInstructors(1),
  });

  const handleRefresh = useCallback(() => {
    refetchCourses();
    refetchInstructors();
  }, [refetchCourses, refetchInstructors]);

  const combinedData = useMemo(() => {
    if (!coursesData?.data?.data || !instructorsData?.data?.data) return [];

    const courses: Course[] = coursesData.data.data;
    const instructors: Instructor[] = instructorsData.data.data;

    return courses.map((course, index: number) => {
      const instructor = instructors[index % instructors.length];
      return {
        id: course.id.toString(),
        title: course.title,
        description: course.description,
        thumbnail: `https://picsum.photos/seed/${course.id}/600/400`,
        price: course.price,
        instructorName: `${instructor.name.first} ${instructor.name.last}`,
      };
    });
  }, [coursesData, instructorsData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return combinedData;
    return combinedData.filter((item: Course) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.instructorName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [combinedData, searchQuery]);

  const renderItem = useCallback(({ item, index }: { item: Course, index: number }) => {
    return <CourseItem item={item} index={index} />;
  }, []);

  const renderSkeletons = () => {
    return (
      <View className="px-5 pt-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="bg-white dark:bg-slate-800 rounded-2xl mb-5 overflow-hidden border border-slate-100 dark:border-slate-800">
            <Skeleton className="w-full h-48 rounded-none" />
            <View className="p-5">
              <Skeleton className="w-3/4 h-6 mb-4" />
              <View className="flex-row items-center mb-4">
                <Skeleton className="w-8 h-8 rounded-full mr-2" />
                <Skeleton className="w-1/3 h-4" />
              </View>
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-5/6 h-4" />
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <Animated.View entering={FadeInDown.duration(400).springify()} className="flex-1 items-center justify-center pt-24 pb-10">
        <View className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full items-center justify-center mb-6 shadow-sm">
          <SearchX color={Colors.textMuted} size={40} />
        </View>
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          No courses found
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-center px-10 leading-6">
          We couldn't find any courses or instructors matching "{searchQuery}". Try a different search term.
        </Text>
      </Animated.View>
    );
  };

  const getGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  }, []);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className="absolute inset-0 opacity-50 dark:hidden" pointerEvents="none">
        <LinearGradient
          colors={['#e0e7ff', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View className="absolute inset-0 opacity-50 hidden dark:flex" pointerEvents="none">
        <LinearGradient
          colors={['#1e1b4b', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="px-5 pb-4 z-10 shadow-sm dark:shadow-none dark:border-b dark:border-white/10"
      >
        <View className="flex-row justify-between items-center mb-6 mt-2">
          <View className="flex-row items-center">
            <Avatar
              size="sm"
              source={typeof user?.avatar === 'string' ? user.avatar : user?.avatar?.url}
              fallback={user?.username || 'U'}
              className="mr-3 border border-slate-200 dark:border-slate-700"
            />
            <View>
              <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">{getGreeting}</Text>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">{user?.username || 'User'}</Text>
            </View>
          </View>
          <TouchableOpacity
            className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
            activeOpacity={0.7}
          >
            <Bell color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={22} />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
          </TouchableOpacity>
        </View>
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Discover
        </Text>
        <View className="flex-row items-center bg-white dark:bg-slate-800 rounded-xl px-4 h-13 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none focus:border-blue-500">
          <Search color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={20} />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900 dark:text-white h-full"
            placeholder="Search courses or instructors..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {(coursesLoading || instructorsLoading) ? (
        renderSkeletons()
      ) : (
        <LegendList
          data={filteredData}
          estimatedItemSize={380}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyState}
          keyExtractor={(item: Course) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
          refreshControl={
            <RefreshControl
              refreshing={coursesRefetching}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </View>
  );
}
