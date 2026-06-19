import { fetchCourses } from '@/api/courses';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useCourseStore } from '@/store/courseStore';
import { Course } from '@/types';
import { LegendList } from '@legendapp/list/react-native';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Award, Bookmark, BookOpen, Clock, Image as ImageIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileFeatureScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { bookmarks, enrolledCourses, completedCourses, learningHistory } = useCourseStore();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetchCourses(1),
  });

  const pageInfo = useMemo(() => {
    switch (type) {
      case 'enrolled':
        return { title: 'Enrolled Courses', icon: <BookOpen color={Colors.primary} size={24} />, data: enrolledCourses };
      case 'completed':
        return { title: 'Completed Courses', icon: <Award color="#f59e0b" size={24} />, data: completedCourses };
      case 'bookmarks':
        return { title: 'Bookmarks', icon: <Bookmark color="#6366f1" size={24} />, data: bookmarks };
      case 'history':
        return { title: 'Learning History', icon: <Clock color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={24} />, data: learningHistory.map(h => h.courseId) };
      default:
        return { title: 'Courses', icon: null, data: [] };
    }
  }, [type, bookmarks, enrolledCourses, completedCourses, learningHistory]);

  const filteredCourses = useMemo(() => {
    if (!coursesData?.data?.data) return [];

    const allCourses: Course[] = coursesData.data.data.map((course: Course) => ({
      ...course,
      thumbnail: `https://picsum.photos/seed/${course.id}/600/400`,
    }));

    return pageInfo.data
      .map(id => allCourses.find((c) => c.id.toString() === id))
      .filter((c): c is Course => c !== undefined);
  }, [coursesData, pageInfo.data]);

  const renderItem = ({ item }: { item: Course }) => (
    <Card
      className="flex-row items-center p-3 mb-4 bg-white dark:bg-slate-800"
      onPress={() => router.push(`/course/${item.id}`)}
    >
      <View className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden mr-4">
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <ImageIcon color={colorScheme === 'dark' ? Colors.textMutedDark : Colors.textMuted} size={24} />
          </View>
        )}
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-base font-bold text-slate-900 dark:text-white mb-1" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400" numberOfLines={1}>
          {item.description || 'No description available.'}
        </Text>
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className="z-10 shadow-sm border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <View className="absolute inset-0 opacity-40 dark:hidden" pointerEvents="none">
          <LinearGradient
            colors={['#e0e7ff', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View className="flex-row items-center px-5 pt-14 pb-5 bg-white/50 dark:bg-slate-900">
          <TouchableOpacity
            className="p-2.5 mr-4 bg-white dark:bg-slate-800 rounded-full shadow-sm dark:shadow-none border border-slate-100 dark:border-transparent"
            onPress={() => router.back()}
          >
            <ArrowLeft color={colorScheme === 'dark' ? Colors.textDark : Colors.text} size={22} />
          </TouchableOpacity>
          <View className="w-11 h-11 bg-white dark:bg-slate-800 rounded-full items-center justify-center mr-3 shadow-sm dark:shadow-none border border-slate-100 dark:border-transparent">
            {pageInfo.icon}
          </View>
          <Text className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pageInfo.title}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredCourses.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full items-center justify-center mb-6">
            {pageInfo.icon}
          </View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Courses Found</Text>
          <Text className="text-center text-slate-500 dark:text-slate-400">
            {type === 'history'
              ? "You haven't viewed any courses yet."
              : `You don't have any ${pageInfo.title.toLowerCase()} yet.`}
          </Text>
        </View>
      ) : (
        <LegendList
          data={filteredCourses}
          estimatedItemSize={104}
          renderItem={renderItem as any}
          keyExtractor={(item: Course) => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          recycleItems={true}
        />
      )}
    </View>
  );
}
