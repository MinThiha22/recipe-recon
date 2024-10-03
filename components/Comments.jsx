import { useState, useEffect } from "react";
import { Text, TouchableOpacity, TextInput, View, Image, FlatList } from "react-native";
import { db, auth, getCurrentUserData, getProfilePicture, uploadPicture } from '../lib/firebase.js';
import { updateDoc, doc, getDoc } from 'firebase/firestore';

const Comments = ({ postId }) => {
    const [comment, setComment] = useState('');
    const [commentSection, setCommentSection] = useState([]);
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setPicture] = useState(null);


    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
            getData(currentUser);
        }
        fetchComments();
    }, []);

    const getData = async (currentUser) => {
        const { username } = await getCurrentUserData();
        setName(username);
        const profilePicture = await getProfilePicture(currentUser.uid);
        setPicture(profilePicture);
    };

    const fetchComments = async () => {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setCommentSection(docSnap.data().comments);
        }
        else {
            setCommentSection([]);
        }
        console.log(commentSection);
    };

    const saveComments = async (updatedList) => {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { comments: updatedList });
        fetchComments();
    };

    const addComment = () => {
        if (comment) {
            const newItem = { comment, username: name, picture: profilePicture };
            const updatedList = [...commentSection, newItem];
            setCommentSection(updatedList);
            saveComments(updatedList);
            setComment('');
        }
    };

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
            {commentSection && (
                <FlatList
                    data={commentSection}
                    renderItem={displayComments}
                    keyExtractor={(item, index) => index.toString()}
                    className="w-full"
                    showsVerticalScrollIndicator={false}
                />
            )}
            <TextInput
                className="border border-gray-300 p-2 text-primary"
                placeholder="Enter Comment"
                placeholderTextColor="#405D72"
                value={comment}
                onChangeText={setComment}
            />
            <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={addComment}>
                <Text className="text-white font-bold text-center">Comment</Text>
            </TouchableOpacity>
        </View>

    );
}

export default Comments;
