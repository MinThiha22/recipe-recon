import { View, Text } from 'react-native'
import React from 'react'
import axios from 'axios';


export const RecipeList = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchRecipes = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3000/api/recipes`, {
        params: {
          query,
        },
      });
      setRecipes(response.data.hits || []);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
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
        keyExtractor={(item) => item.recipe.uri}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{item.recipe.label}</Text>
            <Text>Ingredients: {item.recipe.ingredientLines.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  recipeContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recipeTitle: {
    fontWeight: 'bold',
  },
});
