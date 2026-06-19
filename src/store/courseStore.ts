import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './mmkv';

interface CourseState {
  bookmarks: string[];
  enrolledCourses: string[];
  completedCourses: string[];
  learningHistory: { courseId: string; timestamp: number }[];
  toggleBookmark: (courseId: string) => void;
  enrollCourse: (courseId: string) => void;
  toggleCompleted: (courseId: string) => void;
  addToHistory: (courseId: string) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      enrolledCourses: [],
      completedCourses: [],
      learningHistory: [],
      toggleBookmark: async (courseId) => {
        const bookmarks = get().bookmarks;
        let newBookmarks;
        
        if (bookmarks.includes(courseId)) {
          newBookmarks = bookmarks.filter(id => id !== courseId);
        } else {
          newBookmarks = [...bookmarks, courseId];
          
          if (newBookmarks.length === 5) {
            const { scheduleNotificationAsync } = await import('expo-notifications');
            await scheduleNotificationAsync({
              content: {
                title: 'Power Learner! 🚀',
                body: "You've bookmarked 5 courses! Time to start learning?",
              },
              trigger: null,
            });
          }
        }
        set({ bookmarks: newBookmarks });
      },
      enrollCourse: (courseId) => {
        const enrolled = get().enrolledCourses;
        if (!enrolled.includes(courseId)) {
          set({ enrolledCourses: [...enrolled, courseId] });
        }
      },
      toggleCompleted: (courseId) => {
        const completed = get().completedCourses;
        if (completed.includes(courseId)) {
          set({ completedCourses: completed.filter(id => id !== courseId) });
        } else {
          set({ completedCourses: [...completed, courseId] });
        }
      },
      addToHistory: (courseId) => {
        const history = get().learningHistory;
        const filteredHistory = history.filter(item => item.courseId !== courseId);
        set({ learningHistory: [{ courseId, timestamp: Date.now() }, ...filteredHistory] });
      }
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
