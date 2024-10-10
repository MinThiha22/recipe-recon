import React from "react";
import renderer, { act } from 'react-test-renderer';
import Comments from '../Comments';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

describe('Comments', () => {
  //set mockId and collection reference
  const mockPostId = '1727983439558_aTx7v7Q8T4bGBWyenT5KfNMGy862';
  const commentsCollectionRef = collection(db, 'posts', mockPostId, 'comments');

  //before all empty the comments
  beforeAll(async () => {
    const commentsSnapshot = await getDocs(commentsCollectionRef);
    for (const doc of commentsSnapshot.docs) {
      await updateDoc(doc.ref, { deleted: true });
    }
  });

  //after all empty the comments
  afterAll(async () => {
    const commentsSnapshot = await getDocs(commentsCollectionRef);
    for (const doc of commentsSnapshot.docs) {
      await updateDoc(doc.ref, { deleted: true });
    }
  });

  //test teh comments render correctly
  test('renders correctly', async () => {
    await act(async () => {
      const tree = renderer.create(<Comments postId={mockPostId} />);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });

  //test adding a comment
  test('adds a comment', async () => {
    await act(async () => {
      const tree = renderer.create(<Comments postId={mockPostId} />);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const instance = tree.root;
      const input = instance.findByProps({ placeholder: 'Enter Comment' });
      const button = instance.findByProps({ children: 'Comment' });

      act(() => {
        input.props.onChangeText('New comment');
      });

      act(() => {
        button.props.onPress();
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const commentsSnapshot = await getDocs(commentsCollectionRef);
      const comments = commentsSnapshot.docs.map(doc => doc.data());
      expect(comments).toHaveLength(1);
    });
  });
});