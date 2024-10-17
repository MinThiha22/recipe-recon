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
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

const Instructions = ({ recipe }) => {
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [measurementStyle, setMeasurementStyle] = useState("metric");

  const toggleMeasurementStyle = () => {
    setMeasurementStyle((prevStyle) => (prevStyle === "us" ? "metric" : "us"));
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={instructionsVisible}
        onRequestClose={() => setInstructionsVisible(false)}
      >
        <ScrollView>
          <View className="flex-1 justify-center items-center m-5 bg-primary border-black p-5 rounded-xl shadow-lg">
            <Text className="text-3xl font-chewy text-center text-title pb-5">
              {recipe.title}
            </Text>
            <Image
              className="w-60 h-60"
              source={{ uri: recipe.image }}
              testID="recipeImage"
            />

            <Text className="text-2xl font-poppinsBold text-center text-title pt-5">
              Ingredients
            </Text>
            <>
              <View className="pt-2">
                {recipe.extendedIngredients.map((item) => (
                  <View
                    key={item.id.toString()}
                    className="flex-row justify-between items-center w-full px-2 "
                  >
                    <Text className="text-md font-poppinsBold text-center text-secondary">
                      {item.nameClean}
                    </Text>
                    <Text className="text-md font-poppinsSemiBold text-center text-secondary">
                      {item.measures[measurementStyle].amount}{" "}
                      {item.measures[measurementStyle].unitLong}
                    </Text>
                  </View>
                ))}
              </View>
            </>
            <View>
              <TouchableOpacity
                className="bg-yellow-400 p-3 rounded-full mt-4"
                onPress={toggleMeasurementStyle}
              >
                <Text className="text-white font-bold text-center">
                  {measurementStyle === "us"
                    ? "Switch to Metric"
                    : "Switch to Imperial"}
                </Text>
              </TouchableOpacity>
            </View>
            <>
              <View className="pt-2">
                <Text className="text-2xl font-poppinsBold text-center text-title pt-5">
                  Instructions
                </Text>
                {recipe.analyzedInstructions[0]?.steps.map((item) => (
                  <View key={item.number.toString()}>
                    <Text className="text-2xl font-poppinsBold text-center text-secondary">
                      Step {item.number}
                    </Text>
                    <Text className="text-md font-poppingsRegular text-center text-secondary pb-5">
                      {item.step}
                    </Text>
                  </View>
                ))}
              </View>
            </>
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-full mt-4"
              onPress={() => setInstructionsVisible(false)}
            >
              <Text className="text-white font-bold text-center">
                Hide Instructions
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
      <TouchableOpacity
        className="bg-green-500 p-3 rounded-full mt-4"
        onPress={() => setInstructionsVisible(true)}
        testID="showInstructionsButton"
      >
        <Text
          testID="instructionsHeader"
          className="text-white font-bold text-center"
        >
          Instructions
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Instructions;
