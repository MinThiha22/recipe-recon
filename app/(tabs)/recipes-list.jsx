import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import RenderHtml from "react-native-render-html";
import { db, auth } from "../../lib/firebase.js";
import { doc, setDoc, getDoc,getRecents } from "firebase/firestore";
import FilterButton from "../../components/FilterButton.jsx";
import FavouriteButton from '../../components/FavouriteButton.jsx';

const RecipeList = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recentList, setRecentList] = useState([]);
  const [user, setUser] = useState(null);
  const [isSortByIngredients, setIsSortByIngredients] = useState(false);
  const [isVegetarianFilter, setIsVegetarianFilter] = useState(false);
  const [isVeganFilter, setIsVeganFilter] = useState(false);
  const [isGlutenFreeFilter, setIsGlutenFreeFilter] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const handleClearInput = () => { setQuery(""); };

  // Function to apply all filters
  const applyFilters = () => {
    searchRecipes(
      isSortByIngredients,
      isVegetarianFilter,
      isVeganFilter,
      isGlutenFreeFilter
    );
  };

  // Get api recipes data from server (modified)
  const searchRecipes = async (
    currentIsSortByIngredients,
    currentIsVegetarianFilter,
    currentIsVeganFilter,
    currentIsGlutenFreeFilter
  ) => {
    setRecipes([]);
    setLoading(true);
    setError("");

    // Refresh ingredients if sorting by ingredients
    if (user && currentIsSortByIngredients) {
      await fetchIngredients(user.uid);
    }

    let ingredients = ingredientsList.join(",");
    let endpoint = null;
    let param = {};
    let sort = null;

    if (query.trim()) {
      //if search bar is not empty and sorting by ingredients and query, if not sort by query
      endpoint = 'https://recipe-recon.onrender.com/api/recipeSearch';
      ingredients = currentIsSortByIngredients ? ingredientsList.join(",") : "";
      sort = currentIsSortByIngredients
        ? "min-missing-ingredients"
        : "popularity";

      // Prepare parameters including filters
      param = {
        query,
        ingredients,
        sort,
        isVegetarian: currentIsVegetarianFilter,
        isVegan: currentIsVeganFilter,
        isGlutenFree: currentIsGlutenFreeFilter,
      };
    } else {
      // If search bar is empty
      endpoint = currentIsSortByIngredients
        ? 'https://recipe-recon.onrender.com/api/ingredientsSearch'
        : 'https://recipe-recon.onrender.com/api/recipeSearch/random';


      // If sorting by ingredients use ingredients parameter else use no paramters
      param = currentIsSortByIngredients ? { ingredients } : {};


      // Apply filters
      if (currentIsVegetarianFilter) {
        param.isVegetarian = true;
      }

      if (currentIsVeganFilter) {
        param.isVegan = true;
      }

      if (currentIsGlutenFreeFilter) {
        param.isGlutenFree = true;
      }
    }

    // Fetch data from server endpoint using parameters
    try {
      const response = await axios.get(endpoint, { params: param });
      const recipeData =
        response.data.recipes || response.data.results || response.data;
      setRecipes(recipeData);
    } catch (err) {
      setError("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  // Call searchRecipes on start and when sort/filter states change
  useEffect(() => {
    searchRecipes(
      isSortByIngredients,
      isVegetarianFilter,
      isVeganFilter,
      isGlutenFreeFilter
    );
  }, [
    isSortByIngredients,
    isVegetarianFilter,
    isVeganFilter,
    isGlutenFreeFilter,
  ]);

  // Get specific recipe information from server when recipe is pressed
  const imagePressed = async (id) => {
    try {

      const response = await axios.get(`https://recipe-recon.onrender.com/api/recipeInfo`, {
        params: { query: id },
      });
      const recipeInfo = response.data;
      console.log(recipeInfo);
      setSelectedRecipe(recipeInfo);
      setModalVisible(true);
      addRecents(recipeInfo);
    } catch (err) {
      setError("Failed to fetch recipes");
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  //get current user information on mount
  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      fetchIngredients(currentUser.uid);
      fetchRecents(currentUser.uid);
    }
  }, []);

  //get ingredients from firebase
  const fetchIngredients = async (userId) => {
    const docRef = doc(db, "ingredients", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setIngredientsList(docSnap.data().list);
    } else {
      setIngredientsList([]);
    }
  };

  //toggle ingredient sort and update the search
  const toggleIngredientsSort = () => {
    setIsSortByIngredients((prevIsSortByIngredients) => {
      const newIsIngredients = !prevIsSortByIngredients;
      searchRecipes(newIsIngredients, isVeganFilter, isGlutenFreeFilter);
      return newIsIngredients;
    });
  };

  // Get recents from Firebase
  const fetchRecents = async (userId) => {
    const recents = await getRecents(userId).catch(() => []);
    setRecentList(recents);
    
  };

  // Save recents to Firebase
  const saveRecents = async (updatedList) => {
    if (user) {
      const userRecentsRef = doc(db, "recents", user.uid);
      await setDoc(userRecentsRef, { list: updatedList });
    }
  };

  // Add recents to list and Firebase
  const addRecents = (recipeInfo) => {
    const newItem = { id: recipeInfo.id, name: recipeInfo };
    const recipeExists = recentList.some((item) => item.id === newItem.id);
    if (!recipeExists) {
      const updatedRecentList = [...recentList, newItem];
      setRecentList(updatedRecentList);
      saveRecents(updatedRecentList);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 p-4">
        <Text className="text-5xl font-chewy text-center text-title pt-5">
          Recipe Search
        </Text>

        {/* Recipe Search Bar */}
        <View className="p-2 flex-row items-center">
          <Text
            className={`absolute left-2 top-2 text-primary text-md transition-all ${isFocused || query ? "text-sm top-3" : "text-md top-8"
              } transition-all`}
          >
            Enter your recipe
          </Text>
          <TextInput
            className={`flex-1 mr-2 bg-secondary text-primary h-12 border rounded pl-2 pr-2 text-md ${isFocused ? "border-title" : "border"
              }`}
            placeholder="Enter your recipe"
            placeholderTextColor="gray"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {/* Buttons Row - Sort and Filter */}
        <View className="p-2 flex-row items-center justify-between mb mt">
          <TouchableOpacity
            onPress={toggleIngredientsSort}
            disabled={loading}
            className="flex-1 h-12 border rounded pl-2 pr-2 mr-1 bg-secondary justify-center"
          >
            <Text className="text-primary text-md text-center font-bold">
              {isSortByIngredients
                ? "Unsort by your ingredients"
                : "Sort by your ingredients"}
            </Text>
          </TouchableOpacity>
          <FilterButton
            isVegetarianFilter={isVegetarianFilter}
            setIsVegetarianFilter={setIsVegetarianFilter}
            isVeganFilter={isVeganFilter}
            setIsVeganFilter={setIsVeganFilter}
            isGlutenFreeFilter={isGlutenFreeFilter}
            setIsGlutenFreeFilter={setIsGlutenFreeFilter}
            applyFilters={applyFilters}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          className="bg-secondary p-4 rounded mt-2 border"
          onPress={() =>
            searchRecipes(
              isSortByIngredients,
              isVeganFilter,
              isGlutenFreeFilter
            )
          }
          disabled={loading}
        >
          <Text className="text-primary font-bold text-center">Search</Text>
        </TouchableOpacity>

        {/* Loading and Error Messages */}
        {loading && (
          <Text className="text-3xl pt-10 font-chewy text-center text-title">
            Loading...
          </Text>
        )}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}

        {/* Recipe List */}
        <FlatList
          className="pt-4"
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 bg-primary">
              <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={() => imagePressed(item.id)}
              >
                <Image className="w-60 h-60" source={{ uri: item.image }} />
                <Text className="text-2xl font-chewy text-center text-title">
                  {item.title}
                </Text>
                {isSortByIngredients && (
                  <>
                    <Text className="text-md font-poppingsRegular text-center text-secondary">
                      Ingredients:{" "}
                      {item.usedIngredients && item.usedIngredients.length > 0
                        ? item.usedIngredients
                          .map((ingredient) => ingredient.name)
                          .join(", ")
                        : ""}
                    </Text>
                    <Text className="text-md font-poppingsRegular text-center text-secondary">
                      {item.missedIngredients &&
                        item.missedIngredients.length > 0
                        ? "Missing Ingredients: " +
                        item.missedIngredients
                          .map((ingredient) => ingredient.name)
                          .join(", ")
                        : ""}
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
                onPress={closeModal}
              >
                <Text className="text-white font-bold text-center">
                  Hide Modal
                </Text>
              </TouchableOpacity>
              <FavouriteButton selectedRecipe={selectedRecipe} />
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecipeList;
