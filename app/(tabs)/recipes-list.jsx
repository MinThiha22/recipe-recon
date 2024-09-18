import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';

const RecipeList = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const searchRecipes = async () => {
    if (!query.trim()) {
      setError('Please enter ingredients');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`just-teaching-trout.ngrok-free.app/api/recipeIngredientsSearch`, {
        params: {
          query,
        },
      });
      const recipeData = response.data;
      setRecipes(recipeData || []);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const imagePressed = async (id) => {
    try {
      const response = await axios.get(`https://just-teaching-trout.ngrok-free.app/api/recipeInfo`, {
        params: {
          query: id,
        },
      });
      const recipeInfo = response.data;
      setSelectedRecipe(recipeInfo);
      setModalVisible(true);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 p-4">
        <Text className="text-5xl font-chewy text-center text-title_color">Recipe Search</Text>
        <TextInput
          className="border border-gray-300 rounded p-2 mb-4"
          placeholder="Enter ingredients"
          value={query}
          onChangeText={setQuery}
        />

        <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={searchRecipes}>
                <Text className="text-white font-bold text-center">Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-title_color p-3 rounded-full mt-4">
                <Text className="text-white font-bold text-center">Sort by your ingredients</Text>
              </TouchableOpacity>

        {loading && <Text>Loading...</Text>}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 bg-primary">
              <TouchableOpacity className="flex-1 items-center justify-center" onPress={() => imagePressed(item.id)}>
                <Image className="w-60 h-60" source={{ uri: item.image }} />
                <Text className="text-2xl font-chewy text-center text-title_color">{item.title}</Text>
                <Text className="text-md font-poppingsRegular text-center text-secondary">Ingredients: {item.usedIngredients.map(ingredient => ingredient.name).join(', ')}</Text>
                <Text className="text-md font-poppingsRegular text-center text-secondary"> Missing Ingredients: {item.missedIngredients.map(ingredient => ingredient.name).join(', ')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {selectedRecipe && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View className="flex-1 justify-center items-center m-5 bg-secondary p-5 rounded-lg">
              <Image className="w-48 h-48" source={{ uri: selectedRecipe.image }} />
              <Text className="text-3xl font-chewy text-center text-title_color">{selectedRecipe.title}</Text>
              <RenderHtml
                contentWidth={400}
                source={{ html: selectedRecipe.summary }}
              />
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={closeModal}>
                <Text className="text-white font-bold text-center">Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecipeList;