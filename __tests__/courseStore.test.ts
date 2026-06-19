import { useCourseStore } from '../src/store/courseStore';

// Mock dependencies
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
}));
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('Course Store', () => {
  beforeEach(() => {
    useCourseStore.setState({ bookmarks: [] });
  });

  it('should toggle bookmarks correctly', async () => {
    const store = useCourseStore.getState();
    
    // Initial state
    expect(store.bookmarks).toEqual([]);

    // Add bookmark
    await store.toggleBookmark('123');
    expect(useCourseStore.getState().bookmarks).toEqual(['123']);

    // Remove bookmark
    await store.toggleBookmark('123');
    expect(useCourseStore.getState().bookmarks).toEqual([]);
  });
});
