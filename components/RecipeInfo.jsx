import { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { db, auth } from '../lib/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const RecipeInfo = ({ selectedRecipe, visible, close }) => {
    Return (
    <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={close}
          >
            <View className="flex-1 justify-center items-center m-5 bg-secondary p-5 rounded-lg">
              <Image
                className="w-48 h-48"
                source={{ uri: selectedRecipe.image }}
              />
              <Text className="text-3xl font-chewy text-center text-title">
                {selectedRecipe.title}
              </Text>
              <RenderHtml
                contentWidth={400}
                source={{ html: selectedRecipe.summary }}
              />
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={close}
              >
                <Text className="text-white font-bold text-center">
                  Hide Modal
                </Text>
              </TouchableOpacity>
              <FavouriteButton selectedRecipe={selectedRecipe} />
            </View>
          </Modal>
    )
};
export default RecipeInfo