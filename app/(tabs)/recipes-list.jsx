import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import { db, auth } from '../../lib/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const RecipeList = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favouriteList, setFavouriteList] = useState([]);
  const [user, setUser] = useState(null);
  const [isIngredients, setIsIngredients] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);

  //get api recipes data from server
  const searchRecipes = async (currentIsIngredients) => {
    setRecipes();
    setLoading(true);
    setError('');
    const ingredients = ingredientsList.join(',');

    let endpoint = null;
    let param = {};
    if (query.trim()) {
      //if search bar is not empty and sorting by ingredients use ingredients endpoint, if not sorting by ingredients use default endpoint
      endpoint = 'https://roughy-polite-wholly.ngrok-free.app/api/recipeSearch';

      //if sorting by ingredients use parameters query and ingredients else use query
      param = { query, ingredients };
    } else {
      //if search bar is empty and sorting by ingredients use ingredients search endpoint, if ot sorting by ingredients use random endpoint
      endpoint = currentIsIngredients
        ? 'https://roughy-polite-wholly.ngrok-free.app/api/ingredientsSearch'
        : 'https://roughy-polite-wholly.ngrok-free.app/api/recipeSearch/random';

      //if sorting by ingredients use ingredients parameter else use no paramters 
      param = currentIsIngredients
        ? { ingredients }
        : {};
    }

    //get data from server endpoint using parameters
    try {
      const response = await axios.get(endpoint, { params: param });
      const recipeData = response.data.recipes ||  response.data.results || response.data;
      setRecipes(recipeData);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchRecipes(isIngredients);
  }, [isIngredients]);

  //get specific recipe information from server when recipe is pressed
  const imagePressed = async (id) => {
    try {
      const response = await axios.get(`https://roughy-polite-wholly.ngrok-free.app/api/recipeInfo`, {
        params: { query: id },
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

  //close pop up
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  //get current user information and favourites on mount
  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      fetchFavourites(currentUser.uid);
      fetchIngredients(currentUser.uid);
    }
  }, []);

  //get favourites from firebase
  const fetchFavourites = async (userId) => {
    const docRef = doc(db, 'favourites', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFavouriteList(docSnap.data().list);
    }
  };

  //get ingredients from firebase
  const fetchIngredients = async (userId) => {
    const docRef = doc(db, 'ingredients', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setIngredientsList(docSnap.data().list);
    }
  };

  //save favourites to firebase
  const saveFavourites = async (updatedList) => {
    if (user) {
      const userFavouritesRef = doc(db, 'favourites', user.uid);
      await setDoc(userFavouritesRef, { list: updatedList });
    }
  };

  //add favourite to item list and firebase
  const addFavourite = () => {
    const newItem = { id: selectedRecipe.id, name: selectedRecipe };
    const updatedList = [...favouriteList, newItem];
    setFavouriteList(updatedList);
    saveFavourites(updatedList);
  };

  //remove favourite from item list and firebase
  const removeFavourite = () => {
    const updatedList = favouriteList.filter((x) => x.id !== selectedRecipe.id);
    setFavouriteList(updatedList);
    saveFavourites(updatedList);
  };

  //check if item is favourited
  const isFavourite = (recipeId) => {
    return favouriteList.some((item) => item.id === recipeId);
  };

  //toggle favourite based on if it is favourited
  const toggleFavourite = () => {
    if (isFavourite(selectedRecipe.id)) {
      removeFavourite();
    } else {
      addFavourite();
    }
  };

  //toggle ingredient sort and update the search
 const toggleIngredientsSort = () => {
    setIsIngredients(prevIsIngredients => {
      const newIsIngredients = !prevIsIngredients;
      searchRecipes(newIsIngredients); 
      return newIsIngredients;
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 p-4">
        <Text className="text-5xl font-chewy text-center text-title pt-5">Recipe Search</Text>
        <TextInput
          className="border border-gray-300 rounded p-2 mb-4 text-secondary"
          placeholder="Enter ingredients"
          value={query}
          onChangeText={setQuery}
        />

        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-full mt-4"
          onPress={searchRecipes(isIngredients)}
          disabled={loading} 
        >
          <Text className="text-white font-bold text-center">Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-title p-3 rounded-full mt-4"
          onPress={toggleIngredientsSort}
          disabled={loading} 
        >
          <Text className="text-white font-bold text-center">{isIngredients ? 'Unsort by your ingredients' : 'Sort by your ingredients'}</Text>
        </TouchableOpacity>

        {loading && <Text className="text-3xl pt-10 font-chewy text-center text-title">Loading...</Text>}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}

        <FlatList
          className="pt-4"
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 bg-primary">
              <TouchableOpacity className="flex-1 items-center justify-center" onPress={() => imagePressed(item.id)}>
                <Image className="w-60 h-60" source={{ uri: item.image }} />
                <Text className="text-2xl font-chewy text-center text-title">{item.title}</Text>
                {isIngredients && (
                  <>
                    <Text className="text-md font-poppingsRegular text-center text-secondary">
                      Ingredients: {item.usedIngredients && item.usedIngredients.length > 0 ? item.usedIngredients.map(ingredient => ingredient.name).join(', '): ""}
                    </Text>
                    <Text className="text-md font-poppingsRegular text-center text-secondary">
                      Missing Ingredients: {item.missedIngredients && item.missedIngredients.length > 0 ? item.missedIngredients.map(ingredient => ingredient.name).join(', '): ""}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        />

        {selectedRecipe && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View className="flex-1 justify-center items-center m-5 bg-secondary p-5 rounded-lg">
              <Image className="w-48 h-48" source={{ uri: selectedRecipe.image }} />
              <Text className="text-3xl font-chewy text-center text-title">{selectedRecipe.title}</Text>
              <RenderHtml
                contentWidth={400}
                source={{ html: selectedRecipe.summary }}
              />
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={closeModal}
              >
                <Text className="text-white font-bold text-center">Hide Modal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-title p-3 rounded-full mt-4"
                onPress={toggleFavourite}
              >
                <Text className="text-white font-bold text-center">{isFavourite(selectedRecipe.id) ? 'Unfavourite' : 'Favourite!'}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecipeList;
