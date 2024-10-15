import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

const FilterButton = ({
  isVeganFilter,
  setIsVeganFilter,
  isGlutenFreeFilter,
  setIsGlutenFreeFilter,
  applyFilters,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {/* Filter Button with Down Arrow */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="p-3 bg-white rounded-full flex-row items-center justify-center"
      >
        <Text className="text-lg text-black">Filter</Text>
        <AntDesign name="down" size={20} color="black" className="ml-2" />
      </TouchableOpacity>

      {/* Modal for Filter Options with Transparent Background */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true} // This ensures the background is transparent
      >
        {/* Semi-transparent overlay */}
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Centered modal content */}
          <View className="w-4/5 bg-primary rounded-lg p-5 mt-auto mb-auto">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-2 right-3"
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-lg font-chewy text-title mb-4">
              Select Filters
            </Text>

            {/* Vegan Filter Toggle */}
            <TouchableOpacity
              onPress={() => setIsVeganFilter(!isVeganFilter)}
              className="p-3 bg-orange-400 rounded-md mb-2 w-[80%] flex-row justify-between items-center"
            >
              <Text className="text-white">Vegan</Text>
              {isVeganFilter && (
                <FontAwesome name="check" size={20} color="white" />
              )}
            </TouchableOpacity>

            {/* Gluten-Free Filter Toggle */}
            <TouchableOpacity
              onPress={() => setIsGlutenFreeFilter(!isGlutenFreeFilter)}
              className="p-3 bg-orange-400 rounded-md mb-2 w-[80%] flex-row justify-between items-center"
            >
              <Text className="text-white">Gluten-Free</Text>
              {isGlutenFreeFilter && (
                <FontAwesome name="check" size={20} color="white" />
              )}
            </TouchableOpacity>

            {/* Apply Filters Button */}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => {
                  applyFilters();
                  setModalVisible(false);
                }}
                className="p-3 bg-green-500 rounded-md w-[45%] justify-center"
              >
                <Text className="text-white text-center">Apply Filters</Text>
              </TouchableOpacity>

              {/* Remove Filters Button */}
              <TouchableOpacity
                onPress={() => {
                  setIsVeganFilter(false);
                  setIsGlutenFreeFilter(false);
                  setModalVisible(false);
                }}
                className="p-3 bg-red-500 rounded-md w-[45%] justify-center"
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
