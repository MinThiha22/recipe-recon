mport React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import SignUp from '../SignUp';
import { createUser } from '../../lib/firebase';
import { useGlobalContext } from '../../context/GlobalProvider';

// Mock the required dependencies
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn()
  }
}));

jest.mock('../../lib/firebase', () => ({
  createUser: jest.fn()
}));

jest.mock('../../context/GlobalProvider', () => ({
  useGlobalContext: jest.fn()
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn()
}));

describe('SignUp Component', () => {
  const mockSetUser = jest.fn();
  const mockSetIsLoggedIn = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation for useGlobalContext
    useGlobalContext.mockImplementation(() => ({
      setUser: mockSetUser,
      setIsLoggedIn: mockSetIsLoggedIn
    }));
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);
    
    expect(getByText('Sign Up to Recipe Recon')).toBeTruthy();
    expect(getByPlaceholderText('Your name')).toBeTruthy();
    expect(getByPlaceholderText('example@gmail.com')).toBeTruthy();
    expect(getByPlaceholderText('*********')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('handles form input changes', () => {
    const { getByPlaceholderText } = render(<SignUp />);
    
    const usernameInput = getByPlaceholderText('Your name');
    const emailInput = getByPlaceholderText('example@gmail.com');
    const passwordInput = getByPlaceholderText('*********');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows alert when submitting with empty fields', async () => {
    const { getByText } = render(<SignUp />);
    
    fireEvent.press(getByText('Sign Up'));

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all the fields');
  });

  it('handles successful signup', async () => {
    const mockUser = { id: '123', username: 'testuser' };
    createUser.mockResolvedValueOnce(mockUser);

    const { getByText, getByPlaceholderText } = render(<SignUp />);

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Your name'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('*********'), 'password123');

    // Submit the form
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(router.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('handles signup failure', async () => {
    const errorMessage = 'Registration failed';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    const { getByText, getByPlaceholderText } = render(<SignUp />);

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Your name'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('*********'), 'password123');

    // Submit the form
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  it('toggles submission state during signup process', async () => {
    createUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { getByText, getByPlaceholderText } = render(<SignUp />);

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Your name'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('*********'), 'password123');

    // Submit the form
    fireEvent.press(getByText('Sign Up'));

    // Check loading state
    expect(getByText('Sign Up').props.disabled).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Sign Up').props.disabled).toBeFalsy();
    });
  });
});