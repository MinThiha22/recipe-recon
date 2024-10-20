import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { db, auth } from '../lib/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const BookmarkButton = ({ selectedPost }) => {
    const [bookmarkList, setBookmarkList] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    //load info on focus
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            const currentUser = auth.currentUser;
            setUser(currentUser);

            if (currentUser) {
                fetchBookmarks(currentUser.uid);
            }
            setLoading(false);
        }, []) 
    );

    //get bookmarks from firebase
    const fetchBookmarks = async (userId) => {
        const docRef = doc(db, 'bookmarks', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setBookmarkList(docSnap.data().list);
        }
    };


    //save bookmarks to firebase
    const saveBookmarks = async (updatedList) => {
        if (user) {
            const userBookmarksRef = doc(db, 'bookmarks', user.uid);
            await setDoc(userBookmarksRef, { list: updatedList });
        }
    };

    //add bookmark to item list and firebase
    const addBookmark = () => {
        const newItem = { id: selectedPost.id, name: selectedPost };
        const updatedList = [...bookmarkList, newItem];
        setBookmarkList(updatedList);
        saveBookmarks(updatedList);
    };

    //remove bookmark from item list and firebase
    const removeBookmark = () => {
        const updatedList = bookmarkList.filter((x) => x.id !== selectedPost.id);
        setBookmarkList(updatedList);
        saveBookmarks(updatedList);
    };

    //check if item is bookmarked
    const isBookmark = (postId) => {
        return bookmarkList.some((item) => item.id === postId);
    };

    //toggle bookmark based on if it is bookmarked
    const toggleBookmark = () => {
        if (isBookmark(selectedPost.id)) {
            removeBookmark();
        } else {
            addBookmark();
        }
    };

    return (
        <TouchableOpacity
            className="bg-title p-3 rounded-full mt-4"
            onPress={toggleBookmark}
            disabled={loading}
        >
            <Text className="text-white font-bold text-center">{isBookmark(selectedPost.id) ? 'Delete Bookmark' : 'Bookmark!'}</Text>
        </TouchableOpacity>
    )
}

export default BookmarkButton;