import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Button, FlatList, Image, TouchableOpacity, Linking, CheckBox } from 'react-native'
import axios from 'axios';


const RecipeList = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSelected, setSelection] = useState(false)

  const searchRecipes = async () => {
    if (!query.trim()) {
      setError('Please enter ingredients');
      return;
    }

    setLoading(true);
    setError('');
    const ingredientsCount = query.split(' ').filter(Boolean).length;

    try {
      const response = await axios.get(`http://localhost:3000/api/recipes`, {
        params: {
          query,
          maxIngredients: isSelected ? ingredientsCount : undefined,
        },
      });
      setRecipes(response.data.hits || []);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const imagePressed = (url) => {
    Linking.openURL(url);
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
      <CheckBox value={isSelected} onValueChange={setSelection}></CheckBox>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipe.uri}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <TouchableOpacity onPress={() => imagePressed(item.recipe.url)}>
              <Image style={styles.image} source={{ uri: item.recipe.image }}></Image>
            </TouchableOpacity>
            <Text style={styles.recipeTitle}>{item.recipe.label}</Text>
            <Text>Ingredients: {item.recipe.ingredientLines.join(', ')}</Text>
          </View>
        )}
      />
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