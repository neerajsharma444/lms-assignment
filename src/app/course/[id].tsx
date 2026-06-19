import { fetchCourseById } from '@/api/courses';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { useCourseStore } from '@/store/courseStore';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Award, Bookmark, ChevronLeft, Clock, PlayCircle, Star } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

const HEADER_HEIGHT = 350;

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const scrollY = useSharedValue(0);

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id as string),
  });

  const course = data?.data;
  const { bookmarks, toggleBookmark, enrolledCourses, enrollCourse, addToHistory } = useCourseStore();
  const isBookmarked = bookmarks.includes(id as string);
  const isEnrolled = enrolledCourses.includes(id as string);

  useEffect(() => {
    if (course) {
      addToHistory(id as string);
    }
  }, [course, id, addToHistory]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.5],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0],
            [2, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const handleEnroll = useCallback(() => {
    setIsEnrolling(true);
    setTimeout(() => {
      enrollCourse(id as string);
      setIsEnrolling(false);
      Alert.alert('Success', 'You have successfully enrolled in this course!');
    }, 1500);
  }, [id, enrollCourse]);

  const handleBookmark = useCallback(() => {
    toggleBookmark(id as string);
  }, [id, toggleBookmark]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-900">
        <Skeleton className="w-full" style={{ height: HEADER_HEIGHT }} borderRadius={0} />
        <View className="p-6">
          <Skeleton className="w-3/4 h-8 mb-4" />
          <Skeleton className="w-1/4 h-6 mb-8" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-5/6 h-4 mb-8" />
          <Skeleton className="w-full h-24 rounded-2xl mb-8" />
        </View>
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50 dark:bg-slate-900">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Course not found.</Text>
        <Button label="Go Back" variant="ghost" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ height: HEADER_HEIGHT, overflow: 'hidden' }}>
          <Animated.View
            style={[StyleSheet.absoluteFill, imageAnimatedStyle]}
          >
            <Image
              source={{ uri: `https://picsum.photos/seed/${course.id}/600/400` }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={300}
            />
            {/* Gradient Overlay for better back button visibility */}
            <View className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-32" />
          </Animated.View>
        </View>

        <TouchableOpacity
          className="absolute top-12 left-4 w-12 h-12 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full items-center justify-center border border-white/30"
          onPress={() => router.back()}
        >
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>

        <View className="bg-slate-50 dark:bg-slate-900 -mt-8 rounded-t-[32px] px-6 pt-8">
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View className="flex-row justify-between items-start mb-4">
              <Text className="text-3xl font-extrabold text-slate-900 dark:text-white flex-1 mr-4 tracking-tight leading-tight">
                {course.title}
              </Text>
              <TouchableOpacity
                onPress={handleBookmark}
                className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full items-center justify-center shadow-soft border border-slate-100 dark:border-slate-800"
              >
                <Bookmark
                  color={isBookmarked ? Colors.primary : Colors.textMuted}
                  fill={isBookmarked ? Colors.primary : 'transparent'}
                  size={24}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-2xl font-black text-blue-600 mb-6">
              ${course.price}
            </Text>
            <View className="flex-row items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <View className="items-center">
                <Star color="#f59e0b" fill="#f59e0b" size={24} className="mb-2" />
                <Text className="text-slate-900 dark:text-white font-bold text-lg">4.8</Text>
                <Text className="text-slate-500 text-xs">Rating</Text>
              </View>
              <View className="items-center">
                <Clock color={Colors.primary} size={24} className="mb-2" />
                <Text className="text-slate-900 dark:text-white font-bold text-lg">12h 30m</Text>
                <Text className="text-slate-500 text-xs">Duration</Text>
              </View>
              <View className="items-center">
                <Award color="#10b981" size={24} className="mb-2" />
                <Text className="text-slate-900 dark:text-white font-bold text-lg">Certificate</Text>
                <Text className="text-slate-500 text-xs">Included</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              About this course
            </Text>
            <Text className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {course.description}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card
              className="flex-row items-center p-4 mb-8 bg-white dark:bg-slate-800"
              onPress={() => router.push(`/course/content/${id}`)}
            >
              <View className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mr-4">
                <PlayCircle color={Colors.primary} size={32} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {isEnrolled ? "Start Course" : "Course Preview"}
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  {isEnrolled ? "Jump right into the material" : "Watch introductory video"}
                </Text>
              </View>
            </Card>
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Bar */}
      <Animated.View
        entering={FadeInDown.delay(400).springify()}
        className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50"
      >
        <Button
          label={isEnrolled ? "Continue Learning" : (isEnrolling ? "Enrolling..." : "Enroll Now")}
          onPress={isEnrolled ? () => router.push(`/course/content/${id}`) : handleEnroll}
          isLoading={isEnrolling}
          size="lg"
          variant={isEnrolled ? "secondary" : "primary"}
          className="w-full shadow-soft dark:shadow-none"
        />
      </Animated.View>
    </View>
  );
}
