import { Alert, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from '@react-navigation/native';
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
} from "../../lib/firebase";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { images, icons } from "../../constants";
import FormField from "../../components/FormField";
import RecipeInfo from '../../components/RecipeInfo.jsx';

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
  });
  const [isLoading, setLoading] = useState(false);
  const [isLoadingInfo, setLoadingInfo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  // Get Dynamic Data savedIngredients favourites, and recents recipes
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
      
      setUserData(prevData => ({
        ...prevData, 
        savedIngredients, 
        favourites, 
        recents
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
      return () => {setIsEditing(false)}; 
    }, [])
  );

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setIngredients(userData.savedIngredients);
    setFavourites(userData.favourites);
    setRecents(userData.recents);
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
    setState((prevArray) => prevArray.filter((arrayItem) => arrayItem !== item));
  };

  const tempDeleteAll = () => {
    setIngredients([]);
  };

  const editProfile = async () => {
    if(isLoading) return
    setIsEditing(true);
  }

  const saveChanges = async () => {
    setIsSumbitting(true);
    try {
      const user = await checkAuthState();
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;

      await updateUsername(newUsername);

      if(ingredients.length===0){
        await deleteAllIngredients(userId);
      } else {
        const ingredientsToDelete = userData.savedIngredients.filter(
          ingredient => !ingredients.includes(ingredient)
        );

        for (const ingredient of ingredientsToDelete) {
          await deleteIngredient(ingredient, userId);
        }
      }

      const favouritesToDelete = userData.favourites.filter(
        fav => !favourites.includes(fav)
      );
      for (const fav of favouritesToDelete) {
        await deleteFavourite(fav, userId);
      }

      const recentsToDelete = userData.recents.filter(
        recent => !recents.includes(recent)
      );
      for (const recent of recentsToDelete) {
        await deleteRecent(recent, userId);
      }

      setUserData(prevData => ({
        ...prevData,
        username: newUsername,
        savedIngredients: ingredients,
        favourites: favourites,
        recent: recents
      }));

      Alert.alert("Success", "Changes saved successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSumbitting(false);
      setIsEditing(false);
    }
  }

  const cancelChanges = async () => {
    setIsEditing(false);
    setIngredients(userData.savedIngredients);
    setFavourites(userData.favourites);
    setRecents(userData.recents);
  }

  // Get specific recipe information from server when recipe is pressed
  const recipeSelected = async (id) => {
    try {

      const response = await axios.get(`https://recipe-recon.onrender.com/api/recipeInfo`, {
        params: { query: id },
      });
      const recipeInfo = response.data;
      setSelectedRecipe(recipeInfo);
      setModalVisible(true);
      } catch (err) {
      setError("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };


  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="w-full min-h-[80vh] items-center">
          <Text className="text-3xl mt-5 text-title font-chewy">
            Your Profile
          </Text>
          {isLoadingInfo && (
            <Text className="text-lg mt-3 text-secondary font-poppinsBold">
              Loading...Please wait...
            </Text>
          )}
          {!isLoadingInfo && !isEditing && (
            <Text className="text-lg mt-3 text-secondary font-poppinsBold">
              Hello {userData.username}
            </Text>
          )}
          {isEditing && (
            <FormField 
              title = ""
              value = {newUsername}
              placeholder={userData.username}
              handleChangeText = {(text)=>{setNewUsername(text)}}
              otherStyles = "w-[30%]"
            />
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
                className="w-[120px] h-[120px] rounded-full"
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
              Saved ingredients
            </Text>
            
            {isLoading && (
              <Text className=" text-secondary font-poppingsRegular">
                Loading...Please wait...
              </Text>
            )}
            {!isLoading && (
              <>
                <View className="pt-2">
                  {ingredients &&
                    ingredients.length > 0 ? (
                    ingredients.map((item, index) => (
                      isEditing ? (
                        <View key={index} className="flex-row justify-between items-center bg-slate-400 p-2 mb-2 rounded-md w-[70%] mx-auto">
                          <Text className="font-poppingsRegular font-bold text-secondary">
                            {item}
                          </Text>
                          <TouchableOpacity onPress={() => tempDeleteItem(item,ingredients,setIngredients)}>
                            <Image source={icons.close} className="w-4 h-4" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View key={index} className="flex-row justify-between items-center p-2 mb-1 rounded-md w-[70%]">
                          <Text className="font-poppingsBold text-lg font-bold text-secondary">
                            {item}
                          </Text>
                        </View>
                      )
                    ))
                  ) : (
                    <Text className="font-poppingsRegular text-secondary">
                      No saved ingredients
                    </Text>
                  )}
                  {isEditing && ingredients &&
                    ingredients.length > 0 && (
                      <View className="items-center">
                        <TouchableOpacity
                          onPress={()=>{
                            Alert.alert(
                              "Confirm?",
                              "Are you sure you want to delete all saved ingredients",
                              [
                                {
                                  text: "Yes",
                                  onPress: tempDeleteAll,
                                },
                                {
                                  text: "No",
                                  style: 'cancel'
                                },
                                
                              ]
                            );
                          }}
                          className="bg-red-400 h-[30px] rounded-xl justify-center items-center w-[40%]"
                        >
                          <Text className="text-black font-poppingsBold">
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
                  {favourites && favourites.length > 0 ? (
                    favourites.map((item, index) => (
                      <View
                        key={index}
                        className="flex-row justify-between items-center bg-slate-400 p-2 mb-2 rounded-md w-[80%] mx-auto"
                      >
                        <View className="flex-col gap-1 items-center justify-center">
                          <Image className="w-60 h-60" source={{ uri: item.name.image }} />
                          <Text className="font-poppinsRegular text-black text-lg">
                            {item.name.title}
                          </Text>

                           {isEditing ? (
                            <TouchableOpacity
                              onPress={() => tempDeleteItem(item,favourites,setFavourites)}
                              className="bg-red-400 h-[30px] rounded-xl justify-center items-center w-[30%]"
                            >
                              <Text className="text-black font-poppingsBold">
                                Remove
                              </Text>
                            </TouchableOpacity>
                           ) : (
                            <TouchableOpacity
                              onPress={() => recipeSelected(item.id)}
                              className="bg-title h-[30px] rounded-xl justify-center items-center w-[30%]"
                            >
                              <Text className="text-black font-poppingsBold">
                                Detail
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
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
                  {recents && recents.length > 0 ? (
                    recents.reverse().slice(0,5).map((item, index) => (
                      <View
                        key={index}
                        className="flex-row justify-between items-center bg-slate-400 p-2 mb-2 rounded-md w-[70%] mx-auto"
                      >

                        <View className="flex-col items-center justify-center">
                          <Image className="w-60 h-60" source={{ uri: item.name.image }} />
                          <Text className="font-poppinsRegular text-black text-lg">
                            {item.name.title}
                          </Text>
                          {isEditing ? (
                            <TouchableOpacity
                              onPress={() => tempDeleteItem(item,recents,setRecents)}
                              className="bg-red-400 h-[30px] rounded-xl justify-center items-center w-[30%]"
                            >
                              <Text className="text-black font-poppingsBold">
                                Remove
                              </Text>
                            </TouchableOpacity>
                           ) : (
                            <TouchableOpacity
                              onPress= {() => recipeSelected(item.id)}
                              className="bg-title h-[30px] rounded-xl justify-center items-center w-[30%]"
                            >
                              <Text className="text-black font-poppingsBold">
                                Detail
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text className="font-poppingsRegular text-secondary">
                      No Recent recipes
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
          {!isEditing ? (
            <View className="justify-center flex-row mt-7">
              <CustomButton
                title="Edit Profile"
                handlePress={editProfile}
                containerStyles={"w-[30%]"}
                isLoading={isSumbitting}
              />
              <CustomButton
                title="Log Out"
                handlePress={logOut}
                containerStyles={"w-[30%] ml-2"}
                isLoading={isSumbitting}
              />
            </View>
          ) : (
            <View className="justify-center flex-row mt-7">
              <CustomButton
                title="Save"
                handlePress={()=>{
                  Alert.alert(
                    "Confirm?",
                    "Do you want to save your profile data?",
                    [
                      {
                        text: "Yes",
                        onPress: saveChanges,
                      },
                      {
                        text: "No",
                        style: 'cancel'
                      },  
                    ]
                  );
                }}
                containerStyles={"bg-red-400 w-[30%]"}
                isLoading={isSumbitting}
              />
              <CustomButton
                title="Cancel"
                handlePress={cancelChanges}
                containerStyles={"bg-red-400 w-[30%] ml-2"}
                isLoading={isSumbitting}
              />
            </View>
          )}
          
        </View>
      </ScrollView>
      {selectedRecipe && ( 
          <RecipeInfo selectedRecipe={selectedRecipe} visible={modalVisible} close={closeModal}></RecipeInfo>
        )}
      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
};

export default Profile;
