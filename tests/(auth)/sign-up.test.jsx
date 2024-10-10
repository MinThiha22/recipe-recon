import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUp from '../../app/(auth)/sign-up';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Alert } from 'react-native';
import { createUser } from '../../lib/firebase';
import { router } from 'expo-router';
import { images } from '../../constants';

jest.mock('../../context/GlobalProvider', () => ({
  useGlobalContext: jest.fn()
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Link: 'Link',
  router: {
    replace: jest.fn()
  }
}));

jest.mock('../../constants/images', () => ({
  whiteLogo: require('../../assets/images/logo_white.png') 
}));

jest.mock('../../lib/firebase', () => ({
  createUser: jest.fn(),
}));

describe('<SignUp />', () => {

  // Setup mock values before each test
  const mockSetUser = jest.fn();
  const mockSetIsLoggedIn = jest.fn();

  beforeEach(() => {
    useGlobalContext.mockReturnValue({
      setUser: mockSetUser,
      setIsLoggedIn: mockSetIsLoggedIn,
    });
    jest.spyOn(Alert, 'alert');
  });

  // Clear all mocks after test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test if page renders correctly.
  it('page renders correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignUp />);

    // Check Title and Logo
    expect(getByText('Sign Up to Recipe Recon')).toBeTruthy();
    const logoImage = getByTestId('mainLogo');
    expect(logoImage.props.source).toEqual(images.whiteLogo);

    // Check form labels
    expect(getByText('Username')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();

    // Check input fields
    expect(getByPlaceholderText('Your name')).toBeTruthy();
    expect(getByPlaceholderText('example@gmail.com')).toBeTruthy();
    expect(getByPlaceholderText('*********')).toBeTruthy();

    // Check sign in section
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByTestId('signInLink')).toBeTruthy();
  });

  it('create user successfully', async () => {
    // Mock successful Firebase response
    const mockFirebaseResponse = {
      user: {
        uid: expect.any(String), // Accept any string as uid
        email: 'test@example.com',
        displayName: 'testuser',
        // Add other Firebase user properties as needed
      }
    };
    createUser.mockResolvedValueOnce(mockFirebaseResponse);
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    // Simulate filling in form fields
    fireEvent.changeText(getByPlaceholderText('Your name'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('*********'), 'password123');

    // Simulate pressing the Sign Up button
    act(() => {
      fireEvent.press(getByText('Sign Up'));
    })
    // Wait for the asynchronous actions
    await waitFor(() => {
      // Check if createUser was called with the correct data
      expect(createUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
      expect(mockSetUser).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            email: 'test@example.com',
            displayName: 'testuser',
            uid: expect.any(String)
          })
        })
      ); // Check if the user was set and login status updated
      expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      expect(router.replace).toHaveBeenCalledWith('/home'); // Check if the router redirected to home
    });
  });

  it('show alert if createUser fails', async () => {
    // Mock a Firebase error response
    createUser.mockRejectedValueOnce(new Error('Firebase error'));

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    // Simulate filling in form fields
    fireEvent.changeText(getByPlaceholderText('Your name'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('*********'), 'password123');

    // Simulate pressing the Sign Up button
    
    act(() => {
      fireEvent.press(getByText('Sign Up'));
    })

    // Wait for the asynchronous actions to complete
    await waitFor(() => {
      // Check if createUser was called
      expect(createUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');

      // Ensure that the error alert was shown
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Firebase error');
    });
  });

  it('not create user if formfields are empty', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);

    // Simulate empty formfield
    fireEvent.changeText(getByPlaceholderText('Your name'), '');
    fireEvent.changeText(getByPlaceholderText('example@gmail.com'), '');
    fireEvent.changeText(getByPlaceholderText('*********'), '');
 

    // Simulate pressing the Sign Up button without filling in the form
    act(() => {
      fireEvent.press(getByText('Sign Up'));
    })
    
    // Ensure create user is not called
    expect(createUser).not.toHaveBeenCalled();
  });

});