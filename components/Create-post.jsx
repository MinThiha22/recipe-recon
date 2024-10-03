import { useState, useEffect } from "react";
import { Alert, Text, TouchableOpacity, TextInput, View, Image, KeyboardAvoidingView, Platform  } from "react-native";
import { db, auth, getCurrentUserData, getProfilePicture, uploadPicture } from '../lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { images, icons } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";


const CreatePost = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setPicture] = useState(null);
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');


    const post = async () => {
        await getData(user);
        if (title && body) {
            try {
                const postId = `${Date.now()}_${user.uid}`
                await addDoc(collection(db, 'posts'), {
                    postId,
                    title,
                    body,
                    userId: user.uid,
                    name,
                    imageUrl,
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
        } else {
            alert("Please enter both a title and body.")
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

    const pickImage = async () => {
        Alert.alert(
            "Select Image Source",
            "Choose from where to get your picture:",
            [
                {
                    text: "Camera",
                    onPress: openCamera,
                },
                {
                    text: "Photos",
                    onPress: openPhotos,
                },
                {
                    text: "Cancel",
                },
            ]
        );
    };

    // open camera to take profile picture
    const openCamera = async () => {
        try {
            let result = await ImagePicker.requestCameraPermissionsAsync();
            if (result.status !== "granted") {
                Alert.alert(
                    "Permission denied",
                    "Sorry, we need camera permissions to take a picture!"
                );
                return;
            }

            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!pickerResult.canceled) {
                await uploadImage(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.error("Error opening camera:", error);
            Alert.alert(
                "Error",
                "Something went wrong while trying to open the camera. Please try again."
            );
        }
    };

    // open gallery and select an image
    const openPhotos = async () => {
        try {
            let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (result.status !== "granted") {
                Alert.alert(
                    "Permission denied",
                    "Sorry, we need permission to select picture!"
                );
                return;
            }
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });
            if (!pickerResult.canceled) {
                uploadImage(pickerResult.assets[0].uri);
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    // uploadImage to firebase storage
    const uploadImage = async (uri) => {
        try {
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const blob = await response.blob();
            const userId = user.uid;
            const pictureUrl = await uploadPicture(blob, userId);

            setImage(uri);
            setImageUrl(pictureUrl);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
className="flex-1 justify-center items-center m-5 curved p-5 rounded-lg">
            <View className="w-11/12 max-w-md bg-primary p-5 rounded-xl shadow-lg">
                <Text className="text-3xl font-chewy text-center text-title">Create Post</Text>
                <TouchableOpacity className=" p-3 rounded-full absolute top-0 right-0 w-10 h-10" onPress={onClose}>
                    <Text className="text-white font-bold text-center text-md ">x</Text>
                </TouchableOpacity>
                <TextInput
                    className="border border-gray-300 p-2 text-secondary"
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle} />
                <View className="relative mt-3 items-center">
                    {image ? (
                        <TouchableOpacity
                            onPress={pickImage}
                            className="mb-2 mt-2 p-2 rounded-full"
                        >
                            <Image
                                source={{ uri: image }}
                                resizeMode="contain"
                                className="bg-secondary w-[150px] h-[150px] border-black border-2"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={pickImage}
                            className="mb-2 mt-2 p-2 bg-secondary rounded-full"
                        >
                            <Ionicons name="camera" size={40} color="black" />
                        </TouchableOpacity>
                    )}
                </View>
                <TextInput
                    className="border border-gray-300 p-2 mt-2 text-secondary"
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
        </KeyboardAvoidingView >
    );
}

export default CreatePost;
