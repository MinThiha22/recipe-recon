import React from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import RenderHtml from "react-native-render-html";
import FavouriteButton from "../components/FavouriteButton.jsx";
import Instructions from "./Instructions.jsx";

const RecipeInfo = ({ selectedRecipe, visible, close }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}
    >
      <View className="items-center">
        <View className="w-11/12 max-w-md mt-24 bg-secondary p-5 rounded-xl shadow-lg">
          <View className="items-center">
            <Image
              className="w-48 h-48"
              source={{ uri: selectedRecipe.image }}
            />
            <Text className="text-3xl font-chewy text-center text-title">
              {selectedRecipe.title}
            </Text>
          </View>
          <RenderHtml
            contentWidth={400}
            source={{ html: selectedRecipe.summary }}
          />
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-full mt-4"
            onPress={close}
          >
            <Text className="text-white font-bold text-center">Hide</Text>
          </TouchableOpacity>
          <Instructions recipe={selectedRecipe}></Instructions>
          <FavouriteButton selectedRecipe={selectedRecipe} />
        </View>
      </View>
    </Modal>
  );
};
export default RecipeInfo;
