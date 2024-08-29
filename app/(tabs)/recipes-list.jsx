import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Button, FlatList, Image, TouchableOpacity, Modal } from 'react-native'
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
      const response = await axios.get(`http://localhost:3000/api/recipeSearch`, {
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
      const response = await axios.get(`http://localhost:3000/api/recipeInfo`, {
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
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchRecipes} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <TouchableOpacity onPress={() => imagePressed(item.id)}>
              <Image style={styles.image} source={{ uri: item.image }}></Image>
            </TouchableOpacity>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Text>Ingredients: {item.usedIngredients.map(ingredient => ingredient.name).join(', ')}</Text>
            <Text>Missing Ingredients: {item.missedIngredients.map(ingredient => ingredient.name).join(', ')}</Text>
          </View>
        )}
      />
      {selectedRecipe && (<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <Image style={styles.image} source={{ uri: selectedRecipe.image }}></Image>
        <Text style={styles.modalText}>{selectedRecipe.title}</Text>
        <RenderHtml
          contentWidth={400}
          source={{ html: selectedRecipe.summary }}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.textStyle}>Hide Modal</Text>
        </TouchableOpacity>
      </Modal>
      )};
    </View>
  );
};

const styles = StyleSheet.create({
  image:
  {
    width: 100,
    height: 100,
  },
});

export default RecipeList;