import { Alert,View,Text,ScrollView,TouchableOpacity,Modal } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileActionButtons from "../../components/ProfileActionButtons";
import SavedIngredientsList from "../../components/SavedIngredientsList";
import ProfileRecipeList from "../../components/ProfileRecipeList";
import RecipeInfo from "../../components/RecipeInfo.jsx";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import {
  logout,
  updateUsername,
  getCurrentUserData,
  uploadProfilePicture,
  getProfilePicture,
  checkAuthState,
  getIngredients,
  deleteIngredient,
  deleteAllIngredients,
  getFavourites,
  deleteFavourite,
  getRecents,
  deleteRecent,
  getBookmarks,
  deleteBookmark,
} from "../../lib/firebase";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Comments from "../../components/Comments";

const Profile = () => {
  const [isSumbitting, setIsSumbitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [newUsername, setNewUsername] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profilePicture: null,
    savedIngredients: [],
    favourites: [],
    recents: [],
    bookmarks: [],
  });
  const [isLoading, setLoading] = useState(false);
  const [isLoadingInfo, setLoadingInfo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [favouriteToggled, setFavouriteToggled] = useState(false);

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

  // Get current user data including username, email, profilePicture.
  const getData = async () => {
    if (isEditing) return;
    setLoadingInfo(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      const { username, email } = await getCurrentUserData();
      const profilePicture = await getProfilePicture(userId);
      setUserData({ username, email, profilePicture });
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingInfo(false);
    }
  };

  // Get Dynamic Data savedIngredients favourites, and recents recipes and bookmarks
  const getDynamicData = async () => {
    if (isEditing) return;
    setLoading(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;

      const savedIngredients = await getIngredients(userId).catch(() => []);
      const favourites = await getFavourites(userId).catch(() => []);
      const recents = await getRecents(userId).catch(() => []);
      const bookmarks = await getBookmarks(userId).catch(() => []);

      setUserData((prevData) => ({
        ...prevData,
        savedIngredients,
        favourites,
        recents,
        bookmarks,
      }));

      setUserData((prevData) => ({
        ...prevData,
        savedIngredients,
        favourites,
        recents,
      }));
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDynamicData();
      return () => {
        setIsEditing(false);
      };
    }, [])
  );

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setIngredients(userData.savedIngredients);
    setFavourites(userData.favourites);
    setRecents(userData.recents);
    setBookmarks(userData.bookmarks);
  }, [userData]);

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

  // uploadImage to firebase storage
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

  const tempDeleteItem = (item, array, setState) => {
    setState((prevArray) =>
      prevArray.filter((arrayItem) => arrayItem !== item)
    );
  };

  const tempDeleteAll = () => {
    setIngredients([]);
  };

  const editProfile = async () => {
    if (isLoading) return;
    setIsEditing(true);
  };

  const saveChanges = async () => {
    setIsSumbitting(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;

      if (newUsername !== "") {
        await updateUsername(newUsername);
      }

      if (ingredients.length === 0) {
        await deleteAllIngredients(userId);
      } else {
        const ingredientsToDelete = userData.savedIngredients.filter(
          (ingredient) => !ingredients.includes(ingredient)
        );

        for (const ingredient of ingredientsToDelete) {
          await deleteIngredient(ingredient, userId);
        }
      }

      const favouritesToDelete = userData.favourites.filter(
        (fav) => !favourites.includes(fav)
      );
      for (const fav of favouritesToDelete) {
        await deleteFavourite(fav, userId);
      }

      const recentsToDelete = userData.recents.filter(
        (recent) => !recents.includes(recent)
      );

      for (const recent of recentsToDelete) {
        await deleteRecent(recent, userId);
      }

      const bookmarksToDelete = userData.bookmarks.filter(
        (recent) => !bookmarks.includes(bookmarks)
      );

      for (const bookmark of bookmarksToDelete) {
        await deleteBookmark(bookmark, userId);
      }

      setUserData((prevData) => ({
        ...prevData,
        username: newUsername !== "" ? newUsername : prevData.username,
        savedIngredients: ingredients,
        favourites: favourites,
        recents: recents,
        bookmarks: bookmarks,
      }));

      Alert.alert("Success", "Changes saved successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSumbitting(false);
      setIsEditing(false);
    }
  };

  const cancelChanges = async () => {
    setIsEditing(false);
    setIngredients(userData.savedIngredients);
    setFavourites(userData.favourites);
    setBookmarks(userData.bookmarks);
  };

  // Get specific recipe information from server when recipe is pressed
  const recipeSelected = async (id) => {
    try {
      const response = await axios.get(
        `https://recipe-recon.onrender.com/api/recipeInfo`,
        {
          params: { query: id },
        }
      );
      const recipeInfo = response.data;
      setSelectedRecipe(recipeInfo);
      setRecents(userData.recents);
      setModalVisible(true);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
    if (favouriteToggled) {
      getDynamicData();
      setFavouriteToggled(false); // Reset the flag
    }
  };

  //toggle comments visibility
  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prev) => (prev === postId ? null : postId));
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="w-full min-h-[80vh] items-center">
          <ProfileHeader
            username={userData.username}
            isEditing={isEditing}
            profilePicture={userData.profilePicture}
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            pickImage={pickImage}
            isLoadingInfo={isLoadingInfo}
          />
          <View className="flex-col items-center mt-5">
            <Text className="text-lg font-poppinsBold text-secondary">
              Personal Info
            </Text>
            <Text className="font-poppinsRegular text-secondary">
              Email: {userData.email}
            </Text>
          </View>

          <ProfileActionButtons
            isEditing={isEditing}
            editProfile={editProfile}
            logOut={logOut}
            saveChanges={() => {
              Alert.alert(
                "Confirm?",
                "Do you want to save your profile data?",
                [
                  { text: "Yes", onPress: saveChanges },
                  { text: "No", style: "cancel" },
                ]
              );
            }}
            cancelChanges={cancelChanges}
            isSumbitting={isSumbitting}
          />

          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <SavedIngredientsList
            ingredients={ingredients}
            isEditing={isEditing}
            isLoading={isLoading}
            tempDeleteItem={tempDeleteItem}
            tempDeleteAll={() => {
              Alert.alert(
                "Confirm?",
                "Are you sure you want to delete all saved ingredients",
                [
                  { text: "Yes", onPress: tempDeleteAll },
                  { text: "No", style: "cancel" },
                ]
              );
            }}
            setIngredients={setIngredients}
          />

          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <ProfileRecipeList
            title="Bookmarks"
            items={bookmarks}
            isEditing={isEditing}
            isLoading={isLoading}
            onItemPress={recipeSelected}
            onDeleteItem={(item) =>
              tempDeleteItem(item, bookmarks, setBookmarks)
            }
            showComments={true}
            onToggleComments={toggleCommentsVisibility}
          />

          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <ProfileRecipeList
            title="Favourite Recipes"
            items={favourites}
            isEditing={isEditing}
            isLoading={isLoading}
            onItemPress={recipeSelected}
            onDeleteItem={(item) =>
              tempDeleteItem(item, favourites, setFavourites)
            }
          />
          <View className="my-4 border-t border-secondary w-[80%] max-w-md" />

          <ProfileRecipeList
            title="Recent Recipes"
            items={recents}
            isEditing={isEditing}
            isLoading={isLoading}
            onItemPress={recipeSelected}
            onDeleteItem={(item) => tempDeleteItem(item, recents, setRecents)}
          />
        </View>
      </ScrollView>

      {commentsVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!commentsVisible}
          onRequestClose={() => setCommentsVisible(false)}
        >
          <View className="flex-1 m-2 justify-end">
            <View className="h-3/4 bg-white rounded-lg shadow pl-4 pr-4">
              <TouchableOpacity
                className="bg-primary p-3 rounded-full mt-4"
                onPress={() => setCommentsVisible(false)}
              >
                <Text className="text-white font-bold text-center">
                  Hide Comments
                </Text>
              </TouchableOpacity>
              <Comments postId={commentsVisible} />
            </View>
          </View>
        </Modal>
      )}

      {selectedRecipe && (
        <RecipeInfo
          selectedRecipe={selectedRecipe}
          visible={modalVisible}
          close={closeModal}
          favouriteToggled={favouriteToggled} // Pass the state
          setFavouriteToggled={setFavouriteToggled} // Pass the setter function
        ></RecipeInfo>
      )}
      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
};

export default Profile;
