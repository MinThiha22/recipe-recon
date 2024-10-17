import { useState, useEffect } from "react";
import { Text, TouchableOpacity, TextInput, View, Image, FlatList } from "react-native";
import { db, auth, getCurrentUserData, getProfilePicture, uploadPicture } from '../lib/firebase.js';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { images } from "../constants";

const Comments = ({ postId }) => {
    const [comment, setComment] = useState('');
    const [commentSection, setCommentSection] = useState([]);
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setPicture] = useState(null);

    //on mount get user data and comments
    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
            getData(currentUser);
        }
        fetchComments();
    }, []);

    //load user data
    const getData = async (currentUser) => {
        const { username } = await getCurrentUserData();
        setName(username);
        const profilePicture = await getProfilePicture(currentUser.uid);
        setPicture(profilePicture || images.profilePlaceHolder);
    };

    //get comments from firebase
    const fetchComments = async () => {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setCommentSection(docSnap.data().comments);
        }
        else {
            setCommentSection([]);
        }
    };

    //save comments to firebase
    const saveComments = async (updatedList) => {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { comments: updatedList });
        fetchComments();
    };

    //add comment to comment list
    const addComment = () => {
        if (comment) {
            const newItem = { comment, username: name, picture: profilePicture };
            const updatedList = [...commentSection, newItem];
            setCommentSection(updatedList);
            saveComments(updatedList);
            setComment('');
        }
    };

    //render comments
    const displayComments = ({ item }) => (
        <View className="m-2 p-4 bg-white rounded-lg shadow">
            <Text className="text-gray-600">{item.comment}</Text>
            <View className="flex-row items-center mt-2">
                <Image className="w-5 h-5 mr-1 rounded-full border-black border-1" source={{ uri: item.picture }} />
                <Text className="text-gray-400 text-sm">{item.username}</Text>
            </View>
        </View>
    )

    return (
        <View>
            <View className="flex-row items-center justify-between">
            <TextInput
                className="border border-gray-300 mt-2 p-2 flex-1 mr-2 text-primary"
                placeholder="Enter Comment"
                placeholderTextColor="#405D72"
                value={comment}
                onChangeText={setComment}
            />
            <TouchableOpacity
                className="bg-primary p-3 mt-2 rounded-full"
                onPress={addComment}>
                <Text className="text-white font-bold text-center">Comment</Text>
            </TouchableOpacity>
            </View>
            {commentSection && (
                <FlatList
                    data={commentSection}
                    renderItem={displayComments}
                    keyExtractor={(item, index) => index.toString()}
                    className="w-full"
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>

    );
}

export default Comments;
