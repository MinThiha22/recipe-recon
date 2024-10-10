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
  createUser: jest.fn()
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