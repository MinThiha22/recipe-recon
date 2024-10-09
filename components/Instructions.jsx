import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

const Instructions = ({ recipe }) => {
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={instructionsVisible}
        onRequestClose={() => setInstructionsVisible(false)}
      >
        <View className="flex-1 justify-center items-center m-5 bg-primary border-black p-5 rounded-xl shadow-lg">
          <Text className="text-white font-bold text-center pb-5">
            {recipe.title}
          </Text>
          <Text className="text-white font-bold text-center">Ingredients</Text>
          <FlatList
            className="pt-4"
            data={recipe.extendedIngredients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text className="text-2xl font-chewy text-center text-title">
                  {item.nameClean}
                </Text>
                <Text className="text-md font-poppingsRegular text-center text-secondary">
                  {item.measures.us.amount} {item.measures.us.unitLong}
                </Text>
              </View>
            )}
          />
          <FlatList
            className="pt-4"
            data={recipe.analyzedInstructions[0]?.steps}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <View>
                <Text className="text-2xl font-chewy text-center text-title">
                  Step {item.number}
                </Text>
                <Text className="text-md font-poppingsRegular text-center text-secondary">
                  {item.step}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-full mt-4"
            onPress={() => setInstructionsVisible(false)}
          >
            <Text className="text-white font-bold text-center">Hide Modal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        className="bg-title p-3 rounded-full mt-4"
        onPress={() => setInstructionsVisible(true)}
      >
        <Text className="text-white font-bold text-center">Instructions</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Instructions;
