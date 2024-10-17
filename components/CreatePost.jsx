import { useState, useEffect } from "react";
import { Alert, Text, TouchableOpacity, TextInput, View, Image, KeyboardAvoidingView, Platform } from "react-native";
import { db, auth, getCurrentUserData, getProfilePicture, uploadPicture } from '../lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../constants";

//Create post class for handling creat post display and logic
const CreatePost = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePicture, setPicture] = useState(null);
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    //post function to save post to firebase
    const post = async () => {
        await getData(user);
        if (title && body) {
            try {
                setLoading(true);
                const postId = `${Date.now()}_${user.uid}`
                await setDoc(doc(db, 'posts', postId), {
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
                onCloseModal();
            } catch (error) {
                console.error('Error posting:', error);
                alert('Failed to post');
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter both a title and body.")
        }
    };

    //load user on launch
    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
            getData(currentUser);
        }
    }, []);

    //function to load user data from firebase
    const getData = async (currentUser) => {
        const { username } = await getCurrentUserData();
        setName(username);
        const profilePicture = await getProfilePicture(currentUser.uid);
        setPicture(profilePicture || images.profilePlaceHolder);
    };

    //function pick image for post
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

    // open camera to take post picture
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

    //function for handling modal closing
    const onCloseModal = () => {
        setTitle('');
        setBody('');
        setImage('');
        setImageUrl('');
        onClose();
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            className="flex-1 justify-start items-center m-5 curved p-5 rounded-lg">
            <View className="w-11/12 max-w-md mt-24 bg-primary p-5 rounded-xl shadow-lg">
                <Text className="text-3xl font-chewy text-center text-title">Create Post</Text>
                <TouchableOpacity className=" p-3 rounded-full absolute top-0 right-0 w-10 h-10" onPress={onCloseModal}>
                    <Text className="text-white font-bold text-center text-md ">x</Text>
                </TouchableOpacity>
                <TextInput
                    className="border border-gray-300 p-2 text-secondary"
                    placeholder="Enter Title"
                    value={title}
                    editable={!loading}
                    onChangeText={setTitle} />
                <View className="relative mt-3 items-center">
                    {image ? (
                        <TouchableOpacity
                            onPress={pickImage}
                            className="mb-2 mt-2 p-2 rounded-full"
                            disabled={loading}
                        >
                            <Image
                                source={{ uri: image }}
                                resizeMode="contain"
                                className="bg-secondary w-[100px] h-[100px] border-black border-2"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={pickImage}
                            disabled={loading}
                            className="mb-2 mt-2 p-2 bg-secondary rounded-full"
                        >
                            <Ionicons name="camera" size={40} color="black" />
                        </TouchableOpacity>
                    )}
                </View>
                <TextInput
                    className="border border-gray-300 sp-2 mt-2 text-secondary"
                    style={{ height: image ? 128 : 200 }}
                    placeholder=" Enter Post"
                    value={body}
                    onChangeText={setBody}
                    multiline={true}
                    editable={!loading}
                    blurOnSubmit={false} />
                <TouchableOpacity
                    className="bg-blue-500 p-3 rounded-full mt-4"
                    disabled={loading}
                    onPress={post}
                >
                    <Text className="text-white font-bold text-center">Post</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView >
    );
}

export default CreatePost;
