import { Alert, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from '@react-navigation/native';
import {
  logout,
  getCurrentUserData,
  uploadProfilePicture,
  getProfilePicture,
  checkAuthState,
  getIngredients,
  deleteIngredient,
  deleteAllIngredients,
  getFavourites,
  getRecents,
} from "../../lib/firebase";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { images, icons } from "../../constants";

const Profile = () => {
  const [isSumbitting, setIsSumbitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profilePicture: null,
    savedIngredients: [],
    favourites: [],
  });
  const [isLoading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Log out current user when log out button is pressed
  const logOut = async () => {
    setIsSumbitting(true);
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSumbitting(false);
    }
  };

  // Get current user data including username, email, profilePicture, saveIngredients and favourites
  const getData = async () => {
    setLoading(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      const { username, email } = await getCurrentUserData();
      const profilePicture = await getProfilePicture(userId);

      const savedIngredients = await getIngredients(userId).catch(() => []);
      const favourites = await getFavourites(userId).catch(() => []);
      const recents = await getRecents(userId).catch(() => []);

      setUserData({ username, email, profilePicture, savedIngredients, favourites, recents });
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  useEffect(() => {
    getData();
  }, []);

  // Alert box to choose picture input
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

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const blob = await response.blob();
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      const profilePictureUrl = await uploadProfilePicture(blob, userId);

      setUserData((prevData) => ({
        ...prevData,
        profilePicture: profilePictureUrl,
      }));

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteOne = async (ingredient) => {
    setIsSumbitting(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      await deleteIngredient(ingredient, userId);
      setUserData((prevData) => ({
        ...prevData,
        savedIngredients: prevData.savedIngredients.filter(
          (item) => item !== ingredient
        ),
      }));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSumbitting(false);
    }
  };

  const deleteAll = async () => {
    setIsSumbitting(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      await deleteAllIngredients(userId);
      setUserData((prevData) => ({ ...prevData, savedIngredients: [] }));
      Alert.alert("Success", "All ingredients deleted successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSumbitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="w-full min-h-[80vh] items-center">
          <Text className="text-3xl mt-5 text-title font-chewy">
            Your Profile
          </Text>
          {isLoading && (
            <Text className="text-lg mt-3 text-secondary font-poppinsBold">
              Loading...Please wait...
            </Text>
          )}
          {!isLoading && (
            <Text className="text-lg mt-3 text-secondary font-poppinsBold">
              Hello {userData.username}
            </Text>
          )}

          <View className="relative mt-3">
            {userData.profilePicture ? (
              <Image
                source={{ uri: userData.profilePicture }}
                resizeMode="contain"
                className="bg-secondary w-[120px] h-[120px] rounded-full border-black border-2"
              />
            ) : (
              <Image
                source={images.profilePlaceHolder}
                resizeMode="contain"
                className="w-[30px] h-[30px] rounded-full"
              ></Image>
            )}
            <TouchableOpacity
              onPress={pickImage}
              className="absolute right-0 bottom-0 p-2 bg-secondary rounded-full"
            >
              <Image source={icons.addIcon} className="w-[15px] h-[15px]" ></Image>
            </TouchableOpacity>
          </View>


          <View className="flex-col items-center mt-5">
            <Text className="text-lg font-poppinsBold text-secondary">
              Personal Info
            </Text>
            <Text className="font-poppinsRegular text-secondary">
              Email: {userData.email}
            </Text>
          </View>
          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <View className="items-center">
            <Text className="text-lg font-poppinsBold text-secondary">
              Your saved ingredients
            </Text>
            {isLoading && (
              <Text className=" text-secondary font-poppingsRegular">
                Loading...Please wait...
              </Text>
            )}
            {!isLoading && (
              <>
                <View className="pt-2">
                  {userData.savedIngredients &&
                    userData.savedIngredients.length > 0 ? (
                    userData.savedIngredients.map((item, index) => (
                      <View
                        key={index}
                        className="flex-row justify-between items-center bg-slate-400 p-2 mb-2 rounded-md w-[70%] mx-auto"
                      >
                        <Text className="font-poppingsRegular text-secondary">
                          {item}
                        </Text>
                        <TouchableOpacity onPress={() => deleteOne(item)}>
                          <Image source={icons.close} className="w-4 h-4" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text className="font-poppingsRegular text-secondary">
                      No saved ingredients
                    </Text>
                  )}
                  {userData.savedIngredients &&
                    userData.savedIngredients.length > 0 && (
                      <View className="items-center">
                        <TouchableOpacity
                          onPress={deleteAll}
                          className="bg-red-500 h-[30px] rounded-xl justify-center items-center w-[40%]"
                        >
                          <Text className="text-secondary font-poppingsRegular">
                            Delete All
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              </>
            )}
          </View>

          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <View className="items-center">
            <Text className="text-lg font-poppinsBold text-secondary">
              Favourite Recipes
            </Text>
            {isLoading && (
              <Text className=" text-secondary font-poppingsRegular">
                Loading...Please wait...
              </Text>
            )}
            {!isLoading && (
              <>
                <View className="pt-2">
                  {userData.favourites && userData.favourites.length > 0 ? (
                    userData.favourites.map((item, index) => (
                      <View
                        key={index}
                        className="bg-secondary p-4 mb-2 rounded-md w-[90%]"
                      >
                        {console.log(item.name.title)}
                        <Text className="font-poppinsRegular text-primary text-lg">
                          {item.name.title}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text className="font-poppingsRegular text-secondary">
                      No favourite recipes
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>

          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <View className="items-center">
            <Text className="text-lg font-poppinsBold text-secondary">
              Recent Recipes
            </Text>
            {isLoading && (
              <Text className=" text-secondary font-poppingsRegular">
                Loading...Please wait...
              </Text>
            )}
            {!isLoading && (
              <>
                <View className="pt-2">
                  {userData.recents && userData.recents.length > 0 ? (
                    userData.recents.reverse().slice(0,5).map((item, index) => (
                      <View
                        key={index}
                        className="bg-secondary p-4 mb-2 rounded-md w-[90%]"
                      >
                        {console.log(item.name.title)}
                        <Text className="font-poppinsRegular text-primary text-lg">
                          {item.name.title}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text className="font-poppingsRegular text-secondary">
                      No favourite recipes
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>


          <CustomButton
            title="Log Out"
            handlePress={logOut}
            containerStyles={"mt-7 w-[30%]"}
            isLoading={isSumbitting}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
};

export default Profile;
