import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { icons } from "../../constants";
import { checkAuthState, saveIngredients, getIngredients } from "../../lib/firebase";
import { tryCatch } from "ramda";

const Home = () => {
  // State for holding the manually entered ingredient
  const [ingredient, setIngredient] = useState("");
  // State for holding the list of added ingredients
  const [ingredientsList, setIngredientsList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);

  // Handler function to add the entered ingredient to the list

  const imageRecognition = async (imageUri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      const response = await axios.post(
        `https://just-teaching-trout.ngrok-free.app/api/imageRecognition`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResponse(response.data);
      setIngredient(response.data.category);
      handleAddIngredient
    } catch (err) {
      console.error("Error fetching recognition response: ", err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };
  
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
        const imageUri = pickerResult.assets[0].uri;
        await imageRecognition(imageUri);
      }
    } catch (error) {
      console.error("Error in openCamera:", error);
      Alert.alert(
        "Error",
        "Something went wrong while trying to take and process the picture. Please try again."
      );
    }
  };


  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setIngredientsList([...ingredientsList, ingredient]);
      setIngredient("");
      setResponse("");
    }
  };

  // Handler function to remove an ingredient from the list
  const handleRemoveIngredient = (indexToRemove) => {
    setIngredientsList(
      ingredientsList.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handler function to clear all ingredients
  const handleClearAll = () => {
    setIngredientsList([]); // Clear all ingredients
  };

  
  const handleSave = async () => {
    setSaving(true);
    try{
      const user = await checkAuthState();
      if(!user) {
        throw new Error("User is not authenticated");
      }
      const userId = user.uid;
      await saveIngredients(ingredientsList,userId);
      Alert.alert('Success', 'Your ingredients are saved. You can view them in your profile!');
      setIngredientsList([]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message); 
    } finally {
      setSaving(false);
    }
    
  };

  const handleClearInput = () => {
    setIngredient('');
    setResponse('');
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-3xl mt-2 font-chewy text-title">Home</Text>

          {/* CameraInput functionality */}
          <View className="items-center mt-4">
            <Text className="text-lg font-poppinsBold text-secondary">
              Snap Your Ingedients
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={openCamera}
              className="mb-2 mt-2 p-2 bg-secondary rounded-full"
            >
              <Ionicons name="camera" size={40} color="black" />
            </TouchableOpacity>
          </View>

          {/* TextInput functionality */}
          <View className="w-[100%] items-center mt-2 mb-2">
            <Text className="text-lg font-poppinsBold text-secondary">
              or Enter Manually
            </Text>
            <FormField
              title="Ingredient-input"
              placeholder="Type ingredient here..."
              value={ingredient}
              handleChangeText={setIngredient}
              otherStyles="mb-2 w-[90%]"
              
            >
              <TouchableOpacity onPress={handleClearInput}>
                <Image 
                  source={icons.close} 
                  className="w-5 h-5" 
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </FormField>
            <CustomButton
              title="Add Ingredient"
              handlePress={handleAddIngredient}
              containerStyles="mt-2 w-[50%] "
            ></CustomButton>
          </View>
        
          <View className="w-[80%]">
            {loading && <Text className="text-secondary font-poppinsBold mt-3 mb-3 text-lg">Loading...Analysing image....</Text>}
            {error && <Text className="text-red-500 mb-4">{error}</Text>}
            {!loading && response && 
              <>
                <Text className="text-secondary font-poppinsRegular mt-3 mb-1">Item found with {(response.probability * 100).toFixed(2)}% probability.</Text>
                <Text className="text-secondary font-poppinsRegular">If item is not correct, please try again!</Text>
              </>
            }
          </View>

          {/* Display the added ingredients */}
          <View className="w-[80%]">
            <Text className="font-chewy text-xl text-title text-center mt-2 mb-2">New Ingredient List</Text>
            {ingredientsList.length === 0 ? (
              <Text className="text-secondary font-poppinsRegular text-center">
                No ingredients added yet.
              </Text>
            ) : (
              ingredientsList.map((ingredient, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center bg-slate-400 p-2 mb-2 rounded-md w-[80%] mx-auto"
                >
                  <Text className="text-lg">{ingredient}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveIngredient(index)}
                  >
                    <Image source={icons.close} className="w-4 h-4" onPress={handleRemoveIngredient}></Image>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Static view with "Clear All" and "Save" buttons */}
      <View className="flex-row justify-between bg-primary p-4 absolute bottom-0 w-full">
        <TouchableOpacity
          onPress={handleClearAll}
          className="w-[50%] justify-center items-center"
        >
          <Text className="text-white text-lg">Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          className="w-[50%] justify-center items-center"
        >
          <Text className="text-white text-lg">Save</Text>
        </TouchableOpacity>
      </View>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Home;
