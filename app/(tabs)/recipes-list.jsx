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
import { doc, setDoc, getDoc } from "firebase/firestore";
import Instructions from "../../components/Instructions.jsx";

const RecipeList = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favouriteList, setFavouriteList] = useState([]);
  const [recentList, setRecentList] = useState([]);
  const [user, setUser] = useState(null);
  const [isSortByIngredients, setIsSortByIngredients] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]);

  //get api recipes data from server
  const searchRecipes = async (currentIsSortByIngredients) => {
    setRecipes();
    setLoading(true);
    setError("");

    //refresh ingredients
    if (user && currentIsSortByIngredients) {
      await fetchIngredients(user.uid);
    }

    let ingredients = ingredientsList.join(",");
    let endpoint = null;
    let param = {};
    let sort = null;
    if (query.trim()) {
      //if search bar is not empty and sorting by ingredients and query, if not sort by query
      endpoint = "https://roughy-polite-wholly.ngrok-free.app/api/recipeSearch";

      ingredients = currentIsSortByIngredients ? ingredientsList.join(",") : "";

      sort = currentIsSortByIngredients
        ? "min-missing-ingredients"
        : "popularity";

      param = { query, ingredients, sort };
    } else {
      //if search bar is empty and sorting by ingredients use ingredients search endpoint, if sorting by ingredients use random endpoint
      endpoint = currentIsSortByIngredients
        ? "https://roughy-polite-wholly.ngrok-free.app/api/ingredientsSearch"
        : "https://roughy-polite-wholly.ngrok-free.app/api/recipeSearch/random";

      //if sorting by ingredients use ingredients parameter else use no paramters
      param = currentIsSortByIngredients ? { ingredients } : {};
    }

    //get data from server endpoint using parameters
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

  //call search recipes on start
  useEffect(() => {
    searchRecipes(isSortByIngredients);
  }, [isSortByIngredients]);

  //get specific recipe information from server when recipe is pressed
  const imagePressed = async (id) => {
    try {
      const response = await axios.get(
        `https://roughy-polite-wholly.ngrok-free.app/api/recipeInfo`,
        {
          params: { query: id },
        }
      );
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
      fetchRecents(currentUser.uid);
    }
  }, []);

  //get favourites from firebase
  const fetchFavourites = async (userId) => {
    const docRef = doc(db, "favourites", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFavouriteList(docSnap.data().list);
    }
  };

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

  //save favourites to firebase
  const saveFavourites = async (updatedList) => {
    if (user) {
      const userFavouritesRef = doc(db, "favourites", user.uid);
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
    setIsSortByIngredients((prevIsSortByIngredients) => {
      const newIsIngredients = !prevIsSortByIngredients;
      searchRecipes(newIsIngredients);
      return newIsIngredients;
    });
  };

  //get recents from firebase
  const fetchRecents = async (userId) => {
    const docRef = doc(db, "recents", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setRecentList(docSnap.data().list);
    }
  };

  //save recents to firebase
  const saveRecents = async (updatedList) => {
    if (user) {
      const userRecentsRef = doc(db, "recents", user.uid);
      await setDoc(userRecentsRef, { list: updatedList });
    }
  };

  //add recents to item list and firebase
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
        <TextInput
          className="border border-gray-300 rounded p-2 mb-4 text-secondary"
          placeholder="Enter ingredients"
          value={query}
          onChangeText={setQuery}
        />

        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-full mt-4"
          onPress={() => searchRecipes(isSortByIngredients)}
          disabled={loading}
        >
          <Text className="text-white font-bold text-center">Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-title p-3 rounded-full mt-4"
          onPress={toggleIngredientsSort}
          disabled={loading}
        >
          <Text className="text-white font-bold text-center">
            {isSortByIngredients
              ? "Unsort by your ingredients"
              : "Sort by your ingredients"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <Text className="text-3xl pt-10 font-chewy text-center text-title">
            Loading...
          </Text>
        )}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}

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
                className="bg-title p-3 rounded-full mt-4"
                onPress={toggleFavourite}
              >
                <Text className="text-white font-bold text-center">
                  {isFavourite(selectedRecipe.id)
                    ? "Unfavourite"
                    : "Favourite!"}
                </Text>
              </TouchableOpacity>
              {selectedRecipe && <Instructions recipe={selectedRecipe} />}
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-full mt-4"
                onPress={closeModal}
              >
                <Text className="text-white font-bold text-center">
                  Hide Modal
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecipeList;
