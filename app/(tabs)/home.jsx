import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const Home = () => {
  // State for holding the manually entered ingredient
  const [ingredient, setIngredient] = useState("");
  // State for holding the list of added ingredients
  const [ingredientsList, setIngredientsList] = useState([]);

  // Handler function to add the entered ingredient to the list
  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setIngredientsList([...ingredientsList, ingredient]);
      setIngredient(""); // Clear the input field after adding
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

  // Handler function to save ingredients (implementation can be added)
  const handleSave = () => {
    // Logic to save the ingredients can be added here
    console.log("Ingredients saved:", ingredientsList);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-4xl mt-2 font-chewy text-title">Home</Text>

          {/* TextInput functionality */}
          <View className="w-[100%] items-center mt-1 mb-2">
            <Text className="text-lg font-poppinsBold text-secondary">
              Enter Ingredients
            </Text>
            <FormField
              placeholder="Type ingredient here..."
              value={ingredient}
              handleChangeText={setIngredient}
              otherStyles="mb-2 w-[90%]"
            ></FormField>
            <CustomButton
              title="Add Ingredient"
              handlePress={handleAddIngredient}
              containerStyles="mt-2 w-[50%] "
            ></CustomButton>
          </View>

          {/* Display the added ingredients */}
          <View className="w-[80%]">
            {ingredientsList.length === 0 ? (
              <Text className="text-white text-center mt-2">
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
                    <Text className="text-red-800 text-lg">x</Text>
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
