// Update FilterButton.jsx
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

const FilterButton = ({
  isVeganFilter,
  setIsVeganFilter,
  isGlutenFreeFilter,
  setIsGlutenFreeFilter,
  isVegetarianFilter,
  setIsVegetarianFilter,
  applyFilters,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-1 h-12 border rounded pl-2 pr-2 flex-row items-center justify-center bg-secondary"
      >
        <Text className="text-primary text-md font-bold">Filter</Text>
        <AntDesign name="down" size={18} color="black" className="ml-2" />
      </TouchableOpacity>

      {/* Modal for Filter Options */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="w-4/5 bg-primary rounded-lg p-5 mt-auto mb-auto">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-2 right-3"
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-3xl font-chewy text-title mb-4">
              Select Filters
            </Text>

            {/* Vegetarian Filter Toggle */}
            <TouchableOpacity
              onPress={() => setIsVegetarianFilter(!isVegetarianFilter)}
              className="p-3 bg-secondary rounded-md mb-2 w-[80%] flex-row justify-between items-center"
            >
              <Text className="text-primary text-lg">Vegetarian</Text>
              {isVegetarianFilter && (
                <FontAwesome name="check" size={20} color="green" />
              )}
            </TouchableOpacity>

            {/* Vegan Filter Toggle */}
            <TouchableOpacity
              onPress={() => setIsVeganFilter(!isVeganFilter)}
              className="p-3 bg-secondary rounded-md mb-2 w-[80%] flex-row justify-between items-center"
            >
              <Text className="text-primary text-lg">Vegan</Text>
              {isVeganFilter && (
                <FontAwesome name="check" size={20} color="green" />
              )}
            </TouchableOpacity>

            {/* Gluten-Free Filter Toggle */}
            <TouchableOpacity
              onPress={() => setIsGlutenFreeFilter(!isGlutenFreeFilter)}
              className="p-3 bg-secondary rounded-md mb-2 w-[80%] flex-row justify-between items-center"
            >
              <Text className="text-primary text-lg">Gluten-Free</Text>
              {isGlutenFreeFilter && (
                <FontAwesome name="check" size={20} color="green" />
              )}
            </TouchableOpacity>

            {/* Apply and Remove Filters */}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => {
                  applyFilters();
                  setModalVisible(false);
                }}
                className="p-3 bg-green-700 rounded-md w-[45%] justify-center"
              >
                <Text className="text-white text-center">Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsVegetarianFilter(false);
                  setIsVeganFilter(false);
                  setIsGlutenFreeFilter(false);
                  setModalVisible(false);
                }}
                className="p-3 bg-red-800 rounded-md w-[45%] justify-center"
              >
                <Text className="text-white text-center">Remove Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FilterButton;
