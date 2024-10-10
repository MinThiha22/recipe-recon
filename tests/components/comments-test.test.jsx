import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import Comments from '../../components/Comments';
import { updateDoc } from 'firebase/firestore';

// Mock functions for firebase 
jest.mock('../../lib/firebase', () => ({
  auth: { currentUser: { uid: 'userId' } },
  getCurrentUserData: jest.fn(() => Promise.resolve({ username: 'user' })),
  getProfilePicture: jest.fn(() => Promise.resolve('profilePictureUrl')),
}));

//Mock firestore
jest.mock('firebase/firestore', () => ({
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({ comments: [{ comment: 'Great post', username: 'user1', picture: 'url1' }] }),
  })),
}));

//test comment adding and rendering
describe('<Comments />', () => {
  it('adds a comment', async () => {
    const mockPostId = '123';
    const { getByText, getByPlaceholderText, findByText } = render(<Comments postId={mockPostId} />);

    await act(async () => {
      await waitFor(() => expect(getByText('Comment')).toBeTruthy());
    });

    const input = getByPlaceholderText('Enter Comment');
    fireEvent.changeText(input, 'New comment');
    fireEvent.press(getByText('Comment'));

    await act(async () => {
      await waitFor(() => {
        expect(updateDoc).toHaveBeenCalled();
        
        const [, data] = updateDoc.mock.calls[0]; 
        expect(data.comments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ comment: 'New comment', username: 'user' }),
          ])
        );
      });
    });

    await waitFor(() => expect(findByText('New comment')).toBeTruthy());
  });
});
