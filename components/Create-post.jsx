import { useState, useEffect } from "react";
import { Text, TouchableOpacity, TextInput, View } from "react-native";
import { db, auth, getCurrentUserData, getProfilePicture } from '../lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';



const CreatePost = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setPicture] = useState(null);

    const post = async () => {
        await getData(user);
        try {
            await addDoc(collection(db, 'posts'), {
                title,
                body,
                userId: user.uid,
                name,
                profilePicture,
                comments: [],
                timestamp: new Date().toISOString(),
            });
            setTitle('');
            setBody('');
            onClose();
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post');
        }
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
            getData(currentUser);
        }
    }, []);

    const getData = async (currentUser) => {
        const { username } = await getCurrentUserData();
        setName(username);
        const profilePicture = await getProfilePicture(currentUser.uid);
        setPicture(profilePicture);
    };

    return (
        <View className="flex-1 justify-center items-center m-5 curved p-5 rounded-lg">
            <View className="w-11/12 max-w-md bg-primary p-5 rounded-xl shadow-lg">
                <Text className="text-3xl font-chewy text-center text-title">Create Post</Text>
                <TouchableOpacity className=" p-3 rounded-full absolute top-0 right-0 w-10 h-10" onPress={onClose}>
                    <Text className="text-white font-bold text-center text-md ">x</Text>
                </TouchableOpacity>
                <TextInput
                    className="border border-gray-300 p-2 mb-4 text-secondary"
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle} />

                <TextInput
                    className="border border-gray-300 p-2 mb-4 text-secondary"
                    placeholder="Enter Post"
                    value={body}
                    onChangeText={setBody}
                    multiline={true}
                    numberOfLines={4} />
                <TouchableOpacity
                    className="bg-blue-500 p-3 rounded-full mt-4"
                    onPress={post}
                >
                    <Text className="text-white font-bold text-center">Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CreatePost;
