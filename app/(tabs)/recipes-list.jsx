import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { db, auth } from "../../lib/firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getRecents, checkAuthState } from "../../lib/firebase.js";
import FilterButton from "../../components/FilterButton.jsx";
import RecipeInfo from "../../components/RecipeInfo.jsx";
import { isRecipeDietaryCompliant } from "../../components/DietaryFilter.jsx";

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
  const handleClearInput = () => {
    setQuery("");
  };

  // Function to apply all filters
  const applyFilters = () => {
    searchRecipes(
      isSortByIngredients,
      isVegetarianFilter,
      isVeganFilter,
      isGlutenFreeFilter
    );
  };

  // Filter recipes after they are fetched
  const filterRecipes = (recipes) => {
    let filteredRecipes = recipes;

    // Apply dietary filters
    if (isVegetarianFilter || isVeganFilter) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        isRecipeDietaryCompliant(recipe, isVeganFilter)
      );
    }

    return filteredRecipes;
  };

  // Get API recipes data from server (modified)
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
    let queryParameters = {};
    let sortingCriteria = null;

    if (query.trim()) {
      //if search bar is not empty and sorting by ingredients and query, if not sort by query
      endpoint = "https://recipe-recon.onrender.com/api/recipeSearch";
      ingredients = currentIsSortByIngredients ? ingredientsList.join(",") : "";
      sortingCriteria = currentIsSortByIngredients
        ? "min-missing-ingredients"
        : "popularity";

      // Prepare parameters including filters
      queryParameters = {
        query,
        ingredients,
        sort: sortingCriteria,
        isVegetarian: currentIsVegetarianFilter.toString(),
        isVegan: currentIsVeganFilter.toString(),
        isGlutenFree: currentIsGlutenFreeFilter,
      };
    } else {
      // If search bar is empty
      endpoint = currentIsSortByIngredients
        ? "https://recipe-recon.onrender.com/api/ingredientsSearch"
        : "https://recipe-recon.onrender.com/api/recipeSearch/random";

      // If sorting by ingredients use ingredients parameter else use filters for random recipes
      queryParameters = currentIsSortByIngredients
        ? { ingredients }
        : {
            isVegetarian: currentIsVegetarianFilter.toString(),
            isVegan: currentIsVeganFilter.toString(),
            isGlutenFree: currentIsGlutenFreeFilter,
          };
    }

    // Fetch data from server endpoint using parameters
    try {
      const response = await axios.get(endpoint, { params: queryParameters });
      let recipeData =
        response.data.recipes || response.data.results || response.data;

      // Apply dietary filters manually
      let filteredRecipes = filterRecipes(recipeData);

      setRecipes(filteredRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err.message);
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
  const recipeSelected = async (id) => {
    try {
      const response = await axios.get(
        `https://recipe-recon.onrender.com/api/recipeInfo`,
        {
          params: { query: id },
        }
      );
      const recipeInfo = response.data;
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
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchRecents();
      return () => {};
    }, [])
  );

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
  const fetchRecents = async () => {
    const user = await checkAuthState();
    if (!user) {
      throw new Error("User is not authenticated");
    }
    const userId = user.uid;
    const recents = await getRecents(userId).catch(() => []);
    setRecentList(recents);
  };

  // Save recents to Firebase
  const saveRecents = async (updatedList) => {
    if (user) {
      try {
        const userRecentsRef = doc(db, "recents", user.uid);
        await setDoc(userRecentsRef, { list: updatedList }, { merge: true });
      } catch (error) {
        throw error;
      }
    }
  };

  // Add recents to list and Firebase
  const addRecents = (recipeInfo) => {
    const newItem = { id: recipeInfo.id, name: recipeInfo };
    const recipeExists = recentList.some((item) => item.id === newItem.id);
    if (!recipeExists) {
      const updatedRecentList = [...recentList, newItem];
      recentList.forEach((item) => {
        console.log(item.name.title);
      });
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
            className={`absolute left-2 top-2 text-primary text-md transition-all ${
              isFocused || query ? "text-sm top-3" : "text-md top-8"
            } transition-all`}
          >
            Enter your recipe
          </Text>
          <TextInput
            className={`flex-1 mr-2 bg-secondary text-primary h-12 border rounded pl-2 pr-2 text-md ${
              isFocused ? "border-title" : "border"
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
              isVegetarianFilter,
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

        {/* No Results Found Message */}
        {!loading && recipes.length === 0 && (
          <Text className="text-xl text-center text-title pt-10">
            No Results Found
          </Text>
        )}

        {/* Recipe List */}
        <FlatList
          className="pt-4"
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4 bg-primary">
              <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={() => recipeSelected(item.id)}
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
          <RecipeInfo
            selectedRecipe={selectedRecipe}
            visible={modalVisible}
            close={closeModal}
          ></RecipeInfo>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecipeList;
