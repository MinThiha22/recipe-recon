import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Instructions = ( {id} ) => {

const [instructions, setInstructions] = useState([]);
const [instructionsVisible, setInstructionsVisible] = useState(false);

  const getInstructions = async (recipeId) => {
    try {
      const response = await axios.get(`https://roughy-polite-wholly.ngrok-free.app/api/recipeInstructions`, {
        params: { query: id },
      });
      const instruction = response.data[0]?.steps;
      setInstructions(instruction);
      setInstructionsVisible(true);
    } catch (err) {
      Alert.alert("Failed to fetch instructions")
    }
  };

  return (
    <View>
     <Modal
            animationType="slide"
            transparent={true}
            visible={instructionsVisible}
            onRequestClose={() => (setInstructionsVisible(false))}
          >
            <View className="flex-1 justify-center items-center m-5 bg-secondary p-5 rounded-lg">
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={() => (setInstructionsVisible(false))}
              >
                <Text className="text-white font-bold text-center">Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </Modal>
    <TouchableOpacity
    className="bg-title p-3 rounded-full mt-4"
    onPress={() => (getInstructions(id))}
  >
    <Text className="text-white font-bold text-center">Instructions</Text>
  </TouchableOpacity>
  </View>
  );
}
export default Instructions