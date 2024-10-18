import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { useState } from "react";

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
          <View className="flex-1 items-center">
            <View className="w-11/12 max-w-md mt-24 bg-secondary p-5 rounded-xl shadow-lg items-center">
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
                      className="flex-row justify-between items-center w-full px-2"
                    >
                      <Text className="text-md font-poppinsBold text-center text-black">
                        {item.nameClean}
                      </Text>
                      <Text className="text-md font-poppinsSemiBold text-center text-black">
                        {item.measures[measurementStyle].amount}{" "}
                        {item.measures[measurementStyle].unitLong}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
              <View>
                <TouchableOpacity
                  className="bg-yellow-400 p-3 rounded-full mt-8"
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
                      <Text className="text-2xl font-poppinsBold text-center text-black">
                        Step {item.number}
                      </Text>
                      <Text className="text-md font-poppingsRegular text-center text-black pb-5">
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
