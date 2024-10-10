import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: 'Link',
  router: {
    replace: jest.fn()
  }
}));

// Mock firebase
jest.mock('./lib/firebase', () => ({  
  createUser: jest.fn(),
  auth: { currentUser: { uid: 'userId' } },
  getCurrentUserData: jest.fn(() => Promise.resolve({ username: 'user' })),
  getProfilePicture: jest.fn(() => Promise.resolve('profilePictureUrl')),
}));

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({ comments: [{ comment: 'Great post!', username: 'user1', picture: 'url1' }] }),
  })),
}));

// Mock the StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar'
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView'
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');